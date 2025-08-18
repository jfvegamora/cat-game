/*
MEJORAS:
- Se agregó tablero contador de Sets y Juegos por Set.
- Se agregó línea roja para indicar la posicón ganadora.
*/

const gameBoard = document.querySelector('.game__board');
const gameTurn = document.querySelector('.game__turn');
const endGame = document.querySelector('.endgame');
const endGameResult = document.querySelector('.endgame__result');
const endgameButton = document.querySelector('.endgame__button');

const gamePointsX = document.querySelector('.game__points_x');
const gamePointsO = document.querySelector('.game__points_o');

const gamePointsXAcum = document.querySelector('.game__points_x_acum');
const gamePointsOAcum = document.querySelector('.game__points_o_acum');

let isTurnX = true;//comienza el jugador X
let turn = 0;//turno inicial = 0
let maxTurn = 9; //total de movimientos del juego
let players = { //clase con los 2 tipos de jugadores
    x: 'cross',
    o: 'circle'
}

let totPointGameX = 0;
let totPointGameO = 0;
let totPointSetsX = 0;
let totPointSetsO = 0;

let minGames = 2;//Num juegos mínimo para ganar el set
let maxGames = 3;//Num de juegos totales del set

let setActual = 1; //inicia en el set 1
let minSets = 2;//Num de sets minimo para ganar el partido
let maxSets = 3;//Num de sets totales del partido

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
        const div = document.createElement('div');
        div.classList.add('cell');
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

    showWinningLine(winningPosition.find(array => array.every(position => {
        return cells[position].classList.contains(currentPlayer);
    })));

    showEndGame(true);
    return true;
}

function showEndGame(winner) {
    endGame.classList.add('show'); //renderiza la sección de jugador ganador.

    if (winner) {//hubo un ganador
        if (isTurnX) {
            totPointGameX++;
            gamePointsX.textContent = totPointGameX;
        } else {
            totPointGameO++;
            gamePointsO.textContent = totPointGameO;
        }

        if (totPointGameX == minGames) {//ganó el SET
            totPointSetsX++;

            if (totPointSetsX == minSets) {//también ganó el partido
                endGameResult.innerHTML = `X ha ganado el Partido por ${totPointSetsX} Sets a ${totPointSetsO}. <br> ¡FELICITACIONES!`;
                resetTableroActual();
                resetTableroAcumulado();
            } else {
                endGameResult.textContent = `¡X ha ganado el SET ${setActual} por ${totPointGameX} a ${totPointGameO}.`;
                gamePointsXAcum.textContent = totPointSetsX;
                resetTableroActual();
            }
        } else if (totPointGameO == minGames) {
            totPointSetsO++;

            if (totPointSetsO == minSets) {
                endGameResult.innerHTML = `O ha ganado el Partido por ${totPointSetsO} Sets a ${totPointSetsX}. <br> ¡FELICITACIONES!`;
                resetTableroActual();
                resetTableroAcumulado();
            } else {
                endGameResult.textContent = `¡O ha ganado el SET ${setActual} por ${totPointGameO} a ${totPointGameX}.`;
                gamePointsOAcum.textContent = totPointSetsO;
                resetTableroActual();
            }
        } else {
            endGameResult.textContent = `¡${isTurnX ? "X" : "O"} ha ganado el juego!`;
        }

    } else {
        endGameResult.textContent = `El juego se ha empatado.`;
    }
}

function showWinningLine(winningArray) {
    const cells = document.querySelectorAll('.cell'); // Lista de todas las celdas
    const positions = winningArray.map(index => cells[index].getBoundingClientRect()); // Posiciones de las celdas ganadoras

    // Crear una nueva línea de victoria
    const line = document.createElement('div');
    line.classList.add('winning-line'); // Clase para la línea

    // Obtener las coordenadas de las celdas
    const startX = Math.round(positions[0].left + positions[0].width / 2); // Centro de la primera celda (X)
    const startY = Math.round(positions[0].top + positions[0].height / 2); // Centro de la primera celda (Y)
    const endX = Math.round(positions[2].left + positions[2].width / 2); // Centro de la última celda (X)
    const endY = Math.round(positions[2].top + positions[2].height / 2); // Centro de la última celda (Y)

    // Calcular el ángulo y la distancia de la línea
    const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));

    // Para líneas verticales
    if (startY === endY) {
        line.style.width = `${distance}px`;
        line.style.height = '10px';
        line.style.left = `${Math.min(startX, endX) - Math.round(gameBoard.getBoundingClientRect().left)}px`;
        line.style.top = `${Math.min(startY, endY) - Math.round(gameBoard.getBoundingClientRect().top)}px`;
    } else if (startX === endX) {
        line.style.width = '10px';
        line.style.height = `${distance}px`;
        line.style.left = `${Math.min(startX, endX) - Math.round(gameBoard.getBoundingClientRect().left)}px`;
        line.style.top = `${Math.min(startY, endY) - Math.round(gameBoard.getBoundingClientRect().top)}px`;
    } else {
        line.style.width = '10px';
        line.style.height = `${distance}px`;
        line.style.left = `${Math.min(startX, endX) - Math.round(gameBoard.getBoundingClientRect().left) + 100}px`;
        line.style.top = `${Math.min(startY, endY) - Math.round(gameBoard.getBoundingClientRect().top) - 50}px`;
        line.style.transform = startX > endX ? `rotate(45deg)` : `rotate(-45deg)`;
    }

    // Agregar la línea al tablero
    const board = document.querySelector('.game__board');
    board.appendChild(line);
}

function resetTableroActual() {
    totPointGameX = 0;
    totPointGameO = 0;
    gamePointsX.textContent = "0";
    gamePointsO.textContent = "0";
}

function resetTableroAcumulado() {
    totPointSetsX = 0;
    totPointSetsO = 0;
    gamePointsXAcum.textContent = "0";
    gamePointsOAcum.textContent = "0";
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