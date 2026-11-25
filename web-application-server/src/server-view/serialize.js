export function serializeBoard(board) {
      return {
    fen: board.toFen(),
    sideToMove: board.sideToMove,
    castlingRights: board.castlingRights,
    enPassantSquare: board.enPassantSquare,
    halfmoveClock: board.halfmoveClock,
    fullmoveNumber: board.fullmoveNumber,
    startPosition: board.isStartPosition(),

   pieces: board.pieces.map(([square, piece]) => ({
      letter: piece.letter,
      color: piece.color,
      name: piece.name,
      square: square,
    })),
    printed: board.toString().split("\n"),

  };

}


export function serializeError(error) {
  return {
    error: error.message,
  };
}

export function serializeFenError(error) {
  return {
    error: error.message,
    fen: error.fen,
    at: error.at,
    length: error.length,
    expected: error.expected,
    found: error.found,
  };
}