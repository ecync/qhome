#ifndef PIR_SENSOR_H
#define PIR_SENSOR_H

#include "config.h"

#define PIR_SENSOR_PIN 13

// Global PIR sensor state
extern bool pirSensorStatus;
extern bool motionDetected;

// Function declarations
void initPirSensor();
void handlePirSensor();

#endif
