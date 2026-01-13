// config.h
#ifndef CONFIG_H
#define CONFIG_H


// Default MQTT Server
#define DEFAULT_MQTT_SERVER_IP "your-mqtt-server.com"
#define DEFAULT_MQTT_SERVER_PORT 1883
#define DEFAULT_MQTT_SERVER_USER "your_username"
#define DEFAULT_MQTT_SERVER_PASS "your_password"


/**
* EDITABLE CONFIGURATIONS
*/
String NODE_NAME;  // Device node name

String WIFI_PASSWORD;  // Config potal password

int SYNC_INTERVAL;  // Server sync interval in milliseconds

// MQTT Server
String MQTT_SERVER_IP;
int MQTT_SERVER_PORT;
String MQTT_SERVER_USER;
String MQTT_SERVER_PASS;

// DHT Sensor
bool ENABLE_DHT_SENSOR;
float HIGH_TEMP_DETECTION_VALUE;
float LOW_TEMP_DETECTION_VALUE;
int DHT_SENSOR_READ_INTERVAL;

// PIR Sensor
bool ENABLE_PIR_SENSOR;
int PIR_SENSOR_READ_INTERVAL;

// MQ Sensor
bool ENABLE_MQ_SENSOR;
int MQ_SENSOR_DITECTION_VALUE;
int MQ_SENSOR_READ_INTERVAL;

// Light Sensor
bool ENABLE_LIGHT_SENSOR;
int LIGHT_SENSOR_TRIGGER_VALUE;
int LIGHT_SENSOR_READ_INTERVAL;

// ZMPT Sensor
bool ENABLE_ZMPT_SENSOR;
float HIGH_ZMPT_DETECTION_VALUE;
float LOW_ZMPT_DETECTION_VALUE;
int ZMPT_SENSOR_READ_INTERVAL;

// ACS Sensor
bool ENABLE_ACS_SENSOR;
float HIGH_ACS_DETECTION_VALUE;
int ACS_SENSOR_READ_INTERVAL;


// Function declarations
void loadConfig();
void saveConfig();
void resetConfig();
void setMqttConfig(const char* server_ip, const char* server_port, const char* server_user, const char* server_pass);

#endif