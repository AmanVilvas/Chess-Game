const express = require("express");
const socket = require("socket.io");
const http = require("http");
const { Chess } = require("chess.js");
const path = require("path");

const app = express();

const server = http.createServer(app);
const io = socket(server);

// Create an instance of Chess
const chess = new Chess();
let players = {};
let currentPlayer = "w";

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
//used for font, photos, videos etc

app.get("/", (req, res) => {
    res.render("index", { title: "Chess Game" });
});

//uniquesocket--> unique information about the joined user
io.on("connect", function (uniquesocket) {
    console.log("someone has joined");

    //first come first serve rule is applied here for the player Role segment
    //isme ham assign kar rahe hai players ko white and black role
    //1st user aaya khelne to ham check karenge white hai present nhi hai to uniquesocket(info of user) ko white create karke assign kardoooo
    if (!players.white) {
        players.white = uniquesocket.id;
        uniquesocket.emit("playerRole", "w");
    } else if (!players.black) {
        //isme hamne dekha white kisi ko mil rakha hai to 2nd player aaya hai uske lie black create hua and assign hogya 
        players.black = uniquesocket.id;
        uniquesocket.emit("playerRole", "b");
    } else {
        uniquesocket.emit("spectatorRole");
    }
    // Handle player disconnection
    uniquesocket.on("disconnect", function () {
        if (uniquesocket.id === players.white) {
            delete players.white;
        } else if (uniquesocket.id === players.black) {
            delete players.black;
        }
    });

    // Handle moves made by players
    uniquesocket.on("move", (move) => {
        try {
            // Ensure it's the correct player's turn
            if (chess.turn() === "w" && uniquesocket.id !== players.white) return;
            if (chess.turn() === "b" && uniquesocket.id !== players.black) return;

            // Make the move using chess.js
            const result = chess.move(move);
            if (result) {
                currentPlayer = chess.turn();
                io.emit("move", move); // Broadcast the move to all clients
                io.emit("boardstate", chess.fen()); // Broadcast the updated board state (FEN)
            } else {
                console.log("Invalid move:", move);
                uniquesocket.emit("Invalid move", move); // Notify the player about the invalid move
            }
        } catch (err) {
            console.log(err);
            uniquesocket.emit("Invalid move", move);
        }
    });
});

server.listen(3000, function () {
    console.log("Server is live on port 3000");
});
