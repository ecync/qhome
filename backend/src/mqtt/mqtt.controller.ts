import { Controller, Post, Get, Param, Query, Body, HttpCode, HttpStatus, BadRequestException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { MessagePattern, Ctx, MqttContext } from '@nestjs/microservices';
import { CommandTypes, IncomingMessage, AckData } from 'src/types';

@Controller('mqtt')
export class MqttController {
  constructor(
    private readonly mqttService: MqttService
  ) {}

  @MessagePattern('node/send')
  handleMessage(@Ctx() context: MqttContext) {
    const payload = this.mqttService.publicToSafeJson(context.getPacket().payload);
    console.log('Received message on test/topic:', payload);
    return this.mqttService.processPayload(payload as IncomingMessage);
  }

  @Get('status')
  @HttpCode(HttpStatus.OK)
  async getStatus() {
    const status = await this.mqttService.getNodeConfig();
    return status;
  }

  @Get('errors')
  @HttpCode(HttpStatus.OK)
  async getErrors(@Query('limit') limit = 10) {
    const errors = await this.mqttService.getRecentErrors(Number(limit));
    return errors;
  }

  @Get('alerts')
  @HttpCode(HttpStatus.OK)
  async getAlerts(@Query('limit') limit = 10) {
    const alerts = await this.mqttService.getRecentAlerts(Number(limit));
    return alerts;
  }

  @Post('command/:cmd')
  @HttpCode(HttpStatus.ACCEPTED)
  async sendCommand(@Param('cmd') cmd: CommandTypes) {
    try {
      await this.mqttService.sendCommand(cmd);
      return { status: 'sent', command: cmd };
    } catch (error) {
      throw new InternalServerErrorException('Failed to send command');
    }
  }

  @Post('config')
  @HttpCode(HttpStatus.ACCEPTED)
  async updateConfig(@Body() body: { config: AckData['config'] }) {
    try {
      const { config } = body;
      if (!config) {
        throw new BadRequestException('config is required');
      }
      const nodeName = await this.mqttService.sendConfigUpdate(undefined, config);
      return { status: 'sent', node_name: nodeName };
    } catch (error) {
      throw new InternalServerErrorException('Failed to send config update');
    }
  }

  @Get('sensor-data/:date')
  @HttpCode(HttpStatus.OK)
  async getAnalytics(@Param('date') date: string) {
    const sensorData = await this.mqttService.getSensorData(Number(date));
    return sensorData;
  }
}
