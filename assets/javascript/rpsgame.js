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

$("#sub-button").on("click", function() {

    event.preventDefault();

    var plyrName = capital_letter($("#name-input").val().trim().toLowerCase());


    database.ref("/rps").once('value', function(snapshot) {
        // if exists, get information 
        var playerExists = false;
        snapshot.forEach(function (childSnapShot){
            var playerName = (childSnapShot.val() && childSnapShot.val().name) || 'Anonymous' 
            if (playerName === plyrName) {
                playerExists = true;    
            }
        });

        if (!playerExists) {
        // create a new entry

            database.ref("/rps").push({
                name: plyrName,
                gameStatus: "waiting",
            });
        };

    });

    // Clear Information from the form
    $("#name-input").val('');

    // hide the Form
    $("#new-player").hide();

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


