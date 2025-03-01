# March Madness

A March Madness application with MQTT-based database management system.

## Setup and Running

1. Start the services:
```bash
cd Backend
docker-compose up -d
```

2. The system will automatically:
   - Start PostgreSQL database
   - Start MQTT broker
   - Initialize database tables
   - Start database management service

## Database Management System Usage

The system uses MQTT topics for database operations:

### Saving Data
```bash
# Topic format:
save/<your>/<data>/<path>

# Example using mosquitto_pub:
mosquitto_pub -h localhost -t "save/users/john" -m '{"name": "John", "age": 30}'
```

### Retrieving Data
```bash
# Request Topic format:
get/<your>/<data>/<path>

# Response will be published to:
data/<your>/<data>/<path>

# Example using mosquitto_pub to request:
mosquitto_pub -h localhost -t "get/users/john" -m ""

# Listen for response using mosquitto_sub:
mosquitto_sub -h localhost -t "data/users/john"
```

### Data Format
- All data must be valid JSON
- The system automatically handles JSON parsing and stringifying
- Timestamps (created_at, updated_at) are automatically managed

## Services

- PostgreSQL: localhost:5432
- pgAdmin: http://localhost:16543
- MQTT Broker: localhost:1883
- Database Management Service: Runs automatically

## Database Credentials

### PostgreSQL
- User: root
- Password: root
- Database: marchMadness

### pgAdmin
- Email: brandon@gmail.com
- Password: all4Postgres!