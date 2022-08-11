# Developing a Wordle Game from scratch!

![](https://github.com/faithyeenxin/wordle/blob/main/gifs/wordle_start_up.gif)

## Game Description

Wordle is a word game in which the player has to guess a five-letter word in six attempts.
Each time the player makes a guess, they are told which of their chosen letters are in the target word and whether they are in the correct place or not.

## Rules of Wordle

The player has to guess a five-letter word in six attempts or less.

The word entered should exist in the dictionary.

Each time the player makes a guess, they are told which of their chosen letters are in the target word.

Feedback is given through colours:

- If letter is correct and in the correct position, tile would turn green.
- If letter is correct but in the wrong position, tile would turn orange.
- If letter does not exist in word, tile would turn gray.

## User Story

1. Upon beginning the game, a modal pop-up would appear which shows the player the instructions, name input and a start button.

2. Upon clicking the start button, the game will then start. The player can click the keyboard buttons within the web browser to play.

3. Player would have to guess the randomized 5 letter word.

4. Feedback will be given per letter basis after the player submits his word by using the “Enter” key.

5. Players would only be allowed to submit if the word entered consists of 5 letters.

- If a player tries to submit a word less than 5 letters an error modal would show to instruct him to do otherwise.
- If a player continues to type when he has already selected 5 letters he would also receive an error modal telling him to select the “Enter” key.
  ![](https://github.com/faithyeenxin/wordle/blob/main/gifs/submit_five_only.gif)

6. When “Enter” is clicked:

- If a letter exists in the word at the correct position, the tile and keyboard for that letter would light up green.
- If a letter exists but in an incorrect position, it would light up orange.
- If a letter doesn’t exist at all it would light up gray.

(the answer is Budge!)
![](https://github.com/faithyeenxin/wordle/blob/main/gifs/tile_feedback.gif)
