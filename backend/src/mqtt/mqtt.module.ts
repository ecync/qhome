import { Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { MqttGateway } from './mqtt.gateway';
import { MqttController } from './mqtt.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { NodeConfig, NodeConfigSchema } from 'src/schema/node.config.schema';
import { NodeSensorData, NodeSensorDataSchema } from 'src/schema/node.sensor.data.schema';
import { NodeAlert, NodeAlertSchema } from 'src/schema/node.alert.schema';
import { NodeError, NodeErrorSchema } from 'src/schema/node.error.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: NodeConfig.name, schema: NodeConfigSchema },
      { name: NodeSensorData.name, schema: NodeSensorDataSchema },
      { name: NodeAlert.name, schema: NodeAlertSchema },
      { name: NodeError.name, schema: NodeErrorSchema },
    ]),
    ClientsModule.register([
      {
        name: 'MQTT_SERVICE',
        transport: Transport.MQTT,
        options: {
          url: 'ws://158.101.98.79:9001/mqtt',
        },
      },
    ]),
  ],
  controllers: [MqttController],
  providers: [MqttService, MqttGateway],
})
export class MqttModule {}
