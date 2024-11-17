const socket = io();
// ab io frontend se bhi connect hogya 

const chess = new Chess();
const boardElement = document.querySelector(".chessboard");

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

// Function to render the chessboard
const renderBoard = () => {
    const board = chess.board(); // imaginary board
    boardElement.innerHTML = ""; // chess board mai kuch bhi hai to clear hojayega

    // Flip the board if the player is Black
    if (playerRole === "b") {
        boardElement.classList.add("flipped");
    } else {
        boardElement.classList.remove("flipped");
    }

    board.forEach((row, rowindex) => { // har square ko dekhenge and white ya black mark karenge
        row.forEach((square, squareindex) => {
            const squareElement = document.createElement("div");
            squareElement.classList.add(
                "square",
                (rowindex + squareindex) % 2 === 0 ? "light" : "dark"
            );

            squareElement.dataset.row = rowindex;
            squareElement.dataset.col = squareindex;

            // jo square hai usme piece present hai ya nhi
            if (square) {
                const pieceElement = document.createElement("div");
                pieceElement.classList.add(
                    "piece",
                    square.color === "w" ? "white" : "black"
                );

                // Use the getPieceUnicode function to set the correct Unicode for the piece
                pieceElement.innerText = getPieceUnicode(square.color, square.type); // Update to use Unicode
                pieceElement.draggable = true; // Piece ko drag karne layak banana

                pieceElement.addEventListener("dragstart", (e) => {
                    draggedPiece = pieceElement;
                    sourceSquare = { row: rowindex, col: squareindex };
                    e.dataTransfer.setData("text/plain", ""); // to make draggable smooth
                    pieceElement.classList.add("dragging"); // Add dragging class for visual feedback
                });

                pieceElement.addEventListener("dragend", (e) => {
                    draggedPiece = null;
                    sourceSquare = null;
                    pieceElement.classList.remove("dragging"); // Remove dragging class
                });

                squareElement.appendChild(pieceElement);
            }

            squareElement.addEventListener("dragover", (e) => {
                e.preventDefault(); // Drop ko allow karna
            });

            squareElement.addEventListener("drop", (e) => {
                e.preventDefault(); // Correct the typo here
                if (draggedPiece) {
                    const targetSource = {
                        row: parseInt(squareElement.dataset.row),
                        col: parseInt(squareElement.dataset.col),
                    };

                    handleMove(sourceSquare, targetSource);
                }
            });

            // Append the square element to the board element
            boardElement.appendChild(squareElement); // Har square ko board mein add karna
        });
    });
};

// Function to handle moving pieces
const handleMove = (from, to) => {
    const move = chess.move({
        from: `${String.fromCharCode(97 + from.col)}${8 - from.row}`,
        to: `${String.fromCharCode(97 + to.col)}${8 - to.row}`,
    });

    if (move) {
        renderBoard(); // Move ke baad board ko dobara render karna
        // Emit the move to the server with updated FEN
        socket.emit("move", { 
            from: `${String.fromCharCode(97 + from.col)}${8 - from.row}`,
            to: `${String.fromCharCode(97 + to.col)}${8 - to.row}`,
            fen: chess.fen(), // Send the current board state (FEN)
        });
    }

    // Check for game over (checkmate, stalemate, or draw)
    if (chess.game_over()) {
        setTimeout(() => {
            alert(chess.in_checkmate() ? "Checkmate!" : "Game Over - Stalemate or Draw!");
        }, 100); // Delay to allow board rendering before showing the message
    }
};

// Function to get Unicode symbol for the piece
const getPieceUnicode = (color, type) => {
    const unicodePieces = {
        "w": {
            "p": "♙", // White Pawn
            "r": "♖", // White Rook
            "n": "♘", // White Knight
            "b": "♗", // White Bishop
            "q": "♕", // White Queen
            "k": "♔", // White King
        },
        "b": {
            "p": "♟", // Black Pawn
            "r": "♜", // Black Rook
            "n": "♞", // Black Knight
            "b": "♝", // Black Bishop
            "q": "♛", // Black Queen
            "k": "♚", // Black King
        }
    };

    return unicodePieces[color] ? unicodePieces[color][type] : "";
};

// Listen for board state update from the server
socket.on("boardState", (fen) => {
    chess.load(fen); // Load the board state from the server
    renderBoard(); // Re-render the board
});

// Listen for player role from the server
socket.on("playerRole", (role) => {
    playerRole = role;  // Store the player's role (either 'w' or 'b')
    renderBoard(); // Re-render the board to apply board flipping
});

// Listen for moves broadcasted from the server
socket.on("move", (moveData) => {
    // Update the board based on the move received
    chess.move({
        from: moveData.from,
        to: moveData.to
    });
    renderBoard(); // Re-render the board with updated move
});

renderBoard();
