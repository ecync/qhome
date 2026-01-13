#include "config.h"
#include "payloads.h"
#include "components.h"
#include "mqtt.h"
#include "pir_sensor.h"

bool pirSensorStatus = false;
bool motionDetected = false;

void initPirSensor() {
  Serial.print(F("[PIR] Initializing PIR sensor..."));
  pinMode(PIR_SENSOR_PIN, INPUT);
  pirSensorStatus = true;
  Serial.println(F(" OK"));
}

void handlePirSensor() {
  static unsigned long lastPirCheckTime = 0;
  // Only read if sensor is enabled
  if (!ENABLE_PIR_SENSOR) {
    return;
  }

  // Check if it is time to read the sensor
  if (millis() - lastPirCheckTime < PIR_SENSOR_READ_INTERVAL) {
    return;
  }
  lastPirCheckTime = millis();

  // Read PIR sensor
  int pirState = digitalRead(PIR_SENSOR_PIN);
  
  // Detect motion
  if (pirState == HIGH && !motionDetected) {
    motionDetected = true;
    Serial.println(F("[PIR] Motion detected!"));
    doubleBeep();
    // send motion detected payload
    String payload = createAlertPayload(AlertTypes::MOTION_DETECTED, "Motion detected");
    publishMqtt(PUB_EVENT, payload.c_str());
  } 
}
