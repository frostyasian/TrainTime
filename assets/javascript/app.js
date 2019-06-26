$(document).ready(function() {
  moment().format("[today]");
  console.log(moment().format("LLLL"));

  var config = {
    apiKey: "AIzaSyBFAkGiDC1nCzqdSnINscTxs8EoBTYcXbs",
    authDomain: "train-time-hw-a686d.firebaseapp.com",
    databaseURL: "https://train-time-hw-a686d.firebaseio.com",
    projectId: "train-time-hw-a686d",
    storageBucket: "train-time-hw-a686d.appspot.com",
    messagingSenderId: "913527889231",
    appId: "1:913527889231:web:631f141c6841ace5"
  };

  firebase.initializeApp(config);

  var dataRef = firebase.database();

  function clearMyInput() {
    var trainName = $("#train-name-input").val("");
    var destination = $("#destination-input").val("");
    var firstTrain = $("#first-train-input").val("");
    var frequency = $("#frequency-min-input").val("");
  }

  $("#submitForm").on("click", function(event) {
    event.preventDefault();

    var trainName = $("#train-name-input")
      .val()
      .trim();
    var destination = $("#destination-input")
      .val()
      .trim();
    var firstTrain = $("#first-train-input")
      .val()
      .trim();
    var frequency = $("#frequency-min-input")
      .val()
      .trim();
    // console.log(frequency);
    // console.log(trainName);
    // console.log(destination);
    // console.log(firstTrain);

    dataRef.ref().push({
      trainName: trainName,
      destination: destination,
      firstTrain: firstTrain,
      frequency: frequency,
      firstTrainAdded: firebase.database.ServerValue.TIMESTAMP
    });

    clearMyInput();
  });

  dataRef
    .ref()
    .limitToLast(2)
    .on("child_added", function(childSnapshot) {
      var currentTime = moment();

      var tFrequency = childSnapshot.val().frequency;
      //console.log(tFrequency)

      var convertedDate = moment(
        childSnapshot.val().firstTrain,
        "hh:mm"
      ).subtract(1, "years");

      var firstTime = moment(convertedDate).format("HH:mm");

      console.log(firstTime);

      var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
      //console.log(firstTimeConverted);

      var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
      //console.log("DIFFERENCE IN TIME: " + diffTime);

      var tRemainder = diffTime % tFrequency;
      //console.log(tRemainder);

      var tMinutesTillTrain = tFrequency - tRemainder;
      console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

      var nextTrain = moment()
        .add(tMinutesTillTrain, "minutes")
        .format("HH:mm");
      //console.log(nextTrain);

      console.log(childSnapshot.val());
      console.log(childSnapshot.val().trainName);
      console.log(childSnapshot.val().destination);
      console.log(childSnapshot.val().firstTrain);
      console.log(childSnapshot.val().frequency);

      $(".table tbody").append(
        "<tr><td id='train-name-display'> " +
          childSnapshot.val().trainName +
          "</td><td id='destination-display'>" +
          childSnapshot.val().destination +
          "</td><td id='frequency-display'>" +
          childSnapshot.val().frequency +
          "</td><td id='next-arival-display'>" +
          nextTrain +
          "</td><td id='minutes-away-display'>" +
          tMinutesTillTrain
      );
    });
});
