const noble = require ('@abandonware/noble')

process.on ('message', function (obj) {
  noble.on ('stateChange', function (state) {
    if (state === 'poweredOn') {
      noble.startScanning (obj.s_uuid, true);
    }
    else {
      throw new Error ();
      process.exit ();
    }
  })

  noble.on ('discover', function (peripheral) {
    if (obj.ble_mac.toUpperCase ().replace (/:/g,"") == peripheral.address.toUpperCase ().replace (/:/g,"")) {
      noble.stopScanning ();
      process.send ({ message: peripheral.advertisement });
    }
  })
})

process.on ('SIGINT', function () {
  process.exit ();
})
