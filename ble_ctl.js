const Bluez = require('bluez');

const ble    = new Bluez ();
this.adapter = null;

process.on ('message', function (ble_mac) {
  ble.init ()
   .then(async function () {
     this.adapter = await ble.getAdapter ();
     await this.adapter.StartDiscovery ();
   }).catch (console.error);

   ble.on ('device', async function (address, props) {
     if (ble_mac.toUpperCase ().replace (/:/g,"") == address.toUpperCase ().replace (/:/g,"")) {
       process.send ({ message: props });
       this.adapter.StopDiscovery ();
     }
   });
})
