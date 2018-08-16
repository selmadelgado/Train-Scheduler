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
  
  var trainData = firebase.database();
  
  // 2. On Submit button click, 
  $("#add-train-btn").on("click", function() {
  
    // Collect and store form inputs into variables
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrain = moment($("#first-train-input").val().trim(), "HH:mm").subtract(10, "years").format("X");
    var frequency = $("#frequency-input").val().trim();

    // Create local "temporary" object for holding train data
    var newTrain = {
      trainName: trainName,
      destination: destination,
      firstTrain: firstTrain,
      frequency:frequency
    };
    
    // Upload train data to FB database
    trainData.ref().push(newTrain);

    alert("Train Added.");

    // Log everything to console
    console.log(newTrain.trainName);
    console.log(newTrain.destName);
    console.log(newTrain.startTime);
    console.log(newTrain.minsBetween);
  
    // Clear all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");

    })
    

    // 3.Collect data from firebase
    trainData.ref().on("child_added", function(childSnapshot) {
      //console.log(childSnapshot.val());

      // Store everything into a variable
      var trainName = childSnapshot.val().trainName;
      var destination = childSnapshot.val().destination;
      var firstTrain = childSnapshot.val().firstTrain;
      var frequency = childSnapshot.val().frequency;

      console.log(typeof frequency);

      // When is the next train
      var remainder = moment().diff(moment.unix(firstTrain), "minutes")%frequency;

      // How many minutes untill that train arrives
      var minutes = frequency - remainder;

      // next arrival calculation
      var arrival = moment().add(minutes, "m").format("hh:mm A");

      console.log(remainder);
      console.log(minutes);
      console.log(arrival);

       // Create new row
       var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(destination),
        $("<td class='text-center'>").text(frequency),
        $("<td class='text-center'>").text(arrival),
        $("<td class='text-center'>").text(minutes + " m"),
      );
  
      // Append new row to the table in the DOM
      $("#trains-table > tbody").append(newRow);

    });