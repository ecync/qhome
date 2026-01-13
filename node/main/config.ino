#include <Preferences.h>
#include "config.h"

/*
* DEFAULT CONFIGURATIONS
*/
#define DEFAULT_NODE_NAME "Q-HOME-NODE"

#define DEFAULT_WIFI_PASSWORD "changeme"

#define DEFAULT_SYNC_INTERVAL 60000 // in milliseconds

// DHT Sensor
#define DEFAULT_ENABLE_DHT_SENSOR true
#define DEFAULT_HIGH_TEMP_DETECTION_VALUE 50.0
#define DEFAULT_LOW_TEMP_DETECTION_VALUE 20.0
#define DEFAULT_DHT_SENSOR_READ_INTERVAL 5000 // 80 in milliseconds

// PIR sensor
#define DEFAULT_ENABLE_PIR_SENSOR true
#define DEFAULT_PIR_SENSOR_READ_INTERVAL 1000

// MQ Sensor
#define DEFAULT_ENABLE_MQ_SENSOR true
#define DEFAULT_MQ_SENSOR_DITECTION_VALUE 2100
#define DEFAULT_MQ_SENSOR_READ_INTERVAL 5000  // in milliseconds

// Light Sensor
#define DEFAULT_ENABLE_LIGHT_SENSOR true
#define DEFAULT_LIGHT_SENSOR_TRIGGER_VALUE 400
#define DEFAULT_LIGHT_SENSOR_READ_INTERVAL 5000  // in milliseconds

// ZMPT Sensor
#define DEFAULT_ENABLE_ZMPT_SENSOR true
#define DEFAULT_HIGH_ZMPT_DETECTION_VALUE 255.0
#define DEFAULT_LOW_ZMPT_DETECTION_VALUE 220.0
#define DEFAULT_ZMPT_SENSOR_READ_INTERVAL 5000  // in milliseconds

// ACS Sensor
#define DEFAULT_ENABLE_ACS_SENSOR true
#define DEFAULT_HIGH_ACS_DETECTION_VALUE 9.0
#define DEFAULT_ACS_SENSOR_READ_INTERVAL 5000  // in milliseconds


// Create a config object
Preferences config;
Preferences mqtt_config;

/*
* Initialize configuration by loading values from Preferences
* If no saved values exist, default values are used
*/
void initConfig() {
    Serial.print("[SYSTEM] Getting configurations...");
    config.begin("config", false); // Open Preferences with namespace "config"
    mqtt_config.begin("mqtt_config", false); // Open Preferences with namespace "mqtt_config"

    // Load configurations or use default values
    NODE_NAME = config.getString("node_name", DEFAULT_NODE_NAME);
    WIFI_PASSWORD = config.getString("wifi_password", DEFAULT_WIFI_PASSWORD);
    SYNC_INTERVAL = config.getInt("sync_interval", DEFAULT_SYNC_INTERVAL);

    MQTT_SERVER_IP = mqtt_config.getString("mqtt_server_ip", DEFAULT_MQTT_SERVER_IP);
    MQTT_SERVER_PORT = mqtt_config.getInt("mqtt_server_port", DEFAULT_MQTT_SERVER_PORT);
    MQTT_SERVER_USER = mqtt_config.getString("mqtt_server_user", DEFAULT_MQTT_SERVER_USER);
    MQTT_SERVER_PASS = mqtt_config.getString("mqtt_server_pass", DEFAULT_MQTT_SERVER_PASS);

    ENABLE_DHT_SENSOR = config.getBool("enable_dht_sensor", DEFAULT_ENABLE_DHT_SENSOR);
    HIGH_TEMP_DETECTION_VALUE = config.getFloat("high_temp_value", DEFAULT_HIGH_TEMP_DETECTION_VALUE);
    LOW_TEMP_DETECTION_VALUE = config.getFloat("low_temp_value", DEFAULT_LOW_TEMP_DETECTION_VALUE);
    DHT_SENSOR_READ_INTERVAL = config.getInt("dht_read_interval", DEFAULT_DHT_SENSOR_READ_INTERVAL);

    ENABLE_PIR_SENSOR = config.getBool("enable_pir_sensor", DEFAULT_ENABLE_PIR_SENSOR);
    PIR_SENSOR_READ_INTERVAL = config.getInt("pir_read_interval", DEFAULT_PIR_SENSOR_READ_INTERVAL);

    ENABLE_MQ_SENSOR = config.getBool("enable_mq_sensor", DEFAULT_ENABLE_MQ_SENSOR);
    MQ_SENSOR_DITECTION_VALUE = config.getInt("mq_detection_value", DEFAULT_MQ_SENSOR_DITECTION_VALUE);
    MQ_SENSOR_READ_INTERVAL = config.getInt("mq_read_interval", DEFAULT_MQ_SENSOR_READ_INTERVAL);

    ENABLE_LIGHT_SENSOR = config.getBool("enable_light_sensor", DEFAULT_ENABLE_LIGHT_SENSOR);
    LIGHT_SENSOR_TRIGGER_VALUE = config.getInt("light_trigger_value", DEFAULT_LIGHT_SENSOR_TRIGGER_VALUE);
    LIGHT_SENSOR_READ_INTERVAL = config.getInt("light_read_interval", DEFAULT_LIGHT_SENSOR_READ_INTERVAL);

    ENABLE_ZMPT_SENSOR = config.getBool("enable_zmpt_sensor", DEFAULT_ENABLE_ZMPT_SENSOR);
    HIGH_ZMPT_DETECTION_VALUE = config.getFloat("high_zmpt_value", DEFAULT_HIGH_ZMPT_DETECTION_VALUE);
    LOW_ZMPT_DETECTION_VALUE = config.getFloat("low_zmpt_value", DEFAULT_LOW_ZMPT_DETECTION_VALUE);
    ZMPT_SENSOR_READ_INTERVAL = config.getInt("zmpt_read_interval", DEFAULT_ZMPT_SENSOR_READ_INTERVAL);

    ENABLE_ACS_SENSOR = config.getBool("enable_acs_sensor", DEFAULT_ENABLE_ACS_SENSOR);
    HIGH_ACS_DETECTION_VALUE = config.getFloat("high_acs_value", DEFAULT_HIGH_ACS_DETECTION_VALUE);
    ACS_SENSOR_READ_INTERVAL = config.getInt("acs_read_interval", DEFAULT_ACS_SENSOR_READ_INTERVAL);

    config.end();
    mqtt_config.end();
    Serial.println(" DONE!");
}

/*
* Save current configurations to Preferences
*/
void saveConfig() {
    Serial.print("[SYSTEM] Saving configurations...");
    config.begin("config", false); // Open Preferences with namespace "config"

    // Save configurations
    config.putString("node_name", NODE_NAME);
    config.putString("wifi_password", WIFI_PASSWORD);
    config.putInt("sync_interval", SYNC_INTERVAL);

    config.putBool("enable_dht_sensor", ENABLE_DHT_SENSOR);
    config.putFloat("high_temp_value", HIGH_TEMP_DETECTION_VALUE);
    config.putFloat("low_temp_value", LOW_TEMP_DETECTION_VALUE);
    config.putInt("dht_read_interval", DHT_SENSOR_READ_INTERVAL);

    config.putBool("enable_pir_sensor", ENABLE_PIR_SENSOR);
    config.putInt("pir_read_interval", PIR_SENSOR_READ_INTERVAL);

    config.putBool("enable_mq_sensor", ENABLE_MQ_SENSOR);
    config.putInt("mq_detection_value", MQ_SENSOR_DITECTION_VALUE);
    config.putInt("mq_read_interval", MQ_SENSOR_READ_INTERVAL);

    config.putBool("enable_light_sensor", ENABLE_LIGHT_SENSOR);
    config.putInt("light_trigger_value", LIGHT_SENSOR_TRIGGER_VALUE);
    config.putInt("light_read_interval", LIGHT_SENSOR_READ_INTERVAL);

    config.putBool("enable_zmpt_sensor", ENABLE_ZMPT_SENSOR);
    config.putFloat("high_zmpt_value", HIGH_ZMPT_DETECTION_VALUE);
    config.putFloat("low_zmpt_value", LOW_ZMPT_DETECTION_VALUE);
    config.putInt("zmpt_read_interval", ZMPT_SENSOR_READ_INTERVAL);

    config.putBool("enable_acs_sensor", ENABLE_ACS_SENSOR);
    config.putFloat("high_acs_value", HIGH_ACS_DETECTION_VALUE);
    config.putInt("acs_read_interval", ACS_SENSOR_READ_INTERVAL);

    config.end();
    Serial.println(" DONE!");
}

/*
* Reset configurations to default values
*/
void resetConfig() {
    Serial.print("[SYSTEM] Resetting configurations to default...");
    config.begin("config", false); // Open Preferences with namespace "config"

    // Reset configurations to default values
    config.putString("node_name", DEFAULT_NODE_NAME);
    config.putString("wifi_password", DEFAULT_WIFI_PASSWORD);
    config.putInt("sync_interval", DEFAULT_SYNC_INTERVAL);

    config.putBool("enable_dht_sensor", DEFAULT_ENABLE_DHT_SENSOR);
    config.putFloat("high_temp_value", DEFAULT_HIGH_TEMP_DETECTION_VALUE);
    config.putFloat("low_temp_value", DEFAULT_LOW_TEMP_DETECTION_VALUE);
    config.putInt("dht_read_interval", DEFAULT_DHT_SENSOR_READ_INTERVAL);

    config.putBool("enable_pir_sensor", DEFAULT_ENABLE_PIR_SENSOR);
    config.putInt("pir_read_interval", DEFAULT_PIR_SENSOR_READ_INTERVAL);

    config.putBool("enable_mq_sensor", DEFAULT_ENABLE_MQ_SENSOR);
    config.putInt("mq_detection_value", DEFAULT_MQ_SENSOR_DITECTION_VALUE);
    config.putInt("mq_read_interval", DEFAULT_MQ_SENSOR_READ_INTERVAL);

    config.putBool("enable_light_sensor", DEFAULT_ENABLE_LIGHT_SENSOR);
    config.putInt("light_trigger_value", DEFAULT_LIGHT_SENSOR_TRIGGER_VALUE);
    config.putInt("light_read_interval", DEFAULT_LIGHT_SENSOR_READ_INTERVAL);

    config.putBool("enable_zmpt_sensor", DEFAULT_ENABLE_ZMPT_SENSOR);
    config.putFloat("high_zmpt_value", DEFAULT_HIGH_ZMPT_DETECTION_VALUE);
    config.putFloat("low_zmpt_value", DEFAULT_LOW_ZMPT_DETECTION_VALUE);
    config.putInt("zmpt_read_interval", DEFAULT_ZMPT_SENSOR_READ_INTERVAL);

    config.putBool("enable_acs_sensor", DEFAULT_ENABLE_ACS_SENSOR);
    config.putFloat("high_acs_value", DEFAULT_HIGH_ACS_DETECTION_VALUE);
    config.putInt("acs_read_interval", DEFAULT_ACS_SENSOR_READ_INTERVAL);

    config.end();
    Serial.println(" DONE!");
}


/*
* Set mqtt configurations
*/
void setMqttConfig(const char* server_ip, const char* server_port, const char* server_user, const char* server_pass) {
    Serial.print("[SYSTEM] Setting MQTT configurations...");
    mqtt_config.begin("mqtt_config", false); // Open Preferences with namespace "mqtt_config"

    mqtt_config.putString("mqtt_server_ip", server_ip);
    mqtt_config.putInt("mqtt_server_port", atoi(server_port));
    mqtt_config.putString("mqtt_server_user", server_user);
    mqtt_config.putString("mqtt_server_pass", server_pass);

    mqtt_config.end();
    Serial.println(" DONE!");
}





