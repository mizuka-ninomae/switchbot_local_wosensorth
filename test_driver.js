const LocalWoSensorTH = require('switchbot_local_wosensorth');
let  blu_mac          = "XX:XX:XX:XX:XX:XX";
let  noble_ctl_path   = "/home/pi/homebridge-sensor/node_modules/switchbot_local_wosensorth/";

let wosendor = new LocalWoSensorTH (blu_mac, noble_ctl_path, function (error, value) {
    console.log (value);
    console.log (error);
});
