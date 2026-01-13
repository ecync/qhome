# QHome Automation System

## 🏠 Project Overview
**QHome** is a comprehensive, full-stack IoT Smart Home solution designed to provide real-time monitoring, automation, and remote control of environmental and power sensors. The system is built on a modular architecture, spanning from custom PCB hardware design to a modern web-based dashboard.

This project integrates embedded systems connectivity (ESP32/ESP8266), robust backend services (NestJS/MQTT), and an interactive frontend (React) to create a seamless smart home experience.

## 🏗️ System Architecture

The system operates on a publish-subscribe model using MQTT for low-latency communication between the hardware nodes and the server.

```mermaid
graph LR
    subgraph Hardware Layer
        Node[ESP32 QHome Node]
        Sensors[Sensors: DHT, MQ, ACS, ZMPT]
        Relays[Relays & Actuators]
        Node --- Sensors
        Node --- Relays
    end

    subgraph Communication
        MQTT[MQTT Broker]
        WiFi[WiFi Network]
        Node -.->|MQTT/WS| WiFi
        WiFi -.-> MQTT
    end

    subgraph Cloud/Server Layer
        Backend[NestJS Backend]
        DB[(MongoDB)]
        Backend <-->|Pub/Sub| MQTT
        Backend <-->|Data Persistence| DB
    end

    subgraph User Interface
        Frontend[React Dashboard]
        User((User))
        User --> Frontend
        Frontend <-->|HTTP/REST| Backend
        Frontend <-->|Socket.io| Backend
    end
```

## 📂 Project Modules

The repository is organized into four main operational layers. Click on the module links for detailed documentation, installation steps, and API references.

| Module | Directory | Description | Technology |
| :--- | :--- | :--- | :--- |
| **Hardware Design** | [**`/pcb`**](pcb/README.md) | Custom PCB layouts, schematics, and BOM. | Eagle CAD / Fusion 360 |
| **Firmware** | [**`/node`**](node/README.md) | C++ firmware for ESP controllers implementing sensor logic. | Arduino / C++ |
| **Backend API** | [**`/backend`**](backend/README.md) | Server logic, database management, and MQTT processing. | NestJS, MongoDB, TypeScript |
| **Frontend UI** | [**`/frontend`**](frontend/README.md) | Web dashboard for monitoring and control. | React, Vite, Tailwind CSS |

## ✨ Key Features

*   **Real-time Monitoring**: Live streaming of Temperature, Humidity, Air Quality (Gas), and Ambient Light levels.
*   **Energy Management**: Precise AC Voltage, Current, Power (W), and Energy (kWh) metering using ZMPT101B and ACS712 sensors.
*   **Safety & Alerts**: Instant automated alerts for gas leaks, fire detection, or abnormal power usage via Buzzer and MQTT push notifications.
*   **Remote Control**: Toggle lights and appliances remotely via the web dashboard.
*   **Data Analytics**: Historical charts and graphs to track power consumption and environmental trends over time.
*   **Secure Access**: Token-based authentication (Custom Headers) ensuring only authorized users can control the system.

## 🚀 Getting Started

To spin up the entire system locally, follow the **Installation & Setup** guides in each module's README. A high-level startup order is recommended:

1.  **Infrastructure**: Ensure you have a MongoDB instance and an MQTT Broker (e.g., Mosquitto) running.
2.  **Backend**: Start the [Backend Service](backend/README.md) to initialize the API and Database connections.
3.  **Frontend**: Launch the [Web Dashboard](frontend/README.md) to interact with the system.
4.  **Hardware**: Flash the [Firmware](node/README.md) to your ESP32/ESP8266 device and configure it to connect to your Wi-Fi and MQTT Broker.

## 🛠️ Technology Stack

*   **Hardware**: ESP32, ESP8266, DHT11/22, MQ-135, ACS712, ZMPT101B, Relay Modules.
*   **Protocol**: MQTT (Message Queuing Telemetry Transport) over WebSockets.
*   **Server**: Node.js, NestJS, Mongoose.
*   **Database**: MongoDB (NoSQL).
*   **Client**: React.js, TypeScript, Tailwind CSS, Recharts.

---
*Developed by Eshan Chathuranga*
