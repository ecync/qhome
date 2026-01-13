import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';

export type NodeConfigDocument = HydratedDocument<NodeConfig>;

@Schema({ id: false, _id: false })
export class NodeConfig {
    @Prop({ required: true })
    nodeName: string;
    @Prop({ type: Boolean, default: false })
    isActive: boolean;
    @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
    system: {
        wifi_password: string;
        sync_interval: number;
    }
    @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
    sensors: {
        dht_sensor: {
            enabled: boolean;
            high_temp_value: number;
            low_temp_value: number;
            read_interval: number;
        };
        pir_sensor: {
            enabled: boolean;
            read_interval: number;
        };
        mq_sensor: {
            enabled: boolean;
            detection_value: number;
            read_interval: number;
        };
        light_sensor: {
            enabled: boolean;
            trigger_value: number;
            read_interval: number;
        };
        zmpt_sensor: {
            enabled: boolean;
            high_value: number;
            low_value: number;
            read_interval: number;
        };
        acs_sensor: {
            enabled: boolean;
            high_value: number;
            read_interval: number;
        }
    }
    @Prop({ type: mongoose.Schema.Types.Date, default: Date.now })
    updatedAt: Date;

    @Prop({ type: mongoose.Schema.Types.Date, required: false })
    lastSyncedAt: Date;
}

export const NodeConfigSchema = SchemaFactory.createForClass(NodeConfig);