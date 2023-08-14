const db=require('./db');


function update_db(message,counter){
    const deviceid=message["device_id"];
    const result=db.query(`update devices set quantity='${counter}' where device_id='${deviceid}'`);
  }
