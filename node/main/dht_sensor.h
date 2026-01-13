// dht_sensor.h
#ifndef DHT_SENSOR_H
#define DHT_SENSOR_H

// DHT Sensor Pin
#define DHT_SENSOR_PIN 4
// DHT Sensor Type
#define DHT_SENSOR_TYPE DHT11

bool dhtSensorState = false;
bool lowtempAlertState = false;
bool hightempAlertState = false;

float lastDhtTemperature = 0.0;
float lastDhtHumidity = 0.0;

// Function declarations
void initDhtSensor();
void handleDhtSensor();

#endif