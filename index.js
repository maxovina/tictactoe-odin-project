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

    const playRound = (row, column) => {
        console.log(
            `Marking the ${row}x${column} cell with ${getActivePlayer().token}`
        );
        board.claimCell(column, row, getActivePlayer().token);
        
        let whoWon = checkForWin();
        if(whoWon == 0 || whoWon == 1){
            console.log(`Winner ${players[whoWon].name}!`);
            board.printBoard();
            console.log(`Winner ${players[whoWon].name}!`);
            board.resetBoard();
            activePlayer = players[0];
        }else if(whoWon == 2){
            console.log("It's a TIE!");
            board.printBoard();
            console.log("It's a TIE!");
            board.resetBoard();
            activePlayer = players[0];
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