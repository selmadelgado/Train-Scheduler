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
  
  // 2. On Submit button click, 
  $("#add-train-btn").on("click", function(event) {
    event.preventDefault();
  
    // Collect and store form inputs into variables
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrain = $("#first-train-input").val().trim();
    var frequency = $("#frequency-input").val().trim();
  
    // Create local "temporary" object to hold train data
    var newTrain = {
      trainName: trainName,
      destination: destination,
      firstTrain: firstTrain,
      frequency: frequency
    };
 

    // Upload train data to the database
    database.ref().push(newTrain);
  
    // Log everything to console
    console.log(newTrain.trainName);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrain);
    console.log(newTrain.frequency);
  
    alert("Train successfully added!");
  
    // Clear all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
  });
  
  
    // 3. Collect data from Firebase and add a row in the html when a user adds an entry
    database.ref().on("child_added", function(childSnapshot) {
      console.log(childSnapshot.val());
  
      // Store everything into a variable
      var trainName = childSnapshot.val().trainName;
      var destination = childSnapshot.val().destination;
      var firstTrain = childSnapshot.val().firstTrain;
      var frequency = childSnapshot.val().frequency;
  
      // Train Info
      console.log(trainName);
      console.log(destination);
      console.log(firstTrain);
      console.log(frequency);
  
      // Convert train time into actual time variable through moment.js
      var firstTrainConverted = moment(firstTrain, "HH:mm").subtract(10, "years");
      console.log("firstTrainConverted: " + firstTrainConverted);
  
      // Difference between the times
      var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
      console.log("DIFFERENCE IN TIME: " + diffTime);
  
      // Time apart remainder
      var tRemainder = diffTime % frequency;
      console.log(tRemainder);
  
      // Minutes until the next train
      var tMinutesTillTrain = frequency - tRemainder;
      console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
  
      // next arrival calculation
      var nextArrival = moment().add(tMinutesTillTrain, "minutes");
      console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm"));
  
      // Create the new row
      var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(destination),
        $("<td class='text-center'>").text(moment(firstTrainConverted).format("hh:mm")),
        $("<td class='text-center'>").text(moment(nextArrival).format("hh:mm")),
        $("<td class='text-center'>").text(tMinutesTillTrain),
      );

      // Append new row to the table
      $("#trains-table > tbody").append(newRow);
    });