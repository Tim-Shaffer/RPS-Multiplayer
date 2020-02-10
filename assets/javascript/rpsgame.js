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
// Create a variable to the game reference
var dataRPS = database.ref("/rps");
// Create a variable to the msgs reference
var dataMSG = database.ref("/msgs");

// Global variables for current session information
var plyrName;
var compMsg;
var playerReady = false;

//  global variables for specific player information
var play1Name, play2Name;
var play1Hand, play2Hand;
var isPlay1 = false;
var isPlay2 = false;
var isPlay1ChoiceMade = false;
var isPlay2ChoiceMade = false;

// global variables to maintain player 1 statistics
var win = 0;
var loss = 0;
var tie = 0;

// --------------------------------------------------------------------------------------
//  event listener for the submit button to add a new player to the current game
// --------------------------------------------------------------------------------------
$("#sub-button").on("click", function() {

    // prevent the form from trying to submit itself
    event.preventDefault();

    // set the global plyrName variable equal to the Name that was entered
    plyrName = capital_letter($("#name-input").val().trim().toLowerCase());

    // do we have a record in the DB yet?
    dataRPS.once('value', function(snapshot) {

        // set the exists variable according to whether there is a record in the DB
        var exists = (snapshot.val() !== null);
        
        // if a record exists, this is not the first entry 
        if (exists) {
            // see if there is an entry or the default for player 2
            if (snapshot.val().play2Name === "") {
                
                // add the new name to player 2 in the DB
                addPlay(2);
                // set the player as ready to play or chat
                playerReady = true;

            } 
            //  already an entry in player 2 so game is full
            else {
                
                // add message that game is full 
                compMsg = "Game is Full "  + plyrName + ". But you can still chat!";
                addNewMsg("BOT", compMsg);
                // allow user to monitor game play and message in the chat
                playerReady = true; 

            };
        } 
        //  record doesn't exist so this will be player 1 
        else { 
            
            // add the new name to player 1 in the DB
            addPlay(1);
            // set the player as ready to play or chat
            playerReady = true;
        }
    });

    // Clear Information from the form
    $("#name-input").val('');

    // hide the startup inputs
    $("#startup").hide();

    // show the player section
    $("#playerSection").show();

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
// function addUser() {
//     dataRPS.set({
//         play1Name: plyrName,
//         play2Name: "",
//     });

//     compMsg = "Added Player 1:  " + plyrName;
//     addNewMsg("BOT", compMsg); 
// };
// --------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------
//  function to add current player name into the correct DB field
//  Parameter values:
//  int - an integer to identify what player is being updated
//      1 - (default) - update player 1 
//      2 - update player 2
// --------------------------------------------------------------------------------------
function addPlay(int=1) {

    // update player 2 information
    if (int === 2) {
       
        dataRPS.update({
            play2Name: plyrName,
        });   

        compMsg = "Added Player 2:  " + plyrName;
        addNewMsg("BOT", compMsg); 

    } 
    // update player 1 information - (default)
    else { 

        dataRPS.set({
            play1Name: plyrName,
            // default player 2 while waiting for another player
            play2Name: "",
        });
    
        compMsg = "Added Player 1:  " + plyrName;
        addNewMsg("BOT", compMsg); 

    }

};
// --------------------------------------------------------------------------------------
//  end of addPlay() function
// --------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------
//  function to display the name of the player in the correct location
//  Parameter values:
//  name - the name as input by the user
//  int - an integer to identify what player is being updated
//      1 - (default) - update player 1 
//      2 - update player 2
// --------------------------------------------------------------------------------------
function updatePlayName(name, int=1) {

    // update player 2 section
    if (int === 2) {

        $("#play2-name").text(name);

    } 
    // update player 1 section - (default)
    else {
    
        $("#play1-name").text(name);
    
    };

    // return the name to be stored in a global variable
    return name;

};
// --------------------------------------------------------------------------------------
//  end of updatePlayName() function
// --------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------
//  function to display the name of player 2
// --------------------------------------------------------------------------------------
// function updatePlay2Name(name) {
//     //  update the player section
//     $("#play2-name").text(name);
//     return name;

// };
// --------------------------------------------------------------------------------------
//  end of updatePlay2Name() function
// --------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------
//  This function handles events where the "hand" class is clicked  
// --------------------------------------------------------------------------------------
$('.list-group-item').on('click', '.hand', function () { 

    // establish a local variable to contain the selected hand 
    var hand;

    // update the hand to the option selected based on player 1 class
    if ($(this).hasClass('play1')) {

        // play1 selection
        if ($(this).attr('id') === 'rock') {
            hand = 'Rock';
        }
        else if ($(this).attr('id') === 'paper') {
            hand = 'Paper';
        } 
        else if ($(this).attr('id') === 'scissor') {
            hand = 'Scissor';
        };

        // update DB with play1Hand 
        dataRPS.update({
            play1Hand: hand,
        });

        // hide the section because a choice was already made and processed
        $("#play1-game-choice").hide();

    }
    // update the hand to the option selected based on player 2 class
    else if ($(this).hasClass('play2')) {

        // play2 selection
        if ($(this).attr('id') === 'rock') {
            hand = 'Rock';
        }
        else if ($(this).attr('id') === 'paper') {
            hand = 'Paper';
        } 
        else if ($(this).attr('id') === 'scissor') {
            hand = 'Scissor';
        };
        // update DB with play2Hand
        dataRPS.update({
            play2Hand: hand,
        });

        // hide the section because a choice was already made and processed
        $("#play2-game-choice").hide();
    };    

    // remove the "rematchSelected" field from the DB to note players are making selections on the game
    dataRPS.child("rematchSelected").remove();
    
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
        play1Name = updatePlayName(snapshot.val().play1Name, 1);
        play2Name = updatePlayName(snapshot.val().play2Name, 2); 
    };

    // Check which player this device is associated with
    if (plyrName === play1Name) {

        // current player is #1 but hasn't made a selection
        if (!isPlay1ChoiceMade) {

            // hide the play2 section of choices
            $("#play2-game-choice").hide();
            // show the play1 section of choices
            $("#play1-game-choice").show();
            // set booleans for the local player
            isPlay1 = true;
            isPlay2 = false;
            
            // hide the rematch button
            $("#rematch").hide();

        };

    } 
    // current player is #2 
    else if (plyrName === play2Name) {

        // player 2 hasn't made a choice yet
        if (!isPlay2ChoiceMade) {
        
            // hide the play1 section of choices
            $("#play1-game-choice").hide();
            // show the play2 section of choices
            $("#play2-game-choice").show();
            // set booleans for the local player
            isPlay2 = true;
            isPlay1 = false;

            // hide the rematch button
            $("#rematch").hide();
        
        };

    } 
    // this session is just a bystander 
    else {
        
        // hide the play1 section of choices
        $("#play1-game-choice").hide();

        // hide the play2 section of choices
        $("#play2-game-choice").hide();

        // hide the results 
        // $("#play1-score").hide();
        // $("#play2-score").hide();
        // $("#results-space").hide();

        // set booleans for the players
        isPlay1 = false;
        isPlay2 = false;

        // hide the rematch button
        $("#rematch").hide();

    };
     
});
// --------------------------------------------------------------------------------------
//  end of firebase event listener
// --------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------
//  firebase event listener to be triggerred on the 'child_added' updates of the /rps folder
// --------------------------------------------------------------------------------------
dataRPS.on("child_added", function(snapshot) {

    // determine which child was added to proceed
    if (snapshot.key === 'play1Hand') {
        // update for player one selection
        play1Hand = snapshot.val();
        playChoice(1);
    }
    else if (snapshot.key === 'play2Hand') {
        // update for player two selection 
        play2Hand = snapshot.val();
        playChoice(2);
    } else if (snapshot.key === 'rematchSelected') {
        $("#rematch").hide();
        $("#play1-hand").text("Player 1 Hand");
        $("#play1-hand").removeClass("btn-success");
        $("#play1-hand").removeClass("btn-danger");
        $("#play1-hand").removeClass("btn-secondary")
        isPlay1ChoiceMade = false;
        play1Hand = "";

        $("#play2-hand").text("Player 2 Hand");
        $("#play2-hand").removeClass("btn-success");
        $("#play2-hand").removeClass("btn-danger"); 
        $("#play2-hand").removeClass("btn-secondary")
        isPlay2ChoiceMade = false; 
        play2Hand = "";

    };

    // decide the game when both players have selected their hands
    if (play1Hand && play2Hand) {
        
        // function to determine the winner
        playGame();

    };

});
// --------------------------------------------------------------------------------------
//  end of firebase event listener
// --------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------
//  function to reflect that the player has made a selection but not have it shown until the other player chooses
//  Parameter values:
//  int - an integer to identify what player is being updated
//      1 - (default) - update player 1 
//      2 - update player 2
// --------------------------------------------------------------------------------------
function playChoice(int=1) {

    // update that player 2 has made a choice
    if (int === 2) {

        $("#play2-hand").addClass("btn-secondary").text("???");
        isPlay2ChoiceMade = true;

    }
    //  update that player 1 has made a choice - (default)
    else {

        $("#play1-hand").addClass("btn-secondary").text("???");
        isPlay1ChoiceMade = true;
    }

};
// --------------------------------------------------------------------------------------
//  end of playChoice() function
// --------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------
// This function handles events where the "rematch" button is clicked  
// --------------------------------------------------------------------------------------
$("#rematch").on("click", function() {
    
    // remove player 1 selection from the DB
    dataRPS.child("play1Hand").remove();

    // remove player 2 selection from the DB
    dataRPS.child("play2Hand").remove();

    //  set DB for a rematch
    setRematch();

});
// --------------------------------------------------------------------------------------
// end of function triggered with the rematch button
// --------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------
//  function to set that a rematch has been selected
// --------------------------------------------------------------------------------------
function setRematch() {

    // update DB to reflect a rematch was selected to allow "child-added" listener to update for both players 
    dataRPS.update({
        rematchSelected: true,
    });

    // make the choices available for the active player of the current session
    if (isPlay1) {
        $("#play1-game-choice").show();
        
    } 
    else if (isPlay2) {
        $("#play2-game-choice").show();     
        
    };

};
// --------------------------------------------------------------------------------------
//  end of setRematch() function
// --------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------
//  function to determine the results of a game 
//  - results are tied to player 1 choices
//  - player 2 results are just the opposite of player 1
// --------------------------------------------------------------------------------------
function playGame() {

    // show the hands selected
    $("#play1-hand").text(play1Hand);
    $("#play2-hand").text(play2Hand);

    // Check for ties first 
    if (play1Hand === play2Hand) {
        tie++;
    } 
    // Player 1 chose Rock 
    else if (play1Hand === "Rock") {
    
        // Rock beats Scissors
        if (play2Hand === "Scissor"){
            win++;
            $("#play1-hand").addClass("btn-success");
            $("#play2-hand").addClass("btn-danger");
        // Rock loses to Paper
        } 
        else {
            loss++;
            $("#play2-hand").addClass("btn-success");
            $("#play1-hand").addClass("btn-danger");
        }
    }
    // Player 1 chose Paper
    else if (play1Hand === "Paper") {
        // Paper beats Rock
        if (play2Hand === "Rock"){
            win++;
            $("#play1-hand").addClass("btn-success");
            $("#play2-hand").addClass("btn-danger");
        // Paper loses to Scissors
        } else {
            loss++;
            $("#play2-hand").addClass("btn-success");
            $("#play1-hand").addClass("btn-danger");
        }
    } 
    // Player 1 chose Scissors
    else if (play1Hand === "Scissor") {
        // Scissors beat Paper
        if (play2Hand === "Paper"){
            win++;
            $("#play1-hand").addClass("btn-success");
            $("#play2-hand").addClass("btn-danger");
        // Scissors lose to Rock
        } else {
            loss++;
            $("#play2-hand").addClass("btn-success");
            $("#play1-hand").addClass("btn-danger");
        }
    };
    
    // player 1 Score is being held in the variables
    $("#play1-win").text(win);
    $("#play1-loss").text(loss);
    $("#play1-tie").text(tie);

    // player 2 Score is the opposite of player 1 score   
    $("#play2-win").text(loss);
    $("#play2-loss").text(win);
    $("#play2-tie").text(tie);

    // show the button to allow a rematch to be requested.
    $("#rematch").show();

};
// --------------------------------------------------------------------------------------
//   end of playGame() function
// --------------------------------------------------------------------------------------

//  Instant Message functionality below here: 

// --------------------------------------------------------------------------------------
//  function to add messages to the msg reference in the DB
// --------------------------------------------------------------------------------------
function addNewMsg(tag, msg) {
    
    dataMSG.push({
        userName: tag,
        message: msg,
        dateAdded: firebase.database.ServerValue.TIMESTAMP,
    });

};
// --------------------------------------------------------------------------------------
//  end of addNewMsg() function
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


