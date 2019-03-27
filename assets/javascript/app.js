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
        "Sunday"
      ],
      datasets: [
        {
          data: [186, 183, 183, 181, 179, 177, 174],
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

  var string1 = "";
  var object1 = { M: 1, t: 2, w: 3, th: 4, f: 5, sa: 6, su: 7 };
  console.log(object1.su);
  var data = [];
  //for (var property1 in object1) {
  //database.ref.push(object1[property1]);
  //}

  console.log(string1);
  // expected output: "123"
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
  $("infoSubmit").on("submit", function(thing) {
    thing.preventDefault();
    var nameInput = $("#name-input")
      .val()
      .trim();
    sessionStorage.setItem("Name", nameInput);

    var dateString = moment(Date.now()).format("dddd MMMM DD YYYY");

    database.ref(`/weight/${dateString}`).push({
      nameInput: nameInput
    });
  });

  $("#name-input").val(sessionStorage.getItem("Name"));

  $("#submitButton").on("click", function(event) {
    event.preventDefault();
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

    var dateString = moment(Date.now()).format("dddd MMMM DD YYYY");

    database.ref(`/weight/${dateString}`).push({
      weightMonday: weightMonday,
      weightTuesday: weightTuesday,
      weightWednesday: weightWednesday,
      weightThursday: weightThursday,
      weightFriday: weightFriday,
      weightSaturday: weightSaturday,
      weightSunday: weightSunday
    });
  });

  $("#inputMonday").val(sessionStorage.getItem("Monday"));
  $("#inputTuesday").val(sessionStorage.getItem("Tuesday"));
  $("#inputWednesday").val(sessionStorage.getItem("Wednesday"));
  $("#inputThursday").val(sessionStorage.getItem("Thursday"));
  $("#inputFriday").val(sessionStorage.getItem("Friday"));
  $("#inputSaturday").val(sessionStorage.getItem("Saturday"));
  $("#inputSunday").val(sessionStorage.getItem("Sunday"));

  $(".form-group").val("");

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
