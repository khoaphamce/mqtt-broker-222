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

client.on('connect', () => {
  console.log('Connected')
  client.subscribe(["iot_image", "iot_weather_data"])
//   client.publish(topic, 'nodejs mqtt test', { qos: 0, retain: false }, (error) => {
//     if (error) {
//       console.error(error)
//     }
//   })
})

let topic_checkList = {"iot_weather_data": false, "iot_image": false}
let temp_data = {"iot_weather_data": {}, "iot_image": []}

client.on('message', (topic, payload) => {
  console.log('Received Message:', topic, payload.toString())
  
  if (topic == "iot_image" || topic == "iot_weather_data"){
    topic_checkList[topic] = true
    temp_data[topic] = payload
  }

  if (topic_checkList["iot_image"] == true && topic_checkList["iot_weather_data"] == true)
  {
    topic_checkList["iot_image"] = false
    topic_checkList["iot_weather_data"] = false
    
    let temp_weather = temp_data["iot_weather_data"]

    client.publish("weather_data", temp_data["iot_weather_data"], { qos: 0, retain: false }, (error) => {
        if (error) {
          console.error(error)
        }
    })

    let image_data = Buffer(fs.readFileSync("image.png")).toString('base64')
    // console.log(image_data)
    let img_msg = {"id": "Iot_1", "image": image_data}
    // console.log(img_msg["image"])

    client.publish("image", JSON.stringify(img_msg), { qos: 0, retain: false }, (error) => {
        if (error) {
          console.error(error)
        }
    })

    temp_data["iot_weather_data"] = {}
    temp_data["image"] = {}
  }
})