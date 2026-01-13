#include "config.h"
#include "payloads.h"
#include "mqtt.h"
#include "lcd.h"
#include "light_sensor.h"
#include <ArduinoJson.h>

/*
* Create ACK Payload
*/
String createAckPayload() {
    DynamicJsonDocument doc(1024);
    
    doc["node_name"] = NODE_NAME;
    doc["type"] = PayloadTypes::ACK;
    doc["data"]["config"]["system"]["wifi_password"] = WIFI_PASSWORD;
    doc["data"]["config"]["system"]["sync_interval"] = SYNC_INTERVAL;
    doc["data"]["config"]["sensors"]["dht_sensor"]["enabled"] = ENABLE_DHT_SENSOR;
    doc["data"]["config"]["sensors"]["dht_sensor"]["high_temp_value"] = HIGH_TEMP_DETECTION_VALUE;
    doc["data"]["config"]["sensors"]["dht_sensor"]["low_temp_value"] = LOW_TEMP_DETECTION_VALUE;
    doc["data"]["config"]["sensors"]["dht_sensor"]["read_interval"] = DHT_SENSOR_READ_INTERVAL;
    doc["data"]["config"]["sensors"]["pir_sensor"]["enabled"] = ENABLE_PIR_SENSOR;
    doc["data"]["config"]["sensors"]["pir_sensor"]["read_interval"] = PIR_SENSOR_READ_INTERVAL;
    doc["data"]["config"]["sensors"]["mq_sensor"]["enabled"] = ENABLE_MQ_SENSOR;
    doc["data"]["config"]["sensors"]["mq_sensor"]["detection_value"] = MQ_SENSOR_DITECTION_VALUE;
    doc["data"]["config"]["sensors"]["mq_sensor"]["read_interval"] = MQ_SENSOR_READ_INTERVAL;
    doc["data"]["config"]["sensors"]["light_sensor"]["enabled"] = ENABLE_LIGHT_SENSOR;
    doc["data"]["config"]["sensors"]["light_sensor"]["trigger_value"] = LIGHT_SENSOR_TRIGGER_VALUE;
    doc["data"]["config"]["sensors"]["light_sensor"]["read_interval"] = LIGHT_SENSOR_READ_INTERVAL;
    doc["data"]["config"]["sensors"]["zmpt_sensor"]["enabled"] = ENABLE_ZMPT_SENSOR;
    doc["data"]["config"]["sensors"]["zmpt_sensor"]["high_value"] = HIGH_ZMPT_DETECTION_VALUE;
    doc["data"]["config"]["sensors"]["zmpt_sensor"]["low_value"] = LOW_ZMPT_DETECTION_VALUE;
    doc["data"]["config"]["sensors"]["zmpt_sensor"]["read_interval"] = ZMPT_SENSOR_READ_INTERVAL;
    doc["data"]["config"]["sensors"]["acs_sensor"]["enabled"] = ENABLE_ACS_SENSOR; 
    doc["data"]["config"]["sensors"]["acs_sensor"]["high_value"] = HIGH_ACS_DETECTION_VALUE;
    doc["data"]["config"]["sensors"]["acs_sensor"]["read_interval"] = ACS_SENSOR_READ_INTERVAL;

    String output;
    serializeJson(doc, output);
    return output;
}

/*
* Create Alert Payload
*/
String createAlertPayload(String alertType, String message) {
    DynamicJsonDocument doc(256);
    
    doc["node_name"] = NODE_NAME;
    doc["type"] = PayloadTypes::ALERT;
    doc["data"]["alert_type"] = alertType;
    doc["data"]["message"] = message;

    String output;
    serializeJson(doc, output);
    return output;
}

/*
* Create Error Payload
*/
String createErrorPayload(String errorType, String message) {
    DynamicJsonDocument doc(256);
    
    doc["node_name"] = NODE_NAME;
    doc["type"] = PayloadTypes::ERROR;
    doc["data"]["error_type"] = errorType;
    doc["data"]["message"] = message;

    String output;
    serializeJson(doc, output);
    return output;
}

/*
* Create Sensor Data Payload
*/
String createSensorDataPayload(String temp, String hum, String mq, String light, String zmpt, String acs, String acsPower, String acsEnergy) {
    DynamicJsonDocument doc(1024);
    
    doc["node_name"] = NODE_NAME;
    doc["type"] = PayloadTypes::SENSOR_DATA;
    doc["data"]["temperature"] = temp;
    doc["data"]["humidity"] = hum;
    doc["data"]["mq_value"] = mq;
    doc["data"]["light_value"] = light;
    doc["data"]["zmpt_value"] = zmpt;
    doc["data"]["acs_value"] = acs;
    doc["data"]["acs_power"] = acsPower;
    doc["data"]["acs_energy"] = acsEnergy;


    String output;
    serializeJson(doc, output);
    return output;
}


/*
* Handle Config Update
*/
void handleConfigUpdate(String payload) {
    DynamicJsonDocument doc(1024);
    DeserializationError error = deserializeJson(doc, payload);

    if (error) {
        Serial.print(F("deserializeJson() failed: "));
        Serial.println(error.f_str());
        return;
    }

    // Support NestJS microservices wrapper: { pattern, data: { type, data } }
    JsonObject root = doc.as<JsonObject>();
    JsonObject payloadObj = root;
    if (root.containsKey("data") && root["data"].is<JsonObject>()) {
        payloadObj = root["data"].as<JsonObject>();
    }

    // Check if it is a config update
    if (payloadObj["type"] != PayloadTypes::CONFIG_UPDATE) {
        return;
    }

    JsonObject configData = payloadObj["data"]["config"];
    if (configData.isNull()) {
        return;
    }

    Serial.println(F("[SYSTEM] Processing Config Update..."));

    // System Config
    if (configData["system"].containsKey("wifi_password")) WIFI_PASSWORD = configData["system"]["wifi_password"].as<String>();
    if (configData["system"].containsKey("sync_interval")) SYNC_INTERVAL = configData["system"]["sync_interval"].as<int>();
    if (configData["system"].containsKey("node_name")) {
        String newNodeName = configData["system"]["node_name"].as<String>();
        if (newNodeName != NODE_NAME) {
            Serial.print(F("[SYSTEM] Node name changed from "));
            Serial.print(NODE_NAME);
            Serial.print(F(" to "));
            Serial.println(newNodeName);
            NODE_NAME = newNodeName;
        }
    }

    // DHT Sensor
    if (configData["sensors"]["dht_sensor"].containsKey("enabled")) ENABLE_DHT_SENSOR = configData["sensors"]["dht_sensor"]["enabled"];
    if (configData["sensors"]["dht_sensor"].containsKey("high_temp_value")) HIGH_TEMP_DETECTION_VALUE = configData["sensors"]["dht_sensor"]["high_temp_value"];
    if (configData["sensors"]["dht_sensor"].containsKey("low_temp_value")) LOW_TEMP_DETECTION_VALUE = configData["sensors"]["dht_sensor"]["low_temp_value"];
    if (configData["sensors"]["dht_sensor"].containsKey("read_interval")) DHT_SENSOR_READ_INTERVAL = configData["sensors"]["dht_sensor"]["read_interval"];

    // PIR Sensor
    if (configData["sensors"]["pir_sensor"].containsKey("enabled")) ENABLE_PIR_SENSOR = configData["sensors"]["pir_sensor"]["enabled"];
    if (configData["sensors"]["pir_sensor"].containsKey("read_interval")) PIR_SENSOR_READ_INTERVAL = configData["sensors"]["pir_sensor"]["read_interval"];

    // MQ Sensor
    if (configData["sensors"]["mq_sensor"].containsKey("enabled")) ENABLE_MQ_SENSOR = configData["sensors"]["mq_sensor"]["enabled"];
    if (configData["sensors"]["mq_sensor"].containsKey("detection_value")) MQ_SENSOR_DITECTION_VALUE = configData["sensors"]["mq_sensor"]["detection_value"];
    if (configData["sensors"]["mq_sensor"].containsKey("read_interval")) MQ_SENSOR_READ_INTERVAL = configData["sensors"]["mq_sensor"]["read_interval"];

    // Light Sensor
    if (configData["sensors"]["light_sensor"].containsKey("enabled")) ENABLE_LIGHT_SENSOR = configData["sensors"]["light_sensor"]["enabled"];
    if (configData["sensors"]["light_sensor"].containsKey("trigger_value")) LIGHT_SENSOR_TRIGGER_VALUE = configData["sensors"]["light_sensor"]["trigger_value"];
    if (configData["sensors"]["light_sensor"].containsKey("read_interval")) LIGHT_SENSOR_READ_INTERVAL = configData["sensors"]["light_sensor"]["read_interval"];

    // ZMPT Sensor
    if (configData["sensors"]["zmpt_sensor"].containsKey("enabled")) ENABLE_ZMPT_SENSOR = configData["sensors"]["zmpt_sensor"]["enabled"];
    if (configData["sensors"]["zmpt_sensor"].containsKey("high_value")) HIGH_ZMPT_DETECTION_VALUE = configData["sensors"]["zmpt_sensor"]["high_value"];
    if (configData["sensors"]["zmpt_sensor"].containsKey("low_value")) LOW_ZMPT_DETECTION_VALUE = configData["sensors"]["zmpt_sensor"]["low_value"];
    if (configData["sensors"]["zmpt_sensor"].containsKey("read_interval")) ZMPT_SENSOR_READ_INTERVAL = configData["sensors"]["zmpt_sensor"]["read_interval"];

    // ACS Sensor
    if (configData["sensors"]["acs_sensor"].containsKey("enabled")) ENABLE_ACS_SENSOR = configData["sensors"]["acs_sensor"]["enabled"];
    if (configData["sensors"]["acs_sensor"].containsKey("high_value")) HIGH_ACS_DETECTION_VALUE = configData["sensors"]["acs_sensor"]["high_value"];
    if (configData["sensors"]["acs_sensor"].containsKey("read_interval")) ACS_SENSOR_READ_INTERVAL = configData["sensors"]["acs_sensor"]["read_interval"];

    // Save to preferences
    saveConfig();
    
    // Send ACK
    String ack = createAckPayload();
    publishMqtt(PUB_EVENT, ack.c_str());
}

/*
* Handle Command
*/
void handleCommand(String payload) {
    DynamicJsonDocument doc(512);
    DeserializationError error = deserializeJson(doc, payload);

    if (error) {
        Serial.print(F("deserializeJson() failed: "));
        Serial.println(error.f_str());
        return;
    }

    // Support NestJS microservices wrapper: { pattern, data: { type, data } }
    JsonObject root = doc.as<JsonObject>();
    JsonObject payloadObj = root;
    if (root.containsKey("data") && root["data"].is<JsonObject>()) {
        payloadObj = root["data"].as<JsonObject>();
    }

    // Check if it is a command
    if (payloadObj["type"] != PayloadTypes::COMMAND) {
        return;
    }

    String command = payloadObj["data"]["command"];
    
    if (command == CommandTypes::TOGGLE_LIGHT) {
        setLightCommand(true);
    } else if (command == CommandTypes::TOGGLE_LIGHT_OFF) {
        setLightCommand(false);
    } else if ( command == CommandTypes::RESTART) {
        Serial.println(F("[CMD] Restart command received. Restarting..."));
        centerText("Restarting...", 0);
        delay(1000);
        clearLCD();
        ESP.restart();
    } else if (command == CommandTypes::RESET_CONFIG) {
        Serial.println(F("[CMD] Reset Config command received. Resetting to defaults..."));
        resetConfig();
        centerText("Resetting...", 0);
        delay(1000);
        clearLCD();
        ESP.restart();
    }else {
        Serial.print(F("[CMD] Unknown command: "));
        Serial.println(command);
    }
}