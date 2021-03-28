const child_process = require ('child_process');
const path          = require ('path');
const AsyncLock     = require ('async-lock');

const s_uuid = ['cba20d00224d11e69fb80002a5d5c51b'];
let   te_val, hu_val, bt_val;

class LocalWoSensorTH {
  constructor (ble_mac, noble_ctl_path = '/usr/local/lib/node_modules/switchbot_local_wosensorth/', callback) {
    const lock = new AsyncLock ();
    lock.acquire ('noble_key', function () {
      const noble_ctl = child_process.fork (path.join (noble_ctl_path, 'noble_ctl.js'));
      const obj = { s_uuid: s_uuid, ble_mac: ble_mac }

      noble_ctl.send (obj);

      noble_ctl.on ('message', function (json) {
        noble_ctl.kill ('SIGINT');
        let data     = json.message.serviceData[0]?.data?.data;
        if (data === undefined) {
        }
        else {
          let buf     = Buffer.from (data);
          let te_sign = (buf.readUInt8 (4) & 0b10000000) ? 1: -1;
          te_val      = te_sign * ((buf.readUInt8 (4) & 0b01111111) + ((buf.readUInt8 (3) & 0b00001111) * 0.1));
          hu_val      = (buf.readUInt8 (5) & 0b01111111);
          bt_val      = (buf.readUInt8 (2) & 0b01111111);
          callback (null, {te: te_val, hu: hu_val, bt: bt_val});
          return;
        }
      })

      noble_ctl.on ('error', function (error) {
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
