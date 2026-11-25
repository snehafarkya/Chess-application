import { Hono } from "hono";
import Board from "../model/board.js";
import { serializeBoard, serializePiece } from "../server-view/serialize.js";

const api = new Hono();

api.get("/board", (c) => {
  const fen =
    c.req.query("fen") ||
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

  const board = Board.parse(fen);

  return Response.json(serializeBoard(board));
});

api.get("/board/square", (c) => {
  const square = c.req.query("square");
  const fen =
    c.req.query("fen") ||
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

  if (!/^[a-h][1-8]$/.test(square)) {
    return Response.json({ error: "Invalid square format." }, { status: 400 });
  }
  const board = Board.parse(fen);
  const piece = board.pieceAt(square);
  if (!piece) {
    return Response.json(null);
  }
  return Response.json(serializePiece(piece, square));
});

// api to get all pieces on the board, optionally filtered by color
api.get("/board/pieces", (c) => {
  const color = c.req.query("color");
  const fen =
    c.req.query("fen") ||
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

  if (color && !["white", "black"].includes(color)) {
    return Response.json({ error: "Invalid color." }, { status: 400 });
  }
  const board = Board.parse(fen);
  const pieces = board.pieces
    .filter(([square, piece]) => !color || piece.color === color)
    .map(([square, piece]) => serializePiece(piece, square));
  return Response.json(pieces);
});

export default api;
