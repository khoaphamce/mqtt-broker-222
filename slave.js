const mqtt = require('mqtt')
const fs = require('fs');

const host = 'localhost'
const port = '1883'

const connectUrl = `mqtt://${host}:${port}`
const client = mqtt.connect(connectUrl, {
  clientId: "slave",
  clean: true,
  connectTimeout: 10000,
  username: 'slave',
  reconnectPeriod: 1000,
})

let activeDeviceList = new Set()

client.on('connect', () => {
  console.log('Connected')
  client.subscribe(["iot/active", "iot/deactive"])
//   client.publish(topic, 'nodejs mqtt test', { qos: 0, retain: false }, (error) => {
//     if (error) {
//       console.error(error)
//     }
//   })
})

let topic_checkList = {"iot_weather_data": false, "iot_image": false}
let temp_data = {"iot_weather_data": {}, "iot_image": []}

client.on('message', (topic, payload) => {
  let payloadString = payload.toString()
  // for (i=0; i < payloadString.length; i++){
  //   if (payloadString[i] == "'")
  //     payloadString[i] = '"'
  // }
  console.log('Received Message:', topic, payloadString)
  
  if (topic == "iot/active"){
    activeDeviceList.add(payloadString)
  }
  else if (topic == "iot/deactive"){
    activeDeviceList.delete(payloadString)
  }

  client.publish("active_device", JSON.stringify(Array.from(activeDeviceList)), { qos: 0, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })
  
})