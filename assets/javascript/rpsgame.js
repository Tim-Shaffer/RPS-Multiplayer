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

//  global variables for player information
var play1Name, play2Name;
var play1Hand, play2Hand;
var isPlay1 = false;
var isPlay2 = false;

// --------------------------------------------------------------------------------------
$("#sub-button").on("click", function() {

    event.preventDefault();

    plyrName = capital_letter($("#name-input").val().trim().toLowerCase());

    // do we have a record in the DB yet?
    dataRPS.once('value', function(snapshot) {
        var exists = (snapshot.val() !== null);
        if (exists) {
            if (snapshot.val().play2Name === "") {
             addPlay2();
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

    // wait for an Play2 now!
});
// --------------------------------------------------------------------------------------

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
        play1Name: plyrName,
        play2Name: "",
    });

    compMsg = "Added Player 1:  " + plyrName;
    addNewMsg("BOT", compMsg); 
};
// --------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------
function addPlay2() {
    dataRPS.update({
        play2Name: plyrName,
    });   

    compMsg = "Added Player 2:  " + plyrName;
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
//  function to display the name of player 1
// --------------------------------------------------------------------------------------
function updatePlay1Name(name) {
    //  update the player section
    $("#play1-name").text(name);
    return name;
};
// --------------------------------------------------------------------------------------
//  end of updatePlay1Name() function
// --------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------
//  function to display the name of player 2
// --------------------------------------------------------------------------------------
function updatePlay2Name(name) {
    //  update the player section
    $("#play2-name").text(name);
    return name;

};
// --------------------------------------------------------------------------------------
//  end of updatePlay2Name() function
// --------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------
//  This function handles events where the "hand" class is clicked  
// --------------------------------------------------------------------------------------
$('.list-group-item').on('click', '.hand', function () { 

    // establish a local variable to contain the selected hand 
    var hand;

    // update the hand to the option selected
    if ($(this).hasClass('play1')) {

        // play1 selection
        if ($(this).attr('id') === 'rock') {
            hand = 'r';
        }
        else if ($(this).attr('id') === 'paper') {
            hand = 'p';
        } 
        else if ($(this).attr('id') === 'scissor') {
            hand = 's';
        };

        // update DB with play1Hand 
        dataRPS.update({
            play1Hand: hand,
        });

        // hide the section because a choice was already made and processed
        $("#plyr-game-choice").hide();

    }
    else if ($(this).hasClass('play2')) {

        // play2 selection
        if ($(this).attr('id') === 'rock') {
            hand = 'r';
        }
        else if ($(this).attr('id') === 'paper') {
            hand = 'p';
        } 
        else if ($(this).attr('id') === 'scissor') {
            hand = 's';
        };
        // update DB with oppHand
        dataRPS.update({
            oppHand: hand,
        });

        // hide the section because a choice was already made and processed
        $("#opp-game-choice").hide();
    };    
    
});
// --------------------------------------------------------------------------------------
// end of function triggered with the click of the .hand class
// --------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------
//  firebase event listener to be triggerred on the 'value' updates of the /rps folder
// --------------------------------------------------------------------------------------
dataRPS.on("value", function(snapshot) {

    // verify that there is an actual snapshot to be able to get values from
    var exists = (snapshot.val() !== null);

    // if there is a snapshot, update the screen and variables with the information
    if (exists) {
        play1Name = updatePlay1Name(snapshot.val().play1Name);
        play2Name = updatePlay2Name(snapshot.val().play2Name); 
    };

    // Check which player this device is associated to 
    if (plyrName === play1Name) {
        
        // hide the play2 section of choices
        $("#play2-game-choice").hide();
        // show the play1 section of choices
        $("#play1-game-choice").show();
        // set booleans for the players
        isPlay1 = true;
        isPlay2 = false;

    } 
    // player 2 
    else if (plyrName === play2Name) {
        
        // hide the play1 section of choices
        $("#play1-game-choice").hide();
        // show the play2 section of choices
        $("#play2-game-choice").show();
        // set booleans for the players
        isPlay2 = true;
        isPlay1 = false;


    } 
    // this session is just a bystander 
    else {
        
        // hide the play1 section of choices
        $("#play1-game-choice").hide();
        // hide the play2 section of choices
        $("#play2-game-choice").hide();
        // set booleans for the players
        isPlay1 = false;
        isPlay2 = false;

    };
     
});
// --------------------------------------------------------------------------------------
//  end of firebase event listener
// --------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------
//  firebase event listener to be triggerred on the 'child_added' updates of the /rps folder
// --------------------------------------------------------------------------------------
dataRPS.on("child_added", function(snapshot) {
    
    console.log("child_added activated");
    // console.log(snapshot);
    // determine which child was added to proceed
    if (snapshot.key === 'play1Hand') {
        // update for player one selection
        play1Hand = snapshot.val();
    }
    else if (snapshot.key === 'play2Hand') {
        // update for player two selection 
        play2Hand = snapshot.val();
    };

    // decide the game when both players have selected their hands
    if (play1Hand && play2Hand) {
        // game played
        console.log("A game has been played!");
        // function to determine the winner
        // add a new game button for either user to click 
        // then show\hide sections accordingly
        // update DB with just name and play2
    };

});
// --------------------------------------------------------------------------------------
//  end of firebase event listener
// --------------------------------------------------------------------------------------

//  Instant Message functionality below here: 

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
//  firebase event listener to grab the last 10 messages when a child message is added
// --------------------------------------------------------------------------------------
dataMSG.orderByKey().limitToLast(10).on("child_added", function(childSnapshot) {

        // local variables to hold database values to display
        var tag =  childSnapshot.val().userName;
        var message =  childSnapshot.val().message;
        var dtTm = childSnapshot.val().dateAdded;

        // variables to convert the date into a more readable format
        var unixFormat = "x";
        var convertedDate = moment(dtTm, unixFormat);
        
        // Create the new row of messages to display
        var newRow = $("<tr>").append(
            $("<td>").text(tag),
            $("<td>").text(message),
            $("<td>").text(convertedDate.format("MM/DD/YY hh:mm:ss")),
            );

            // Append the new row to the table
            $("#msg-table > tbody").append(newRow);
    
},
// Handle the errors
    function(errorObject) {
    console.log("Errors handled: " + errorObject.code);

});
// --------------------------------------------------------------------------------------
//  end of firebase event listener
// --------------------------------------------------------------------------------------


