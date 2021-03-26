const noble     = require ('@abandonware/noble')

process.on ('message', function (blu_mac) {
  noble.on ('stateChange', function (state) {
    if (state === 'poweredOn') {
      noble.startScanning ([], true);
    }
    else {
      process.send ({error: "from child!" });
    }
  })

  noble.on ('discover', function (peripheral) {
    if (blu_mac.toUpperCase ().replace (/:/g,"") == peripheral.address.toUpperCase ().replace (/:/g,"")) {
      noble.stopScanning ();
      process.send ({ message: peripheral.advertisement });
    }
  })
})

process.on ('SIGINT', function () {
  process.exit ();
})
