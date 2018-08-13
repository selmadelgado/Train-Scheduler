// Initialize Firebase
var config = {
    apiKey: "AIzaSyAv8YvNcSZRDK68KiEUU-mw8JIiBvOMyxY",
    authDomain: "train-scheduler-3d1dc.firebaseapp.com",
    databaseURL: "https://train-scheduler-3d1dc.firebaseio.com",
    projectId: "train-scheduler-3d1dc",
    storageBucket: "train-scheduler-3d1dc.appspot.com",
    messagingSenderId: "137746131845"
  };
  
  firebase.initializeApp(config);
  
  var database = firebase.database();
  
  // 2. Button to add Trains
  $("#add-train-btn").on("click", function(event) {
    event.preventDefault();
  
    // Grab user input
    var trainName = $("#train-name-input").val().trim();
    var destName = $("#destination-input").val().trim();
    var startTime = $("#first-train-input").val().trim();
    var minsBetween = $("#frequency-input").val().trim();
  
    // Create local "temporary" object for holding train data
    var newTrain = {
      trainName: trainName,
      destName: destName,
      startTime: startTime,
      minsBetween: minsBetween
    };
  
    // Upload train data to the database
    database.ref().push(newTrain);
  
    // Log everything to console
    console.log(newTrain.trainName);
    console.log(newTrain.destName);
    console.log(newTrain.startTime);
    console.log(newTrain.minsBetween);
  
    alert("Train successfully added.");
  
    // Clear all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
  });
  
  
    // 3. Create Firebase event to add train info to the database and a row in the html when a user adds an entry
    database.ref().on("child_added", function(childSnapshot) {
      console.log(childSnapshot.val());
  
      // Store everything into a variable
      var trainName = childSnapshot.val().trainName;
      var destName = childSnapshot.val().destName;
      var startTime = childSnapshot.val().startTime;
      var minsBetween = childSnapshot.val().minsBetween;
  
      // Train Info
      console.log(trainName);
      console.log(destName);
      console.log(startTime);
      console.log(minsBetween);
  
      // Prettify starting train time.
      var startTimeConverted = moment(startTime, "HH:mm").subtract(1, "years");
      console.log("startTimeConverted: " + startTimeConverted);
  
      // Difference between the times
      var diffTime = moment().diff(moment(startTimeConverted), "minutes");
      console.log("DIFFERENCE IN TIME: " + diffTime);
  
      // Time apart remainder
      var tRemainder = diffTime % minsBetween;
      console.log(tRemainder);
  
      // Minutes until the next train
      var tMinutesTillTrain = minsBetween - tRemainder;
      console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
  
      // next arrival calculation
      var nextArrival = moment().add(tMinutesTillTrain, "minutes");
      console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm"));
  
      // Create the new row
      var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(destName),
        $("<td class='text-center'>").text(moment(startTimeConverted).format("hh:mm")),
        $("<td class='text-center'>").text(moment(nextArrival).format("hh:mm")),
        $("<td class='text-center'>").text(tMinutesTillTrain),
      );
  
      // Append new row to the table
      $("#trains-table > tbody").append(newRow);
    });