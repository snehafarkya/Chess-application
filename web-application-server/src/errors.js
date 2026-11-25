class FenError extends Error {
  constructor(fen, { at, length = 1, expected, found }) {
    const foundDescription =
      found === undefined || found === null ? "the end of the FEN" : `${found}`;
    const name = "FenError";

    super(
      `Invalid FEN: expected ${expected} at index ${at}, but found "${foundDescription}" in "${fen}"`,
    );

    this.name = name;
    this.fen = fen;
    this.at = at;
    this.length = length;
    this.expected = expected;
    this.found = foundDescription;
  }
}

export { FenError };

// More beautiful error messages, i.e. the error squiggles appear under the offending character.
// The message points at the wrong characters with a marker line:
//
//   Invalid FEN: expected a space, but found "K"
//
//     rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KK - 0 1
//                                                    ^
//
// class FenError extends Error {
//   constructor(fen, { at, length = 1, expected, found = null }) {
//     const shown = found === null ? "the end of the FEN" : `"${found}"`;
//     const marker = " ".repeat(at) + "^".repeat(length);
//     super(`Invalid FEN: expected ${expected}, but found ${shown}\n\n  ${fen}\n  ${marker}`);
//     this.name = "FenError";
//     this.fen = fen;
//     this.at = at;
//     this.length = length;
//     this.expected = expected;
//     this.found = found ?? "the end of the FEN";
//     this.marker = marker;
//   }
// }
