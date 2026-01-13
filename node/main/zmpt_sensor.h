#ifndef ZMPT_SENSOR_H
#define ZMPT_SENSOR_H

#include "config.h"

#define ZMPT_SENSOR_PIN 36

// Global ZMPT sensor state
extern bool zmptSensorStatus; 
extern float zmptSensorValue; 

// Function declarations
void initZmptSensor();
void handleZmptSensor();

#endif
