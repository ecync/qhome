#ifndef ACS_SENSOR_H
#define ACS_SENSOR_H

#include "config.h"

#define ACS_SENSOR_PIN 39

// ACS712 sensor state
extern bool acsSensorStatus;
extern float acsSensorValue;
extern float acsPowerValue;
extern float acsEnergyValue; // Energy in kWh

// Function declarations
void initAcsSensor();
void handleAcsSensor();

#endif
