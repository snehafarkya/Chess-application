import Piece from "../piece.js";
import { FenError } from "../errors.js";


const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];
const SYMBOLS = {
  K: "♔", Q: "♕", R: "♖", B: "♗", N: "♘", P: "♙",
  k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟",
};

class Board {
  // private field
  #square; 
  constructor() {
    this.#square = new Map();
    this.sideToMove = "white";
    this.castlingRights = {
      white: { kingside: false, queenside: false },
      black: { kingside: false, queenside: false },
    };
    this.enPassantSquare = "-";
    this.halfmoveClock = 0;
    this.fullmoveNumber = 1;
  }
  pieceAt(square) {
    return this.#square.get(square) ?? null;
  }

  //iterate to get all the pieces on the board and return them as an array of [square, piece] pairs. The squares are in algebraic notation (e.g., "e4") and the pieces are Piece objects. The array is sorted by rank (8 to 1) and file (a to h).
  get pieces() {
    const result = [];
    for (let rank = 8; rank >= 1; rank--) {
      for (const file of "abcdefgh") {
        const square = file + rank;
        const piece = this.pieceAt(square);
        if (piece !== null) {
          result.push([square, piece]);
        }
      }
    }
    return result;
  }

  // creating a addPiece method to add a piece to the board. I contains a letter and a square as parameters. It creates a new Piece object and adds it to the #square map with the square as the key.
  addPiece(letter, square) {
    const piece = new Piece(letter, square);
    this.#square.set(square, piece);
  }
  // creating a static parse method to parse a FEN string and create a new Board object. It splits the FEN string into its fields and creates a new Board object. It returns the new Board object.
  static parse(fen) {
    // first ensure that the given FEN string is valid
    const matches = [...fen.matchAll(/\S+/g)];
    const fields = matches.map((match) => match[0]);

    if (fields.length !== 6) {
      const missingFields = fields.length < 6;

      const at = missingFields ? fen.length : matches[6].index;

      const found = missingFields ? null : matches[6][0];

      throw new FenError(fen, {
        at,
        expected: "exactly six FEN fields",
        found,
      });
    }
    const [
      piecePlacement,
      activeColor,
      castling,
      enPassant,
      halfmoveClock,
      fullmoveNumber,
    ] = fields;
    Board.validatePiecePlacement(piecePlacement, fen);
    // validate active color
    if (activeColor !== "w" && activeColor !== "b") {
      throw new FenError(fen, {
        at: matches[1].index,
        expected: 'either "w" or "b"',
        found: activeColor,
      });
    }
    // validating castling rights
    if (!/^(K?Q?k?q?|[-])$/.test(castling)) {
      throw new FenError(fen, {
        at: matches[2].index,
        expected: 'a valid castling rights string (e.g., "KQkq" or "-")',
        found: castling,
      });
    }
    // validating en passant square
    if (!/^([a-h][36]|[-])$/.test(enPassant)) {
      throw new FenError(fen, {
        at: matches[3].index,
        expected: 'a valid en passant square (e.g., "e3", "d6", or "-")',
        found: enPassant,
      });
    }
    // validating halfmove clock
    if (!/^\d+$/.test(halfmoveClock)) {
      throw new FenError(fen, {
        at: matches[4].index,
        expected: "a non-negative integer",
        found: halfmoveClock,
      });
    }
    // validating fullmove number
    if (!/^\d+$/.test(fullmoveNumber) || Number(fullmoveNumber) < 1) {
      throw new FenError(fen, {
        at: matches[5].index,
        expected: "a positive integer",
        found: fullmoveNumber,
      });
    }
    const board = new Board();
    board.sideToMove = activeColor === "w" ? "white" : "black";
    //parsing castling rights
    board.castlingRights = {
      white: {
        kingside: castling.includes("K"),
        queenside: castling.includes("Q"),
      },
      black: {
        kingside: castling.includes("k"),
        queenside: castling.includes("q"),
      },
    };

    board.enPassantSquare = enPassant;
    board.halfmoveClock = Number(halfmoveClock);
    board.fullmoveNumber = Number(fullmoveNumber);

    const ranks = piecePlacement.split("/");

    for (let rankIndex = 0; rankIndex < ranks.length; rankIndex++) {
      const rank = ranks[rankIndex];
      //fileindex is basically column index
      let fileIndex = 0;

      for (const symbol of rank) {
        if (symbol >= "1" && symbol <= "8") {
          fileIndex += Number(symbol);
        } else {
          const file = "abcdefgh"[fileIndex];
          const chessRank = 8 - rankIndex;
          const square = file + chessRank;

          board.addPiece(symbol, square);
          fileIndex++;
        }
      }
    }
    return board;
  }

  //method to validate the eight ranks of a FEN string
  
static validatePiecePlacement(piecePlacement, fen) {
  const ranks = piecePlacement.split("/");
  const placementStart = fen.indexOf(piecePlacement);

  if (ranks.length !== 8) {
    throw new FenError(fen, {
      at: placementStart,
      expected: "8 ranks",
      found: piecePlacement,
    });
  }

  let rankStart = placementStart;

  for (const rank of ranks) {
    let squareCount = 0;

    for (let i = 0; i < rank.length; i++) {
      const symbol = rank[i];
      const at = rankStart + i;

      if (symbol >= "1" && symbol <= "8") {
        squareCount += Number(symbol);
      } else if ("KQRBNPkqrbnp".includes(symbol)) {
        squareCount++;
      } else {
        throw new FenError(fen, {
          at,
          expected: "a valid chess piece or digit between 1 and 8",
          found: symbol,
        });
      }
    }

    if (squareCount !== 8) {
      throw new FenError(fen, {
        at: rankStart,
        expected: "exactly eight squares in each rank",
        found: rank,
      });
    }

    // Move to the beginning of the next rank.
    rankStart += rank.length + 1;
  }
}

  //this method checks if the board is at starting position or not. The blank spaces are very important for measurement
  isStartPosition() {
    const startingPieces =
      "rnbqkbnr" +
      "pppppppp" +
      "        " +
      "        " +
      "        " +
      "        " +
      "PPPPPPPP" +
      "RNBQKBNR";
    let currentPieces = "";
    for (let rank = 8; rank >= 1; rank--) {
      for (const file of "abcdefgh") {
        const piece = this.pieceAt(file + rank);
        currentPieces += piece ? piece.letter : " ";
      }
    }

    return currentPieces === startingPieces && this.sideToMove === "white";
  }

  //now to convert board back tofen

  toFen() {
    const ranks = [];

    for (let rank = 8; rank >= 1; rank--) {
      let row = "";
      let emptyCount = 0;

      for (const file of "abcdefgh") {
        const piece = this.pieceAt(file + rank);

        if (piece === null) {
          emptyCount++;
        } else {
          if (emptyCount > 0) {
            row += emptyCount;
            emptyCount = 0;
          }

          row += piece.letter;
        }
      }

      if (emptyCount > 0) {
        row += emptyCount;
      }

      ranks.push(row);
    }

    // Convert all eight ranks into piece placement
    const piecePlacement = ranks.join("/");

    // Convert active color
    const activeColor = this.sideToMove === "white" ? "w" : "b";

    // Convert castling rights
    let castling = "";

    if (this.castlingRights.white.kingside) castling += "K";
    if (this.castlingRights.white.queenside) castling += "Q";
    if (this.castlingRights.black.kingside) castling += "k";
    if (this.castlingRights.black.queenside) castling += "q";

    if (castling === "") castling = "-";

    // Convert en passant
    const enPassant = this.enPassantSquare ?? "-";

    // Return complete FEN
    return `${piecePlacement} ${activeColor} ${castling} ${enPassant} ${this.halfmoveClock} ${this.fullmoveNumber}`;
  }

  // implementing the toString() method 
  toString() {
  const rows = [];

  for (let rank = 8; rank >= 1; rank--) {
    const row = FILES.map(
      (file) => SYMBOLS[this.pieceAt(file + rank)?.letter] ?? "·",
    );
    rows.push(`${rank} ${row.join(" ")}`);
  }
  rows.push("  a b c d e f g h");
  return rows.join("\n");
}

}
export default Board;
