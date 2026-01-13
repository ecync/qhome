#include "config.h"
#include "payloads.h"
#include "components.h"
#include "mqtt.h"
#include "light_sensor.h"
#include "lcd.h"

// Global Light sensor state
bool lightSensorStatus = false;
int lightSensorValue = 0;
bool is_sensor_error_reported_light = false;
bool lightAlertSent = false;
bool IS_MANUAL = false;

// Button state variables
int lastLightButtonState = HIGH;
int lightButtonState = HIGH;
unsigned long lastLightDebounceTime = 0;
unsigned long lightDebounceDelay = 50;
bool manualRelayState = false;

/*
* Set Light Relays
*/
void setLightRelays(bool state) {
    digitalWrite(LIGHT_SENSOR_RELAY01_PIN, state ? HIGH : LOW);
    digitalWrite(LIGHT_SENSOR_RELAY02_PIN, state ? HIGH : LOW);
}

/*
* Set Light Command (Remote)
*/
void setLightCommand(bool state) {
    IS_MANUAL = true; // Enable manual mode
    manualRelayState = state;
    setLightRelays(manualRelayState);
    Serial.println(manualRelayState ? F("[CMD] Light ON") : F("[CMD] Light OFF"));
    
    // Show Mode and State on LCD
    displayMessage("Mode: Remote", manualRelayState ? "Light: ON" : "Light: OFF", 2000);
    
    // Publish status
    String payload = createAlertPayload(manualRelayState ? AlertTypes::LIGHT_ON : AlertTypes::LIGHT_OFF, "Remote light toggle");
    publishMqtt(PUB_EVENT, payload.c_str());
}

/*
* Handle Manual Light Button
*/
void handleManualButton() {
    int reading = digitalRead(MANUAL_LIGHT_BUTTON_PIN);

    // Check light sensor is enabled
    if (!ENABLE_LIGHT_SENSOR) {
        IS_MANUAL = true;
        return;
    }

    if (reading != lastLightButtonState) {
        lastLightDebounceTime = millis();
    }

    if ((millis() - lastLightDebounceTime) > lightDebounceDelay) {
        if (reading != lightButtonState) {
            lightButtonState = reading;

            if (lightButtonState == LOW) {
                // Button Pressed
                IS_MANUAL = true; // Enable manual mode
                manualRelayState = !manualRelayState;
                setLightRelays(manualRelayState);
                Serial.println(manualRelayState ? F("[MANUAL] Light ON") : F("[MANUAL] Light OFF"));
                
                // Show Mode and State on LCD
                displayMessage("Mode: Manual", manualRelayState ? "Light: ON" : "Light: OFF", 2000);
                
                // Publish status
                String payload = createAlertPayload(manualRelayState ? AlertTypes::LIGHT_ON : AlertTypes::LIGHT_OFF, "Manual light toggle");
                publishMqtt(PUB_EVENT, payload.c_str());
            }
        }
    }
    lastLightButtonState = reading;
}

/*
* Initialize Light Sensor
*/
void initLightSensor() {
  Serial.print(F("[LIGHT] Initializing Light sensor..."));
  analogSetAttenuation(ADC_11db);
  // Test Sensor connection by reading value
  int read = analogRead(LIGHT_SENSOR_PIN);
  
  if (read > 4095) {
    Serial.println(F(" FAILED"));
    // Send error
    String payload = createErrorPayload(ErrorTypes::LIGHT_READ_FAILURE, "Light sensor initialization failed");
    publishMqtt(PUB_EVENT, payload.c_str());
    lightSensorStatus = false;
  } else {
    Serial.println(F(" OK"));
    lightSensorStatus = true;
  }
}

/*
* Handle Light Sensor (to be called in main loop)
*/
void handleLightSensor() {
  static unsigned long lastLightReadTime = 0;
  
  // Only read if sensor is enabled
  if (!ENABLE_LIGHT_SENSOR) {
    IS_MANUAL = true; // enable manual mode
    return;
  }

  // Check if it is time to read the sensor
  if (millis() - lastLightReadTime < LIGHT_SENSOR_READ_INTERVAL) {
    return;
  }
  lastLightReadTime = millis();

  // Read light sensor value
  lightSensorValue = analogRead(LIGHT_SENSOR_PIN);

  if (lightSensorValue > 4095) {
    lightSensorStatus = false;
    if (!is_sensor_error_reported_light) {
      is_sensor_error_reported_light = true;
      Serial.println(F("[LIGHT] Invalid Light sensor reading detected!"));
      String payload = createErrorPayload(ErrorTypes::LIGHT_READ_FAILURE, "Invalid Light sensor reading");
      publishMqtt(PUB_EVENT, payload.c_str());
    }
  } else {
    lightSensorStatus = true;
    is_sensor_error_reported_light = false;
    // Tigger ditection
    if (lightSensorValue <= LIGHT_SENSOR_TRIGGER_VALUE) {
      setLightRelays(true); // Turn ON relays
      manualRelayState = true; // Sync state
      if (!lightAlertSent) {
        lightAlertSent = true;
        doubleBeep();
        Serial.println("[LIGHT] Low light level detected! Sensor Value: " + String(lightSensorValue));
        String payload = createAlertPayload(AlertTypes::LIGHT_ON, "Low light level detected");
        publishMqtt(PUB_EVENT, payload.c_str());
      }
    } else {
      setLightRelays(false); // Turn OFF relays
      manualRelayState = false; // Sync state
      if (lightAlertSent) {
        lightAlertSent = false;
        doubleBeep();
        Serial.println("[LIGHT] Light level normal. Sensor Value: " + String(lightSensorValue));
        String payload = createAlertPayload(AlertTypes::LIGHT_OFF, "Light level returned to normal");
        publishMqtt(PUB_EVENT, payload.c_str());
      }
    }
  }
  // Debug output
  Serial.println("[LIGHT] Sensor Value: " + String(lightSensorValue));
}
