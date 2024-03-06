function Gameboard() {
    const rows = 3;
    const cols = 3;
    const board = [];

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

function GameController(
    playerOneName = 'Player One',
    playerTwoName = 'Player Two'
) {
    const board = Gameboard();

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
        for(let i = 0; i < 3; i++){
            if(rawBoard[i][0] === rawBoard[i][1] && rawBoard[i][1] === rawBoard[i][2] && rawBoard[i][0] !== 0){
                let winner = rawBoard[0][0] == 'X' ? players[0] : players[1];
                return winner;
            }else if(rawBoard[0][i] === rawBoard[1][i] && rawBoard[1][i] === rawBoard[2][i] && rawBoard[0][i] !== 0){
                let winner = rawBoard[0][0] == 'X' ? players[0] : players[1];
                return winner;
            }
        }
        
        if(rawBoard[0][0] === rawBoard[1][1] && rawBoard[1][1] === rawBoard[2][2] && rawBoard[0][0] !== 0){
            let winner = rawBoard[0][0] == 'X' ? players[0] : players[1];
            return winner;
        }
        if(rawBoard[0][2] === rawBoard[1][1] && rawBoard[1][1] === rawBoard[2][0] && rawBoard[0][2] !== 0){
            let winner = rawBoard[0][0] == 'X' ? players[0] : players[1];
            return winner;
        }
        return false;
    }

    const playRound = (row, column) => {
        console.log(
            `Marking the ${row}x${column} cell with ${getActivePlayer().token}`
        );
        board.claimCell(column, row, getActivePlayer().token);
        
        if(checkForWin() == players[0]){
            console.log(`winner ${players[0].name}`);
            board.resetBoard();
            activePlayer = players[0];
            printNewRound();
        }else if(checkForWin() == players[1]){
            console.log(`winner ${players[1].name}`);
            board.resetBoard();
            activePlayer = players[0];
            printNewRound();
        }
        switchPlayerTurn();
        printNewRound();
    };

    printNewRound();

    return {
        playRound,
        getActivePlayer,
        checkForWin
    };
}

const game = GameController();