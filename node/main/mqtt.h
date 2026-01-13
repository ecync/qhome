#ifndef MQTT_H
#define MQTT_H

// PUB SUB EVENTS
#define PUB_EVENT "node/send"
#define SUB_EVENT "node/cmd"

// MQTT Client Settings
#define MQTT_CLIENT_BUFFER_SIZE 1024
#define MQTT_CLIENT_KEEPALIVE 60
#define MQTT_RECONNECT_INTERVAL 5000  // 5 seconds

// MQTT connection state
bool mqttConnected = false;

// Sync timer
unsigned long lastSyncTime = 0;

// Function declarations
void initMqtt();
void maintainMqtt();
bool publishMqtt(const char* topic, const char* payload);
void sendSensorData();

#endif