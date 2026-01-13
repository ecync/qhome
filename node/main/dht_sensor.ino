#include <Adafruit_Sensor.h>
#include <DHT.h>
#include "config.h"
#include "dht_sensor.h"
#include "mqtt.h"
#include "payloads.h"

DHT dht(DHT_SENSOR_PIN, DHT_SENSOR_TYPE);

unsigned long lastDhtReadTime = 0;
bool is_send_alert = false;

/*
* Initialize DHT Sensor
*/
void initDhtSensor() {
  Serial.print(F("[DHT] Initializing DHT sensor..."));
  dht.begin();

  //  Validation read
  delay(500);

  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  if (isnan(temperature) || isnan(humidity)) {
    dhtSensorState = false;
    Serial.println(F(" FAILED!"));
  } else {
    dhtSensorState = true;
    Serial.println(F(" DONE!"));
  }
}

/*
* Handle DHT Sensor (to be called in main loop)
*/
void handleDhtSensor() {
  // Check if DHT sensor is enabled
  if (!ENABLE_DHT_SENSOR) {
    return;
  }

  // Check read interval
  if (millis() - lastDhtReadTime < DHT_SENSOR_READ_INTERVAL) {
    return;
  }
  lastDhtReadTime = millis();

  // Read temperature and humidity
  lastDhtTemperature = dht.readTemperature();
  lastDhtHumidity = dht.readHumidity();

  // Validate readings
  if (isnan(lastDhtTemperature) || isnan(lastDhtHumidity)) {
    dhtSensorState = false;
    // publish error
    if (!is_send_alert) {
      is_send_alert = true;
      String errorPayload = createErrorPayload(ErrorTypes::DHT_READ_FAILURE, "Failed to read from DHT sensor.");
      publishMqtt(PUB_EVENT, errorPayload.c_str());
      Serial.println("[DHT] Failed to read from DHT sensor!");
    }
    return;
  } else {
    is_send_alert = false;
    dhtSensorState = true;
  }

  // Check for low temperature alert
  if (lastDhtTemperature <= LOW_TEMP_DETECTION_VALUE) {
    lowtempAlertState = true;
    Serial.println("[DHT] Low temperature detected!");
    // publish alert
    String alertPayload = createAlertPayload(AlertTypes::LOW_TEMPERATURE, "Low temperature threshold exceeded.");
    publishMqtt(PUB_EVENT, alertPayload.c_str());
  } else {
    lowtempAlertState = false;
  }

  // if temperature exceeds high threshold
  if (lastDhtTemperature >= HIGH_TEMP_DETECTION_VALUE) {
    hightempAlertState = true;
    // publish alert
    String alertPayload = createAlertPayload(AlertTypes::HIGH_TEMPERATURE, "High temperature threshold exceeded.");
    publishMqtt(PUB_EVENT, alertPayload.c_str());
    Serial.println("[DHT] High temperature detected!");
  } else {
    hightempAlertState = false;
  }

  // Log readings
  Serial.println("[DHT] Temperature: " + String(lastDhtTemperature) + " °C, Humidity: " + String(lastDhtHumidity) + " %");
}