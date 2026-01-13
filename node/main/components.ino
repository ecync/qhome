#include "components.h"
#include "wifi_con.h"
#include "config.h"
#include "lcd.h"
#include "dht_sensor.h"
#include "mq_sensor.h"
#include "light_sensor.h"
#include "pir_sensor.h"
#include "zmpt_sensor.h"
#include "acs_sensor.h"

// Global error state
bool errorIndicatorState = false;

/*
* Initialize all components
*/
void initComponents() {
    Serial.print("[SYSTEM] Initializing components...");
    // Initialize pins
    pinMode(SYSTEM_BTN_PIN, INPUT_PULLUP);
    pinMode(ERROR_INDICATOR_LED_PIN, OUTPUT);
    pinMode(BUZZER_PIN, OUTPUT);
    pinMode(LIGHT_SENSOR_RELAY01_PIN, OUTPUT);
    pinMode(LIGHT_SENSOR_RELAY02_PIN, OUTPUT);
    pinMode(MANUAL_LIGHT_BUTTON_PIN, INPUT_PULLUP);
    pinMode(WIFI_INDICATOR_LED_PIN, OUTPUT);
    pinMode(MQ_SENSOR_INDICATER_LED_PIN, OUTPUT);

    // Set initial states
    digitalWrite(ERROR_INDICATOR_LED_PIN, LOW);
    digitalWrite(BUZZER_PIN, LOW);
    digitalWrite(LIGHT_SENSOR_RELAY01_PIN, LOW);
    digitalWrite(LIGHT_SENSOR_RELAY02_PIN, LOW);
    digitalWrite(WIFI_INDICATOR_LED_PIN, LOW);
    digitalWrite(MQ_SENSOR_INDICATER_LED_PIN, LOW);

    Serial.println(" DONE!");
}

/*
* Turn on all indicators (LEDs)
*/
void turnOnIndicators() {
    digitalWrite(ERROR_INDICATOR_LED_PIN, HIGH);
    digitalWrite(WIFI_INDICATOR_LED_PIN, HIGH);
    digitalWrite(MQ_SENSOR_INDICATER_LED_PIN, HIGH);
}

/*
* Turn off all indicators (LEDs)
*/
void turnOffIndicators() {
    digitalWrite(ERROR_INDICATOR_LED_PIN, LOW);
    digitalWrite(WIFI_INDICATOR_LED_PIN, LOW);
    digitalWrite(MQ_SENSOR_INDICATER_LED_PIN, LOW);
}

/*
* Turn on MQ indicator LED
*/
void turnOnMqIndicator() {
    digitalWrite(MQ_SENSOR_INDICATER_LED_PIN, HIGH);
}

/*
* Turn off MQ indicator LED
*/
void turnOffMqIndicator() {
    digitalWrite(MQ_SENSOR_INDICATER_LED_PIN, LOW);
}

/*
* Handle error indication
*/
void handleErrorIndication() {
    // Check sensor statuses
    bool hasError = false;
    
    if (ENABLE_DHT_SENSOR && !dhtSensorState) hasError = true;
    if (ENABLE_MQ_SENSOR && !mqSensorStatus) hasError = true;
    if (ENABLE_LIGHT_SENSOR && !lightSensorStatus) hasError = true;
    if (ENABLE_ZMPT_SENSOR && !zmptSensorStatus) hasError = true;
    if (ENABLE_ACS_SENSOR && !acsSensorStatus) hasError = true;

    errorIndicatorState = hasError;

    static unsigned long previousBlinkMillis = 0;
    if (errorIndicatorState) {
        if (millis() - previousBlinkMillis >= 500) {
            previousBlinkMillis = millis();
            // Toggle the LED state
            int ledState = digitalRead(ERROR_INDICATOR_LED_PIN);
            digitalWrite(ERROR_INDICATOR_LED_PIN, !ledState);
        }
    } else {
        digitalWrite(ERROR_INDICATOR_LED_PIN, LOW);
    }
}

/*
* Handle system button
* Short press - Restart
* Long press (5s) - Reset WiFi and Restart
*/
void handleSystemButton() {
    // Read the button state
    static bool lastButtonState = (digitalRead(SYSTEM_BTN_PIN) == LOW);
    static unsigned long buttonPressTime = 0;
    bool currentButtonState = (digitalRead(SYSTEM_BTN_PIN) == LOW);
    const unsigned long resetButtonHoldTime = 5000;

    // Button pressed
    if (currentButtonState && !lastButtonState) {
        buttonPressTime = millis();
    }

    // Check for hold while pressed
    if (currentButtonState && (millis() - buttonPressTime >= resetButtonHoldTime)) {
        Serial.println(F("[SYSTEM] System button held for reset duration. Resetting..."));
        clearLCD();
        centerText("Resetting...", 0);
        resetWifi();
        resetConfig();
        clearLCD();
        delay(3000);
        ESP.restart();
    }

    // Button released
    if (!currentButtonState && lastButtonState) {
        // If we are here, it means the button was released before the hold time
        Serial.println(F("[SYSTEM] System button pressed. Restarting..."));
        clearLCD();
        centerText("Restarting...", 0);
        delay(3000);
        clearLCD();
        ESP.restart();
    }
    lastButtonState = currentButtonState;
}

/*
* Handle WiFi LED indication
* Connected: ON
* Portal Mode (AP): Blink
* Not Connected: OFF
*/
void handleWifiLed() {
    if (WiFi.status() == WL_CONNECTED) {
        digitalWrite(WIFI_INDICATOR_LED_PIN, HIGH);
    } else if (WiFi.getMode() == WIFI_AP || WiFi.getMode() == WIFI_AP_STA) {
         // Blink if AP is active (Portal Mode)
         static unsigned long previousMillis = 0;
         if (millis() - previousMillis >= 500) {
             previousMillis = millis();
             int state = digitalRead(WIFI_INDICATOR_LED_PIN);
             digitalWrite(WIFI_INDICATOR_LED_PIN, !state);
         }
    } else {
        digitalWrite(WIFI_INDICATOR_LED_PIN, LOW);
    }
}

/*
* Long beep for alerts
*/
void longBeep() {
    digitalWrite(BUZZER_PIN, HIGH);
    delay(1000);
    digitalWrite(BUZZER_PIN, LOW);
}

/*
* Double beep for alerts
*/
void doubleBeep() {
    digitalWrite(BUZZER_PIN, HIGH);
    delay(200);
    digitalWrite(BUZZER_PIN, LOW);
    delay(100);
    digitalWrite(BUZZER_PIN, HIGH);
    delay(200);
    digitalWrite(BUZZER_PIN, LOW);
}

/*
* Short beep for alerts
*/
void shortBeep() {
    digitalWrite(BUZZER_PIN, HIGH);
    delay(200);
    digitalWrite(BUZZER_PIN, LOW);
}
