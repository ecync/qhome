import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';
import { NodeConfig } from './node.config.schema';

export type NodeAlertDocument = HydratedDocument<NodeAlert>;

@Schema({ timestamps: true })
export class NodeAlert {
    @Prop({ required: true })
    type: string
    @Prop({ required: true })
    message: string
    @Prop({ type: mongoose.Schema.Types.Date, default: Date.now })
    createdAt: Date;
}

export const NodeAlertSchema = SchemaFactory.createForClass(NodeAlert);