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
var dataRPS = database.ref("/rps");
var dataMSG = database.ref("/msgs");

// *****
var plyrName;
var compMsg;
var playerReady = false;
var hasOpponent = false;
var opponentName;
var playerName;
var playHand, oppHand;


$("#sub-button").on("click", function() {

    event.preventDefault();

    plyrName = capital_letter($("#name-input").val().trim().toLowerCase());

    // do we have a record in the DB yet?
    dataRPS.once('value', function(snapshot) {
        var exists = (snapshot.val() !== null);
        if (exists) {
            if (snapshot.val().opponent === "") {
             addOpponent();
             playerReady = true;
            } else {
                // add bot message that game is full 
                compMsg = "Game is Full "  + plyrName + ". But you can still chat!";
                addNewMsg("BOT", compMsg);
                playerReady = true; 
            }
        } else {      
            addUser();
            playerReady = true;
        }
    });

    // Clear Information from the form
    $("#name-input").val('');

    // hide the startup inputs
    $("#startup").hide();
    // $("#new-player").hide();
    // $("#existing").hide();

    // show the player section
    $("#playerSection").show();

    // wait for an opponent now!
});

// --------------------------------------------------------------------------------------
// function to capitalize the text before saving it.
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

// --------------------------------------------------------------------------------------
function addUser() {
    dataRPS.set({
        name: plyrName,
        opponent: "",
    });

    compMsg = "Added Player:  " + plyrName;
    addNewMsg("BOT", compMsg); 
};
// --------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------
function addOpponent() {
    dataRPS.update({
        opponent: plyrName,
    });   

    compMsg = "Added Opponent:  " + plyrName;
    addNewMsg("BOT", compMsg); 

};
// --------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------
function addNewMsg(tag, msg) {
    // $("#msg-text").append('<p>' + tag + ':  ' + msg + '</p>')
    dataMSG.push({
        userName: tag,
        message: msg,
        dateAdded: firebase.database.ServerValue.TIMESTAMP,
    });

};
// --------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------
function updatePlayerName(name) {
    //  update the player section
    $("#player-name").text(name);
    return name;
};
// --------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------
function updateOpponentName(name) {
    //  update the player section
    $("#opponent-name").text(name);
    return name;

};
// --------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------
// Firebase watcher + initial loader 
dataMSG.orderByKey().limitToLast(10).on("child_added", function(childSnapshot) {
    // console.log("At least hitting the message portion!");

        var tag =  childSnapshot.val().userName;
        var message =  childSnapshot.val().message;
        var dtTm = childSnapshot.val().dateAdded;

        var unixFormat = "x";
        var convertedDate = moment(dtTm, unixFormat);
        
        // Create the new row
        var newRow = $("<tr>").append(
            $("<td>").text(tag),
            $("<td>").text(message),
            $("<td>").text(convertedDate.format("MM/DD/YY hh:mm:ss")),
            );

            // Append the new row to the table
            $("#msg-table > tbody").append(newRow);
    
},// Handle the errors
    function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});
// --------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------
// This function handles events where the "add-msg" button is clicked  
// --------------------------------------------------------------------------------------
$("#add-msg").on("click", function(event) {
    // event.preventDefault() prevents the form from trying to submit itself.
    // using a form so that the user can hit enter instead of clicking the button if they want
    event.preventDefault();

    // This line will grab the text from the input box and trim the spaces
    var instantMessage = $("#button-input").val().trim();

    // after grabbing the information, remove it from the page 
    $("#button-input").val("");

    // can only IM if the player is signed in and ready
    if (playerReady) {
        addNewMsg(plyrName, instantMessage); 
    }

});
// --------------------------------------------------------------------------------------
// end of function triggered with the add button
// --------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------
dataRPS.on("value", function(snapshot) {
    var exists = (snapshot.val() !== null);
    if (exists) {
        playerName = updatePlayerName(snapshot.val().name);
        opponentName = updateOpponentName(snapshot.val().opponent); 
    };

    if (plyrName === playerName) {
        $("#opp-game-choice").hide();
        $("#plyr-game-choice").show();
    }
    else if (plyrName === opponentName) {
        $("#plyr-game-choice").hide();
        $("#opp-game-choice").show();
    } else {
        $("#plyr-game-choice").hide();
        $("#opp-game-choice").hide();
    }
     
});
// --------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------
$('.list-group-item').on('click', '.hand', function () { 

    var hand;
    if ($(this).hasClass('player')) {
        if ($(this).attr('id') === 'rock') {
            console.log("Rock was Chosen");
            hand = 'r';
        }
        else if ($(this).attr('id') === 'paper') {
            console.log("Paper was Chosen");
            hand = 'p';
        } 
        else if ($(this).attr('id') === 'scissor') {
            console.log("Scissor was Chosen");
            hand = 's';
        };
        // update DB with playerHand 
        dataRPS.update({
            playerHand: hand,
        });
        $("#plyr-game-choice").hide();
    }
    else if ($(this).hasClass('opponent')) {
        if ($(this).attr('id') === 'rock') {
            console.log("Rock was Chosen");
            hand = 'r';
        }
        else if ($(this).attr('id') === 'paper') {
            console.log("Paper was Chosen");
            hand = 'p';
        } 
        else if ($(this).attr('id') === 'scissor') {
            console.log("Scissor was Chosen");
            hand = 's';
        };
        // update DB with oppHand
        dataRPS.update({
            oppHand: hand,
        });
        $("#opp-game-choice").hide();
    };
    

});
// --------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------
dataRPS.on("child_added", function(snapshot) {
    console.log("child_added activated");
    // console.log(snapshot);
    if (snapshot.key === 'playerHand') {
        playHand = snapshot.val();
    }
    else if (snapshot.key === 'oppHand') { 
        oppHand = snapshot.val();
    }

    if (playHand && oppHand) {
        // game played
        console.log("A game has been played!");
        // function to determine the winner
        // add a new game button for either user to click 
        // then show\hide sections accordingly
        // update DB with just name and opponent
    }
});
// --------------------------------------------------------------------------------------


