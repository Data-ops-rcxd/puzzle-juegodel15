//Piece function class.
var Piece = function (value, rigthPosX, rigthPosY, posX, posY) {
  this.value = value;
  this.isRigthPosition = false;
  this.posX = posX;
  this.posY = posY;
  this.rigthPosX = rigthPosX;
  this.rigthPosY = rigthPosY;
};

//Sorts the created array.
function RandomSort(array) {
  var length = array.length;
  var aux, randomPos;

  for (var i = 0; i < length; i++) {
    randomPos = i + Math.floor(Math.random() * (length - i));
    aux = array[i];
    array[i] = array[randomPos];
    array[randomPos] = aux;
  }

  return array;
}

//Game function class (all logic here).
var Game = function () {
  this.isWrongCount = 0;
  this.piecesArray = [];

  //Initialize the game and creates the array
  this.initializeGame = function () {
    let rArray = Array.from({ length: 15 }, (_, i) => i + 1);
    RandomSort(rArray);

    do {
      rArray = RandomSort(rArray);
    } while (!this.isSolvable(rArray));

    for (let i = 0; i < 15; i++) {
      const pieceNumber = i + 1;
      const posX = Math.floor(i / 4) + 1;
      const posY = (i % 4) + 1;
      const rigthPosX = Math.floor((rArray[i] - 1) / 4) + 1;
      const rigthPosY = ((rArray[i] - 1) % 4) + 1;

      const isCorrectPosition = posX === rigthPosX && posY === rigthPosY;

      this.piecesArray[i] = new Piece(
        pieceNumber,
        posX,
        posY,
        rigthPosX,
        rigthPosY,
        isCorrectPosition
      );

      if (!isCorrectPosition) {
        this.isWrongCount++;
      }
    }

    this.piecesArray[15] = new Piece(16, 4, 4, 4, 4);
  };

  //Checks if the array created is solvable.
  this.isSolvable = function (random_array) {
    var control_sum = 0;
    var length = random_array.length;

    for (var i = 0; i < length; i++) {
      for (var j = i + 1; j < length; j++) {
        if (random_array[j] < random_array[i]) {
          control_sum++;
        }
      }
    }
    return control_sum % 2 === 0;
  };

  //Draws board.
  this.drawBoard = function (pixel_size) {
    const gameBoard = document.createElement("section");
    gameBoard.id = "game_board";
    gameBoard.style.height = pixel_size + "px";
    gameBoard.style.width = pixel_size + "px";

    const pieceContainer = document.createElement("section");
    pieceContainer.id = "piece_container";

    gameBoard.appendChild(pieceContainer);

    document.body.appendChild(gameBoard);

    for (let i = 0; i < 15; i++) {
      const gamePiece = document.createElement("div");
      gamePiece.classList.add("game_piece");
      gamePiece.style.top = (this.piecesArray[i].posX - 1) * 25 + "%";
      gamePiece.style.left = (this.piecesArray[i].posY - 1) * 25 + "%";

      const numberContainer = document.createElement("div");
      numberContainer.classList.add("number_container");
      numberContainer.textContent = this.piecesArray[i].value;

      gamePiece.appendChild(numberContainer);
      pieceContainer.appendChild(gamePiece);
    }
  };

  //Checks piece position.
  this.checkPosition = function (piece) {
    const isCorrectPosition =
      piece.posX === piece.rigthPosX && piece.posY === piece.rigthPosY;

    if (piece.isRigthPosition !== isCorrectPosition) {
      piece.isRigthPosition = isCorrectPosition;

      if (isCorrectPosition) {
        this.isWrongCount--;
      } else {
        this.isWrongCount++;
      }
    }
  };

  //Moves piece.
  this.movePiece = function (piece_number) {
    const piece = this.piecesArray[piece_number - 1];
    const emptyPiece = this.piecesArray[15];

    const test_posX = piece.posX - emptyPiece.posX;
    const test_posY = piece.posY - emptyPiece.posY;

    if (Math.abs(test_posX) + Math.abs(test_posY) !== 1) {
      return false; // Invalid move, not adjacent to the empty space
    }

    // Swap positions
    [piece.posX, emptyPiece.posX] = [emptyPiece.posX, piece.posX];
    [piece.posY, emptyPiece.posY] = [emptyPiece.posY, piece.posY];

    this.checkPosition(piece);

    return true; // Valid move
  };

  //Verify game status.
  this.checkGame = function () {
    if (this.isWrongCount == 0) return true;
    else return false;
  };
};

document.addEventListener("DOMContentLoaded", function () {
  const game = new Game();
  game.initializeGame();
  game.drawBoard(700);

  const gamePieceElements = document.querySelectorAll(".game_piece");
  gamePieceElements.forEach(function (pieceElement) {
    pieceElement.addEventListener("click", function () {
      const pieceNumber = pieceElement.querySelector("div").textContent;
      if (game.movePiece(pieceNumber)) {
        pieceElement.style.transition = "top 0.3s, left 0.3s";
        pieceElement.style.top =
          (game.piecesArray[pieceNumber - 1].posX - 1) * 25 + "%";
        pieceElement.style.left =
          (game.piecesArray[pieceNumber - 1].posY - 1) * 25 + "%";
      }
      if (game.checkGame()) {
        document.getElementById("talking_box").textContent =
          "Game set - Well done!";
        const resetb = document.createElement("button");
        resetb.className = "resetbutton";
        resetb.textContent = "Reset Game";
        resetb.onclick = () => {
          location.reload();
        };
        document.body.appendChild(resetb);
      }
    });
  });
});
