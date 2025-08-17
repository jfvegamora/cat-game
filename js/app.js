
const gameBoard = document.querySelector('.game__board');
const gameTurn = document.querySelector('.game__turn');
const endGame = document.querySelector('.endgame');
const endGameResult = document.querySelector('.endgame__result');
const endgameButton = document.querySelector('.endgame__button');

let isTurnX = true;//comienza el jugador X
let turn = 0;//turno inicial = 0
let maxTurn = 9; //total de movimientos del juego
let players = { //clase con los 2 tipos de jugadores
    x: 'cross',
    o: 'circle'
}

const winningPosition = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]
];

function createBoard() { //crea el tablero de juego
    const cells = 9;

    //para limpiar el tablero
    while (gameBoard.firstElementChild) {
        gameBoard.firstElementChild.remove();
    }

    for (let i = 0; i < cells; i++) {
        const div = document.createElement('div');//crea 9 elementos div
        div.classList.add('cell');//para crear una celda
        // div.textContent = i; //para ver la posicion de cada celda
        div.addEventListener('click', handleGame, { once: true });

        gameBoard.append(div);
    }
}

//función manejadora para el evento click del div, recibira e como objeto del evento
function handleGame(e) {
    const currentCell = e.currentTarget;
    const currentTurn = isTurnX ? players.x : players.o;
    turn++;

    drawShape(currentCell, currentTurn);//dibuja el X o O.

    if (checkWinner(currentTurn)) {//verifica si ya hay un ganador
        return; //sale para que no se eecute changeTurn ya que el juego terminó.
    }

    if (turn === maxTurn) {//si se completaron los 9 movimientos y todavía no hay un ganador
        showEndGame(false);//llama a mensajear que terminó el juego sin un ganador.
    }

    changeTurn();//llama a cambiar el turno
}

function drawShape(element, newClass) {
    element.classList.add(newClass);
}

function changeTurn() {
    isTurnX = !isTurnX;
    gameTurn.textContent = isTurnX ? 'X' : 'O';
}

function checkWinner(currentPlayer) {
    const cells = document.querySelectorAll('.cell');

    //some: itera sobre el arreglo winningPosition para obtener cada array dentro de él.
    const winner = winningPosition.some(array => {
        return array.every(position => {
            return cells[position].classList.contains(currentPlayer);
        });
    });

    if (!winner) {
        return;
    }

    showEndGame(true);
    return true;
}

function showEndGame(winner) {
    endGame.classList.add('show'); //renderiza la sección de jugador ganador.

    if (winner) {//hubo un ganador
        endGameResult.textContent = `¡${isTurnX ? "X" : "O"} ha ganado el juego!`;
    } else {
        endGameResult.textContent = `El juego se ha empatado.`;
    }
}

function startGame() {
    createBoard();
    gameTurn.textContent = isTurnX ? 'X' : 'O';
    isTurnX = true;
    turn = 0;

    endGame.classList.remove('show'); //oculta el mensaje final
}

endgameButton.addEventListener('click', startGame);//llama a startGame al hacer click en endgameButton.

startGame();