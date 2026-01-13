#include <ZMPT101B.h>
#include "config.h"
#include "payloads.h"
#include "components.h"
#include "mqtt.h"
#include "zmpt_sensor.h"

// Define AC Frequency (50Hz or 60Hz)
#define AC_FREQ 50.0
// Define Sensitivity (Calibrate this value)
#define ZMPT_SENSIVITY 500.0f 

bool zmptSensorStatus = false;
float zmptSensorValue = 0.0;

bool is_sensor_error_reported_zmpt = false;
int lastZmptAlertState = 0; // 0 = Normal, 1 = No Power, 2 = High, 3 = Low

ZMPT101B voltageSensor(ZMPT_SENSOR_PIN, AC_FREQ);

/*
* Initialize ZMPT Sensor
*/
void initZmptSensor() {
  Serial.print(F("[ZMPT] Initializing ZMPT sensor..."));
  voltageSensor.setSensitivity(ZMPT_SENSIVITY);
  
  // Test Sensor connection by reading value
  float read = voltageSensor.getRmsVoltage();
  
  if (isnan(read)) {
    Serial.println(F(" FAILED"));
    // Send error
    String payload = createErrorPayload(ErrorTypes::ZMPT_READ_FAILURE, "ZMPT sensor initialization failed");
    publishMqtt(PUB_EVENT, payload.c_str());
    zmptSensorStatus = false;
  } else {
    Serial.println(F(" OK"));
    zmptSensorStatus = true;
  }
}

/*
* Handle ZMPT Sensor (to be called in main loop)
*/
void handleZmptSensor() {
  static unsigned long lastZmptReadTime = 0;
  // Only read if sensor is enabled
  if (!ENABLE_ZMPT_SENSOR) {
    return;
  }

  // Check if it is time to read the sensor
  if (millis() - lastZmptReadTime < ZMPT_SENSOR_READ_INTERVAL) {
    return;
  }
  lastZmptReadTime = millis();

  // Read ZMPT sensor value
  zmptSensorValue = voltageSensor.getRmsVoltage();

  // Check if any reads failed
  if (isnan(zmptSensorValue)) {
    zmptSensorStatus = false;
    if (!is_sensor_error_reported_zmpt) {
      is_sensor_error_reported_zmpt = true;
      Serial.println(F("[ZMPT] Invalid ZMPT sensor reading detected!"));
      String payload = createErrorPayload(ErrorTypes::ZMPT_READ_FAILURE, "Invalid ZMPT sensor reading");
      publishMqtt(PUB_EVENT, payload.c_str());
    }
    return;
  }

  zmptSensorStatus = true;
  is_sensor_error_reported_zmpt = false;

  // Filter noise
  if (zmptSensorValue < 70.0) {
    zmptSensorValue = 0.0;
  }

  // Trigger detection
  int currentZmptState = 0;
  if (zmptSensorValue < 50.0) {
    currentZmptState = 1; // No Power
  } else if (zmptSensorValue >= HIGH_ZMPT_DETECTION_VALUE) {
    currentZmptState = 2; // High Voltage
  } else if (zmptSensorValue <= LOW_ZMPT_DETECTION_VALUE) {
    currentZmptState = 3; // Low Voltage
  } else {
    currentZmptState = 0; // Normal
  }
  
  if (currentZmptState != lastZmptAlertState) {
    if (currentZmptState == 1) { // No Power
      longBeep();
      Serial.println("[ZMPT] No power detected! Sensor Value: " + String(zmptSensorValue));
      String payload = createAlertPayload(AlertTypes::LOW_VOLTAGE, "No power detected by ZMPT sensor");
      publishMqtt(PUB_EVENT, payload.c_str());
    } else if (currentZmptState == 2) { // High Voltage
      longBeep();
      Serial.println("[ZMPT] High voltage detected! Sensor Value: " + String(zmptSensorValue));
      String payload = createAlertPayload(AlertTypes::HIGH_VOLTAGE, "High voltage detected by ZMPT sensor");
      publishMqtt(PUB_EVENT, payload.c_str());
    } else if (currentZmptState == 3) { // Low Voltage
      longBeep();
      Serial.println("[ZMPT] Low voltage detected! Sensor Value: " + String(zmptSensorValue));
      String payload = createAlertPayload(AlertTypes::LOW_VOLTAGE, "Low voltage detected by ZMPT sensor");
      publishMqtt(PUB_EVENT, payload.c_str());
    } else { // Back to normal
      shortBeep();
      Serial.println("[ZMPT] Voltage normal. Sensor Value: " + String(zmptSensorValue));
      String payload = createAlertPayload(AlertTypes::HIGH_VOLTAGE, "Voltage returned to normal"); 
      publishMqtt(PUB_EVENT, payload.c_str());
    }
    lastZmptAlertState = currentZmptState;
  }

  // Debug output
  Serial.println("[ZMPT] Sensor Value: " + String(zmptSensorValue));
}
