
export enum IncommingMessageType {
    ACK = "_ack",
    SENSOR_DATA = "_sensor_data",
    CONFIG_UPDATE = "_config_update",
    ALERT = "_alert",
    COMMAND = "_command",
    ERROR = "_error",
}

export enum AlertTypes {
    HIGH_TEMPERATURE = "high_temperature",
    LOW_TEMPERATURE = "low_temperature",
    MOTION_DETECTED = "motion_detected",
    GAS_DETECTED = "gas_detected",
    LIGHT_ON = "light_on",
    LIGHT_OFF = "light_off",
    HIGH_VOLTAGE = "high_voltage",
    LOW_VOLTAGE = "low_voltage",
    HIGH_CURRENT = "high_current",
}

export enum ErrorTypes {
    DHT_READ_FAILURE = "dht_read_failure",
    PIR_READ_FAILURE = "pir_read_failure",
    MQ_READ_FAILURE = "mq_read_failure",
    LIGHT_READ_FAILURE = "light_read_failure",
    ZMPT_READ_FAILURE = "zmpt_read_failure",
    ACS_READ_FAILURE = "acs_read_failure",
}

export enum CommandTypes {
    RESTART = "restart",
    RESET_CONFIG = "reset_config",
    TOGGLE_LIGHT = "toggle_light",
    TOGGLE_LIGHT_OFF = "toggle_light_off",
}

export interface ErrorData {
    error_type: ErrorTypes;
    message: string;
}

export interface CommandData {
    command: CommandTypes;
}

export interface AckData {
    config: {
        system: {
            wifi_password: string;
            sync_interval: number;
        };
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
    };
}

// Payload for backend -> node configuration update
export interface ConfigUpdateData {
    config: AckData['config'];
}

export interface AlertData {
    alert_type: AlertTypes;
    message: string;
}

export interface SensorData {
    temperature: number;
    humidity: number;
    mq_value: number;
    light_value: number;
    zmpt_value: number;
    acs_value: number;
    acs_power: number;
    acs_energy: number;
}

export interface IncomingMessage {
    node_name: string;
    type: IncommingMessageType;
    data: AckData | SensorData | AlertData | CommandData | ErrorData | ConfigUpdateData;
}


export type ServerEventTypes =
    'sensor.data' | 
    'node.alert' |
    'node.error' ;