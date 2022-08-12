import $ from "jquery";

//////////////////////////////////////////////////////
//// * APIs
//////////////////////////////////////////////////////

let apiWords = [""];

const myAPI = (callback) => {
  console.log("my word generator API is being run");
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
  console.log("my check word API is being run");
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
        gameState.wordSynonyms = response.assoc_word;
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

const getWordMeaning = () => {
  console.log("my get word meaning API is being run");
  const settings = {
    async: true,
    crossDomain: true,
    url:
      "https://twinword-word-graph-dictionary.p.rapidapi.com/definition/?entry=" +
      gameState.word,
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "47a48209d9mshd1a13fcd7d48010p1847d4jsn5ed0867d44a8",
      "X-RapidAPI-Host": "twinword-word-graph-dictionary.p.rapidapi.com",
    },
  };

  $.ajax(settings).then(
    (response) => {
      if (response.result_msg === "Success") {
        gameState.wordMeaning = response.meaning;
      } else if (response.result_msg === "Entry word not found") {
        popUp(
          "This word has no meaning!",
          "This shouldn't be happening",
          "Close"
        );
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
  wordSynonyms: [],
  wordMeaning: {},
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
  currentRow: 0,
  currentTile: 0,
  playerName: "",
  score: 0,
  storedData: {
    name: "Faith",
    highscore: 0,
    words: [],
  },
};
//////////////////////////////////////////////////////
//// * CONSTRUCTOR FUNCTION
//////////////////////////////////////////////////////

class Word {
  constructor(name, synonyms, meaning) {
    (this.name = name), (this.synonyms = synonyms), (this.meaning = meaning);
  }
}

class Player {
  constructor(name, highscore, wordsObj) {
    (this.name = name), (this.highscore = highscore), (this.words = wordsObj);
  }
}

//////////////////////////////////////////////////////
//// * FUNCTIONS
//////////////////////////////////////////////////////

const resetGame = () => {
  (gameState.word = ""),
    (gameState.wordSynonyms = []),
    (gameState.wordMeaning = {}),
    (gameState.gameRows = [
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
    ]);
  gameState.color = {};
  gameState.currentRow = 0;
  gameState.currentTile = 0;
  gameState.word =
    apiWords[Math.floor(Math.random() * apiWords.length)].toUpperCase();
  console.log("the word is: " + gameState.word);
  renderGame();
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
          myAPI(resetGame); //ONLY SWITCH ON THIS LINE OF CODE WHEN NOT TESTING
          // resetGame();
        }
        if (buttonMessage === "Enter Valid Name") {
          $(".inputName").val("");
          renderStartModal();
        }
        if (buttonMessage === "Return to Words") {
          $modal.removeClass("modal_visible");
          $(".modal_dict").addClass("modal_visible");
        }
        $modal.removeClass("modal_visible");
      });
  }, 500);
};

const updateStoredDataWord = () => {
  // 1) collect word's synonyms + definition (use API)
  const storedWord = new Word(
    gameState.word,
    gameState.wordSynonyms,
    gameState.wordMeaning
  );
  // 2)  add word into storedData and local storage (prolly can create function that stores storedData into localStorage?)

  gameState.storedData.words.push(storedWord);

  const updatedPlayerData = new Player(
    gameState.playerName,
    gameState.storedData.highscore,
    gameState.storedData.words
  );
  localStorage.setItem(gameState.playerName, JSON.stringify(updatedPlayerData));

  console.log(JSON.parse(localStorage.getItem(gameState.playerName)));
};

const storeScore = () => {
  const userHighScore = JSON.parse(
    localStorage.getItem(gameState.playerName)
  ).highscore;
  /* update highscore if current score is higher than local storage highscore */
  if (userHighScore < gameState.score) {
    gameState.storedData.highscore = gameState.score;
    localStorage.setItem(
      gameState.playerName,
      JSON.stringify(gameState.storedData)
    );
  } else {
    /* update score state to match local storage*/
    gameState.storedData.highscore = userHighScore;
  }
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
  updateStoredDataWord(); //to work on this function!!
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

const checkUserExist = (playerName) => {
  const storedUser = localStorage.getItem(gameState.playerName);
  if (storedUser === null) {
    console.log("user does not exist and is being created");
    /* call my constructor function to create new player data */
    const newPlayerData = new Player(playerName, 0, []);
    /*save the new data created as state*/
    gameState.storedData = newPlayerData;

    /*save the new data created in local storage*/
    localStorage.setItem(
      gameState.playerName,
      JSON.stringify(gameState.storedData)
    );

    console.log(localStorage.getItem(gameState.playerName));
  } else {
    console.log("the user exists: " + storedUser);
    gameState.storedData = JSON.parse(
      localStorage.getItem(gameState.playerName)
    );
  }
};

const savePlayerName = (playerName) => {
  const lowerCasePlayerName = playerName.trim().toLowerCase();
  const reformattedPlayerName =
    lowerCasePlayerName.charAt(0).toUpperCase() + lowerCasePlayerName.slice(1);
  gameState.playerName = reformattedPlayerName;
};

const validatePlayerName = (playerName) => {
  if (playerName.trim().length !== 0) {
    /* save as state */
    savePlayerName(playerName);
    /* save to local storage */
    checkUserExist(gameState.playerName);
    renderGame();
  } else {
    popUp(
      "This is not a name!",
      "Name should not consist of all spaces",
      "Enter Valid Name"
    );
  }
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

const renderStartModal = () => {
  /* Start Game Modal */
  const $modal = $(".modal_start");
  $modal.addClass("modal_visible");
  const $startBtn = $(".modal_button_start");
  $startBtn.off();
  $startBtn.on("click", () => {
    if (apiWords.length > 0) {
      gameState.word =
        apiWords[Math.floor(Math.random() * apiWords.length)].toUpperCase();
      getWordMeaning();
      console.log("the start word is: " + gameState.word);

      $modal.removeClass("modal_visible");

      const playerName = $(".inputName").val();
      validatePlayerName(playerName);

      console.log(localStorage);
    } else {
      popUp(
        "Please hold!",
        "Randomized word is currently generating!",
        "Dismiss"
      );
    }
  });
};

const renderGuideModal = () => {
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
};

const renderDictionaryModal = () => {
  /* Dictionary Modal */
  const $dictModal = $(".modal_dict");
  const $dictBtn = $(".dictbtn");

  $dictBtn.off();
  $dictBtn.on("click", () => {
    /*add word data here!*/
    const wordsToDisplay = gameState.storedData.words.slice(-3);
    const $dictWordContainer = $(".all_words_container").empty();
    wordsToDisplay.forEach((word, index) => {
      console.log(word);
      const $wordTitle = $("<h2>").text(word.name);
      const $wordBtnContainer = $("<div>").addClass("modal_buttons");

      const $meaningBtn = $("<button>")
        .off()
        .text("Meaning")
        .addClass("meaning_button_" + index)
        .addClass("modal_button")
        .on("click", () => {
          let noun;
          let verb;
          let adverb;
          let adjective;
          let meaning;
          if (Object.keys(word.meaning).length > 0) {
            noun = word.meaning.noun.substring(0, 150) + "...";
            verb = word.meaning.verb.substring(0, 150) + "...";
            adverb = word.meaning.adverb.substring(0, 150) + "...";
            adjective = word.meaning.adjective.substring(0, 150) + "...";
            meaning = noun + verb + adverb + adjective;
          } else {
            meaning = "No meaning found in dictionary";
          }

          popUp(word.name, meaning, "Return to Words");
          $dictModal.removeClass("modal_visible");
        });
      const $synonymsBtn = $("<button>")
        .off()
        .text("Synonyms")
        .addClass("synonyms_button_" + index)
        .addClass("modal_button")
        .on("click", () => {
          popUp(word.name, word.synonyms.toString(), "Return to Words");
          $dictModal.removeClass("modal_visible");
        });
      $wordBtnContainer.append($meaningBtn).append($synonymsBtn);
      $dictWordContainer.append($wordTitle).append($wordBtnContainer);
    });

    $dictModal.addClass("modal_visible");
  });

  const $closeDictBtn = $(".modal_button_close.dict");
  $closeDictBtn.off();
  $closeDictBtn.on("click", () => {
    $dictModal.removeClass("modal_visible");
  });
};

const renderScoreModal = () => {
  /* Score Modal */
  const $scoreModal = $(".modal_score");
  const $highScore = $(".highScore");
  const $currentScore = $(".currentScore");
  const $scoreTitle = $(".modal_title.score");
  const $scoreBtn = $(".scorebtn");
  $scoreBtn.off();
  $scoreBtn.on("click", () => {
    $scoreTitle.text("Hello there " + gameState.playerName + "!");
    $highScore.text(gameState.storedData.highscore);
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

    const newPlayerData = new Player(playerName, 0, []);
    gameState.storedData = newPlayerData;
    localStorage.setItem(
      gameState.playerName,
      JSON.stringify(gameState.storedData)
    );
    gameState.score = 0;
    $highScore.text(0);
    $currentScore.text(0);
    console.log(localStorage);
  });
};

const renderPlayersHighScore = () => {
  const allPlayers = [];

  for (const player in localStorage) {
    switch (player) {
      //components in localstorage: length, clear, getItem, key, removeItem, setItem
      //>>!  i can't think of any other efficient way to exclude these
      case "length":
        break;
      case "clear":
        break;
      case "getItem":
        break;
      case "key":
        break;
      case "removeItem":
        break;
      case "setItem":
        break;
      default:
        // console.log(player);
        // console.log(
        //   "highscore: " + JSON.parse(localStorage.getItem(player)).highscore
        // );
        const newPlayer = {
          name: player,
          highscore: JSON.parse(localStorage.getItem(player)).highscore,
        };
        allPlayers.push(newPlayer);
    }
  }

  allPlayers.sort((a, b) => {
    return b.highscore - a.highscore;
  });

  // console.log(allPlayers);

  const $leaderBoardContainer = $(".player_container").empty();
  for (let i = 0; i < 3; i++) {
    if (allPlayers[i] !== undefined) {
      // console.log(allPlayers[i]);
      const $tr = $("<tr>");
      const $tdName = $("<td>").text(allPlayers[i].name);
      const $tdScore = $("<td>").text(allPlayers[i].highscore);
      $tr.append($tdName).append($tdScore);
      $leaderBoardContainer.append($tr);
    }
  }
  return $leaderBoardContainer;
};

const renderLeaderBoardModal = () => {
  /* Leaderboard Modal */
  const $leaderModal = $(".modal_leader");
  const $leaderBtn = $(".leaderbtn");
  $leaderBtn.off();
  $leaderBtn.on("click", () => {
    renderPlayersHighScore();
    $leaderModal.addClass("modal_visible");
  });

  const $closeLeaderBtn = $(".modal_button_close.leader");
  $closeLeaderBtn.off();
  $closeLeaderBtn.on("click", () => {
    $leaderModal.removeClass("modal_visible");
  });
};

const renderGame = () => {
  renderTileBoard();
  renderKeyBoard();
};

const main = () => {
  console.log("entire game is being run again");
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
      getWordMeaning();
      console.log("the start word is: " + gameState.word);
      $modal.removeClass("modal_visible");

      const playerName = $(".inputName").val();
      validatePlayerName(playerName);
      console.log(localStorage);
    } else {
      popUp(
        "Please hold!",
        "Randomized word is currently generating!",
        "Dismiss"
      );
    }
  });

  renderGuideModal();
  renderDictionaryModal();
  renderScoreModal();
  renderLeaderBoardModal();
};

main();

/* Clear local storage */
// localStorage.clear();
// console.log(localStorage);

// console.log(localStorage);
