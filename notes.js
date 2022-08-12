/* 
//////////////////////////////////////////////////////
//// * GOAL ONE
//////////////////////////////////////////////////////
// Meanings and Synonyms for last 5 words attempted!

1) to add in new key and value for words attempted (failed or not) into local storage, synonyms as list + meaning as object

- create a variable on the outside that maintains the words and add new words (max 5)

>> a good way to learn and utilize class and constructors

{ name: "Faith", password:"123",score: 0 , words:{

  "pineapple": {
    synonyms: []
    meaning: {
      "noun": " ",
      "verb":" ",
      "adverb": " ", 
      adjective: " "
    },

    "durian": {
    synonyms: []
    meaning: {
      "noun": " ",
      "verb":" ",
      "adverb": " ", 
      adjective: " "
    }
  }
}}

- upon game end, set new local value for player (if game don't end, don't add new word to list as he didn't actually complete it)

//////////////////////////////////////////////////////
//// * STEPS TO ACHIEVE GOAL ONE 
//////////////////////////////////////////////////////
1) create a constructor function that gives the blueprint of how data should be stored in local storage (done)
2) replace old code which hardcoded the creation and utilize OOP constructor function (done except store score, related to next part)
3) store the created object as state so that we have somewhere to pull down the value from 

use of Local Storage:

// ON START UP: (✅ COMPLETED)
1) name is "retrieved" using .val() 
2) check if name is allowed (no empty string, no numbers) validatePlayerName(playerName)       
3) player name is then reconfigured and saved to state using savePlayerName(playerName) 
- it reconfigures the name from all sorts of cases to Upper case first letter and lower case other letters
4) user is then checked within local storage if he exist using checkUserExist() which utilizes the game state saved name
- checkUserExist() pulls out/gets value from local storage by using the saved player name
- if user does not exist, user will be created and stored into local storage 
- if user exists, user data should be extracted and saved into state so that we can utilize it in dictionary/score board 
5) after all these steps, game is rendered

// IN SCORE MODAL: (✅ COMPLETED)-pulling data only from state and using it, unless it's the resetting of states
simple getItem utilized
1) Player Name
2) High Score 
3) Current Score 

// ON SUBMITTING OF ANSWER & GETTING CORRECT: (✅ COMPLETED)
1) handleClick() would channel "ENTER" submission to handleEnter()
2) handleEnter() would check if current submission is valid:
- check if 5 letter word entered (row tile ===5) if not show popup modal to fill up accurate no. of letters
- if is 5 letter word, it would fire function which utilizes API to checkIfWordExist(param1, param2), 
    it would take in 2 params:
    param 1: word entered (ie row taken and letters joined together for checking)
    param 2: function to run if word is indeed valid => checkAnswer()

3) when the word does exist, callback function would then execute to check if the word is correct => checkAnswer()
- if correct: execute showCorrect()
-if incorrect: execute showIncorrect()

// ON SHOW CORRECT: (✅ COMPLETED)
1) once word is correct, showCorrect() would execute and it would then execute storeScore()
2) storeScore() would retrieve the highscore saved in local storage and compare it to the current score of game,
- if local storage high score is lower than current score of game, local storage of player would be re-set. 
- if local storage high score is higher, nothing happens (update state just to be sure)

// ON RESET OF DATA:  
1) user will be removed from local storage
2) user data in local storage will all revert to original  *(!TO WORK ON!)*-to somehow utilize constructor function to create new empty player data
3) current score state within game will also be reset 


//////////////////////////////////////////////////////
//// * GOAL TWO
//////////////////////////////////////////////////////
2) displaying the last words + meaning + synonym 
- separate divs for each (meaning) & (synonyms)
- upon clicking the button, container will overlay on top which shows the meaning/synonyms 
- on closing the meaning/synonym modal it will show the "hidden" container 

// Leaderboard!
1) extracting the scores from all the users on leaderboard 
2) sorting the players based on their scores 
3) displaying only the top 5 higest score players 







//////////////////////////////////////////////////////
//// * STEPS TO ACHIEVE GOAL TWO 
//////////////////////////////////////////////////////







*/
