/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 2 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(3);
const app_controller_1 = __webpack_require__(4);
const app_service_1 = __webpack_require__(5);
const config_1 = __webpack_require__(6);
const mongoose_1 = __webpack_require__(7);
const mqtt_module_1 = __webpack_require__(8);
const event_emitter_1 = __webpack_require__(16);
const core_1 = __webpack_require__(1);
const auth_guard_1 = __webpack_require__(22);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            mongoose_1.MongooseModule.forRoot(process.env.MONGO_URI || ''),
            event_emitter_1.EventEmitterModule.forRoot(),
            mqtt_module_1.MqttModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: auth_guard_1.AuthGuard,
            },
        ],
    })
], AppModule);


/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 4 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const common_1 = __webpack_require__(3);
const app_service_1 = __webpack_require__(5);
let AppController = class AppController {
    appService;
    constructor(appService) {
        this.appService = appService;
    }
};
exports.AppController = AppController;
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeof (_a = typeof app_service_1.AppService !== "undefined" && app_service_1.AppService) === "function" ? _a : Object])
], AppController);


/***/ }),
/* 5 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppService = void 0;
const common_1 = __webpack_require__(3);
let AppService = class AppService {
    getHello() {
        return 'Hello World!';
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);


/***/ }),
/* 6 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 7 */
/***/ ((module) => {

module.exports = require("@nestjs/mongoose");

/***/ }),
/* 8 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MqttModule = void 0;
const common_1 = __webpack_require__(3);
const mqtt_service_1 = __webpack_require__(9);
const mqtt_gateway_1 = __webpack_require__(18);
const mqtt_controller_1 = __webpack_require__(21);
const microservices_1 = __webpack_require__(17);
const config_1 = __webpack_require__(6);
const mongoose_1 = __webpack_require__(7);
const node_config_schema_1 = __webpack_require__(12);
const node_sensor_data_schema_1 = __webpack_require__(13);
const node_alert_schema_1 = __webpack_require__(14);
const node_error_schema_1 = __webpack_require__(15);
let MqttModule = class MqttModule {
};
exports.MqttModule = MqttModule;
exports.MqttModule = MqttModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            mongoose_1.MongooseModule.forFeature([
                { name: node_config_schema_1.NodeConfig.name, schema: node_config_schema_1.NodeConfigSchema },
                { name: node_sensor_data_schema_1.NodeSensorData.name, schema: node_sensor_data_schema_1.NodeSensorDataSchema },
                { name: node_alert_schema_1.NodeAlert.name, schema: node_alert_schema_1.NodeAlertSchema },
                { name: node_error_schema_1.NodeError.name, schema: node_error_schema_1.NodeErrorSchema },
            ]),
            microservices_1.ClientsModule.register([
                {
                    name: 'MQTT_SERVICE',
                    transport: microservices_1.Transport.MQTT,
                    options: {
                        url: 'ws://158.101.98.79:9001/mqtt',
                    },
                },
            ]),
        ],
        controllers: [mqtt_controller_1.MqttController],
        providers: [mqtt_service_1.MqttService, mqtt_gateway_1.MqttGateway],
    })
], MqttModule);


/***/ }),
/* 9 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var MqttService_1;
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MqttService = void 0;
const common_1 = __webpack_require__(3);
const types_1 = __webpack_require__(10);
const mongoose_1 = __webpack_require__(11);
const mongoose_2 = __webpack_require__(7);
const node_config_schema_1 = __webpack_require__(12);
const node_sensor_data_schema_1 = __webpack_require__(13);
const node_alert_schema_1 = __webpack_require__(14);
const node_error_schema_1 = __webpack_require__(15);
const config_1 = __webpack_require__(6);
const event_emitter_1 = __webpack_require__(16);
const microservices_1 = __webpack_require__(17);
const common_2 = __webpack_require__(3);
let MqttService = MqttService_1 = class MqttService {
    nodeConfigModel;
    nodeSensorDataModel;
    nodeAlertModel;
    nodeErrorModel;
    configService;
    eventEmitter;
    mqttClient;
    logger = new common_1.Logger(MqttService_1.name);
    nodeConfigCache;
    lastSyncTime;
    lastSensorDataSaveTime;
    constructor(nodeConfigModel, nodeSensorDataModel, nodeAlertModel, nodeErrorModel, configService, eventEmitter, mqttClient) {
        this.nodeConfigModel = nodeConfigModel;
        this.nodeSensorDataModel = nodeSensorDataModel;
        this.nodeAlertModel = nodeAlertModel;
        this.nodeErrorModel = nodeErrorModel;
        this.configService = configService;
        this.eventEmitter = eventEmitter;
        this.mqttClient = mqttClient;
    }
    async onModuleInit() {
        try {
            const config = await this.nodeConfigModel.findOne().exec();
            if (config) {
                this.nodeConfigCache = config;
            }
            this.logger.log('Node configurations cached successfully on module init.');
        }
        catch (error) {
            this.logger.error('Failed to cache node configurations on module init', error);
        }
        setInterval(async () => {
            if (this.nodeConfigCache) {
                const syncInterval = this.nodeConfigCache.system.sync_interval;
                const now = new Date();
                const timeDiff = (now.getTime() - (this.lastSyncTime ? this.lastSyncTime.getTime() : 0)) / 1000;
                if (timeDiff > syncInterval) {
                    try {
                        await this.nodeConfigModel.findOneAndUpdate({ nodeName: this.nodeConfigCache.nodeName }, { $set: { isActive: false } }).exec();
                        this.nodeConfigCache.isActive = false;
                        this.logger.warn(`Node ${this.nodeConfigCache.nodeName} marked as inactive due to sync timeout.`);
                    }
                    catch (error) {
                        this.logger.error(`Failed to update isActive status for node ${this.nodeConfigCache.nodeName}`, error);
                    }
                }
            }
        }, 60000);
    }
    processPayload(payload) {
        switch (payload.type) {
            case types_1.IncommingMessageType.ACK:
                this.handleAckData(payload.node_name, payload.data);
                break;
            case types_1.IncommingMessageType.SENSOR_DATA:
                this.handleSensorData(payload.node_name, payload.data);
                break;
            case types_1.IncommingMessageType.ALERT:
                this.handleAlertData(payload.data);
                break;
            case types_1.IncommingMessageType.ERROR:
                this.handleErrorData(payload.data);
                break;
            default:
                this.logger.warn(`Unknown message type received: ${payload.type}`);
        }
    }
    async handleAlertData(data) {
        try {
            this.eventEmitter.emit('node.alert', data);
            const alertData = new this.nodeAlertModel({
                type: data.alert_type,
                message: data.message,
            });
            await alertData.save();
            this.logger.debug('Alert data saved successfully.');
        }
        catch (error) {
            this.logger.error('Failed to save alert data', error);
        }
    }
    async handleErrorData(data) {
        try {
            this.eventEmitter.emit('node.error', data);
            const errorData = new this.nodeErrorModel({
                type: data.error_type,
                message: data.message,
            });
            await errorData.save();
            this.logger.debug('Error data saved successfully.');
        }
        catch (error) {
            this.logger.error('Failed to save error data', error);
        }
    }
    async handleSensorData(node_name, data) {
        try {
            this.eventEmitter.emit('sensor.data', { data });
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
            this.lastSyncTime = new Date();
            this.logger.debug('Sensor data saved successfully.');
        }
        catch (error) {
            this.logger.error('Failed to save sensor data', error);
        }
    }
    async handleAckData(node_name, data) {
        try {
            const updatedConfig = this.nodeConfigModel.findOneAndUpdate({ nodeName: this.nodeConfigCache?.nodeName || node_name }, {
                $set: {
                    nodeName: node_name,
                    isActive: true,
                    system: data.config.system,
                    sensors: data.config.sensors,
                    updatedAt: new Date(),
                    lastSyncedAt: new Date(),
                }
            }, { upsert: true, new: true }).exec();
            updatedConfig.then((doc) => {
                if (doc) {
                    this.nodeConfigCache = doc;
                    this.logger.debug(`Node config for ${node_name} updated/created successfully.`);
                }
            });
            this.lastSyncTime = new Date();
        }
        catch (error) {
            this.logger.error(`Failed to update/create node config for ${node_name}`, error);
        }
    }
    publicToSafeJson(payload) {
        try {
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
        }
        catch (error) {
            this.logger.error('Failed to convert payload to JSON', error);
        }
    }
    async getNodeConfig() {
        try {
            const config = await this.nodeConfigModel.findOne().exec();
            return config;
        }
        catch (error) {
            this.logger.error('Failed to retrieve node configuration', error);
            return null;
        }
    }
    async getRecentErrors(limit) {
        try {
            const errors = await this.nodeErrorModel.find().sort({ createdAt: -1 }).limit(limit).exec();
            return errors;
        }
        catch (error) {
            this.logger.error('Failed to retrieve recent errors', error);
            return [];
        }
    }
    async getRecentAlerts(limit) {
        try {
            const alerts = await this.nodeAlertModel.find().sort({ createdAt: -1 }).limit(limit).exec();
            return alerts;
        }
        catch (error) {
            this.logger.error('Failed to retrieve recent alerts', error);
            return [];
        }
    }
    async sendCommand(command) {
        const payload = {
            type: types_1.IncommingMessageType.COMMAND,
            data: {
                command: command
            }
        };
        try {
            this.mqttClient.emit('node/cmd', payload);
            this.logger.debug(`Command ${command} sent to node `);
        }
        catch (error) {
            this.logger.error(`Failed to send command ${command} to node`, error);
        }
    }
    async sendConfigUpdate(node_name, config) {
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
            type: types_1.IncommingMessageType.CONFIG_UPDATE,
            data: { config }
        };
        try {
            await this.mqttClient.emit('node/cmd', payload);
            this.logger.debug(`Config update sent to node ${resolvedNode}`);
            return resolvedNode;
        }
        catch (error) {
            this.logger.error(`Failed to send config update to node ${resolvedNode}`, error);
            throw error;
        }
    }
    async getSensorData(date) {
        try {
            const sensorData = await this.nodeSensorDataModel.find({ createdAt: { $gte: new Date(date) } }).sort({ createdAt: -1 }).exec();
            return sensorData;
        }
        catch (error) {
            this.logger.error('Failed to retrieve recent sensor data', error);
            return [];
        }
    }
};
exports.MqttService = MqttService;
exports.MqttService = MqttService = MqttService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(node_config_schema_1.NodeConfig.name)),
    __param(1, (0, mongoose_2.InjectModel)(node_sensor_data_schema_1.NodeSensorData.name)),
    __param(2, (0, mongoose_2.InjectModel)(node_alert_schema_1.NodeAlert.name)),
    __param(3, (0, mongoose_2.InjectModel)(node_error_schema_1.NodeError.name)),
    __param(6, (0, common_2.Inject)('MQTT_SERVICE')),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_1.Model !== "undefined" && mongoose_1.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_1.Model !== "undefined" && mongoose_1.Model) === "function" ? _b : Object, typeof (_c = typeof mongoose_1.Model !== "undefined" && mongoose_1.Model) === "function" ? _c : Object, typeof (_d = typeof mongoose_1.Model !== "undefined" && mongoose_1.Model) === "function" ? _d : Object, typeof (_e = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _e : Object, typeof (_f = typeof event_emitter_1.EventEmitter2 !== "undefined" && event_emitter_1.EventEmitter2) === "function" ? _f : Object, typeof (_g = typeof microservices_1.ClientProxy !== "undefined" && microservices_1.ClientProxy) === "function" ? _g : Object])
], MqttService);


/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommandTypes = exports.ErrorTypes = exports.AlertTypes = exports.IncommingMessageType = void 0;
var IncommingMessageType;
(function (IncommingMessageType) {
    IncommingMessageType["ACK"] = "_ack";
    IncommingMessageType["SENSOR_DATA"] = "_sensor_data";
    IncommingMessageType["CONFIG_UPDATE"] = "_config_update";
    IncommingMessageType["ALERT"] = "_alert";
    IncommingMessageType["COMMAND"] = "_command";
    IncommingMessageType["ERROR"] = "_error";
})(IncommingMessageType || (exports.IncommingMessageType = IncommingMessageType = {}));
var AlertTypes;
(function (AlertTypes) {
    AlertTypes["HIGH_TEMPERATURE"] = "high_temperature";
    AlertTypes["LOW_TEMPERATURE"] = "low_temperature";
    AlertTypes["MOTION_DETECTED"] = "motion_detected";
    AlertTypes["GAS_DETECTED"] = "gas_detected";
    AlertTypes["LIGHT_ON"] = "light_on";
    AlertTypes["LIGHT_OFF"] = "light_off";
    AlertTypes["HIGH_VOLTAGE"] = "high_voltage";
    AlertTypes["LOW_VOLTAGE"] = "low_voltage";
    AlertTypes["HIGH_CURRENT"] = "high_current";
})(AlertTypes || (exports.AlertTypes = AlertTypes = {}));
var ErrorTypes;
(function (ErrorTypes) {
    ErrorTypes["DHT_READ_FAILURE"] = "dht_read_failure";
    ErrorTypes["PIR_READ_FAILURE"] = "pir_read_failure";
    ErrorTypes["MQ_READ_FAILURE"] = "mq_read_failure";
    ErrorTypes["LIGHT_READ_FAILURE"] = "light_read_failure";
    ErrorTypes["ZMPT_READ_FAILURE"] = "zmpt_read_failure";
    ErrorTypes["ACS_READ_FAILURE"] = "acs_read_failure";
})(ErrorTypes || (exports.ErrorTypes = ErrorTypes = {}));
var CommandTypes;
(function (CommandTypes) {
    CommandTypes["RESTART"] = "restart";
    CommandTypes["RESET_CONFIG"] = "reset_config";
    CommandTypes["TOGGLE_LIGHT"] = "toggle_light";
    CommandTypes["TOGGLE_LIGHT_OFF"] = "toggle_light_off";
})(CommandTypes || (exports.CommandTypes = CommandTypes = {}));


/***/ }),
/* 11 */
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),
/* 12 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NodeConfigSchema = exports.NodeConfig = void 0;
const mongoose_1 = __webpack_require__(7);
const mongoose_2 = __importDefault(__webpack_require__(11));
let NodeConfig = class NodeConfig {
    nodeName;
    isActive;
    system;
    sensors;
    updatedAt;
    lastSyncedAt;
};
exports.NodeConfig = NodeConfig;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], NodeConfig.prototype, "nodeName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], NodeConfig.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.default.Schema.Types.Mixed, required: true }),
    __metadata("design:type", Object)
], NodeConfig.prototype, "system", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.default.Schema.Types.Mixed, required: true }),
    __metadata("design:type", Object)
], NodeConfig.prototype, "sensors", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.default.Schema.Types.Date, default: Date.now }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], NodeConfig.prototype, "updatedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.default.Schema.Types.Date, required: false }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], NodeConfig.prototype, "lastSyncedAt", void 0);
exports.NodeConfig = NodeConfig = __decorate([
    (0, mongoose_1.Schema)({ id: false, _id: false })
], NodeConfig);
exports.NodeConfigSchema = mongoose_1.SchemaFactory.createForClass(NodeConfig);


/***/ }),
/* 13 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NodeSensorDataSchema = exports.NodeSensorData = void 0;
const mongoose_1 = __webpack_require__(7);
const mongoose_2 = __importDefault(__webpack_require__(11));
let NodeSensorData = class NodeSensorData {
    tempeture;
    humidity;
    mq_value;
    light_value;
    zmpt_value;
    acs_value;
    acs_power;
    acs_energy;
    createdAt;
};
exports.NodeSensorData = NodeSensorData;
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Number)
], NodeSensorData.prototype, "tempeture", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Number)
], NodeSensorData.prototype, "humidity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Number)
], NodeSensorData.prototype, "mq_value", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Number)
], NodeSensorData.prototype, "light_value", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Number)
], NodeSensorData.prototype, "zmpt_value", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Number)
], NodeSensorData.prototype, "acs_value", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Number)
], NodeSensorData.prototype, "acs_power", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Number)
], NodeSensorData.prototype, "acs_energy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.default.Schema.Types.Date, default: Date.now }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], NodeSensorData.prototype, "createdAt", void 0);
exports.NodeSensorData = NodeSensorData = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], NodeSensorData);
exports.NodeSensorDataSchema = mongoose_1.SchemaFactory.createForClass(NodeSensorData);


/***/ }),
/* 14 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NodeAlertSchema = exports.NodeAlert = void 0;
const mongoose_1 = __webpack_require__(7);
const mongoose_2 = __importDefault(__webpack_require__(11));
let NodeAlert = class NodeAlert {
    type;
    message;
    createdAt;
};
exports.NodeAlert = NodeAlert;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], NodeAlert.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], NodeAlert.prototype, "message", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.default.Schema.Types.Date, default: Date.now }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], NodeAlert.prototype, "createdAt", void 0);
exports.NodeAlert = NodeAlert = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], NodeAlert);
exports.NodeAlertSchema = mongoose_1.SchemaFactory.createForClass(NodeAlert);


/***/ }),
/* 15 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NodeErrorSchema = exports.NodeError = void 0;
const mongoose_1 = __webpack_require__(7);
const mongoose_2 = __importDefault(__webpack_require__(11));
let NodeError = class NodeError {
    type;
    message;
    createdAt;
};
exports.NodeError = NodeError;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], NodeError.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], NodeError.prototype, "message", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.default.Schema.Types.Date, default: Date.now }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], NodeError.prototype, "createdAt", void 0);
exports.NodeError = NodeError = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], NodeError);
exports.NodeErrorSchema = mongoose_1.SchemaFactory.createForClass(NodeError);


/***/ }),
/* 16 */
/***/ ((module) => {

module.exports = require("@nestjs/event-emitter");

/***/ }),
/* 17 */
/***/ ((module) => {

module.exports = require("@nestjs/microservices");

/***/ }),
/* 18 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MqttGateway = void 0;
const websockets_1 = __webpack_require__(19);
const socket_io_1 = __webpack_require__(20);
const event_emitter_1 = __webpack_require__(16);
const mqtt_service_1 = __webpack_require__(9);
const types_1 = __webpack_require__(10);
let MqttGateway = class MqttGateway {
    eventEmitter;
    mqttService;
    server;
    constructor(eventEmitter, mqttService) {
        this.eventEmitter = eventEmitter;
        this.mqttService = mqttService;
    }
    afterInit() {
        console.log('WebSocket Gateway Initialized');
        this.eventEmitter.on('sensor.data', (data) => {
            this.server.emit('sensor.data', { data });
        });
        this.eventEmitter.on('node.alert', (data) => {
            this.server.emit('node.alert', { data });
        });
        this.eventEmitter.on('node.error', (data) => {
            this.server.emit('node.error', { data });
        });
    }
    handleConnection(client) {
        console.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
    }
    handleSubscribeToNode(data, client) {
        const { node_name } = data;
        client.join(node_name);
        console.log(`Client ${client.id} subscribed to node: ${node_name}`);
    }
    async handleSendCommand(command, client) {
        await this.mqttService.sendCommand(command);
        client.emit('command.ack', { command, status: 'sent' });
    }
    async handleUpdateConfig(data, client) {
        const { node_name, config } = data;
        await this.mqttService.sendConfigUpdate(node_name, config);
        client.emit('config.ack', { node_name, status: 'sent' });
    }
};
exports.MqttGateway = MqttGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_c = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _c : Object)
], MqttGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('subscribeToNode'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], MqttGateway.prototype, "handleSubscribeToNode", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendCommand'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof types_1.CommandTypes !== "undefined" && types_1.CommandTypes) === "function" ? _d : Object, typeof (_e = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], MqttGateway.prototype, "handleSendCommand", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('updateConfig'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_f = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], MqttGateway.prototype, "handleUpdateConfig", null);
exports.MqttGateway = MqttGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: '/mqtt',
        cors: {
            origin: '*',
        },
        path: '/ws',
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof event_emitter_1.EventEmitter2 !== "undefined" && event_emitter_1.EventEmitter2) === "function" ? _a : Object, typeof (_b = typeof mqtt_service_1.MqttService !== "undefined" && mqtt_service_1.MqttService) === "function" ? _b : Object])
], MqttGateway);


/***/ }),
/* 19 */
/***/ ((module) => {

module.exports = require("@nestjs/websockets");

/***/ }),
/* 20 */
/***/ ((module) => {

module.exports = require("socket.io");

/***/ }),
/* 21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MqttController = void 0;
const common_1 = __webpack_require__(3);
const mqtt_service_1 = __webpack_require__(9);
const microservices_1 = __webpack_require__(17);
const types_1 = __webpack_require__(10);
let MqttController = class MqttController {
    mqttService;
    constructor(mqttService) {
        this.mqttService = mqttService;
    }
    handleMessage(context) {
        const payload = this.mqttService.publicToSafeJson(context.getPacket().payload);
        console.log('Received message on test/topic:', payload);
        return this.mqttService.processPayload(payload);
    }
    async getStatus() {
        const status = await this.mqttService.getNodeConfig();
        return status;
    }
    async getErrors(limit = 10) {
        const errors = await this.mqttService.getRecentErrors(Number(limit));
        return errors;
    }
    async getAlerts(limit = 10) {
        const alerts = await this.mqttService.getRecentAlerts(Number(limit));
        return alerts;
    }
    async sendCommand(cmd) {
        try {
            await this.mqttService.sendCommand(cmd);
            return { status: 'sent', command: cmd };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to send command');
        }
    }
    async updateConfig(body) {
        try {
            const { config } = body;
            if (!config) {
                throw new common_1.BadRequestException('config is required');
            }
            const nodeName = await this.mqttService.sendConfigUpdate(undefined, config);
            return { status: 'sent', node_name: nodeName };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to send config update');
        }
    }
    async getAnalytics(date) {
        const sensorData = await this.mqttService.getSensorData(Number(date));
        return sensorData;
    }
};
exports.MqttController = MqttController;
__decorate([
    (0, microservices_1.MessagePattern)('node/send'),
    __param(0, (0, microservices_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof microservices_1.MqttContext !== "undefined" && microservices_1.MqttContext) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], MqttController.prototype, "handleMessage", null);
__decorate([
    (0, common_1.Get)('status'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "getStatus", null);
__decorate([
    (0, common_1.Get)('errors'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "getErrors", null);
__decorate([
    (0, common_1.Get)('alerts'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "getAlerts", null);
__decorate([
    (0, common_1.Post)('command/:cmd'),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    __param(0, (0, common_1.Param)('cmd')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof types_1.CommandTypes !== "undefined" && types_1.CommandTypes) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "sendCommand", null);
__decorate([
    (0, common_1.Post)('config'),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "updateConfig", null);
__decorate([
    (0, common_1.Get)('sensor-data/:date'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MqttController.prototype, "getAnalytics", null);
exports.MqttController = MqttController = __decorate([
    (0, common_1.Controller)('mqtt'),
    __metadata("design:paramtypes", [typeof (_a = typeof mqtt_service_1.MqttService !== "undefined" && mqtt_service_1.MqttService) === "function" ? _a : Object])
], MqttController);


/***/ }),
/* 22 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthGuard = void 0;
const common_1 = __webpack_require__(3);
const config_1 = __webpack_require__(6);
let AuthGuard = class AuthGuard {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    canActivate(context) {
        if (context.getType() !== 'http') {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const headers = request.headers || {};
        const expectedUser = this.configService.get('API_USERNAME');
        const expectedPass = this.configService.get('API_PASSWORD');
        if (!expectedUser || !expectedPass) {
            throw new common_1.UnauthorizedException('API credentials not configured');
        }
        const headerUser = headers['x-username'];
        const headerPass = (headers['x-password'] || headers['x-passsword']);
        if (!headerUser || !headerPass) {
            throw new common_1.UnauthorizedException('Missing X-USERNAME or X-PASSWORD');
        }
        if (headerUser !== expectedUser || headerPass !== expectedPass) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return true;
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], AuthGuard);


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(1);
const app_module_1 = __webpack_require__(2);
const microservices_1 = __webpack_require__(17);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.connectMicroservice({
        transport: microservices_1.Transport.MQTT,
        options: {
            url: "ws://158.101.98.79:9001/mqtt",
            protocol: 'ws',
        }
    });
    app.setGlobalPrefix('api');
    app.enableCors();
    await app.startAllMicroservices();
    await app.listen(process.env.PORT || 3000);
}
bootstrap();

})();

/******/ })()
;