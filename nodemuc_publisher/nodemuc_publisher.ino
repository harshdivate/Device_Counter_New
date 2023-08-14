#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include<ArduinoJson.h>


//Define Touch Sensor 
#define sensor_pin D1

int device_id=144;

int laststate=LOW;
int currentstate;
// Replace with your Wi-Fi credentials
const char* ssid = "Sahils.iphone";
const char* password = "1234567890";

// MQTT broker settings
const char* mqttServer = "173.212.249.30";
const int mqttPort = 1883;  // MQTT broker port
const char* mqttTopic = "company_name";
const char* mqttClientId = "machine1"; // MQTT client ID //machine_one
const char* mqttUsername = "smps"; // MQTT username
const char* mqttPassword = "smps1234"; 

// Create WiFi client and MQTT client instances
WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  pinMode(sensor_pin,INPUT);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }

  Serial.println("Connected to WiFi");

  // Configure MQTT broker and callback function
  mqttClient.setServer(mqttServer, mqttPort);

}

void loop() {
  if (!mqttClient.connected()) {
    reconnect();
  }
  
  // Publish a message to the MQTT topic
    DynamicJsonDocument jsonDocument(128); // Adjust the size as needed
  jsonDocument["device_id"] = mqttClientId;
  jsonDocument["message"] = "Device Detected";

  String jsonString;
  serializeJson(jsonDocument, jsonString);
  // String message = "Device Detected";
  int currentstate=digitalRead(sensor_pin);
  if(laststate==LOW && currentstate==HIGH){
      Serial.print("Publishing");
      mqttClient.publish(mqttTopic, jsonString.c_str());
      Serial.println("Published");
  }


  // Publish every 5 seconds
  delay(5000);
}

void reconnect() {
  while (!mqttClient.connected()) {
    Serial.println("Connecting to MQTT Broker...");
    
    if (mqttClient.connect(mqttClientId,mqttUsername,mqttPassword)) {
      Serial.println("Connected to MQTT Broker");
    } else {
      Serial.print("Failed, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" Retrying in 5 seconds...");
      delay(5000);
    }
  }
}