const mqtt = require('mqtt');

// MQTT broker URL
const brokerUrl = 'mqtt://173.212.249.30:1883'; // Replace with your broker URL

// MQTT client options
// const options = {
//   clientId: 'publisher-client', // Choose a unique client ID
//   username: 'your-username',    // MQTT username (if required)
//   password: 'your-password',    // MQTT password (if required)
// };

// Create MQTT client instance
const client = mqtt.connect(brokerUrl);

// When the client is connected
client.on('connect', () => {
  console.log('Connected to MQTT broker');

  // Publish a message to the 'company_name' topic
  const message = 'Hello, MQTT from publisher!';
  client.publish('company_name', message, (err) => {
    if (err) {
      console.error('Error publishing message:', err);
    } else {
      console.log('Message published successfully');
    }
    // After publishing the message, you might want to disconnect the client
    client.end();
  });
});

// Handle disconnection
client.on('close', () => {
  console.log('Disconnected from MQTT broker');
});

// Handle errors
client.on('error', (err) => {
  console.error('MQTT client error:', err);
});
