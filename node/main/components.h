// components.h
#ifndef COMPONENTS_H
#define COMPONENTS_H

/*
* COMPONENTS PINS
*/
#define SYSTEM_BTN_PIN 19

#define WIFI_RESET_BTN_PIN 18

#define ERROR_INDICATOR_LED_PIN 32

#define BUZZER_PIN 25

#define LIGHT_SENSOR_RELAY01_PIN 26
#define LIGHT_SENSOR_RELAY02_PIN 27
#define MANUAL_LIGHT_BUTTON_PIN 23

#define WIFI_INDICATOR_LED_PIN 15

#define MQ_SENSOR_INDICATER_LED_PIN 33

// Variables for blinking indicator
extern bool errorIndicatorState;

const unsigned long resetButtonHoldTime = 5000;  // Hold for 5 seconds to reset
const unsigned long resetButtonDebounce = 50; // 50 milliseconds debounce

// Function declarations
void initComponents();
void turnOnIndicators();
void turnOffIndicators();
void turnOnMqIndicator();
void turnOffMqIndicator();
void handleErrorIndication();
void handleSystemButton();
void handleWifiLed();
void longBeep();
void doubleBeep();
void shortBeep();

#endif