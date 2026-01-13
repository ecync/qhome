#include "config.h"
#include "wifi_con.h"

WiFiManager wm;

// WiFiManager MQTT Server Parameters
WiFiManagerParameter custom_mqtt_host("host", "MQTT Host", DEFAULT_MQTT_SERVER_IP, 40);
WiFiManagerParameter custom_mqtt_port("port", "MQTT Port", String(DEFAULT_MQTT_SERVER_PORT).c_str(), 6);
WiFiManagerParameter custom_mqtt_user("user", "MQTT User", DEFAULT_MQTT_SERVER_USER, 20);
WiFiManagerParameter custom_mqtt_pass("pass", "MQTT Password", DEFAULT_MQTT_SERVER_PASS, 20);


unsigned long previousMillis = 0;

/**
 * Initialize WiFi Manager and attempt connection
 */
void initWifi() {
  Serial.print(F("[WIFI] Connecting to WiFi..."));
  
  // Set debug output to false
  wm.setDebugOutput(false);
  
  // Add custom parameters to WiFiManager
  wm.addParameter(&custom_mqtt_host);
  wm.addParameter(&custom_mqtt_port);
  wm.addParameter(&custom_mqtt_user);
  wm.addParameter(&custom_mqtt_pass);

  // Reset settings - Test only
  // wm.resetSettings();

  // Set Config Portal to non-blocking
  wm.setConfigPortalBlocking(false);
  
  // Set callback for saving parameters
  wm.setSaveParamsCallback(onParameterSave);

  // Start Wifi portal
  if (wm.autoConnect(NODE_NAME.c_str(), WIFI_PASSWORD.c_str())) {
    wifiConnected = true;
    Serial.println(F(" CONNECTED!"));
  } else {
    wifiConnected = false;
    Serial.println(F(" RUNNING AP"));
  }
}

/**
 * Callback for saving parameters from WiFiManager
 */
void onParameterSave() {
  Serial.println(F("[WIFI] Saving parameters..."));
  // Get the updated parameters
  const char* mqtt_host = custom_mqtt_host.getValue();
  const char* mqtt_port = custom_mqtt_port.getValue();
  const char* mqtt_user = custom_mqtt_user.getValue();
  const char* mqtt_pass = custom_mqtt_pass.getValue();
  
  // Save to config
  setMqttConfig(mqtt_host, mqtt_port, mqtt_user, mqtt_pass);
}

/**
 * Maintain WiFi connection and handle Config Portal
 */
void maintainWifi() {
  wm.process();

  unsigned long currentMillis = millis();

  // Check connected
  if (WiFi.status() == WL_CONNECTED) {
    if (!wifiConnected) {
      wifiConnected = true;
      Serial.println(F("[WIFI] Reconnected!"));
    }
    // Reset the reconnection timer
    previousMillis = currentMillis;
    return;
  }

  // not connected
  wifiConnected = false;

  // Try to reconnect
  if (currentMillis - previousMillis >= WIFI_RECONNECT_INTERVAL) {
    previousMillis = currentMillis;
    Serial.println(F("[WIFI] Connection lost. Attempting to reconnect..."));
    
    // Attempt to reconnect
    WiFi.reconnect();
  }
}

/**
 * Reset WiFi settings and restart
 */
void resetWifi() {
  Serial.println(F("[WIFI] Resetting WiFi Settings..."));
  wm.resetSettings();
}
