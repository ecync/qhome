import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';
import { NodeConfig } from './node.config.schema';

export type NodeErrorDocument = HydratedDocument<NodeError>;

@Schema({ timestamps: true })
export class NodeError {
    @Prop({ required: true })
    type: string
    @Prop({ required: true })
    message: string
    @Prop({ type: mongoose.Schema.Types.Date, default: Date.now })
    createdAt: Date;
}

export const NodeErrorSchema = SchemaFactory.createForClass(NodeError);