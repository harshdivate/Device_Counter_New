const mqtt = require('mqtt');
const express=require("express");
const db=require('./db');

// MQTT broker details
const brokerUrl = 'mqtt://173.212.249.30';
const clientId = 'c1';
const username = 'smps';
const password = 'smps1234';

let counter=0;
// Topic to subscribe to
const topic = 'company_name';



// Connect to the MQTT broker
const client = mqtt.connect(brokerUrl, {
  clientId,
  username,
  password
});

// Callback when the client is connected
client.on('connect', () => {
  console.log('Connected to MQTT broker');
  // Subscribe to the topic
  client.subscribe(topic, (err) => {
    if (!err) {
      console.log(`Subscribed to topic: ${topic}`);
    } else {
      console.error(`Error subscribing to topic: ${err}`);
    }
  });
});

// Callback when a message is received
client.on('message', (receivedTopic, message) => {
//     const jsonData=message;
//     const jsonObject=JSON.parse(jsonData);
//     const deviceid=jsonObject.device_id;
//     console.log("Device id is"+deviceid+"Type of device id is"+typeof(deviceid));
//     //Function call to updat the database
//     counter=counter+1;
//     update_db(deviceid,counter)
//   console.log(`Received message on topic ${receivedTopic}: ${message}`);
    counter=counter+1;
    console.log(message);
    const messageObj = JSON.parse(message);
    console.log(messageObj);
    const deviceId = messageObj.device_id;
    console.log(`Device Id is `+deviceId+"typeof deviceid is"+typeof(deviceId));
    update_db(deviceId, counter);
    console.log("Updated");
   
});



// async function update_db(deviceid,counter){
//     // const deviceid=message["device_id"];
//     const result=await db.query(`update devices set quantity=${counter} where device_id=${deviceid}`);
//     console.log(result);
//   }


async function update_db(deviceid, counter) {
    try {
      const result = await db.query(`UPDATE device_c SET quantity=${counter} WHERE deviceId='${deviceid}'`);
      
    } catch (error) {
      console.error("Error updating database:", error);
    }
  }



// Callback when an error occurs
client.on('error', (error) => {
  console.error(`MQTT Error: ${error}`);
});
