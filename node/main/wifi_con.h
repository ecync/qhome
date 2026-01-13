#ifndef WIFI_CON_H
#define WIFI_CON_H

#include <WiFiManager.h>
#include <WiFi.h>

#define WIFI_RECONNECT_INTERVAL 30000  // 30 seconds

// Global connection state
bool wifiConnected;

// finction declarations
void initWifi();
void maintainWifi();
void onParameterSave();
void resetWifi();

#endif