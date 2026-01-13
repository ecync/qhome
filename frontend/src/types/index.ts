
export interface SensorData {
    temperature?: number;
    tempeture?: number; // Handling API typo
    humidity: number;
    mq_value: number; // Gas
    light_value: number;
    zmpt_value: number; // Voltage
    acs_value: number; // Current
    acs_power: number; // Power
    acs_energy: number; // Energy
    createdAt?: number;
    nodeName?: string;
}

// Configuration Models
export interface SensorConfig {
    enabled: boolean;
    read_interval: number;
    high_value?: number;
    low_value?: number;
    trigger_value?: number;
    detection_value?: number;
}

export interface NodeConfig {
    nodeName?: string;
    isActive: boolean;
    system: {
        wifi_password?: string; // Optional for security in frontend
        sync_interval: number;
    };
    sensors: {
        dht_sensor: SensorConfig & { high_temp_value: number; low_temp_value: number };
        pir_sensor: SensorConfig;
        mq_sensor: SensorConfig & { detection_value: number };
        light_sensor: SensorConfig & { trigger_value: number };
        zmpt_sensor: SensorConfig & { high_value: number; low_value: number };
        acs_sensor: SensorConfig & { high_value: number };
    };
}

export interface NodeAlert {
    node_name: string;
    timestamp: string;
    data: {
        alert_type: 'high_temperature' | 'low_temperature' | 'motion_detected' | 'gas_detected' | 'light_on' | 'light_off' | 'high_voltage' | 'low_voltage' | 'high_current';
        message: string;
    };
}
