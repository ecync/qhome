#include <LiquidCrystal_I2C.h>
#include <Wire.h>
#include "config.h" 
#include "components.h"
#include "wifi_con.h"
#include "mqtt.h"
#include "dht_sensor.h"
#include "mq_sensor.h"
#include "light_sensor.h"
#include "pir_sensor.h"
#include "zmpt_sensor.h"
#include "acs_sensor.h"

LiquidCrystal_I2C lcd(0x27, 16, 2); // Set the LCD I2C address

// LCD State Machine
enum LcdScreen {
  SCREEN_HOME,
  SCREEN_ENV,
  SCREEN_POWER,
  SCREEN_ENERGY,
  SCREEN_STATUS,
  SCREEN_ERROR,
  SCREEN_COUNT
};

int currentScreen = SCREEN_HOME;
unsigned long lastScreenChange = 0;

// Temporary message variables
bool showingMessage = false;
unsigned long messageStartTime = 0;
unsigned long messageDuration = 0;

/*
* Initialize LCD
*/
void initLcd() {
    Serial.print(F("[LCD] Initializing LCD..."));
    Wire.begin(LCD_SDA_PIN, LCD_SCL_PIN); 
    lcd.init();
    lcd.backlight();
    lcd.clear();
    centerText("Starting...", 0);
    displayProgressBar(0, 1);
    Serial.println(F(" DONE!"));
}

/*
* Center text on a specific line
*/
void centerText(String text, int line) {
  int padding = (16 - text.length()) / 2;
  if (padding < 0) padding = 0;
  lcd.setCursor(padding, line);
  lcd.print(text);
}

/*
* Clear the LCD display
*/
void clearLCD() {
  lcd.clear();
}

/*
* Display a progress bar on the LCD
*/
void displayProgressBar(int percentage, int line) {
  int totalBlocks = 16;
  int filledBlocks = (percentage * totalBlocks) / 100;
  
  lcd.setCursor(0, line);
  for (int i = 0; i < totalBlocks; i++) {
    if (i < filledBlocks) {
      lcd.write(byte(255)); // Full block
    } else {
      lcd.write(' '); // Empty space
    }
  }
}

/*
* Show different screens
*/
// Home Screen
void showHomeScreen() {
    lcd.setCursor(0, 0);
    lcd.print(NODE_NAME.substring(0, 16)); // Limit to 16 chars
    
    lcd.setCursor(0, 1);
    if (wifiConnected) {
        lcd.print("WiFi:OK ");
    } else {
        lcd.print("WiFi:-- ");
    }
    
    if (mqttConnected) {
        lcd.print("MQTT:OK");
    } else {
        lcd.print("MQTT:--");
    }
}
// Environment Screen
void showEnvScreen() {
    lcd.setCursor(0, 0);
    lcd.print("Temp: ");
    lcd.print(lastDhtTemperature, 1);
    lcd.print((char)223); // Degree symbol
    lcd.print("C");
    
    lcd.setCursor(0, 1);
    lcd.print("Hum:  ");
    lcd.print(lastDhtHumidity, 1);
    lcd.print("%");
}
// Power Screen
void showPowerScreen() {
    lcd.setCursor(0, 0);
    lcd.print("V: ");
    lcd.print(zmptSensorValue, 1);
    lcd.print("V");
    
    lcd.setCursor(0, 1);
    lcd.print("P: ");
    lcd.print(acsPowerValue, 1);
    lcd.print("W");
    lcd.print(" I:");
    lcd.print(acsSensorValue, 2);
    lcd.print("A");
}
// Energy Screen
void showEnergyScreen() {
    lcd.setCursor(0, 0);
    lcd.print("Energy Usage:");
    
    lcd.setCursor(0, 1);
    lcd.print(acsEnergyValue, 4);
    lcd.print(" kWh");
}
// Status Screen
void showStatusScreen() {
    lcd.setCursor(0, 0);
    lcd.print("L:");
    lcd.print(lightSensorValue);
    lcd.print(" M:");
    lcd.print(motionDetected ? "YES" : "NO ");
    
    lcd.setCursor(0, 1);
    lcd.print("Gas:");
    lcd.print(mqSensorValue);
}
// Error Screen
void showErrorScreen() {
    lcd.setCursor(0, 0);
    lcd.print("SENSOR ERROR!");
    lcd.setCursor(0, 1);
    // Check which sensor failed
    String errors = "";
    if (ENABLE_DHT_SENSOR && !dhtSensorState) errors += "DHT ";
    if (ENABLE_MQ_SENSOR && !mqSensorStatus) errors += "MQ ";
    if (ENABLE_LIGHT_SENSOR && !lightSensorStatus) errors += "LDR ";
    if (ENABLE_ZMPT_SENSOR && !zmptSensorStatus) errors += "ZMPT ";
    if (ENABLE_ACS_SENSOR && !acsSensorStatus) errors += "ACS ";
    
    if (errors.length() > 16) {
        lcd.print("Multiple Errors");
    } else {
        lcd.print(errors);
    }
}
// Display a temporary message
void displayMessage(String line1, String line2, int duration) {
    lcd.clear();
    centerText(line1, 0);
    centerText(line2, 1);
    showingMessage = true;
    messageStartTime = millis();
    messageDuration = duration;
}

/*
* Handle LCD updates
*/
void handleLcd() {
    // Check if showing a temporary message
    if (showingMessage) {
        if (millis() - messageStartTime < messageDuration) {
            return; // Still showing message
        } else {
            showingMessage = false;
            lcd.clear();
            lastScreenChange = 0; // Force update
        }
    }

    if (millis() - lastScreenChange >= SCREEN_INTERVAL) {
        lastScreenChange = millis();
        currentScreen++;
        
        // Skip ERROR screen if no error
        if (currentScreen == SCREEN_ERROR && !errorIndicatorState) {
            currentScreen++;
        }

        if (currentScreen >= SCREEN_COUNT) {
            currentScreen = SCREEN_HOME;
        }
        
        lcd.clear();
        
        switch (currentScreen) {
            case SCREEN_HOME:
                showHomeScreen();
                break;
            case SCREEN_ENV:
                showEnvScreen();
                break;
            case SCREEN_POWER:
                showPowerScreen();
                break;
            case SCREEN_ENERGY:
                showEnergyScreen();
                break;
            case SCREEN_STATUS:
                showStatusScreen();
                break;
            case SCREEN_ERROR:
                showErrorScreen();
                break;
        }
    }
}
