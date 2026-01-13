// lcd.h
#ifndef LCD_H
#define LCD_H

#define LCD_SDA_PIN 21
#define LCD_SCL_PIN 22

#define SCREEN_INTERVAL 3000 // 3 seconds per screen

// Function declarations
void initLcd();
void centerText(String text, int line);
void clearLCD();
void displayProgressBar(int percentage, int line);
void handleLcd();
void displayMessage(String line1, String line2, int duration);

#endif