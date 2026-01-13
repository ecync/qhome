import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { IncommingMessageType, IncomingMessage, AckData, SensorData, AlertData, ErrorData, CommandTypes } from 'src/types';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { NodeConfig, NodeConfigDocument } from 'src/schema/node.config.schema';
import { NodeSensorData, NodeSensorDataDocument } from 'src/schema/node.sensor.data.schema';
import { NodeAlert, NodeAlertDocument } from 'src/schema/node.alert.schema';
import { NodeError, NodeErrorDocument } from 'src/schema/node.error.schema';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { ServerEventTypes } from 'src/types';

@Injectable()
export class MqttService implements OnModuleInit {
    public readonly logger = new Logger(MqttService.name);
    private nodeConfigCache: NodeConfig;
    private lastSyncTime: Date;
    private lastSensorDataSaveTime: Date;

    constructor(
        @InjectModel(NodeConfig.name) private nodeConfigModel: Model<NodeConfigDocument>,
        @InjectModel(NodeSensorData.name) private nodeSensorDataModel: Model<NodeSensorDataDocument>,
        @InjectModel(NodeAlert.name) private nodeAlertModel: Model<NodeAlertDocument>,
        @InjectModel(NodeError.name) private nodeErrorModel: Model<NodeErrorDocument>,
        private readonly configService: ConfigService,
        private eventEmitter: EventEmitter2,
        @Inject('MQTT_SERVICE') private readonly mqttClient: ClientProxy,
    ) { }

    // On module initialization, cache the node configuration and set up periodic checks
    async onModuleInit() {
        try {
            // Get Configuration from database and cache it
            const config = await this.nodeConfigModel.findOne().exec();
            if (config) {
                this.nodeConfigCache = config;
            }
            this.logger.log('Node configurations cached successfully on module init.');
        } catch (error) {
            this.logger.error('Failed to cache node configurations on module init', error);
        }

        // Create a set isActive false if last sync time exceeds sync interval
        setInterval(async () => {
            if (this.nodeConfigCache) {
                const syncInterval = this.nodeConfigCache.system.sync_interval; // in seconds
                const now = new Date();
                const timeDiff = (now.getTime() - (this.lastSyncTime ? this.lastSyncTime.getTime() : 0)) / 1000;
                if (timeDiff > syncInterval) {
                    try {
                        await this.nodeConfigModel.findOneAndUpdate(
                            { nodeName: this.nodeConfigCache.nodeName },
                            { $set: { isActive: false } }
                        ).exec();
                        this.nodeConfigCache.isActive = false;
                        this.logger.warn(`Node ${this.nodeConfigCache.nodeName} marked as inactive due to sync timeout.`);
                    } catch (error) {
                        this.logger.error(`Failed to update isActive status for node ${this.nodeConfigCache.nodeName}`, error);
                    }
                }
            }
        }, 60000); // Check every minute
    }

    public processPayload(payload: IncomingMessage): void {
        switch (payload.type) {
            case IncommingMessageType.ACK:
                // Save ACK data to database
                this.handleAckData(payload.node_name, payload.data as AckData);
                break;
            case IncommingMessageType.SENSOR_DATA:
                // Broadcast sensor data to websocket clients and save to database
                this.handleSensorData(payload.node_name, payload.data as SensorData);
                break;
            case IncommingMessageType.ALERT:
                // Handle alert data
                this.handleAlertData(payload.data as AlertData);
                break;
            case IncommingMessageType.ERROR:
                // Handle error data
                this.handleErrorData(payload.data as ErrorData);
                break;
            default:
                this.logger.warn(`Unknown message type received: ${payload.type}`);
        }
    }
    // Handle alert data by saving it to the database
    private async handleAlertData(data: AlertData): Promise<void> {
        try {
            // send alert data to websocket clients
            this.eventEmitter.emit('node.alert' as ServerEventTypes, data);
            // save alert data to database
            const alertData = new this.nodeAlertModel({
                type: data.alert_type,
                message: data.message,
            });
            await alertData.save();
            this.logger.debug('Alert data saved successfully.');
        } catch (error) {
            this.logger.error('Failed to save alert data', error);
        }
    }
    // Handle error data by saving it to the database
    private async handleErrorData(data: ErrorData): Promise<void> {
        try {
            // send error data to websocket clients
            this.eventEmitter.emit('node.error' as ServerEventTypes, data);
            // save error data to database
            const errorData = new this.nodeErrorModel({
                type: data.error_type,
                message: data.message,
            });
            await errorData.save();
            this.logger.debug('Error data saved successfully.');  
        } catch (error) {
            this.logger.error('Failed to save error data', error);   
        }
    }
    // Handle sensor data by saving it to the database 
    private async handleSensorData(node_name: string, data: SensorData): Promise<void> {
        try {
            // Send data to websocket clients (always broadcast, regardless of DB save throttling)
            this.eventEmitter.emit('sensor.data' as ServerEventTypes, { data });
            // save sensor data to database if 15 minutes have passed since last save
            const now = new Date();
            const timeDiff = (now.getTime() - (this.lastSensorDataSaveTime ? this.lastSensorDataSaveTime.getTime() : 0)) / 1000;
            if (timeDiff < 900) {
                this.logger.debug('Sensor data save skipped to reduce database load.');
                return;
            }
            this.lastSensorDataSaveTime = now;
            const sensorData = new this.nodeSensorDataModel({
                tempeture: data.temperature ? data.temperature : 0,
                humidity: data.humidity ? data.humidity : 0,
                mq_value: data.mq_value ? data.mq_value : 0,
                light_value: data.light_value ? data.light_value : 0,
                zmpt_value: data.zmpt_value ? data.zmpt_value : 0,
                acs_value: data.acs_value ? data.acs_value : 0,
                acs_power: data.acs_power ? data.acs_power : 0,
                acs_energy: data.acs_energy ? data.acs_energy : 0,
            });
            await sensorData.save();
            this.lastSyncTime = new Date(); // Update last sync time
            this.logger.debug('Sensor data saved successfully.');
        } catch (error) {
            this.logger.error('Failed to save sensor data', error);
        }
    }

    // Handle ACK data by updating or creating node configuration in the database.
    private async handleAckData(node_name: string, data: AckData): Promise<void> {
        try {
            // update or create node config in database
            const updatedConfig = this.nodeConfigModel.findOneAndUpdate(
                { nodeName: this.nodeConfigCache?.nodeName || node_name },
                {
                    $set: {
                        nodeName: node_name,
                        isActive: true,
                        system: data.config.system,
                        sensors: data.config.sensors,
                        updatedAt: new Date(),
                        lastSyncedAt: new Date(),
                    }
                },
                { upsert: true, new: true }
            ).exec();
            // Update cache
            updatedConfig.then((doc) => {
                if (doc) {
                    this.nodeConfigCache = doc;
                    this.logger.debug(`Node config for ${node_name} updated/created successfully.`);
                }
            });
            this.lastSyncTime = new Date(); // Update last sync time
        } catch (error) {
            this.logger.error(`Failed to update/create node config for ${node_name}`, error);
        }
    }

    publicToSafeJson(payload: any): Record<string, any> | undefined {
        try {
            // If payload is a buffer, convert it to string first
            if (!payload) {
                throw new Error('Payload is undefined or null');
            }
            if (Buffer.isBuffer(payload)) {
                payload = payload.toString();
                return JSON.parse(payload);
            }
            if (typeof payload === 'string') {
                return JSON.parse(payload);
            }
            return JSON.parse(JSON.stringify(payload));
        } catch (error) {
            this.logger.error('Failed to convert payload to JSON', error);
        }
    }

    async getNodeConfig(): Promise<NodeConfigDocument | null> {
        try {
            const config = await this.nodeConfigModel.findOne().exec();
            return config;
        } catch (error) {
            this.logger.error('Failed to retrieve node configuration', error);
            return null;
        }
    }

    async getRecentErrors(limit: number): Promise<NodeErrorDocument[]> {
        try {
            const errors = await this.nodeErrorModel.find().sort({ createdAt: -1 }).limit(limit).exec();
            return errors;
        } catch (error) {
            this.logger.error('Failed to retrieve recent errors', error);
            return [];
        }
    }

    async getRecentAlerts(limit: number): Promise<NodeAlertDocument[]> {
        try {
            const alerts = await this.nodeAlertModel.find().sort({ createdAt: -1 }).limit(limit).exec();
            return alerts;
        } catch (error) {
            this.logger.error('Failed to retrieve recent alerts', error);
            return [];
        }
    }

    // Publish a command to the node via MQTT
    async sendCommand(command: CommandTypes): Promise<void> {
        const payload = {
            type: IncommingMessageType.COMMAND,
            data: { 
                command: command
             }
        };
        try {
            this.mqttClient.emit('node/cmd', payload);
            this.logger.debug(`Command ${command} sent to node `);
        } catch (error) {
            this.logger.error(`Failed to send command ${command} to node`, error);
        }
    }

    // Publish a configuration update to the node via MQTT
    async sendConfigUpdate(node_name: string | undefined, config: AckData['config']): Promise<string> {
        // Resolve node name if not provided
        let resolvedNode = node_name || this.nodeConfigCache?.nodeName;
        if (!resolvedNode) {
            const cfg = await this.getNodeConfig();
            resolvedNode = cfg?.nodeName || '';
        }
        if (!resolvedNode) {
            throw new Error('No node_name available for config update');
        }
        const payload = {
            node_name: resolvedNode,
            type: IncommingMessageType.CONFIG_UPDATE,
            data: { config }
        };
        try {
            await this.mqttClient.emit('node/cmd', payload);
            this.logger.debug(`Config update sent to node ${resolvedNode}`);
            return resolvedNode;
        } catch (error) {
            this.logger.error(`Failed to send config update to node ${resolvedNode}`, error);
            throw error;
        }
    }

    async getSensorData(date: number): Promise<NodeSensorDataDocument[]> {
        try {
            const sensorData = await this.nodeSensorDataModel.find({ createdAt: { $gte: new Date(date) } }).sort({ createdAt: -1 }).exec();
            return sensorData;
        } catch (error) {
            this.logger.error('Failed to retrieve recent sensor data', error);
            return [];
        }
    }
}