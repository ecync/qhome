import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MqttService } from './mqtt.service';
import { CommandTypes, AckData } from 'src/types';


@WebSocketGateway({
    namespace: '/mqtt',
    cors: {
        origin: '*',
    },
    path: '/ws',
})
export class MqttGateway {
    @WebSocketServer()
    private server: Server;

    constructor(private readonly eventEmitter: EventEmitter2, private readonly mqttService: MqttService) {}

    afterInit() {
        console.log('WebSocket Gateway Initialized');
        // Wire event emitter -> websocket broadcasts
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
    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('subscribeToNode')
    handleSubscribeToNode(@MessageBody() data: { node_name: string }, client: any) {
        const { node_name } = data;
        client.join(node_name);
        console.log(`Client ${client.id} subscribed to node: ${node_name}`);
    }

    // Frontend -> send command to node
    @SubscribeMessage('sendCommand')
    async handleSendCommand(@MessageBody() command: CommandTypes, client: Socket) {
        await this.mqttService.sendCommand(command);
        client.emit('command.ack', { command, status: 'sent' });
    }

    // Frontend -> update config on node
    @SubscribeMessage('updateConfig')
    async handleUpdateConfig(@MessageBody() data: { node_name: string; config: AckData['config'] }, client: Socket) {
        const { node_name, config } = data;
        await this.mqttService.sendConfigUpdate(node_name, config);
        client.emit('config.ack', { node_name, status: 'sent' });
    }

    


}

