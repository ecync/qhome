#include "config.h"
#include "components.h"
#include "wifi_con.h"
#include "mqtt.h"
#include "dht_sensor.h"
#include "lcd.h"
#include "mq_sensor.h"
#include "light_sensor.h"
#include "pir_sensor.h"
#include "zmpt_sensor.h"
#include "acs_sensor.h"


void setup() {
  Serial.begin(115200);
  initComponents(); // Initialize components
  initLcd();        // Initialize LCD
  
  displayProgressBar(10, 1);
  initConfig();     // Initialize configurations
  
  displayProgressBar(30, 1);
  initWifi();       // Initialize WiFi
  
  displayProgressBar(50, 1);
  initMqtt();       // Initialize MQTT

  // Sensor initializations
  displayProgressBar(60, 1);
  initDhtSensor();  // Initialize DHT sensor
  
  displayProgressBar(70, 1);
  initMqSensor();   // Initialize MQ sensor
  
  displayProgressBar(80, 1);
  initLightSensor(); // Initialize Light sensor
  
  displayProgressBar(85, 1);
  initPirSensor();   // Initialize PIR sensor
  
  displayProgressBar(90, 1);
  initZmptSensor();  // Initialize ZMPT sensor
  
  displayProgressBar(95, 1);
  initAcsSensor();   // Initialize ACS sensor
  
  displayProgressBar(100, 1);
  delay(1000); // Show 100% for a moment
  clearLCD(); // Clear LCD
  longBeep(); // Indicate system ready
}

void loop() {
  handleSystemButton(); // Handle system button presses
  handleErrorIndication(); // Handle error indication
  handleWifiLed(); // Handle WiFi LED indication
  maintainWifi(); // Maintain WiFi connection
  maintainMqtt(); // Maintain MQTT connection

  // Handle manual button for light sensor
  handleManualButton();
  
  // Sensor handling
  handleDhtSensor(); // Handle DHT sensor readings
  handleMqSensor();  // Handle MQ sensor
  handleMqLed();     // Handle MQ LED
  handleLightSensor(); // Handle Light sensor
  handlePirSensor();   // Handle PIR sensor
  handleZmptSensor();  // Handle ZMPT sensor
  handleAcsSensor();   // Handle ACS sensor

  // Send sensor data
  sendSensorData();

  // Handle LCD
  handleLcd();
}
