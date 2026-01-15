# Backend API Reference

Base URL: `http://localhost:3000/api`

## Authentication
All HTTP endpoints require the following headers:
- `X-USERNAME`: The username configured in environment variables.
- `X-PASSWORD`: The password configured in environment variables.

---

## 📡 MQTT Message Flow Diagram

This diagram illustrates the complete message flow between IoT nodes, MQTT broker, and the backend service.

```mermaid
sequenceDiagram
    participant Node as IoT Node<br/>(ESP32)
    participant Broker as MQTT Broker<br/>(WebSocket)
    participant Backend as NestJS Backend<br/>(Gateway)
    participant DB as MongoDB
    participant Socket as Socket.IO<br/>(Clients)
    participant API as REST API<br/>(Controllers)
    
    Note over Node,Socket: System Initialization
    Node->>Broker: CONNECT (Client ID: node_001)
    Broker-->>Node: CONNACK
    Node->>Broker: SUBSCRIBE (node/cmd)
    Backend->>Broker: CONNECT (Client ID: backend_service)
    Broker-->>Backend: CONNACK
    Backend->>Broker: SUBSCRIBE (node/send)
    
    Note over Node,Socket: Sensor Data Publishing
    loop Every Sync Interval (e.g., 60s)
        Node->>Node: Read all sensors<br/>(DHT, MQ, ACS, ZMPT, PIR, LDR)
        Node->>Node: Create JSON payload<br/>{type: "_sensor_data", payload: {...}}
        Node->>Broker: PUBLISH (node/send)<br/>Topic: node/send<br/>Payload: Sensor Data JSON
        Broker->>Backend: FORWARD (node/send message)
        Backend->>Backend: Validate & Parse JSON
        Backend->>Backend: Extract data fields<br/>(temp, humidity, power, etc.)
        
        par Parallel Processing
            Backend->>DB: INSERT (NodeSensorData collection)<br/>Save sensor readings
            DB-->>Backend: Acknowledgment
        and
            Backend->>Socket: EMIT (sensorUpdate)<br/>Broadcast to all clients
            Socket-->>Frontend: Real-time update
        end
    end
    
    Note over Node,Socket: Alert & Error Handling
    Node->>Node: Detect threshold breach<br/>(e.g., Gas > 400 PPM)
    Node->>Broker: PUBLISH (node/send)<br/>{type: '_alert', payload: {alert_type: 'gas_detected'}}
    Broker->>Backend: FORWARD (alert message)
    Backend->>Backend: Parse alert type
    Backend->>DB: INSERT (NodeAlert collection)
    Backend->>Socket: EMIT (criticalAlert)<br/>Immediate notification
    Socket-->>Frontend: Show alert popup
    
    Node->>Node: Sensor read failure<br/>(e.g., DHT timeout)
    Node->>Broker: PUBLISH (node/send)<br/>{type: '_error', payload: {error_type: 'dht_failure'}}
    Broker->>Backend: FORWARD (error message)
    Backend->>DB: INSERT (NodeError collection)
    Backend->>Socket: EMIT (systemError)
    
    Note over Node,Socket: Command & Control Flow
    Frontend->>API: HTTP POST /mqtt/command/toggle_light<br/>Headers: X-USERNAME, X-PASSWORD
    API->>API: Authenticate request
    API->>API: Create command payload<br/>{type: '_command', payload: {cmd: 'toggle_light'}}
    API->>Broker: PUBLISH (node/cmd)<br/>Topic: node/cmd<br/>Payload: Command JSON
    API-->>Frontend: 202 Accepted
    Broker->>Node: FORWARD (node/cmd message)
    Node->>Node: Parse command type
    Node->>Node: Execute action<br/>(Toggle relay GPIO)
    Node->>Broker: PUBLISH (node/send)<br/>{type: '_ack', payload: {status: 'success'}}
    Broker->>Backend: FORWARD (acknowledgment)
    Backend->>Socket: EMIT (commandAck)
    Socket-->>Frontend: Update UI state
    
    Note over Node,Socket: Configuration Update Flow
    Frontend->>API: HTTP POST /mqtt/config<br/>Body: {config: {sensors: {...}, system: {...}}}
    API->>API: Validate config schema
    API->>DB: UPDATE (NodeConfig collection)<br/>Save new configuration
    DB-->>API: Update confirmed
    API->>API: Create config payload<br/>{type: '_config_update', payload: {config: {...}}}
    API->>Broker: PUBLISH (node/cmd)<br/>Topic: node/cmd
    API-->>Frontend: 202 Accepted
    Broker->>Node: FORWARD (config message)
    Node->>Node: Parse config fields
    Node->>Node: Update runtime variables<br/>(thresholds, intervals)
    Node->>Node: Save to EEPROM/SPIFFS
    Node->>Broker: PUBLISH (node/send)<br/>{type: '_ack', payload: {config_applied: true}}
    Broker->>Backend: FORWARD (ack)
    Backend->>Socket: EMIT (configUpdated)
    
    Note over Node,Socket: Heartbeat & Keepalive
    loop Every 120s
        Node->>Broker: PINGREQ
        Broker-->>Node: PINGRESP
    end
    
    loop Every 60s
        Backend->>Broker: PINGREQ
        Broker-->>Backend: PINGRESP
    end
```

### Message Type Reference

| Message Type | Direction | Topic | Purpose |
|--------------|-----------|-------|---------|
| `_sensor_data` | Node → Backend | `node/send` | Regular telemetry data transmission |
| `_alert` | Node → Backend | `node/send` | Critical safety events (gas, fire, motion) |
| `_error` | Node → Backend | `node/send` | System faults and sensor failures |
| `_ack` | Node → Backend | `node/send` | Command acknowledgment responses |
| `_command` | Backend → Node | `node/cmd` | Immediate control actions (toggle, restart) |
| `_config_update` | Backend → Node | `node/cmd` | Configuration parameter updates |

---

## HTTP Endpoints

### 1. System Status
Get the current configuration from the database (mirrors the node's config).

- **URL**: `/mqtt/status`
- **Method**: `GET`
- **Response**: `200 OK`
```json
// Returns NodeConfig object
{
    "_id": "...",
    "node_name": "Living Room",
    "wifi_password": "...",
    "sync_interval": 60000,
    "sensors": { ... }
}
```

### 2. Error Logs
Get a list of recent error reports from the node.

- **URL**: `/mqtt/errors`
- **Method**: `GET`
- **Query Params**:
    - `limit`: (Optional) Number of records to return. Default: 10.
- **Response**: `200 OK`
```json
[
    {
        "error_type": "dht_read_failure",
        "message": "Failed to read from DHT sensor",
        "createdAt": "2026-01-13T10:00:00.000Z"
    }
]
```

### 3. Alert Logs
Get a list of critical alerts (Gas, Fire, Motion).

- **URL**: `/mqtt/alerts`
- **Method**: `GET`
- **Query Params**:
    - `limit`: (Optional) Number of records to return. Default: 10.
- **Response**: `200 OK`
```json
[
    {
        "alert_type": "gas_detected",
        "message": "High gas levels detected!",
        "createdAt": "2026-01-13T10:05:00.000Z"
    }
]
```

### 4. Historical Sensor Data
Get aggregated sensor readings for a specific date.

- **URL**: `/mqtt/sensor-data/:date`
- **Method**: `GET`
- **URL Params**:
    - `date`: Valid Javascript Timestamp (ms).
- **Response**: `200 OK`
```json
[
    {
        "tempeture": 28.5,
        "humidity": 60,
        "mq_value": 150,
        "acs_power": 120.5,
        "createdAt": "..."
    }
]
```

### 5. Send Command
Send an immediate control command to the node.

- **URL**: `/mqtt/command/:cmd`
- **Method**: `POST`
- **URL Params**:
    - `cmd`: Valid command type. 
      - `restart`
      - `reset_config`
      - `toggle_light`
      - `toggle_light_off`
- **Response**: `202 Accepted`

### 6. Update Configuration
Update the system configuration and push changes to the node via MQTT.

- **URL**: `/mqtt/config`
- **Method**: `POST`
- **Body**:
```json
{
  "config": {
    "system": {
      "wifi_password": "newpass",
      "sync_interval": 30000
    },
    "sensors": {
      "dht_sensor": {
        "enabled": true,
        "high_temp_value": 40,
        "low_temp_value": 0,
        "read_interval": 2000
      },
      // ... other sensors
    }
  }
}
```
- **Response**: `202 Accepted`

---

## MQTT Interface

The backend acts as an MQTT Client wrapper.

### Subscribed Topics
- **`node/send`**: Listens for payloads from the node.
    - **Wrappers**:
        - `_ack`: Handshake payload.
        - `_sensor_data`: Telemetry.
        - `_alert`: Critical events.
        - `_error`: System faults.

### Published Topics
- **`node/cmd`**: Used to send commands to the node.
    - Payload Structure:
    ```json
    {
        "type": "_config_update" | "_command",
        "payload": { ... }
    }
    ```
