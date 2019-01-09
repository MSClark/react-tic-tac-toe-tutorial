import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

// TODO: style board and refactor so components are in their own file

function Square(props) { 
    /* 
    simple functional component that has no state, it takes in the props value of 
    what square # it is and an onclick function, both are defined in the board component 
    */
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        {/* Board is rendered here and the css class "board-row" ensures its a 3x3 grid */}
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [ // history is an array of objects where each object is an array 0-8 of the state of the board
                {
                    squares: Array(9).fill(null) // initializing blank square array to start
                }
            ],
            stepNumber: 0,
            xIsNext: true // x has the first move
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice(); 
        /* 
        slice creates a shallow copy of the array, shallow meaning that it points to the 
        same memory addresses as the original array so if thats lost, both are lost

        slice needs a param and if you call it like this itll actually pass undefined 
        which gets translated to 0 so its the same as calling slice(0)
        */
        if (calculateWinner(squares) || squares[i]) { // if calculate winner method comes back true or ???
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([ // merge two arrays
                {
                    squares: squares
                }
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0 // if remainder is 0 x is next otherwise y is next
        });
    }

    render() {
        const history = this.state.history; 
        /* 
        history variable is in multiple places because in these places it instantiates itself off 
        the state history. the state of history may be different in handleClick and here 
        */
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
                    // key is a unique identifier for that component so react can differentiate between components
			return (
				<li key={move}> 
					<button onClick={() => this.jumpTo(move)}>{desc}</button>
				</li>
			);
    	});

        let status;
        if (winner) {
            status = "Winner: " + winner;
        } else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={i => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}
  
  
