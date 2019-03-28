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

    console.log("document is ready");

    start();

    //EVENT: Submit user info
    $("#submit-button").on("click", function(){  
        if(debug){console.log("EVENT: submitted user info")};
        
        collectUserInfo();
    });

    //EVENT: food search
    $(".food-search").on("click", function(){
        if(debug){console.log("EVENT: searching for food");}
        event.preventDefault();

        //value + '-input' = id of input element
        let inputName = "#" + $(this).val() + "-input";
        let foodItem = $(inputName).val().trim().toLowerCase();
        if(foodItem===""){
            console.log("please enter a food");
            return false;
        }

        foodItem = foodItem.replace(' ','%20');
        console.log("Search for FOOD: ",foodItem);

        let url = "https://api.edamam.com/api/food-database/parser?ingr=" + foodItem +  "&app_id=422e6eb9&app_key=a3e3c2376edf1be05dc26f0f2e4f9fa1";
        console.log("url: ", url);

        $.ajax({
            url: url,
            method: "GET"
        }).then(function(response){
            console.log(response);
        });
    });    
});

    //VARIABLES
    'use strict'
    var debug = true;

    var foodItem = {
        name: "",
        calories: 0
    };

var nutrionistasApp = {
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
    userInfo : {
        name: "",
        gender: "",
        goal: "",
        dailyCalories: 0,
    },
    isUserInfoComplete: false,
    currentDateString: "",
    dbRef: "",
    listener: "",
    secondsRemaining: 0,
    endOfDayTimer: "",
    consumedCalories: 0,
    remainingCalories: 0
}

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
    if(debug) {console.log("Function: setupValueListener - ", childName )}
    
    //EVENT: 'value' listener
    database.ref().child(childName).on("value", function(snapshot){
        if(debug) {console.log("EVENT: on 'value'", snapshot, snapshot.val());}

        processFoodFromDatabase(snapshot.val());
    });
}

// all about the chart----------------------------------------

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

// end of chart -----------------------------------------------  
  
function cancelValueListener(childName){
    if(debug) {console.log("Function: cancelValueListener")}
    
    nutrionistasApp.dbRef.off("value", nutrionistasApp.listener);
   if(debug) {console.log("Turned off 'value' listener");}
}

function storeAllFoodToDatabase() {
    if(debug) {console.log("Function: storeAllFoodToDatabase")}
  
    nutrionistasApp.dbRef.set({
        "breakfast": nutrionistasApp.breakfast,
        "lunch": nutrionistasApp.lunch,
        "dinner": nutrionistasApp.dinner,
        "snacks": nutrionistasApp.snacks,
    });
}

function processFoodFromDatabase(snapshot){
    if(debug) {console.log("Function: processFoodFromDatabase")}

    clearAllFood();
    nutrionistasApp.consumedCalories = 0;

    // no food listed
    if(snapshot===null){
        return false;

    //save all food into array       
    } else {
        nutrionistasApp.breakfast = snapshot.breakfast;
        nutrionistasApp.lunch = snapshot.lunch;
        nutrionistasApp.dinner = snapshot.dinner;
        nutrionistasApp.snacks = snapshot.snacks;
    }

    //display breakfast
    //array is null if empty
    if(nutrionistasApp.breakfast) {
        nutrionistasApp.breakfast.forEach(function(food){
            console.log("breakfast", food);
            nutrionistasApp.consumedCalories += parseInt(food.calories);
            let foodItem = $("<div></div>").addClass("row my-2")
                    .append(`<div class="col-6 col-sm-2">${food.name}</div> <div class="col-6 col-sm-2">${food.calories} cal</div>`);
            $("#breakfast-display").append(foodItem);
        });
    }

    //display lunch
    if(nutrionistasApp.lunch) {
        nutrionistasApp.lunch.forEach(function(food){
            console.log("lunch", food);
            nutrionistasApp.consumedCalories += parseInt(food.calories);
            let foodItem = $("<div></div>").addClass("row my-2")
                    .append(`<div class="col-6 col-sm-2">${food.name}</div> <div class="col-6 col-sm-2">${food.calories} cal</div>`);
            $("#lunch-display").append(foodItem);
        });
    }

    // display dinner
    if(nutrionistasApp.dinner) {
        nutrionistasApp.dinner.forEach(function(food){
            console.log("dinner", food);
            nutrionistasApp.consumedCalories += parseInt(food.calories);
            let foodItem = $("<div></div>").addClass("row my-2")
                .append(`<div class="col-6 col-sm-2">${food.name}</div> <div class="col-6 col-sm-2">${food.calories} cal</div>`);
            $("#dinner-display").append(foodItem);
        });
    }

    //display snacks
    if(nutrionistasApp.snacks) {
        nutrionistasApp.snacks.forEach(function(food){
            console.log("snacks", food);
            nutrionistasApp.consumedCalories += parseInt(food.calories);
            let foodItem = $("<div></div>").addClass("row my-2")
                    .append(`<div class="col-6 col-sm-2">${food.name}</div> <div class="col-6 col-sm-2">${food.calories} cal</div>`);
            $("#snacks-display").append(foodItem);
    
        });
    }
    console.log(nutrionistasApp.userInfo);
    //TODO: check if dailyCalories/goal is zero > show '--' for goal and remaining
    //show target, consumed and remaining
    $("#daily-calories-display").text(nutrionistasApp.userInfo.dailyCalories);
    $("#consumed-calories-display").text(nutrionistasApp.consumedCalories);
    $("#remaining-calories-display").text(nutrionistasApp.userInfo.dailyCalories - nutrionistasApp.consumedCalories);

}
// LOCALSTORAGE -----------------------------------
function retrieveUserInfoFromLocalStorage (){
    if(debug) {console.log("Function: retrieveUserInfo")}

    nutrionistasApp.isUserInfoComplete = false;

    let fromLocalStorage = localStorage.getItem("nutrionistas");
    if(fromLocalStorage){
        fromLocalStorage = JSON.parse(fromLocalStorage);
        nutrionistasApp.userInfo.name = fromLocalStorage.name;
        nutrionistasApp.userInfo.gender = fromLocalStorage.gender;
        nutrionistasApp.userInfo.goal = fromLocalStorage.goal;
        nutrionistasApp.userInfo.dailyCalories = fromLocalStorage.dailyCalories;
        nutrionistasApp.isUserInfoComplete = true;
        if(debug) {console.log("user info retrieval was sucessful", nutrionistasApp.userInfo)}
   
    //if null    
    }else {
        console.log("Missing userinfo");
        $("#user-info-input").show();
        $("#user-info-display").hide();
    }
}

  function storeUserInfoIntoLocalStorage() {
    if (debug) {
      console.log("Function: storeUserInfo");
    }

    let forStorage = JSON.stringify(nutrionistasApp.userInfo);
    localStorage.setItem("nutrionistas", forStorage);
  }

function collectUserInfo() {
    if(debug) {console.log("Function: collectUserInfo")}

    event.preventDefault();

    $("#error-userinfo").empty();

    //get the name
    let name = $("#name-input").val();
    //check if name is empty
    if(name==="") {
        let errorMessage = $("<p></p>").text("Please enter your name").addClass("text-danger");
        $("#error-userinfo").append(errorMessage);
        return false;
    }

    //get the gender
    let gender = $("input[name = gender]:checked").val();    
    //get the goal
    let goal = $("input[name = goal]:checked").val();
    
    //set the daily calorie intake based on the gender and goal    
    let dailyCalories=0;
    if(gender==="female"){
        if(goal==='hard'){
            dailyCalories = 1200;
        } else if(goal==='moderate'){
            dailyCalories = 1400;
        } else {
            dailyCalories = 1500;
        }
    } else {
        if(goal==='hard'){
            dailyCalories = 1500;
        } else if(goal==='moderate'){
            dailyCalories = 1600;
        } else {
            dailyCalories = 1800;
        }
    }

    //save user info into app variables
    nutrionistasApp.userInfo.name = name;
    nutrionistasApp.userInfo.gender = gender;
    nutrionistasApp.userInfo.goal = goal;
    nutrionistasApp.userInfo.dailyCalories = dailyCalories;
    
    //save user info to localStorage
    localStorage.setItem("nutrionistas", JSON.stringify(nutrionistasApp.userInfo));

    if(debug) {console.log(`Name:${nutrionistasApp.userInfo.name}  Gender:${nutrionistasApp.userInfo.gender} Goal:${nutrionistasApp.userInfo.goal}  DailyCalories:${nutrionistasApp.userInfo.dailyCalories}`);}

    // hide the form
    $("#user-info-input").fadeOut();
    $("#user-info-display").fadeIn();

    //TODO: update the summary > daily calorie, remaining
}

function clearAllFood() {
    $("#breakfast-display").empty();
    $("#lunch-display").empty();
    $("#dinner-display").empty();
    $("#snacks-display").empty();
}

function collectUserInfo() {
    if(debug) {console.log("Function: collectUserInfo")}

    event.preventDefault();

    $("#error-userinfo").empty();

    //get the name
    let name = $("#name-input").val();
    //check if name is empty
    if(name==="") {
        let errorMessage = $("<p></p>").text("Please enter your name").addClass("text-danger");
        $("#error-userinfo").append(errorMessage);
        return false;
    }

    //get the gender
    let gender = $("input[name = gender]:checked").val();    
    //get the goal
    let goal = $("input[name = goal]:checked").val();
    
    //set the daily calorie intake based on the gender and goal    
    let dailyCalories=0;
    if(gender==="female"){
        if(goal==='hard'){
            dailyCalories = 1200;
        } else if(goal==='moderate'){
            dailyCalories = 1400;
        } else {
            dailyCalories = 1500;
        }
    } else {
        if(goal==='hard'){
            dailyCalories = 1500;
        } else if(goal==='moderate'){
            dailyCalories = 1600;
        } else {
            dailyCalories = 1800;
        }
    }

    //save user info into app variables
    nutrionistasApp.userInfo.name = name;
    nutrionistasApp.userInfo.gender = gender;
    nutrionistasApp.userInfo.goal = goal;
    nutrionistasApp.userInfo.dailyCalories = dailyCalories;
    
    //save user info to localStorage
    localStorage.setItem("nutrionistas", JSON.stringify(nutrionistasApp.userInfo));

    if(debug) {console.log(`Name:${nutrionistasApp.userInfo.name}  Gender:${nutrionistasApp.userInfo.gender} Goal:${nutrionistasApp.userInfo.goal}  DailyCalories:${nutrionistasApp.userInfo.dailyCalories}`);}

    // hide the form
    $("#user-info-input").fadeOut();
    $("#user-info-display").fadeIn();

    //TODO: update the summary > daily calorie, remaining
}

function clearAllFood() {
    $("#breakfast-display").empty();
    $("#lunch-display").empty();
    $("#dinner-display").empty();
    $("#snacks-display").empty();
}

function start (){
    if(debug) {console.log("Function: start")}
    //load userinfo
    retrieveUserInfoFromLocalStorage();
    //get today's date
    getTheCurentDateAndTime();
    
    //EVENT: a new day has begun
    //note that 1 second is added to timeout
    nutrionistasApp.endOfDayTimer = setTimeout(function(){
        if(debug) {console.log("EVENT: a new day has begun")}
        getReadyForAnotherDay();
    }, (nutrionistasApp.secondsRemaining*1000)+1);

    //setup a food diary for today in the db
    nutrionistasApp.dbRef = database.ref().child(nutrionistasApp.currentDateString);

    //set a 'value' event listener for today's date
    nutrionistasApp.listener = setupValueListener(nutrionistasApp.currentDateString);
    console.log("Listener: ", nutrionistasApp.listener);

    // test_food();
}

var theday = 1;

function getTheCurentDateAndTime(){
    if(debug) {console.log("Function: getTheCurentDate")}
    let theDate, year, month, day, hours, minutes, seconds;

    //start of test ------------
    // var theDate = new Date(2018, 11, theday, 23, 55, 0, 0);
    // end of test----------

    theDate = new Date();
    year = theDate.getFullYear();
    month = theDate.getMonth() + 1;
    day = theDate.getDate();
    hours = theDate.getHours();
    minutes = theDate.getMinutes();
    seconds = theDate.getSeconds();
    
    //start of test ------------
    // theday++;
    //end of test ------------

    //make sure that the month and day are 2 digits long
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    //create the datestring
    nutrionistasApp.currentDateString = `${year}-${month}-${day}`;
    //calculate number of seconds remaining in the day
    nutrionistasApp.secondsRemaining = 86400 - ((hours*60*60) + (minutes*60) + seconds);
    if(debug){console.log("nutrionistasApp.secondsRemaining", nutrionistasApp.secondsRemaining);}
    if(debug){console.log("nutrionistasApp.currentDateString", nutrionistasApp.currentDateString);}
}

function getReadyForAnotherDay() {
    if(debug){console.log("Function: getReadyForAnotherDay");}
    getTheCurentDateAndTime();
    //cancel the current 'value' database listener
    cancelValueListener();
    //setup a food diary for today in the db
    nutrionistasApp.dbRef = database.ref().child(nutrionistasApp.currentDateString);
    //set a 'value' event listener for today's date
    nutrionistasApp.listener = setupValueListener(nutrionistasApp.currentDateString);
    // setup a new 24hour timer
    nutrionistasApp.endOfDayTimer = setTimeout(function(){
        if(debug) {console.log("EVENT: a new day has begun")}
        getReadyForAnotherDay();
    }, 86400*1000 );

    // nutrionistasApp.endOfDayTimer = setTimeout(function(){
    //     if(debug) {console.log("EVENT: a new day has begun")}
    //     getReadyForAnotherDay();
    // }, 300*1000 );

}



// ======================TEST CODE 

// function test_food() {
//     let name = "",
//         calories = 0;

//     // breakfast
//     name = "egg";
//     calories = 70;
//     nutrionistasApp.breakfast.push({name, calories});
//     console.log("before ", nutrionistasApp.breakfast);

//     name = "coffee";
//     calories = 90;
//     nutrionistasApp.breakfast.push({name, calories});
//     console.log("after ", nutrionistasApp.breakfast);

//     // lunch
//     name = "salad";
//     calories = 300;
//     nutrionistasApp.lunch.push({name, calories});

//     // dinner
//     name = "baked chicken";
//     calories = 350;
//     nutrionistasApp.dinner.push({name, calories});

//     // snacks
//     name = "chocolate cake";
//     calories = 400;
//     nutrionistasApp.snacks.push({name, calories});
    
//     nutrionistasApp.dbRef.set({
//         "breakfast": nutrionistasApp.breakfast,
//         "lunch": nutrionistasApp.lunch,
//         "dinner": nutrionistasApp.dinner,
//         "snacks": nutrionistasApp.snacks,
//     });
// }

/*  ongoing tests
    - faking date to test date rollover in the "getTheCurentDateAndTime"
    - setting a short end of day rollover timer "getReadyForAnotherDay"
    - at the end of 'start' i executed 'test_food'
*/
