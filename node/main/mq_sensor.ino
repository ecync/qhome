#include "config.h"
#include "payloads.h"
#include "components.h"
#include "mqtt.h"
#include "mq_sensor.h"

/*
* Initialize MQ Sensor
*/
void initMqSensor() {
  Serial.print(F("[MQ] Initializing MQ sensor..."));
  pinMode(MQ_SENSOR_PIN_A0, INPUT);
  pinMode(MQ_SENSOR_INDICATER_LED_PIN, OUTPUT);
  
  // read to check status
  int val = analogRead(MQ_SENSOR_PIN_A0);
  mqSensorStatus = (val >= MQ_SENSOR_MIN_VALID_READING && val <= MQ_SENSOR_MAX_VALID_READING);
  
  if (!mqSensorStatus) {
    Serial.println(F(" FAILED"));
  } else {
    Serial.println(F(" OK"));
  }
}

void handleMqLed() {
    if (mqAlertSent) {
        static unsigned long lastMqLedToggle = 0;
        if (millis() - lastMqLedToggle >= 250) { // Blink every 250ms
            lastMqLedToggle = millis();
            int state = digitalRead(MQ_SENSOR_INDICATER_LED_PIN);
            digitalWrite(MQ_SENSOR_INDICATER_LED_PIN, !state);
        }
    } else {
        digitalWrite(MQ_SENSOR_INDICATER_LED_PIN, LOW);
    }
}

void handleMqSensor() {
  // Only read if sensor is enabled
  if (!ENABLE_MQ_SENSOR) {
    return;
  }

  // Check if it is time to read the sensor
  static unsigned long lastMqReadTime = 0;
  if (millis() - lastMqReadTime < MQ_SENSOR_READ_INTERVAL) {
    return;
  }
  lastMqReadTime = millis();

  // Read MQ sensor value
  mqSensorValue = analogRead(MQ_SENSOR_PIN_A0);

  if (mqSensorValue < MQ_SENSOR_MIN_VALID_READING || mqSensorValue > MQ_SENSOR_MAX_VALID_READING) {
    mqSensorStatus = false;
    if (!is_sensor_error_reported_mq) {
      is_sensor_error_reported_mq = true;
      Serial.println(F("[MQ] Invalid MQ sensor reading detected!"));
      String payload = createErrorPayload(ErrorTypes::MQ_READ_FAILURE, "Invalid MQ sensor reading");
      publishMqtt(PUB_EVENT, payload.c_str());
    }
  } else {
    mqSensorStatus = true;
    is_sensor_error_reported_mq = false;
    // Tigger ditection
    if (mqSensorValue >= MQ_SENSOR_DITECTION_VALUE) {
      if (!mqAlertSent) {
        mqAlertSent = true;
        longBeep();
        Serial.println("[MQ] High gas concentration detected! Sensor Value: " + String(mqSensorValue));
        String payload = createAlertPayload(AlertTypes::GAS_DETECTED, "High gas concentration detected");
        publishMqtt(PUB_EVENT, payload.c_str());
      }
    } else {
      if (mqAlertSent) {
        mqAlertSent = false;
      }
    }
  }
  // Debug output
  Serial.println("[MQ] Sensor Value: " + String(mqSensorValue));
}
