const child_process = require ('child_process');
const path          = require ('path');
const AsyncLock     = require ('async-lock');

class LocalWoSensorTH {
  constructor (ble_mac, ble_ctl_path = '/usr/local/lib/node_modules/switchbot_local_wosensorth/', callback) {
    const lock = new AsyncLock ();
    lock.acquire ('ble_key', function () {
      const ble_ctl = child_process.fork (path.join (ble_ctl_path, 'ble_ctl.js'));

      ble_ctl.send (ble_mac);

      ble_ctl.on ('message', function (json) {
        ble_ctl.kill ('SIGINT');
        let buf     = Buffer.from (json.message.ServiceData['00000d00-0000-1000-8000-00805f9b34fb']);
        let te_sign = (buf.readUInt8 (4) & 0b10000000) ? 1: -1;
        callback (null, {
          te: te_sign * ((buf.readUInt8 (4) & 0b01111111) + ((buf.readUInt8 (3) & 0b00001111) * 0.1)),
          hu: (buf.readUInt8 (5) & 0b01111111),
          bt: (buf.readUInt8 (2) & 0b01111111)
        });
        return;
      })

      ble_ctl.on ('error', function (error) {
        callback (error, null);
        return;
      })
    }
  )}
}

if (require.main === module) {
  new LocalWoSensorTH (process.argv[2], process.argv[3], function (error, value) {
    console.log (value);
    console.log (error);
  });
}
else {
  module.exports = LocalWoSensorTH;
}
