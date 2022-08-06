import $ from "jquery";

console.log($);

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
  gameState.currentRow = 0;
  gameState.currentTile = 0;
};

const gameOver = (message) => {
  console.log("Game over! " + message);
};

const showIncorrect = () => {
  if (gameState.currentRow < 5) {
    console.log("sorry please try again");
    gameState.currentRow++;
    gameState.currentTile = 0;
  } else {
    gameOver("You didn't get the answer correct!");
  }
};

const showCorrect = () => {
  gameOver("You got the answer correct!");
};

const checkAnswer = (keyLetter) => {
  gameState.gameRows[gameState.currentRow].join("") === word
    ? showCorrect()
    : showIncorrect();
};

const handleEnter = (keyLetter) => {
  gameState.currentTile === 5
    ? checkAnswer(keyLetter)
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
  renderTileBoard();
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
        .text(tile);
      $row.append($tile);
    });
    $tileBoard.append($row);
  });
};

const renderKeyBoard = () => {
  const $keyBoard = $(".key_container");
  gameState.keys.forEach((keyLetter) => {
    const $key = $("<button>");
    $key
      .text(keyLetter)
      .attr("id", keyLetter)
      .on("click", () => {
        handleClick(keyLetter);
      });
    $keyBoard.append($key);
  });
};

const renderGame = () => {
  renderTileBoard();
  renderKeyBoard();
};

const main = () => {
  /* Start Game Modal */
  const $modal = $(".modal");
  const $startBtn = $(".modal_button");

  window.onload = (event) => {
    setTimeout(() => {
      $modal.addClass("modal_visible");
    }, 1000);
  };

  $startBtn.on("click", () => {
    $modal.removeClass("modal_visible");
  });
};

renderGame();
