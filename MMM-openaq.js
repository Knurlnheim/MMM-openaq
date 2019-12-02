'use strict';

Module.register("MMM-openaq", {
  defaults: {
    title: "Qualité de l'air",
    url: '',
    updateInterval: 30*60*1000,
	station_id: 'FR11025',
	label: 'Lille Fives'
    },

  start: function() {
    this.getData();
    this.scheduleUpdate();
    this.measurements = [];

  },

  getStyles: function() {
  	return ["openaq_style.css"];
  },


  getDom: function() {
    var wrapper = document.createElement("div");

    if (!this.loaded) {
      wrapper.innerHTML = this.translate("LOADING");
      wrapper.className = "dimmed light small";
      return wrapper;
    }

    var table = document.createElement("table");
    table.className = "regular light small";
    var last_update = new Date();

    for (var i  in this.measurements) {
      var row = document.createElement("tr");
      table.appendChild(row);
      var cell = document.createElement("td");
      var fparam = "";
      var quality_array = [];
      var color_array = ["supergreen", "green", "yellow", "orange", "red"];
      switch (this.measurements[i].parameter) {
        case "pm25":
          fparam = "PM 2,5";
          quality_array = [0,15,30,55,110]
          // Log.info("fparam pm25");
          break;
        case "pm10":
          fparam = "PM 10";
          quality_array = [0,25,50,90,180]
          // Log.info("fparam pm10");
          break;
        case "no2":
          fparam = "NO<sub>2</sub>";
          quality_array = [0,50,100,200,400]
          // Log.info("fparam no2");
          break;
        case "o3":
          fparam = "O<sub>3</sub>";
          quality_array = [0,60,120,180,240]
          //  Log.info("fparam o3");
          break;
        default:
          // Log.info("fparam default " + this.measurements[i].parameter );
          fparam = this.measurements[i].parameter;
        }
      cell.innerHTML = fparam;
      cell.className = "";
      row.appendChild(cell);
// replace(".", this.config.decimalSymbol)
      var cell = document.createElement("td");
      cell.innerHTML = this.measurements[i].value.toString().replace(".", ",") + " " + this.measurements[i].unit;
      var fvalue = this.measurements[i].value;
      // var fvalue = parseFloat(this.measurements[i].value);
      for (var j in quality_array) {
        if (fvalue >= quality_array[j] ) {
          var colorclass = color_array[j]
          //Log.info("fvalue /  color" + fvalue +" "+ colorclass);
        }
      }
      cell.className = colorclass;
      row.appendChild(cell)

      var mdate = new Date(this.measurements[i].lastUpdated);
  //    Log.info("lastdate : " + last_update.toLocaleString('fr-FR', {day : 'numeric',month : 'numeric',year : 'numeric',hour: "2-digit",minute: "2-digit",second: "2-digit"}) );
  //    Log.info("mdate : " + mdate.toLocaleString('fr-FR', {day : 'numeric',month : 'numeric',year : 'numeric',hour: "2-digit",minute: "2-digit",second: "2-digit"}) );
      if (mdate < last_update){
        last_update = mdate;
      }
    }
    wrapper.appendChild(table);

    var note = document.createElement("div");
    note.classList.add("xsmall", "dimmed", "align-right");
    note.innerHTML = "Relevé de " + this.config.label + "<br>Le " + last_update.toLocaleString('fr-FR', {day : 'numeric',month : 'numeric',year : 'numeric',hour: "2-digit",minute: "2-digit"}) ;

    wrapper.appendChild(note);
    return wrapper;
  },



  scheduleUpdate: function(delay) {
    var nextLoad = this.config.updateInterval;
    if (typeof delay !== "undefined" && delay >= 0) {
      nextLoad = delay;
    }

    var self = this;
    setInterval(function() {
      self.getData();
    }, nextLoad);
  },

  getData: function () {
    this.sendSocketNotification('GET_OPENAQ', this.config.station_id);
    this.loaded = false;
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification === "DATA_OPENAQ") {
    //  Log.info("received :"+ JSON.stringify(payload));
      this.measurements = payload;
      this.loaded = true;
      var fade = 500;
      this.updateDom(fade);
    }

  }

});
