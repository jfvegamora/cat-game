/*
MEJORAS:
- TIMER: Se implementó un tiempo de jugada para cada jugador. Predeterminado 15 segundos.

*/

const gameBoard = document.querySelector('.game__board');
const gameTurn = document.querySelector('.game__turn');
const setTurn = document.querySelector('.set__turn');
const endGame = document.querySelector('.endgame');
const endGameResult = document.querySelector('.endgame__result');
const endgameButton = document.querySelector('.endgame__button');
const initGameButton = document.querySelector('.init_game__button');

const gamePointsX = document.querySelector('.game__points_x');
const gamePointsO = document.querySelector('.game__points_o');

const gamePointsXAcum = document.querySelector('.game__points_x_acum');
const gamePointsOAcum = document.querySelector('.game__points_o_acum');

const inNumGamesSets = document.querySelector('#inNumGamesSets');
const inNumSets = document.querySelector('#inNumSets');

const undoBtnX = document.querySelector('#btnIconoX');
const undoBtnO = document.querySelector('#btnIconoO');
const undoImgX = document.querySelector('#icono_undo_x');
const undoImgO = document.querySelector('#icono_undo_o');

const timeX = document.querySelector('.time-x');
const timeO = document.querySelector('.time-o');

let isTurnX = true;//comienza el jugador X
let turnGame = 'X'; //turno inicial para X
let firstGame = true; //inicio del partido
let turn = 0;//turno inicial = 0
const maxTurn = 9; //total de movimientos del juego
let players = { //clase con los 2 tipos de jugadores
    x: 'cross',
    o: 'circle'
}

let totPointGameX = 0;
let totPointGameO = 0;
let totPointSetsX = 0;
let totPointSetsO = 0;

let defaultGamesSets = 3; //Num. de juegos por set
let defaultNumSets = 3;   //Num de sets por partido

inNumGamesSets.value = defaultGamesSets;
inNumSets.value = defaultNumSets;

let minGames = Math.ceil(inNumGamesSets.value / 2);//Num juegos mínimo para ganar un set
let maxGames = inNumGamesSets.value;//Num de juegos totales del set

let minSets = Math.ceil(inNumSets.value / 2);//Num de sets mínimo para ganar el partido
let maxSets = inNumSets.value;

let setActual = 1; //inicia en el set 1

const winningPosition = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// Variables para almacenar las últimas jugadas de X y O
let lastMoveX = null;
let lastMoveO = null;

// Variables para controlar si el jugador ya usó su deshacer
let usedUndoX = false;
let usedUndoO = false;

let timerX; // Temporizador para X
let timerO; // Temporizador para O
const timerXO = 15; //Tiempo de juego por partida para cada jugador.
let pausedTimeX = timerXO; // Tiempo restante de X al pausar
let pausedTimeO = timerXO; // Tiempo restante de O al pausar
let gameOver = false;

function startTimerX() {
    let timeLeftX = pausedTimeX; // Empezar con el tiempo pausado
    timeX.textContent = timeLeftX;

    // Temporizador de X
    timerX = setInterval(function () {
        timeLeftX--;
        timeX.textContent = timeLeftX;

        if (timeLeftX <= 0) {
            showEndGame("O"); // Si se acaba el tiempo de X, gana O
            clearInterval(timerX);
        }
    }, 1000);
}

function startTimerO() {
    let timeLeftO = pausedTimeO; // Empezar con el tiempo pausado
    timeO.textContent = timeLeftO;

    // Temporizador de O
    timerO = setInterval(function () {
        timeLeftO--;
        timeO.textContent = timeLeftO;

        if (timeLeftO <= 0) {
            showEndGame("X"); // Si se acaba el tiempo de O, gana X.
            clearInterval(timerO);
        }
    }, 1000);
}

function pauseTimerX() {
    clearInterval(timerX); // Detener el temporizador de X
    // pausedTimeX = parseInt(document.querySelector('.time-x').textContent); // Guardar el tiempo restante
    pausedTimeX = timeX.textContent; // Guardar el tiempo restante
}

function pauseTimerO() {
    clearInterval(timerO); // Detener el temporizador de O
    // pausedTimeO = parseInt(document.querySelector('.time-o').textContent); // Guardar el tiempo restante
    pausedTimeO = timeO.textContent; // Guardar el tiempo restante
}

function showEndGame(winner) {
    endGame.classList.add('show'); //renderiza la sección de jugador ganador.

    if (winner) {//hubo un ganador
        clearInterval(timerX);
        clearInterval(timerO);

        if (winner == 'X') {
            totPointGameX++;
            gamePointsX.textContent = totPointGameX;
        } else if (winner == 'O') {
            totPointGameO++;
            gamePointsO.textContent = totPointGameO;
        } else if (isTurnX) {
            totPointGameX++;
            gamePointsX.textContent = totPointGameX;
        } else {
            totPointGameO++;
            gamePointsO.textContent = totPointGameO;
        }

        if (totPointGameX == minGames) {
            totPointSetsX++;
            gamePointsXAcum.textContent = totPointSetsX;
            setScoreSet(setActual, totPointGameX, totPointGameO);

            if (totPointSetsX == minSets) {
                endGameResult.innerHTML = `¡X ha ganado el SET ${setActual} y el Partido por ${totPointSetsX} Sets a ${totPointSetsO}. <br> FELICITACIONES!`;
                gameOver = true;
            } else {
                endGameResult.textContent = `¡X ha ganado el SET ${setActual} por ${totPointGameX} a ${totPointGameO}.`;
                resetTableroActual();
                setActual++;
                setTurn.textContent = setActual;
            }

        } else if (totPointGameO == minGames) {
            totPointSetsO++;
            gamePointsOAcum.textContent = totPointSetsO;
            setScoreSet(setActual, totPointGameX, totPointGameO);

            if (totPointSetsO == minSets) {
                endGameResult.innerHTML = `¡O ha ganado el SET ${setActual} y el Partido por ${totPointSetsO} Sets a ${totPointSetsX}. <br> FELICITACIONES!`;
                gameOver = true;
            } else {
                endGameResult.textContent = `¡O ha ganado el SET ${setActual} por ${totPointGameO} a ${totPointGameX}.`;
                resetTableroActual();
                setActual++;
                setTurn.textContent = setActual;
            }

        } else if (winner == 'X' || winner == 'O') {
            endGameResult.textContent = `Tiempo acabado! ¡${winner} ha ganado el juego!!`;
        } else {
            endGameResult.textContent = `¡${isTurnX ? "X" : "O"} ha ganado el juego!`;
        }
    } else {
        endGameResult.textContent = `El juego se ha empatado.`;
    }
}

function resetTime() {
    clearInterval(timerX); // Detener el temporizador de X
    clearInterval(timerO); // Detener el temporizador de O

    pausedTimeX = timerXO; // Tiempo inicial de X 
    pausedTimeO = timerXO; // Tiempo inicial de O 

    document.querySelector('.time-x').textContent = pausedTimeX;
    document.querySelector('.time-o').textContent = pausedTimeO;

    if (!gameOver) {//si no ha terminado el partido debe comenzar timer.
        // console.log('turnGame resetTime:', turnGame);

        if (turnGame == 'X') {
            startTimerX();
        } else {
            startTimerO();
        }
    }
}

function setScoreSet(setActual, totPointGameX, totPointGameO) {
    const pointX = document.querySelector('#point-1-' + (setActual));
    pointX.textContent = totPointGameX;

    const pointO = document.querySelector('#point-2-' + (setActual));
    pointO.textContent = totPointGameO;
}

function createBoard() { //crea el tablero de juego
    const cells = 9;

    setTurn.textContent = setActual;

    //para limpiar el tablero
    while (gameBoard.firstElementChild) {
        gameBoard.firstElementChild.remove();
    }

    for (let i = 0; i < cells; i++) {
        const div = document.createElement('div');//crea un elemento div
        div.classList.add('cell');//agrega la clase cell al div

        div.addEventListener('click', handleGame); //se quita {once:true} para hacer más de un click en caso de undo.

        gameBoard.append(div);
    }
}

function agregarColumnas() {
    // Obtener el número de columnas a agregar
    const numColumnas = inNumSets.value;

    // console.log('numColumnas:', numColumnas);

    // Si el número de columnas es un número válido
    if (!isNaN(numColumnas) && numColumnas > 0) {
        const tabla = document.querySelector('.tabla-gato'); // Seleccionamos la tabla
        const filas = tabla.rows; // Obtenemos todas las filas

        //elimina las columnas dinámicas del juego anterior
        Array.from(tabla.rows).forEach(fila => {
            Array.from(fila.cells).forEach(celda => {
                if (celda.classList.contains('col-header') ||
                    celda.classList.contains('col-x') ||
                    celda.classList.contains('col-o')) {
                    celda.remove();
                }
            });
        });

        // Recorrer todas las filas
        for (let i = 0; i < filas.length; i++) {
            const fila = filas[i];

            // Insertar las nuevas celdas antes de la última columna (Acumulado)
            // Si no es la fila del encabezado, agregar las nuevas celdas
            for (let j = 0; j < numColumnas; j++) {
                const nuevaCelda = document.createElement(i === 0 ? 'th' : 'td');

                if (i == 0) {
                    nuevaCelda.classList.add('tabla-gato-puntaje', 'col-header');
                } else if (i == 1) {
                    nuevaCelda.classList.add('tabla-gato-puntaje', 'col-x');
                } else if (i == 2) {
                    nuevaCelda.classList.add('tabla-gato-puntaje', 'col-o');
                }

                nuevaCelda.id = `point-${i}-${j + 1}`;

                if (i == 0) {
                    nuevaCelda.textContent = j + 1;
                } else {
                    nuevaCelda.textContent = '0';
                }
                fila.insertBefore(nuevaCelda, fila.cells[fila.cells.length - 1]); // Inserta antes de la última columna
            }
        }

    } else {
        alert('Por favor ingresa un número válido de columnas.');
    }
}

//función manejadora para el evento click del div, recibira e como objeto del evento
function handleGame(e) {
    const currentCell = e.currentTarget;

    // Como se quitó { once: true } al crear las celdas, hay que controlar un solo click por celda.
    if (currentCell.classList.contains('cross') || currentCell.classList.contains('circle')) {
        return;  // Si la celda ya tiene un símbolo, no hacer nada
    }

    const currentTurn = isTurnX ? players.x : players.o;
    turn++;

    // Almacenar la última jugada
    if (isTurnX) {
        lastMoveX = currentCell;
    } else {
        lastMoveO = currentCell;
    }

    drawShape(currentCell, currentTurn);//dibuja el X o O.

    if (checkWinner(currentTurn)) {//verifica si ya hay un ganador
        return; //sale para que no se eecute changeTurn ya que el juego terminó.
    }

    if (turn === maxTurn) {//si se completaron los 9 movimientos y todavía no hay un ganador
        showEndGame(false);//llama a mensajear que terminó el juego sin un ganador.
    }

    // Pausar el temporizador del jugador actual y empezar el del siguiente jugador
    if (isTurnX) {
        pauseTimerX(); // Pausa el temporizador de X y guarda el tiempo restante
        startTimerO(); // Inicia el temporizador de O con el tiempo guardado
    } else {
        pauseTimerO(); // Pausa el temporizador de O y guarda el tiempo restante
        startTimerX(); // Inicia el temporizador de X con el tiempo guardado
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

    // console.log('pos[0].left:', Math.round(positions[0].left), ' top:', Math.round(positions[0].top), ' width:', positions[0].width, ' height:', positions[0].height);
    // console.log('pos[2].left:', Math.round(positions[2].left), ' top:', Math.round(positions[2].top), ' width:', positions[2].width, ' height:', positions[2].height);
    // console.log('startX:', startX, ' startY:', startY, ' endX:', endX, ' endY:', endY);

    // Calcular el ángulo y la distancia de la línea
    // const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
    const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    // const angle=45;
    // console.log('angle:', angle,' distance:', distance);

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


    // console.log('gameBoard.getBoundingClientRect().left:', Math.round(gameBoard.getBoundingClientRect().left));
    // console.log('line.style.top:', line.style.top);
    // console.log('line.style.left:', line.style.left);

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

function startGame() {

    turnGame = turnGame == 'X' ? 'O' : 'X';
    isTurnX = firstGame ? true : (turnGame == 'X' ? false : true);
    gameTurn.textContent = isTurnX ? 'X' : 'O';
    turn = 0;
    firstGame = false;

    endGame.classList.remove('show'); //oculta el mensaje final

    initGameButton.classList.add('visible');

    // Reiniciar jugadas y deshacer botones
    lastMoveX = null;
    lastMoveO = null;
    usedUndoX = false;
    usedUndoO = false;

    undoImgX.classList.remove('icon-disabled');
    undoImgX.classList.add('icon-enabled');
    undoImgO.classList.remove('icon-disabled');
    undoImgO.classList.add('icon-enabled');
}

endgameButton.addEventListener('click', () => {
    if (gameOver) {
        endGame.classList.remove('show');
    } else {
        resetTime();
        createBoard();
        startGame();
    }
});

function toggleIconClass(imgElement) {
    if (imgElement.classList.contains('icon-enabled')) {
        imgElement.classList.remove('icon-enabled');
        imgElement.classList.add('icon-disabled');
    }
}

undoBtnX.addEventListener('click', () => {
    if (usedUndoX || !lastMoveX || lastMoveX === null || isTurnX) {
        return; // Si ya se usó el deshacer o es el turno de X    ||
    }

    // Limpiar la última celda de X
    lastMoveX.classList.remove(players.x);

    if (isTurnX) {
        pauseTimerX(); // Pausa el temporizador de X y guarda el tiempo restante
        startTimerO(); // Inicia el temporizador de O con el tiempo guardado
    } else {
        pauseTimerO(); // Pausa el temporizador de O y guarda el tiempo restante
        startTimerX(); // Inicia el temporizador de X con el tiempo guardado
    }

    // Revertir el turno
    isTurnX = true;
    gameTurn.textContent = 'X';

    // Desactivar el botón de deshacer para X
    usedUndoX = true;
    toggleIconClass(undoImgX);

    turn--; // Decrementamos el turno
});

undoBtnO.addEventListener('click', () => {
    if (usedUndoO || !lastMoveO || lastMoveO === null || !isTurnX) {
        return; // Si ya se usó el deshacer o es el turno de O
    }

    // Limpiar la última celda de O
    lastMoveO.classList.remove(players.o);

    if (isTurnX) {
        pauseTimerX(); // Pausa el temporizador de X y guarda el tiempo restante
        startTimerO(); // Inicia el temporizador de O con el tiempo guardado
    } else {
        pauseTimerO(); // Pausa el temporizador de O y guarda el tiempo restante
        startTimerX(); // Inicia el temporizador de X con el tiempo guardado
    }

    // Revertir el turno
    isTurnX = false;
    gameTurn.textContent = 'O';

    // Desactivar el botón de deshacer para O
    usedUndoO = true;
    toggleIconClass(undoImgO);

    turn--; // Decrementamos el turno
});

inNumSets.addEventListener('change', function () {
    if (inNumSets.value < defaultNumSets) {
        alert(`Nº Sets debe ser mayor o igual a ${defaultNumSets}.`);
        minSets = 0;
        maxSets = 0;
        inNumSets.value = defaultNumSets;
    } else if (inNumSets.value % 2 !== 0) {//es impar
        minSets = Math.ceil(inNumSets.value / 2);//Num de sets minimo para ganar el partido
        maxSets = inNumSets.value;//Num de sets totales del partido
        agregarColumnas();
        // console.log('NEW minSets:', minSets);
    } else {
        minSets = 0;
        maxSets = 0;
        inNumSets.value = defaultNumSets;
        alert('Nº Sets debe ser impar.');
    }
})

inNumGamesSets.addEventListener('change', function () {
    if (inNumGamesSets.value < defaultGamesSets) {
        alert(`Nº Juegos por Sets debe ser mayor o igual a ${defaultGamesSets}.`);
        minGames = 0;
        maxGames = 0;
        inNumGamesSets.value = defaultGamesSets;
    } else if (inNumGamesSets.value % 2 !== 0) {//es impar
        minGames = Math.ceil(inNumGamesSets.value / 2);
        maxGames = inNumGamesSets.value;
        console.log('minGames:', minGames);
    } else {
        minGames = 0;
        maxGames = 0;
        inNumGamesSets.value = defaultGamesSets;
        alert('Nº Juegos por Sets debe ser impar.');
    }
})

initGameButton.addEventListener('click', function () {
    initGameButton.classList.remove('visible');
    initGameButton.classList.add('hidden');

    initMatch();

    if (isTurnX) {
        startTimerX(); // Inicia el temporizador para X
    } else {
        startTimerO(); // Si O empieza, inicia el temporizador para O
    }
})

function initMatch() {
    isTurnX = true;
    turnGame = 'X';
    firstGame = true;
    turn = 0;

    totPointGameX = 0;
    totPointGameO = 0;
    totPointSetsX = 0;
    totPointSetsO = 0;

    setActual = 1;

    lastMoveX = null;
    lastMoveO = null;

    usedUndoX = false;
    usedUndoO = false;

    pausedTimeX = timerXO;
    pausedTimeO = timerXO;
    timeX.textContent = pausedTimeX;
    timeO.textContent = pausedTimeO;
    gameOver = false;

    gamePointsX.textContent = "0";
    gamePointsO.textContent = "0";

    gamePointsXAcum.textContent = "0";
    gamePointsOAcum.textContent = "0";

    createBoard();
    startGame();
    agregarColumnas();
}

initMatch();
