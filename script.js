const log = (msg) => console.log(msg);
const jumbotronTextRef = document.querySelector('#msg');

const oData = {};

document.querySelector('#newGame').addEventListener('click', initGame);

// Startar spelet
function initGame() {
    log('initGame()');
    initGlobalObject();
    setPlayerDetails();
    generateStartingPlayer();

    document.querySelector('#form').classList.add('d-none');
    document.querySelector('#errorMsg').textContent = '';

    generateGameField();
    document.querySelector('#gameTable').addEventListener('click', executeMove);
}

function initGlobalObject() {
    log('initGlobalObject()');
    oData.player1score = 0;
    oData.player2score = 0;
    oData.currentPlayer = 0;
    oData.currentMove = 1;
    oData.flippedCard = null;
    oData.remainingCards = 16;
}

function setPlayerDetails() {
    log('setPlayerDetails()');
    oData.player1Nickname = document.querySelector('#nick1').value;
    oData.player2Nickname = document.querySelector('#nick2').value;
    oData.player1Color = document.querySelector('#color1').value;
    oData.player2Color = document.querySelector('#color2').value;
}

function generateStartingPlayer() {
    log('generateStartingPlayer()');
    if (Math.random() < 0.5) {
        oData.currentPlayer = 1;
        setPlayerMessage(oData.player1Nickname);
    } else {
        oData.currentPlayer = 2;
        setPlayerMessage(oData.player2Nickname);
    }
}

function setPlayerMessage(player) {
    jumbotronTextRef.textContent = `Aktuell spelare är ${player}`;
}

// Skapar spelplanen
function generateGameField() {
    log('generateGameField()');
    const gameFieldRef = document.querySelector('#gameArea');
    gameFieldRef.innerHTML = '';
    gameFieldRef.classList.add('row', 'justify-content-center', 'mt-5');

    const tableRef = document.createElement('table');
    tableRef.id = 'gameTable';
    tableRef.classList.add('ml-0', 'mr-0');
    gameFieldRef.appendChild(tableRef);

    const deck = createDeck();

    // Skapar ett 4x4 tabell-grid
    for (let i = 0; i < 4; i++) {
        const rowRef = document.createElement('tr');
        tableRef.appendChild(rowRef);
        for (let j = 0; j < 4; j++) {
            const cellRef = document.createElement('td');
            rowRef.appendChild(cellRef);
            cellRef.style =
                'width: 140px; height: 160px; border: 1px solid darkgrey; font-size: 50px; text-align: center; background-color: #CCCCCC;';
            const card = deck.pop();
            const imgRef = document.createElement('img');
            imgRef.alt = 'Doggo';
            imgRef.src = card.imageURL;
            imgRef.classList.add('w-100', 'h-100', 'd-none');
            imgRef.style = 'object-fit: cover; box-sizing: border-box;';
            imgRef.dataset.id = card.value;
            imgRef.dataset.cardInPlay = true;
            cellRef.appendChild(imgRef);
        }
    }
}

function createDeck() {
    log('createDeck()');
    const deck = [];

    // Skapar 2 lika kort
    for (let i = 1; i <= 8; i++) {
        deck.push({
            value: i,
            imageURL: `./images/${i}.jpg`,
        });
        deck.push({
            value: i,
            imageURL: `./images/${i}.jpg`,
        });
    }

    return shuffleDeck(deck);
}

// Fisher Yates Shuffle Algorithm
function shuffleDeck(deck) {
    log('shuffleDeck()');
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    return deck;
}

function executeMove(event) {
    // log('executeMove()');
    const cell = event.target.firstChild;
    if (event.target.tagName === 'TD') {
        if (cell.dataset.cardInPlay) {
            cell.classList.toggle('d-none');
            if (oData.currentMove === 1) {
                oData.currentMove++;
                oData.flippedCard = cell;
            } else {
                oData.currentMove--;
                if (oData.flippedCard.dataset.id === cell.dataset.id) {
                    log('träff');
                    cell.dataset.cardInPlay = false;
                    oData.flippedCard.cardInPlay = false;
                    if (oData.currentPlayer === 1) {
                        oData.player1score++;
                        cell.style = `border: 3px solid ${oData.player1Color}; object-fit: cover; box-sizing: border-box`;
                        oData.flippedCard.style = `border: 3px solid ${oData.player1Color}; object-fit: cover; box-sizing: border-box`;
                    } else if (oData.currentPlayer === 2) {
                        oData.player2score++;
                        cell.style = `border: 3px solid ${oData.player2Color}; object-fit: cover; box-sizing: border-box`;
                        oData.flippedCard.style = `border: 3px solid ${oData.player2Color}; object-fit: cover; box-sizing: border-box`;
                    }
                    oData.remainingCards -= 2;
                } else {
                    log('miss');
                    setTimeout(() => {
                        cell.classList.toggle('d-none');
                        oData.flippedCard.classList.toggle('d-none');
                        changePlayer();
                    }, 1500);
                }

                const winner = checkWinner();
                if (winner !== 0) {
                    gameOver(winner);
                }
            }
        }
    }
}

function changePlayer() {
    log('changePlayer()');
    if (oData.currentPlayer === 1) {
        oData.currentPlayer = 2;
        setPlayerMessage(oData.player2Nickname);
    } else {
        oData.currentPlayer = 1;
        setPlayerMessage(oData.player1Nickname);
    }
}

function checkWinner() {
    if (oData.remainingCards === 0) {
        if (oData.player1score > oData.player2score) {
            return 1;
        } else if (oData.player1score < oData.player2score) {
            return 2;
        } else {
            return 3;
        }
    } else {
        return 0;
    }
}

function gameOver(winner) {
    document.querySelector('#form').classList.remove('d-none');
    document
        .querySelector('#gameTable')
        .removeEventListener('click', executeMove);
    if (winner === 1) {
        jumbotronTextRef.textContent = `${oData.player1Nickname} vann!`;
    } else if (winner === 2) {
        jumbotronTextRef.textContent = `${oData.player2Nickname} vann!`;
    } else if (winner === 3) {
        jumbotronTextRef.textContent = `Oavgjort :(`;
    }
}
