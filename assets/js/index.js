// Constants
const board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
];
const tiles = [...document.querySelector('.board').children];
const AI = 'x';
const HUMAN = 'o';

let current = HUMAN;
let firstMove = HUMAN;

const modal = document.querySelector('.modal');
const modalContent = document.querySelector('.modal-content');

// Modal Functions
function openModal(result) {
    modal.style.display = 'block';
    if (result === 'win') {
        modalContent.innerText = 'You Win!';
        modalContent.style.backgroundColor = '#198754';
    } else if (result === 'loss') {
        modalContent.innerText = 'You Lose!';
        modalContent.style.backgroundColor = '#dc3545';
    } else {
        modalContent.innerText = 'Draw!';
        modalContent.style.backgroundColor = '#fd7e14';
    }
}

// Game Functions
function render() {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            tiles[i * 3 + j].innerText = board[i][j];
        }
    }
    if (checkWinner(AI)) {
        openModal('loss');
        setTimeout(resetBoard, 1000);
        return true;
    } else if (checkWinner(HUMAN)) {
        openModal('win');
        setTimeout(resetBoard, 1000);
        return true;
    } else if (board.every((row) => row.every((cell) => cell !== ''))) {
        openModal('draw');
        setTimeout(resetBoard, 1000);
        return true;
    }
    return false;
}

function empty(i, j) {
    return board[i][j] === '';
}

function checkWinner(player) {
    for (let i = 0; i < board.length; i++) {
        if (board[i][0] === player && board[i][1] === player && board[i][2] === player) {
            return true;
        }
    }
    for (let i = 0; i < board.length; i++) {
        if (board[0][i] === player && board[1][i] === player && board[2][i] === player) {
            return true;
        }
    }
    if (board[0][0] === player && board[1][1] === player && board[2][2] === player) {
        return true;
    }
    if (board[0][2] === player && board[1][1] === player && board[2][0] === player) {
        return true;
    }
    return false;
}

function gameOver() {
    return (
        checkWinner(AI) ||
        checkWinner(HUMAN) ||
        board.every((row) => row.every((cell) => cell !== ''))
    );
}

function minimax(depth, alpha, beta, maximizingPlayer) {
    if (checkWinner(AI)) {
        return { score: 10 };
    }
    if (checkWinner(HUMAN)) {
        return { score: -10 };
    }
    if (board.every((row) => row.every((cell) => cell !== ''))) {
        return { score: 0 };
    }
    let moves = [];
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (empty(i, j)) {
                board[i][j] = maximizingPlayer ? AI : HUMAN;
                let move = {
                    i: i,
                    j: j,
                    score:
                        minimax(depth + 1, alpha, beta, !maximizingPlayer).score +
                        (maximizingPlayer === true ? -depth : depth), // Subtract depth if player is AI, add depth if player is HUMAN
                };
                board[i][j] = '';
                moves.push(move);
                if (maximizingPlayer) {
                    alpha = Math.max(alpha, move.score);
                    if (beta <= alpha) {
                        break;
                    }
                } else {
                    beta = Math.min(beta, move.score);
                    if (beta <= alpha) {
                        break;
                    }
                }
            }
        }
    }
    return maximizingPlayer
        ? moves.reduce((a, c) => (a.score > c.score ? a : c))
        : moves.reduce((a, c) => (a.score < c.score ? a : c));
}

function playerMove(i, j) {
    if (empty(i, j)) {
        board[i][j] = current;
        if (render()) return;
        current = AI;
        aiMove();
    }
}

function aiMove() {
    let move = minimax(0, -Infinity, Infinity, false);
    board[move.i][move.j] = AI;
    if (render()) return;
    current = HUMAN;
}

function resetBoard() {
    board.forEach((row) => row.fill(''));
    if (firstMove === AI) {
        aiMove();
    } else {
        current = HUMAN;
    }
    firstMove = firstMove === AI ? HUMAN : AI;
    render();
}

// Player Events
function handleClick(event) {
    if (gameOver()) return;
    const index = tiles.indexOf(event.target);
    const i = Math.floor(index / 3);
    const j = index % 3;
    playerMove(i, j);
}

for (let i = 0; i < tiles.length; i++) {
    tiles[i].addEventListener('click', handleClick);
}

// Modal Event
window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};
