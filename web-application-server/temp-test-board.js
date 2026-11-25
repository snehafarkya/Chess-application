import Board from "./src/model/board.js";
import {serializeBoard, serializeFenError, serializePiece} from "./src/server-view/serialize.js";
import { FenError } from "./src/errors.js";

const fen =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  const piece = Board.parse(fen).pieceAt("e1");
  console.log("Piece at e1:", piece ? serializePiece(piece, "e1") : "No piece found");

try {
  // Parse the FEN inside try
  const board = Board.parse(fen);

  console.log("Board parsed successfully!");

  console.log("Total pieces:", board.pieces.length);
  console.log("Is starting position:", board.isStartPosition());

  console.log("Original FEN:", fen);
  console.log("Generated FEN:", board.toFen());
  console.log("Match:", fen === board.toFen());

} catch (error) {
  console.log("An error occurred!");
  console.log("Error name:", error.name);
  console.log("Error message:", error.message);
  console.log("Invalid FEN:", error.fen);
  console.log("Error position:", error.at);
  console.log("Expected:", error.expected);
  console.log("Found:", error.found);
}

const board = Board.parse(
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
);

console.log(board.toString());
console.log(serializeBoard(board));
const error = new FenError(
  "8/8/8/8/8/8/8/9 w - - 0 1",
  {
    at: 14,
    expected: "a valid chess piece or digit between 1 and 8",
    found: "9",
  }
);

console.log(serializeFenError(error));