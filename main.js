import $ from "jquery";

//////////////////////////////////////////////////////
//// * APIs
//////////////////////////////////////////////////////

let apiWords = [""];
const myAPI = (callback) => {
  const settings = {
    async: true,
    crossDomain: true,
    url: "https://random-words5.p.rapidapi.com/getMultipleRandom?count=5&wordLength=5",
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "47a48209d9mshd1a13fcd7d48010p1847d4jsn5ed0867d44a8",
      "X-RapidAPI-Host": "random-words5.p.rapidapi.com",
    },
  };

  $.ajax(settings).then(
    (response) => {
      apiWords = response;
      if (typeof callback === "function") {
        callback();
      }
    },
    (error) => {
      console.log(error);
    }
  );
};

const checkIfWordExist = (word, callback) => {
  const settings = {
    async: true,
    crossDomain: true,
    url:
      "https://twinword-word-graph-dictionary.p.rapidapi.com/association/?entry=" +
      word,
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "47a48209d9mshd1a13fcd7d48010p1847d4jsn5ed0867d44a8",
      "X-RapidAPI-Host": "twinword-word-graph-dictionary.p.rapidapi.com",
    },
  };

  $.ajax(settings).then(
    (response) => {
      if (response.result_msg === "Success") {
        if (typeof callback === "function") {
          callback();
          renderGame();
        }
      } else if (response.result_msg === "Entry word not found") {
        popUp("This word does not exist!", "Please resubmit!", "Resubmit");
      }
    },
    (error) => {
      console.log(error);
    }
  );
};

//////////////////////////////////////////////////////
//// * STATE
//////////////////////////////////////////////////////

const gameState = {
  word: "",
  keys: [
    "Q",
    "W",
    "E",
    "R",
    "T",
    "Y",
    "U",
    "I",
    "O",
    "P",
    "A",
    "S",
    "D",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
    "ENTER",
    "Z",
    "X",
    "C",
    "V",
    "B",
    "N",
    "M",
    "«",
  ],
  gameRows: [
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
  ],
  color: {
    letter: "green_overlay",
  },
  playerName: "",
  currentRow: 0,
  currentTile: 0,
  score: 0,
};

//////////////////////////////////////////////////////
//// * FUNCTIONS
//////////////////////////////////////////////////////

const resetGame = () => {
  gameState.gameRows = [
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
  ];
  gameState.color = {};
  gameState.currentRow = 0;
  gameState.currentTile = 0;
  gameState.word =
    apiWords[Math.floor(Math.random() * apiWords.length)].toUpperCase();
  console.log("the word is: " + gameState.word);
  renderGame();
};

const storeScore = () => {
  const userHighScore = JSON.parse(
    localStorage.getItem(gameState.playerName)
  ).score;
  if (userHighScore < gameState.score) {
    localStorage.setItem(
      gameState.playerName,
      JSON.stringify({ name: gameState.playerName, score: gameState.score })
    );
    const highScore = JSON.parse(
      localStorage.getItem(gameState.playerName)
    ).score;
    console.log("Your highscore is " + highScore);
    console.log("Your current score is " + gameState.score);
  } else {
    const highScore = JSON.parse(
      localStorage.getItem(gameState.playerName)
    ).score;
    console.log("Your highscore is " + highScore);
    console.log("Your current score is " + gameState.score);
  }
};

const checkUserExist = () => {
  const storedUser = localStorage.getItem(gameState.playerName);

  if (storedUser === null) {
    console.log("user does not exist and has been created");
    localStorage.setItem(
      gameState.playerName,
      JSON.stringify({ name: gameState.playerName, score: gameState.score })
    );
  } else {
    console.log("the user exists: " + storedUser);
  }
};

const popUp = (title, descrip, buttonMessage) => {
  const $messageDisplay = $(".message_container");
  const $message = $("<p>").text(gameState.word);
  /* Diplay Correct Word */
  if (buttonMessage === "Replay") {
    $messageDisplay.append($message);
  }

  /* Game Over Modal*/
  const $modal = $(".modal_popup");
  setTimeout(() => {
    $(".modal_title.popup").text(title);
    $(".modal_message.popup").text(descrip);
    $modal.addClass("modal_visible");
    $(".modal_button_restart")
      .off()
      .text(buttonMessage)
      .on("click", () => {
        $message.remove();
        if (buttonMessage === "Replay") {
          // myAPI(resetGame); //ONLY SWITCH ON THIS LINE OF CODE WHEN NOT TESTING
          resetGame();
        }
        $modal.removeClass("modal_visible");
      });
  }, 500);
};

const showIncorrect = () => {
  gameState.currentRow++;
  gameState.currentTile = 0;
  addColor();
  if (gameState.currentRow <= 5) {
    popUp("Oh No!", "You got it wrong!", "Try Again");
  } else {
    popUp("You ran out of tries!", "Would you like to play again?", "Replay");
  }
};

const showCorrect = () => {
  gameState.currentRow++;
  gameState.currentTile = 0;
  gameState.score++;
  storeScore();
  addColor();
  popUp("You got it!", "Would you like to play again?", "Replay");
};

const checkAnswer = () => {
  gameState.gameRows[gameState.currentRow].join("") === gameState.word
    ? showCorrect()
    : showIncorrect();
};

const handleEnter = (keyLetter) => {
  gameState.currentTile === 5
    ? checkIfWordExist(
        gameState.gameRows[gameState.currentRow].join(""),
        checkAnswer
      )
    : popUp("Oh No!", "Please fill up a 5 letter word!", "Continue");
  renderGame();
};

const handleBackspace = (keyLetter) => {
  gameState.currentTile > 0
    ? gameState.currentTile-- &&
      (gameState.gameRows[gameState.currentRow][gameState.currentTile] = "")
    : popUp("Oh No!", "There's nothing to remove!", "Continue");
};

const addInput = (keyLetter) => {
  gameState.currentTile < 5 && gameState.currentRow < 6
    ? (gameState.gameRows[gameState.currentRow][gameState.currentTile] =
        keyLetter) && gameState.currentTile++
    : popUp(
        "You can't add more letters!",
        "Please click the Enter Button to submit!",
        "Continue"
      );
};

const handleClick = (keyLetter) => {
  if (keyLetter === "ENTER") {
    handleEnter(keyLetter);
  } else if (keyLetter === "«") {
    handleBackspace(keyLetter);
  } else {
    addInput(keyLetter);
  }
  renderGame();
};

const addColor = (rowIndex, tile, tileIndex) => {
  if (tile === undefined || tile === "") {
    return "";
  } else if (rowIndex < gameState.currentRow) {
    if (tile === gameState.word[tileIndex]) {
      gameState.color[tile] = "green_overlay";
      return "green_overlay";
    } else if (gameState.word.includes(tile)) {
      gameState.color[tile] = "yellow_overlay";
      return "yellow_overlay";
    } else {
      gameState.color[tile] = "grey_overlay";
      return "grey_overlay";
    }
  } else {
    return "";
  }
};

const addKeyColor = (keyLetter) => {
  for (const letter in gameState.color) {
    if (letter === keyLetter) {
      return gameState.color[letter];
    }
  }
};

const savePlayerName = (playerName) => {
  //figure out why local storage is saving this entire code lol
  const lowerCasePlayerName = playerName.toLowerCase();
  const reformattedPlayerName =
    lowerCasePlayerName.charAt(0).toUpperCase() + lowerCasePlayerName.slice(1);
  gameState.playerName = reformattedPlayerName;
};

//////////////////////////////////////////////////////
//// * RENDERING
//////////////////////////////////////////////////////

const renderTileBoard = () => {
  const $tileBoard = $(".tile_container").empty();
  gameState.gameRows.forEach((row, rowIndex) => {
    const $row = $("<div>");
    $row.attr("id", "row_" + rowIndex);
    row.forEach((tile, tileIndex) => {
      const $tile = $("<div>");
      $tile
        .attr("id", "row_" + rowIndex + "_tile_" + tileIndex)
        .addClass("tile")
        .addClass(addColor(rowIndex, tile, tileIndex))
        .text(tile);
      $row.append($tile);
      $tileBoard.append($row);
    });
  });
};

const renderKeyBoard = () => {
  const $keyBoard = $(".key_container").empty();
  gameState.keys.forEach((keyLetter) => {
    const $key = $("<button>");
    $key
      .text(keyLetter)
      .attr("id", keyLetter)
      .on("click", () => {
        handleClick(keyLetter);
      })
      .addClass(addKeyColor(keyLetter));
    $keyBoard.append($key);
  });
};

const renderGame = () => {
  renderTileBoard();
  renderKeyBoard();
};

const main = () => {
  console.log(localStorage);
  gameState.playerName = "";
  myAPI();

  /* Start Game Modal */
  const $modal = $(".modal_start");
  window.onload = () => {
    setTimeout(() => {
      $modal.addClass("modal_visible");
    }, 800);
  };

  const $startBtn = $(".modal_button_start");
  $startBtn.off();
  $startBtn.on("click", () => {
    if (apiWords.length > 0) {
      gameState.word =
        apiWords[Math.floor(Math.random() * apiWords.length)].toUpperCase();
      console.log("the start word is: " + gameState.word);
      $modal.removeClass("modal_visible");

      const playerName = $(".inputName").val();
      savePlayerName(playerName);
      checkUserExist();
      renderGame();
      console.log(localStorage);
    } else {
      popUp(
        "Please hold!",
        "Randomized word is currently generating!",
        "Dismiss"
      );
    }
  });

  /* Guide Modal */
  const $guideModal = $(".modal_guide");
  const $guideBtn = $(".guidebtn");
  $guideBtn.off();
  $guideBtn.on("click", () => {
    $guideModal.addClass("modal_visible");
  });

  const $closePopupBtn = $(".modal_button_close.guide");
  $closePopupBtn.off();
  $closePopupBtn.on("click", () => {
    $guideModal.removeClass("modal_visible");
  });

  /* Score Modal */
  const $scoreModal = $(".modal_score");
  const $highScore = $(".highScore");
  const $currentScore = $(".currentScore");
  const $scoreTitle = $(".modal_title.score");
  const $scoreBtn = $(".scorebtn");
  $scoreBtn.off();
  $scoreBtn.on("click", () => {
    $scoreTitle.text(
      "Hello there " +
        JSON.parse(localStorage.getItem(gameState.playerName)).name +
        "!"
    );
    $highScore.text(
      JSON.parse(localStorage.getItem(gameState.playerName)).score
    );
    $currentScore.text(gameState.score);
    $scoreModal.addClass("modal_visible");
  });
  const $closeScoreBtn = $(".modal_button_close.score");
  $closeScoreBtn.off();
  $closeScoreBtn.on("click", () => {
    $scoreModal.removeClass("modal_visible");
  });

  const $resetScoreBtn = $(".modal_button_reset.score");
  $resetScoreBtn.off();
  $resetScoreBtn.on("click", () => {
    localStorage.removeItem(gameState.playerName);
    localStorage.setItem(
      gameState.playerName,
      JSON.stringify({ name: gameState.playerName, score: 0 })
    );
    gameState.score = 0;
    $highScore.text(0);
    $currentScore.text(0);
    console.log(localStorage);
  });
};

main();
