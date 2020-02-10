# RPS-Multiplayer
Multiplayer **Rock** - **Paper** - **Scissors** Game

## Tech Used
* HTML 
* CSS
* Bootstrap
* JavaScript
* jQuery
* moment.js
* firebase 

## Contents

## Default Page - index.html
* Link directly to the page here:  https://tim-shaffer.github.io/RPS-Multiplayer/

## Instructions
1. On load of the page, enter a User Name in the space provide and hit the *submit* button.

    [Image of Default Page Screenshot](/assets/images/Player1_Start_Screen.jpg)
    
    1. Programming will decide what you are allowed to do!
        1. The first player to enter the game will be player 1 and the name will show in the appropriate area. 

        [Image of Player 1 Page Screenshot](/assets/images/Player1_Join_Screen.jpg)

        1. The second player to enter the game will be player 2 and the name will show in the appropriate area. 

        [Image of Player 2 Page Screenshot](/assets/images/Player2_Join_Screen.jpg)

        1. Only Two Players are allowed per game.
            1. Any subsequent players are added with a message that the **"Game is Full"** but that they can still chat!

    1. Each Player has a corresponding section that allows them to select **Rock**, **Paper**, or **Scissors** 
        1. Selections are noted to a database and are hidden from view until both players have made a selection

        [Image of Player 1 Select Page Screenshot](/assets/images/Player1_Select_Screen.jpg)

        [Image of Player 2 Waiting to Select Page Screenshot](/assets/images/Player2_Waiting_to_Select_Screen.jpg)

    1. When both players have made a selection, a Winner and Loser are determined.
        1. Rock smashes Scissors
        1. Paper covers Rock
        1. Scissors cut Paper
        1. Same selections are Ties.

    1. The game determines the Winner and shows the results.
        1.  With the results, either player is allowed to ask for a **"Rematch"** by clicking the rematch button.

    1. Scores are maintained for each player in their own sections.

## Special Features
1. Upon hitting the *submit* button to try to enter the game, checks are done to see if there is an **ACTIVE** game already in progress.
    1. A game is considered **ACTIVE** if there have been updates in the last 5 minutes.
    1. If there isn't an **ACTIVE** game, the database is refreshed and the user is allowed to enter as Player 1 and wait for a second player.
    1. If there is an **ACTIVE** game, the process will decide if the user becomes a player or just a *"chatter"*

    [Image of Player 3 Page Screenshot](/assets/images/Player3_Start_Screen.jpg)

1. The *"chatter*" will see the game play and the results but can not participate in the game play.

1. The **Messaging** section will show the last 10 messages.
    1. Messages are tagged with either the User Name or "BOT" (computer) to identify who created the message.
    1. A timestamp is also created and displayed for when that message occurred.
    

    
