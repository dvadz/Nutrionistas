$(document).ready(function() {
  new Chart(document.getElementById("line-chart"), {
    type: "line",
    data: {
      labels: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      datasets: [
        {
          data: [
            186,
            183,
            183,
            181,
            179,
            177,
            174,
            173,
            171,
            170,
            169,
            169,
            168,
            166,
            165,
            162,
            159,
            161,
            158,
            157,
            154,
            154,
            152
          ],
          label: "Your Weight",
          borderColor: "#3e95cd",
          fill: false
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: "Daily Weight Tracker"
      }
    }
  });

  //VARIABLES
  ("use strict");
  var debug = true;

  var nutrionistasApp = {
    breakfast: {},
    lunch: {},
    dinner: {},
    snacks: {},
    foodItem: {
      name: "",
      calories: 0
    },
    userInfo: {
      name: "",
      gender: "",
      weightLossGoal: 0
    },
    isUserInfoComplete: false,
    currentDateString: "",
    dbRef: "",
    listener: ""
  };
  // -----------------------------------------------------
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDv5rul3wHkx6ovFTUX98iifYu3szg_M4s",
    authDomain: "nutrionista-68235.firebaseapp.com",
    databaseURL: "https://nutrionista-68235.firebaseio.com",
    projectId: "nutrionista-68235",
    storageBucket: "nutrionista-68235.appspot.com",
    messagingSenderId: "549278594473"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  function setupValueListener(childName) {
    if (debug) {
      console.log("Function: setupValueListener");
    }

    database
      .ref()
      .child(childName)
      .on("value", function(snapshot) {
        if (debug) {
          console.log("EVENT: on 'value'", snapshot, snapshot.val());
        }

        readDatabase(snapshot.val());
      });
  }

  $(".form-group").on("keyup", function() {
    var weightMonday = $("#inputMonday")
      .val()
      .trim();
    var weightTuesday = $("#inputTuesday")
      .val()
      .trim();
    var weightWednesday = $("#inputWednesday")
      .val()
      .trim();
    var weightThursday = $("#inputThursday")
      .val()
      .trim();
    var weightFriday = $("#inputFriday")
      .val()
      .trim();
    var weightSaturday = $("#inputSaturday")
      .val()
      .trim();
    var weightSunday = $("#inputSunday")
      .val()
      .trim();

    sessionStorage.setItem("Monday", weightMonday);
    sessionStorage.setItem("Tuesday", weightTuesday);
    sessionStorage.setItem("Wednesday", weightWednesday);
    sessionStorage.setItem("Thursday", weightThursday);
    sessionStorage.setItem("Friday", weightFriday);
    sessionStorage.setItem("Saturday", weightSaturday);
    sessionStorage.setItem("Sunday", weightSunday);
  });
  $("#inputMonday").val(sessionStorage.getItem("Monday"));
  $("#inputTuesday").val(sessionStorage.getItem("Tuesday"));
  $("#inputWednesday").val(sessionStorage.getItem("Wednesday"));
  $("#inputThursday").val(sessionStorage.getItem("Thursday"));
  $("#inputFriday").val(sessionStorage.getItem("Friday"));
  $("#inputSaturday").val(sessionStorage.getItem("Saturday"));
  $("#inputSunday").val(sessionStorage.getItem("Sunday"));

  $("#submit").on("click", function(event) {
    event.preventDefault();

    if (
      $("#inputMonday")
        .val()
        .trim() === "" ||
      $("#inputTuesday")
        .val()
        .trim() === "" ||
      $("#inputWednesday")
        .val()
        .trim() === "" ||
      $("#inputThursday")
        .val()
        .trim() === "" ||
      $("#inputFriday")
        .val()
        .trim() === "" ||
      $("#inputSaturday")
        .val()
        .trim() === "" ||
      $("#inputSunday")
        .val()
        .trim() === ""
    ) {
      alert("Please fill in all the details");
    } else {
      weightMondayIs = $("#inputMonday")
        .val()
        .trim();
      weightTuesdayIs = $("#inputTuesday")
        .val()
        .trim();
      weightWednesdayIs = $("#inputWednesday")
        .val()
        .trim();
      weightThursdayIs = $("#inputThursday")
        .val()
        .trim();
      weightFridayIs = $("#inputFriday")
        .val()
        .trim();
      weightSaturdayIs = $("#inputSaturday")
        .val()
        .trim();
      weightSundayIs = $("#inputSunday")
        .val()
        .trim();

      $(".form-group").val("");

      database.ref().push({
        weightMondayIs: weightMondayIs,
        weightTuesdayIs: weightTuesdayIs,
        weightWednesdayIs: weightWednesdayIs,
        weightThursdayIs: weightThursdayIs,
        weightFridayIs: weightFridayIs,
        weightSaturdayIs: weightSaturdayIs,
        weightSundayIs: weightSundayIs,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
    }
  });

  function cancelValueListener(childName) {
    if (debug) {
      console.log("Function: cancelValueListener");
    }

    if (nutrionistasApp.listener) {
      nutrionistasApp.dbRef.off("value", nutrionistasApp.listener);
      console.log("Turned off listener");
      nutrionistasApp.listener = "";
    } else {
      console.log("No active listener");
    }
  }

  function readDatabase(snapshot) {
    if (debug) {
      console.log("Function: readDatabase");
    }
    // TODO:  if the snapshot.val() is null, do something? or nothing

    // TODO: else you definitely have to do something
  }

  // DOCUMENT READY--------------------------
  $(document).ready(function() {
    console.log("document is ready");

    start();
  });

  // LOCALSTORAGE -----------------------------------
  function retrieveUserInfoFromLocalStorage() {
    if (debug) {
      console.log("Function: retrieveUserInfo");
    }

    nutrionistasApp.isUserInfoComplete = false;

    let fromLocalStorage = localStorage.getItem("nutrionistas");
    if (fromLocalStorage) {
      fromLocalStorage = JSON.parse(fromLocalStorage);
      nutrionistasApp.userInfo.name = fromLocalStorage.name;
      nutrionistasApp.userInfo.gender = fromLocalStorage.gender;
      nutrionistasApp.userInfo.weightLossGoal = fromLocalStorage.weightLossGoal;
      nutrionistasApp.isUserInfoComplete = true;
      if (debug) {
        console.log(
          "user info retrieval was sucessful",
          nutrionistasApp.userInfo
        );
      }
    } else {
      console.log("Missing userinfo");
      // TODO:
    }
  }

  function storeUserInfoIntoLocalStorage() {
    if (debug) {
      console.log("Function: storeUserInfo");
    }

    let forStorage = JSON.stringify(nutrionistasApp.userInfo);
    localStorage.setItem("nutrionistas", forStorage);
  }

  function start() {
    if (debug) {
      console.log("Function: start");
    }
    //load userinfo
    retrieveUserInfoFromLocalStorage();
    //TODO: if missing, ask user to provide info
    //TODO:set a timer that will alert that the current day has ended
    //get today's date
    getTheCurentDate();

    // override
    nutrionistasApp.currentDateString = "2019-03-21";
    console.log("Date override:", nutrionistasApp.currentDateString);

    // TODO:setup if a food diary for today already exists in the db
    nutrionistasApp.dbRef = database
      .ref()
      .child(nutrionistasApp.currentDateString);

    //cancel any existing 'value' event listener
    cancelValueListener();

    //set a 'value' event listener for today's date
    setupValueListener(nutrionistasApp.currentDateString);
  }

  function getTheCurentDate() {
    if (debug) {
      console.log("Function: getTheCurentDate");
    }
    let theDate, year, month, day;

    theDate = new Date();
    year = theDate.getFullYear();
    month = theDate.getMonth() + 1;
    day = theDate.getDate();

    //make sure that the month and day are 2 digits long
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    nutrionistasApp.currentDateString = `${year}-${month}-${day}`;
    console.log(
      "nutrionistasApp.currentDateString",
      nutrionistasApp.currentDateString
    );
  }
});
