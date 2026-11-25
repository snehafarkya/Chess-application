import {Hono} from "hono";
import Board from "../model/board.js";
import {serializeBoard, serializePiece} from "../server-view/serialize.js";

const api = new Hono();

api.get("/board", (c) => {
    const fen = c.req.query("fen") || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

  const board = Board.parse(fen);

  return Response.json(serializeBoard(board));
});
api.get("/board/square", (c) => {
    const square = c.req.query("square");
    const fen = c.req.query("fen") || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

  const board = Board.parse(fen);

  const piece = board.pieceAt(square);
  if (!piece) {
    return Response.json(null);
  }

  return Response.json(serializePiece(piece, square));
});

export default api;
