var NodeHelper = require('node_helper');
var request = require('request');

module.exports = NodeHelper.create({
  start: function () {
    console.log('MMM-openaq helper started...');
  },

  getMeasures: function (stationid) {
      var self = this;

        request({ url: 'https://api.openaq.org/v1/latest?location='+stationid, method: 'GET' }, function (error, response, body) {
          // console.log(response.statusCode);
          if (!error && response.statusCode == 200) {
            var measurements = JSON.parse(body).results[0].measurements;
            // console.log("Measurements :" + JSON.stringify(measurements));
            var result = [];
            for (var i in measurements) {
              result[i] = {};
              result[i].parameter = measurements[i].parameter;
              result[i].value = measurements[i].value;
              result[i].unit = measurements[i].unit;
              result[i].lastUpdated = measurements[i].lastUpdated;
            }
          }

      self.sendSocketNotification('DATA_OPENAQ', result);

      });
  },


  //Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, payload) {
    // console.log("Received :" + notification);
    // console.log("Received payload:" + payload);
    if (notification === 'GET_OPENAQ') {
      this.getMeasures(payload);
    }
  }

});
