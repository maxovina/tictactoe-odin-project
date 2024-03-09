function Gameboard() {
    const rows = 3;
    const cols = 3;
    const board = [];

    const gui = GUIController(board);

    for(let i = 0; i < rows; i++){
        board[i] = [];
        for(let j = 0; j < cols; j++){
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const claimCell = (column, row, player) => {
        if(board[row][column].getValue() == 0){
            board[row][column].changeValue(player);
            gui.claimCellGUI(row, column, player);
        }else {
            console.log('This cell is already claimed!')
        }
    }

    const printBoard = () => {
        const rawBoard = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(rawBoard);
    }

    const resetBoard = () => {
        for(let i = 0; i < rows; i++){
            board[i] = [];
            for(let j = 0; j < cols; j++){
                board[i].push(Cell());
            }
        }
    }
    return {
        getBoard, 
        claimCell, 
        printBoard,
        resetBoard
    };
}

function Cell() {
    let value = 0;
    const changeValue = (player) => value = player;
    const getValue = () => value;

    return {
        changeValue,
        getValue
    };

}

function GUIController() {
    const gameBoardContainer = document.querySelector('.gameBoardContainer');
    const winMessage = document.querySelector('#winnerMessage');
    const endScreen = document.querySelector('.endScreen');
    const activePlayerMessage = document.querySelector('#activePlayerMessage');
    const resetButton = document.querySelector('#resetButton');
    

    const createGUI = () => {
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                let gameField = document.createElement('div');
                gameField.classList.toggle('gameField');
                gameField.textContent = '';
                gameField.setAttribute('row', i);
                gameField.setAttribute('column', j);
                gameField.addEventListener('click', () => {
                    const row = gameField.getAttribute('row');
                    const column = gameField.getAttribute('column');
                    game.playRound(parseInt(row), parseInt(column));
                })
                gameBoardContainer.appendChild(gameField);
            }
        }

    }
    const claimCellGUI = (row, column, player) => {
        let CellGUI = document.querySelector(`[row="${row}"][column="${column}"]`);
        CellGUI.textContent = player;
    }

    const displayWinMessage = (players, winner) => {
        if(winner == 0 || winner == 1){
            winMessage.textContent = `${players[winner].name} WON!`
        }else if(winner == 2){
            winMessage.textContent = 'TIE!'
        }
        
    }

    const clearGUIBoard = () => {
        let gameFields = document.querySelectorAll('.gameField');
        gameFields.forEach((field) => {
            field.textContent = '';
        })
    }

    const showActivePlayer = (activePlayer) => {
        activePlayerMessage.textContent = `${activePlayer.name}'s turn (${activePlayer.token})`
    }

    const showEndScreen = (players, winner) => {
        endScreen.classList.remove('Hidden')
        if(winner == 0 || winner == 1){
            winMessage.textContent = `${players[winner].name} WON!`
        }else if(winner == 2){
            winMessage.textContent = 'TIE!'
        }
        endScreen.addEventListener('click', () => {
            endScreen.classList.add('Hidden')
        })
    }

    resetButton.addEventListener('click', () => {
        game.restartGame();
    })

    return {
        createGUI, 
        claimCellGUI,
        displayWinMessage, 
        clearGUIBoard, 
        showEndScreen, 
        showActivePlayer}
}

function GameController(
    playerOneName = 'Player One',
    playerTwoName = 'Player Two'
) {
    const board = Gameboard();
    const gui = GUIController();

    const players = [
        {
            name: playerOneName,
            token: 'X'
        },
        {
            name: playerTwoName,
            token: 'O'
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const checkForWin = () => {
        const rawBoard = board.getBoard().map(row => row.map(cell => cell.getValue()));
        //Check rows and columns
        for(let i = 0; i < 3; i++){
            if(rawBoard[i][0] === rawBoard[i][1] && rawBoard[i][1] === rawBoard[i][2] && rawBoard[i][0] !== 0){
                let winner = rawBoard[i][0] == 'X' ? 0 : 1;
                return winner;
            }else if(rawBoard[0][i] === rawBoard[1][i] && rawBoard[1][i] === rawBoard[2][i] && rawBoard[0][i] !== 0){
                let winner = rawBoard[0][i] == 'X' ? 0 : 1;
                return winner;
                }
        }
        //Check diagonals
        if(rawBoard[0][0] === rawBoard[1][1] && rawBoard[1][1] === rawBoard[2][2] && rawBoard[0][0] !== 0){
            let winner = rawBoard[0][0] == 'X' ? 0 : 1;
            return winner;
        }else if(rawBoard[0][2] === rawBoard[1][1] && rawBoard[1][1] === rawBoard[2][0] && rawBoard[0][2] !== 0){
            let winner = rawBoard[0][2] == 'X' ? 0 : 1;
            return winner;
        //If not win check if theres a tie
        }else if(rawBoard.every((row) => (row.every((cell) => cell != 0)))){
            return 2;
        }
    }

    const restartGame = () => {
        board.printBoard();
        board.resetBoard();
        gui.clearGUIBoard();
        activePlayer = players[1];
        switchPlayerTurn();
        gui.showActivePlayer(getActivePlayer());
    }

    const playRound = (row, column) => {
        console.log(
            `Marking the ${row}x${column} cell with ${getActivePlayer().token}`
        );
        const cellAlreadyClaimed = board.getBoard()[row][column].getValue() !== 0;
        if (!cellAlreadyClaimed) {
            board.claimCell(column, row, getActivePlayer().token);
            
            let whoWon = checkForWin();
            if(whoWon == 0 || whoWon == 1 || whoWon == 2){
                gui.showEndScreen(players, whoWon);
                restartGame();
            } else {
                switchPlayerTurn();
            }
            gui.showActivePlayer(getActivePlayer());
        } else {
            console.log('This cell is already claimed!');
        }
        printNewRound();
    };

    printNewRound();
    gui.createGUI();
    gui.showActivePlayer(getActivePlayer());

    return {
        playRound,
        getActivePlayer,
        checkForWin,
        restartGame
    };
}

const game = GameController();