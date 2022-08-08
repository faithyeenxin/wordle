import $ from "jquery";

//////////////////////////////////////////////////////
//// * DATA
//////////////////////////////////////////////////////
const word = "PANDA";

const gameState = {
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
  // gameRowStatus: [
  //   ["", "", "", "", ""],
  //   ["", "", "", "", ""],
  //   ["", "", "", "", ""],
  //   ["", "", "", "", ""],
  //   ["", "", "", "", ""],
  //   ["", "", "", "", ""],
  // ],
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
  gameState.gameRowStatus = [
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
  ];
  gameState.currentRow = 0;
  gameState.currentTile = 0;
};

const gameOver = (message) => {
  console.log("Game over! " + message);
  /* Game Over Modal*/
  const $modal = $(".modal_gameover");
  const $messageDisplay = $(".message_container");
  const $message = $("<p>").text(word);
  $messageDisplay.append($message);
  setTimeout(() => {
    $(".modal_title").text(message);
    $modal.addClass("modal_visible");
  }, 1000);
  const $startBtn = $(".modal_button_restart");
  $startBtn.on("click", () => {
    $message.remove();
    resetGame();
    renderGame();
    $modal.removeClass("modal_visible");
  });
};

const showIncorrect = () => {
  gameState.currentRow++;
  gameState.currentTile = 0;
  addColor();
  if (gameState.currentRow <= 5) {
    console.log("sorry please try again");
    // gameState.currentRow++;
    // gameState.currentTile = 0;
  } else {
    gameOver("You ran out of tries!");
  }
};

const showCorrect = () => {
  gameState.currentRow++;
  gameState.currentTile = 0;
  addColor();
  gameOver("You got it!");
};

const checkAnswer = () => {
  // gameState.currentRow++;
  // gameState.currentTile = 0;
  // addColor();
  gameState.gameRows[gameState.currentRow].join("") === word
    ? showCorrect()
    : showIncorrect();
};

const handleEnter = (keyLetter) => {
  gameState.currentTile === 5
    ? checkAnswer()
    : console.log("sorry please fill in 5 letter word");
};

const handleBackspace = (keyLetter) => {
  gameState.currentTile > 0
    ? gameState.currentTile-- &&
      (gameState.gameRows[gameState.currentRow][gameState.currentTile] = "")
    : console.log("sorry there is nothing to remove");
};

const addInput = (keyLetter) => {
  gameState.currentTile < 5 && gameState.currentRow < 6
    ? (gameState.gameRows[gameState.currentRow][gameState.currentTile] =
        keyLetter) && gameState.currentTile++
    : console.log("sorry you can only submit");
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

//// when there's 2 states maintained (not recommended)
// const addColor = () => {
//   gameState.gameRows[gameState.currentRow].forEach((letter, index) => {
//     console.log(letter, index);
//     console.log(word[index]);
//     if (letter === word[index]) {
//       gameState.gameRowStatus[gameState.currentRow][index] = "green_overlay";
//     } else if (word.includes(letter)) {
//       gameState.gameRowStatus[gameState.currentRow][index] = "yellow_overlay";
//     } else {
//       gameState.gameRowStatus[gameState.currentRow][index] = "grey_overlay";
//     }
//   });
//   console.log(gameState.gameRowStatus[gameState.currentRow]);
// };

const addColor = (rowIndex, tile, tileIndex) => {
  if (tile === undefined || tile === "") {
    return "";
  } else if (rowIndex < gameState.currentRow) {
    if (tile === word[tileIndex]) {
      gameState.color[tile] = "green_overlay";
      return "green_overlay";
    } else if (word.includes(tile)) {
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
        //// when there's 2 states maintained (not recommended)
        // .addClass(gameState.gameRowStatus[rowIndex][tileIndex])
        .addClass(addColor(rowIndex, tile, tileIndex))
        .text(tile);
      $row.append($tile);
    });
    $tileBoard.append($row);
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
  console.log(gameState.color);
};

const main = () => {
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

renderGame();
// main();
