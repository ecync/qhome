#ifndef MQ_SENSOR_H
#define MQ_SENSOR_H

#include "config.h"

#define MQ_SENSOR_PIN_A0 34 // Analog pin for MQ sensor


// Define valid reading range for MQ sensor
#define MQ_SENSOR_MIN_VALID_READING 200
#define MQ_SENSOR_MAX_VALID_READING 4095

// Global MQ sensor state
bool mqSensorStatus = false;
int mqSensorValue = 0;
bool mqAlertSent = false;
bool is_sensor_error_reported_mq = false;

// Function declarations
void initMqSensor();
void handleMqSensor();
void handleMqLed();

#endif