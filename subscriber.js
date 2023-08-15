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

let cv;



async function getCounterValue(deviceId) {
  try {
    const result = await db.query(`select quantity from device_c where deviceId='${deviceId}'`);
    // console.log(result.rows[0].quantity);
    const counterValue = parseInt(result.rows[0].quantity); // Assuming result is an object with a 'rows' property

    return counterValue;
  } catch (err) {
    console.log(err);
  }
}








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
client.on('message',async (receivedTopic, message) => {
  try{
    const messageObj = JSON.parse(message);
    const deviceId = messageObj.device_id;
    let counter=await getCounterValue(deviceId);
    console.log(typeof(counter),counter);
    counter=counter+1;
    // console.log(`Got counter value as ${counter}`);
    await update_db(deviceId, counter);
    // console.log(`Updated the counter to ${counter}`);
  }
  catch(err){
    console.log(err);
  }
   
   
});


// client.on('message', async (receivedTopic, message) => {
//   const messageObj = JSON.parse(message);
//   const deviceId = messageObj.device_id;
  
//   try {
//       const counterValue = await getCounterValue(deviceId); // Await the Promise
//       console.log(typeof counterValue, counterValue);
//       const updatedCounter = counterValue + 1;
//       await update_db(deviceId, updatedCounter); // Await the database update
//       console.log(`Updated the counter to ${updatedCounter}`);
//   } catch (error) {
//       console.error("Error processing message:", error);
//   }
// });




// async function update_db(deviceid,counter){
//     // const deviceid=message["device_id"];
//     const result=await db.query(`update devices set quantity=${counter} where device_id=${deviceid}`);
//     console.log(result);
//   }


async function update_db(deviceid, counter) {
    try {
      let result = await db.query(`UPDATE device_c SET quantity=${counter} WHERE deviceId='${deviceid}'`);
      // let result = await db.query('UPDATE device_c SET quantity=$1 WHERE deviceId=$2', [counter, deviceid]);
      
    } catch (error) {
      console.error("Error updating database:", error);
    }
  }



// Callback when an error occurs
client.on('error', (error) => {
  console.error(`MQTT Error: ${error}`);
});
