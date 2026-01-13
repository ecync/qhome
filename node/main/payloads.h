// payloads.h
#ifndef PAYLOADS_H
#define PAYLOADS_H

#include <ArduinoJson.h>

// Payload Types
namespace PayloadTypes {
    const char* const  ACK = "_ack";
    const char* const  SENSOR_DATA = "_sensor_data";
    const char* const  CONFIG_UPDATE = "_config_update";
    const char* const  ALERT = "_alert";
    const char* const  COMMAND = "_command";
    const char* const  ERROR = "_error";
}

// Alert Types
namespace AlertTypes {
    const char* const  HIGH_TEMPERATURE = "high_temperature";
    const char* const  LOW_TEMPERATURE = "low_temperature";
    const char* const  MOTION_DETECTED = "motion_detected";
    const char* const  GAS_DETECTED = "gas_detected";
    const char* const  LIGHT_ON = "light_on";
    const char* const  LIGHT_OFF = "light_off";
    const char* const  HIGH_VOLTAGE = "high_voltage";
    const char* const  LOW_VOLTAGE = "low_voltage";
    const char* const  HIGH_CURRENT = "high_current";
}

// Error Types
namespace ErrorTypes {
    const char* const  DHT_READ_FAILURE = "dht_read_failure";
    const char* const  PIR_READ_FAILURE = "pir_read_failure";
    const char* const  MQ_READ_FAILURE = "mq_read_failure";
    const char* const  LIGHT_READ_FAILURE = "light_read_failure";
    const char* const  ZMPT_READ_FAILURE = "zmpt_read_failure";
    const char* const  ACS_READ_FAILURE = "acs_read_failure";  
}

// Command Types
namespace CommandTypes {
    const char* const  RESTART = "restart";
    const char* const  RESET_CONFIG = "reset_config";
    const char* const  TOGGLE_LIGHT = "light_on";
    const char* const  TOGGLE_LIGHT_OFF = "light_off";
}

// Function declarations
String createAckPayload();
String createAlertPayload(String alertType, String message);
String createErrorPayload(String errorType, String message);
String createSensorDataPayload(String temp, String hum, String mq, String light, String zmpt, String acs, String acsPower, String acsEnergy);
void handleConfigUpdate(String payload);
void handleCommand(String payload);
#endif