import paho.mqtt.client as mqtt
import json
import time
from typing import Any, Dict

class DBMTester:
    def __init__(self):
        self.client = mqtt.Client(protocol=mqtt.MQTTv5)  # Update to MQTT v5
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.received_data = None
        
    def on_connect(self, client: mqtt.Client, userdata: Any, flags: Dict, rc: int):
        print("Connected with result code "+str(rc))
        client.subscribe("data/#")
        
    def on_message(self, client: mqtt.Client, userdata: Any, msg: mqtt.MQTTMessage):
        try:
            decoded_payload = msg.payload.decode()
            print(f"\nReceived message on topic {msg.topic}")
            print(f"Payload (raw): {decoded_payload}")
            self.received_data = json.loads(decoded_payload)
            print(f"Parsed data: {self.received_data}")
        except Exception as e:
            print(f"Error processing message: {e}")
            self.received_data = None

    def connect(self):
        print("Connecting to MQTT broker...")
        self.client.connect("localhost", 1883, 60)
        self.client.loop_start()

    def save_data(self, path: str, data: dict):
        print(f"\nTesting save to path: {path}")
        print(f"Data to save: {data}")
        payload = json.dumps(data)
        print(f"Encoded payload: {payload}")
        self.client.publish(f"save/{path}", payload)
        time.sleep(2)  # Increased wait time

    def get_data(self, path: str) -> dict:
        print(f"\nTesting get from path: {path}")
        self.received_data = None
        self.client.publish(f"get/{path}", "")
        
        timeout = 10  # Increased timeout
        while self.received_data is None and timeout > 0:
            time.sleep(0.5)  # Longer sleep interval
            timeout -= 0.5
            
        if self.received_data is None:
            print("Timeout waiting for response")
        return self.received_data

    def run_tests(self):
        try:
            # Test 1: Save and retrieve user data
            test_user = {"name": "John Doe", "age": 30, "email": "john@example.com"}
            self.save_data("users/john", test_user)
            
            print("\nWaiting before retrieval...")
            time.sleep(2)  # Give database time to process
            
            retrieved_user = self.get_data("users/john")
            print(f"\nOriginal data: {test_user}")
            print(f"Retrieved data: {retrieved_user}")
            
            if retrieved_user != test_user:
                print("\nData mismatch details:")
                print(f"Type of original: {type(test_user)}")
                print(f"Type of retrieved: {type(retrieved_user)}")
                print(f"Keys in original: {test_user.keys()}")
                print(f"Keys in retrieved: {retrieved_user.keys() if retrieved_user else 'None'}")
            
            assert retrieved_user == test_user, "User data mismatch"
            print("Test 1 passed!")
            
            # Continue with other tests only if first one passes
            # Test 2: Update existing data
            updated_user = {**test_user, "age": 31}
            self.save_data("users/john", updated_user)
            time.sleep(2)
            retrieved_updated = self.get_data("users/john")
            assert retrieved_updated == updated_user, "Updated data mismatch"
            print("Test 2 passed!")
            
            # Test 3: Get non-existent data
            missing_data = self.get_data("users/nonexistent")
            assert missing_data is None, "Should return None for missing data"
            print("Test 3 passed!")
            
            print("\nAll tests passed successfully!")
        except AssertionError as e:
            print(f"\nAssertion failed: {e}")
            raise
        except Exception as e:
            print(f"\nUnexpected error: {e}")
            raise

    def cleanup(self):
        print("\nCleaning up...")
        self.client.loop_stop()
        self.client.disconnect()

if __name__ == "__main__":
    tester = None
    try:
        tester = DBMTester()
        tester.connect()
        time.sleep(2)  # Wait longer for initial connection
        tester.run_tests()
    except Exception as e:
        print(f"\nTest failed: {e}")
    finally:
        if tester:
            tester.cleanup()
