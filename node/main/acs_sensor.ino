#include <ACS712.h>
#include "config.h"
#include "payloads.h"
#include "components.h"
#include "mqtt.h"
#include "acs_sensor.h"
#include "zmpt_sensor.h" // Need ZMPT value for power calculation

// ACS712 Configuration
#define ACS_SENSOR_VOLTAGE_REF 5.0
#define ACS_SENSOR_ADC_BITS 4095
#define AC_FREQ 50.0

bool acsSensorStatus = false;
float acsSensorValue = 0.0;
float acsPowerValue = 0.0;
float acsEnergyValue = 0.0;
unsigned long lastEnergyCalcTime = 0;

bool is_sensor_error_reported_acs = false;
bool acsAlertSent = false;

ACS712 ACS(ACS_SENSOR_PIN, ACS_SENSOR_VOLTAGE_REF, ACS_SENSOR_ADC_BITS);

/*
* Initialize ACS Sensor
*/
void initAcsSensor() {
  Serial.print(F("[ACS] Initializing ACS sensor..."));
  analogSetAttenuation(ADC_11db); // Set attenuation for better range
  ACS.autoMidPoint();
  ACS.setNoisemV(40); // Set noise level (adjust as needed)
  ACS.detectFrequency(AC_FREQ); 
  delay(1000);  // wait for sensor to stabilize
  Serial.println(F(" OK"));
  acsSensorStatus = true;
}

/*
* Calculate Power
*/
float getPower(float voltage, float current) {
  return voltage * current * 0.9;  // Power in Watts
}

/*
* Get power useage
*/
float getAcsPowerUsage() {
  return acsPowerValue ;
}

/*
* Handle ACS Sensor
*/
void handleAcsSensor() {
  static unsigned long lastAcsReadTime = 0;
  // Only read if sensor is enabled
  if (!ENABLE_ACS_SENSOR) {
    return;
  }

  // Check if it is time to read the sensor
  if (millis() - lastAcsReadTime < ACS_SENSOR_READ_INTERVAL) {
    return;
  }
  lastAcsReadTime = millis();

  // Read ACS sensor value
  acsSensorValue = ACS.mA_AC(AC_FREQ) / 1000.0;  

  // Filter low noise values
  if (acsSensorValue < 0.05 || zmptSensorValue < 50.0) {
    acsSensorValue = 0.0;
  }
  
  // Measure power
  acsPowerValue = getPower(zmptSensorValue, acsSensorValue);

  // Calculate Energy Usage to kWh
  unsigned long currentMillis = millis();
  if (lastEnergyCalcTime > 0) {
      float timeInHours = (currentMillis - lastEnergyCalcTime) / 3600000.0;
      acsEnergyValue += (acsPowerValue * timeInHours) / 1000.0;
  }
  lastEnergyCalcTime = currentMillis;

  // Check if any reads failed
  if (isnan(acsSensorValue)) {
    acsSensorStatus = false;
    if (!is_sensor_error_reported_acs) {
      is_sensor_error_reported_acs = true;
      Serial.println(F("[ACS] Invalid ACS sensor reading detected!"));
      String payload = createErrorPayload(ErrorTypes::ACS_READ_FAILURE, "Invalid ACS sensor reading");
      publishMqtt(PUB_EVENT, payload.c_str());
    }
    return;
  }

  acsSensorStatus = true;
  is_sensor_error_reported_acs = false;

  // Trigger detection
  if (acsSensorValue >= HIGH_ACS_DETECTION_VALUE) {
    if (!acsAlertSent) {
      acsAlertSent = true;
      longBeep();
      Serial.println("[ACS] High current detected! Sensor Value: " + String(acsSensorValue));
      String payload = createAlertPayload(AlertTypes::HIGH_CURRENT, "High current detected by ACS sensor");
      publishMqtt(PUB_EVENT, payload.c_str());
    }
  } else {
    acsAlertSent = false;
  }

  // Debug output
  Serial.println("[ACS] Sensor Value:  Current: " + String(acsSensorValue) + " A" + " Power: " + String(acsPowerValue) + " W");
}
