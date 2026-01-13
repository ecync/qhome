#ifndef LIGHT_SENSOR_H
#define LIGHT_SENSOR_H

#define LIGHT_SENSOR_PIN 35

// Global Light sensor state
extern bool lightSensorStatus;
extern int lightSensorValue;
extern bool is_sensor_error_reported_light;
extern bool lightAlertSent;
extern bool IS_MANUAL;

// Function declarations
void initLightSensor();
void handleLightSensor();
void handleManualButton();
void setLightCommand(bool state);
#endif
