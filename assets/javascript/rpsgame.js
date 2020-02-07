// Initialize Firebase
var config = {
    apiKey: "AIzaSyCzaFQ5xnOyq0EeOcwPiGJUopzH1rywqQg",
    authDomain: "my-awesome-project-e3117.firebaseapp.com",
    databaseURL: "https://my-awesome-project-e3117.firebaseio.com",
    projectId: "my-awesome-project-e3117",
    storageBucket: "my-awesome-project-e3117.appspot.com",
    messagingSenderId: "1000192780325",
    appId: "1:1000192780325:web:8fe8d950b0f05c824737cc"
};

firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();
var dataRef = database.ref("/rps");

// *****
var plyrName;
var msg;

$("#sub-button").on("click", function() {

    event.preventDefault();

    var userStatus = getRadioValue();
    // console.log("Check for " + userStatus + " user.")

    plyrName = capital_letter($("#name-input").val().trim().toLowerCase());

    dataRef.once('value', function(snapshot) {
        playerExists = false;

        var playerName;

        snapshot.forEach(function (childSnapShot){
            if (childSnapShot.key === plyrName) {
                    playerExists = true;  
            };
            
        });

        if (userStatus === "existing"){
            if (playerExists) {
                console.log("Looking for Existing User and it Exists")
                msg = "The " + plyrName + " user account was found.  New Game Play established";
                updatePlayerName();
                addNewMsg("BOT");
            } else {
                console.log("Looking for Existing User but it doesn't exist - so add it")
                msg = "Search for an Existing User but none found."
                addNewMsg("BOT");
                addUser();
                updatePlayerName();
            }
        } else {
            if (playerExists) {
                console.log("Looking for New User but it Exists")
                msg = "Trying to add new user: " + plyrName + " but it already exists"; 
                addNewMsg("BOT");
                updatePlayerName(); 
            } else {
                console.log("Looking for New User and it doesn't exist - so add it");
                addUser();
                updatePlayerName();
            }
        };

    });

    // Clear Information from the form
    $("#name-input").val('');

    // hide the startup inputs
    $("#startup").hide();
    // $("#new-player").hide();
    // $("#existing").hide();

    // show the player section
    $("#playerSection").show();

});

// --------------------------------------------------------------------------------------
// function to capitalize the text before putting it into the array
// Found this function on W3 schools - https://www.w3resource.com/javascript-exercises/javascript-basic-exercise-50.php
// --------------------------------------------------------------------------------------
function capital_letter(str) {
    // separate the str parameter into pieces based on the 'space' separator
    str = str.split(" ");

    // traverse the string pieces and convert the first character of each word to Upper Case and then concatenate the rest of the string.
    for (let i = 0, x = str.length; i < x; i++) {
        str[i] = str[i][0].toUpperCase() + str[i].substr(1);
    }

    // return the capitalize string put back together with the 'space' separator.
    return str.join(" ");
};
// --------------------------------------------------------------------------------------
// end of the capital_letter() function
// --------------------------------------------------------------------------------------

// Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
database.ref('/rps').on("child_added", function(childSnapshot) {
    // Log everything that's coming out of snapshot
    // console.log(childSnapshot.val().name);
    // console.log(childSnapshot.val().gameStatus);
    console.log(childSnapshot.key);
    
});

function getRadioValue() {
        var ele = $('input[name ="optradio"]'); 
          
        for(i = 0; i < ele.length; i++) { 
            if(ele[i].checked) 
            return ele[i].value; 
        } 
};

function addUser() {
    database.ref("/rps").child(plyrName).set({
        name: plyrName,
        opponent: "",
    });

    updatePlayerName();

    msg = "Added New User:  " + plyrName;
    addNewMsg("BOT"); 
};

function addNewMsg(tag) {
    // $("#msg-text").append('<p>' + tag + ':  ' + msg + '</p>')
    database.ref("/msgs").push({
        userName: tag,
        message: msg,
        dateAdded: firebase.database.ServerValue.TIMESTAMP,
    });

};

function updatePlayerName() {
    //  update the player section
    $("#player-name").text(plyrName);
};

// Firebase watcher + initial loader 
database.ref('/msgs').orderByKey().limitToLast(10).on("child_added", function(childSnapshot) {
    // console.log("At least hitting the message portion!");

        var tag =  childSnapshot.val().userName;
        var msg =  childSnapshot.val().message;
        var dtTm = childSnapshot.val().dateAdded;

        var unixFormat = "x";
        var convertedDate = moment(dtTm, unixFormat);
        
        // Create the new row
        var newRow = $("<tr>").append(
            $("<td>").text(tag),
            $("<td>").text(msg),
            $("<td>").text(convertedDate.format("MM/DD/YY hh:mm:ss")),
            );

            // Append the new row to the table
            $("#msg-table > tbody").append(newRow);
    
},// Handle the errors
    function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

