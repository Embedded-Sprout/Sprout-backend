var express = require('express');
var app = express();

var mqtt = require('mqtt');

var fs = require('fs');
var fileName = 'public/data.json';

// var broker = 'mqtt://test.mosquitto.org';

var broker = 'mqtt://ee-estott-octo.ee.ic.ac.uk';
var client = mqtt.connect(broker, {clientId:'backend'});

client.on("connect", function() {
    console.log('Connected to mqtt broker: ' + broker);
});
client.subscribe('IC.embedded/LH/testing', {qos: 1});

client.on('message', function(topic, message, packet) {
    console.log('message is ' + message);
    console.log('topic is ' + topic);
    var data = JSON.parse(fs.readFileSync(fileName));
    data.push(JSON.parse(message));
    fs.writeFileSync(fileName, JSON.stringify(data));
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.send('Hello World');
})

var server = app.listen(process.env.PORT, function () {
    var host = server.address().address
    var port = server.address().port
   
    console.log("Example app listening at http://%s:%s", host, port)
})
