#include <PubSubClient.h>
#include <WiFi.h>
#include <ArduinoJson.h>
#include "config.h"
#include "mqtt.h"
#include "wifi_con.h"
#include "payloads.h"
#include "dht_sensor.h"
#include "mq_sensor.h"
#include "light_sensor.h"
#include "pir_sensor.h"
#include "zmpt_sensor.h"
#include "acs_sensor.h"

WiFiClient espClient;
PubSubClient mqttClient(espClient);


// Timer for reconnection attempts
unsigned long lastMqttReconnectAttempt = 0;

/**
 * MQTT Callback function
 */
void onMessage(char* topic, byte* payload, unsigned int length) {
    Serial.print(F("[MQTT] Message arrived ["));
    Serial.print(topic);
    Serial.print(F("] "));
    
    String message = "";
    for (unsigned int i = 0; i < length; i++) {
        message += (char)payload[i];
    }
    Serial.println(message); // DEBUG: Print the payload 

    // Handle configuration updates
    handleConfigUpdate(message);
    
    // Handle commands
    handleCommand(message);
}

/**
 * Initialize MQTT connection settings
 */
void initMqtt() {
    Serial.print(F("[MQTT] Initializing MQTT..."));
    
    // Configure MQTT Server
    if (MQTT_SERVER_IP.length() > 0) {
        mqttClient.setServer(MQTT_SERVER_IP.c_str(), MQTT_SERVER_PORT);
        mqttClient.setCallback(onMessage);
        mqttClient.setBufferSize(MQTT_CLIENT_BUFFER_SIZE);
        mqttClient.setKeepAlive(MQTT_CLIENT_KEEPALIVE);    
        Serial.println(F(" DONE!"));
    } else {
        Serial.println(F(" FAILED! (No Server IP)"));
    }
}

/**
 * Connect to the MQTT broker
 */
bool connectMqtt() {
    // Check if WiFi is connected
    if (!wifiConnected) {
        return false;
    }

    Serial.print(F("[MQTT] Attempting connection..."));

    // Attempt to connect
    if (mqttClient.connect(NODE_NAME.c_str(), MQTT_SERVER_USER.c_str(), MQTT_SERVER_PASS.c_str())) {
        Serial.println(F(" CONNECTED!"));
        mqttConnected = true;
        
        // Subscribe to topics
        mqttClient.subscribe(SUB_EVENT);

        // Send ACK payload
        delay(500); 
        String ackPayload = createAckPayload();
        publishMqtt(PUB_EVENT, ackPayload.c_str());
        
        return true;
    } else {
        Serial.print(F(" FAILED, rc="));
        Serial.print(mqttClient.state());
        Serial.println(F(" try again in 5 seconds"));
        mqttConnected = false;
        return false;
    }
}

/** 
 * Maintain MQTT connection and process loop
 */
void maintainMqtt() {
    // Only attempt MQTT if WiFi is connected
    if (!wifiConnected) {
        mqttConnected = false;
        return;
    }

    if (!mqttClient.connected()) {
        mqttConnected = false;
        unsigned long now = millis();
        // Attempt reconnection
        if (now - lastMqttReconnectAttempt > MQTT_RECONNECT_INTERVAL) {
            lastMqttReconnectAttempt = now;
            if (connectMqtt()) {
                lastMqttReconnectAttempt = 0;
            }
        }
    } else {
        mqttConnected = true;
        mqttClient.loop();
    }
}

/**
 * Publish a message to a specific topic
 */
bool publishMqtt(const char* topic, const char* payload) {
    if (!mqttClient.connected()) {
        return false;
    }
    return mqttClient.publish(topic, payload);
}
/**
 * Send sensor data
 */
void sendSensorData() {
    // Check if MQTT is connected
    if (!mqttConnected) {
        return;
    }

    // Check if it's time to sync
    unsigned long currentTime = millis();
    if (currentTime - lastSyncTime < SYNC_INTERVAL) {
        return;
    }

    // Update last sync time
    lastSyncTime = currentTime;
    // Create and publish sensor data payload
    String payload = createSensorDataPayload(
        String(lastDhtTemperature),
        String(lastDhtHumidity),
        String(mqSensorValue),
        String(lightSensorValue),
        String(zmptSensorValue),
        String(acsSensorValue),
        String(acsPowerValue),
        String(acsEnergyValue)
    );
    publishMqtt(PUB_EVENT, payload.c_str());
    
    Serial.println(F("[MQTT] Sensor data sent"));
}
