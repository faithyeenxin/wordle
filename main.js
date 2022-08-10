import $ from "jquery";

//////////////////////////////////////////////////////
//// * DATA
//////////////////////////////////////////////////////
const listOfWords = [
  "panda",
  "usual",
  "actor",
  "daddy",
  "haunt",
  "lover",
  "claim",
  "media",
  "toady",
  "build",
  "guest",
  "straw",
  "canal",
  "legal",
  "exert",
  "chest",
  "earth",
  "reply",
  "front",
  "trust",
];

const gameState = {
  word: listOfWords[
    Math.floor(Math.random() * listOfWords.length)
  ].toUpperCase(),
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
    listOfWords[Math.floor(Math.random() * listOfWords.length)].toUpperCase();
  console.log(gameState.word);
};

const popUp = (title, descrip, buttonMessage) => {
  console.log("button message was: " + buttonMessage);
  const $messageDisplay = $(".message_container");
  const $message = $("<p>").text(gameState.word);
  /* Diplay Correct Word */
  if (buttonMessage === "Replay") {
    $messageDisplay.append($message);
  }

  /* Game Over Modal*/
  const $modal = $(".modal_popup");
  setTimeout(() => {
    $(".modal_title").text(title);
    $(".modal_message").text(descrip);
    $modal.addClass("modal_visible");
    $(".modal_button_restart")
      .off()
      .text(buttonMessage)
      .on("click", () => {
        console.log("button clicked was: " + buttonMessage);
        $message.remove();
        if (buttonMessage === "Replay") {
          resetGame();
          renderGame();
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
    console.log("try again was entered");
    popUp("Oh No!", "You got it wrong!", "Try Again");
  } else {
    console.log("replay was entered cos ran out of tries");
    popUp("You ran out of tries!", "Would you like to play again?", "Replay");
  }
};

const showCorrect = () => {
  gameState.currentRow++;
  gameState.currentTile = 0;
  addColor();
  console.log("replay was entered cos show correct");
  popUp("You got it!", "Would you like to play again?", "Replay");
};

const checkAnswer = () => {
  gameState.gameRows[gameState.currentRow].join("") === gameState.word
    ? showCorrect()
    : showIncorrect();
};

const handleEnter = (keyLetter) => {
  gameState.currentTile === 5
    ? checkAnswer()
    : popUp("Oh No!", "Please fill up a 5 letter word!", "Continue");
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
  renderGame();
  console.log(gameState.word);
  /* Start Game Modal */
  const $modal = $(".modal_start");
  window.onload = () => {
    setTimeout(() => {
      $modal.addClass("modal_visible");
    }, 800);
  };

  const $startBtn = $(".modal_button_start");
  $startBtn.on("click", () => {
    $modal.removeClass("modal_visible");
  });
};

main();
