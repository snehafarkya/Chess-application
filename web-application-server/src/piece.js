export const NAMES = {
  k: "king",
  q: "queen",
  r: "rook",
  b: "bishop",
  n: "knight",
  p: "pawn",
};

class Piece {
  #square;
  #color;
  #letter;

  constructor(letter, square) {
    if (letter.toUpperCase() === letter) {
      this.#color = "white";
    } else {
      this.#color = "black";
    }

    this.#square = square;
    this.#letter = letter;
  }

  get letter() {
    return this.#letter;
  }

  get square() {
    return this.#square;
  }

  get color() {
    return this.#color;
  }

  get name() {
    return NAMES[this.#letter.toLowerCase()];
  }
}

export default Piece;

// Copy this method into your class Board, together with the two constants.
// It prints the board as Unicode text and only needs your pieceAt.
// console.log(`${board}`) calls toString(). console.log(board) prints the raw object.
// The outlined symbols stand for White and the filled ones for Black, so on a dark terminal the colors MIGHT look swapped.
//
// const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];
//
// const SYMBOLS = {
//   K: "♔", Q: "♕", R: "♖", B: "♗", N: "♘", P: "♙",
//   k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟",
// };
//
// toString() {
//   const rows = [];
//   for (let rank = 8; rank >= 1; rank--) {
//     const row = FILES.map(
//       (file) => SYMBOLS[this.pieceAt(file + rank)?.letter] ?? "·",
//     );
//     rows.push(`${rank} ${row.join(" ")}`);
//   }
//   rows.push("  a b c d e f g h");
//   return rows.join("\n");
// }
