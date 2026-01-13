import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';
import { NodeConfig } from './node.config.schema';

export type NodeSensorDataDocument = HydratedDocument<NodeSensorData>;

@Schema({ timestamps: true })
export class NodeSensorData {
    @Prop({ required: false })
    tempeture?: number;
    @Prop({ required: false })
    humidity?: number;
    @Prop({ required: false })
    mq_value?: number
    @Prop({ required: false })
    light_value?: number
    @Prop({ required: false })
    zmpt_value?: number
    @Prop({ required: false })
    acs_value?: number
    @Prop({ required: false })
    acs_power?: number
    @Prop({ required: false })
    acs_energy?: number
    @Prop({ type: mongoose.Schema.Types.Date, default: Date.now })
    createdAt: Date;
}

export const NodeSensorDataSchema = SchemaFactory.createForClass(NodeSensorData);