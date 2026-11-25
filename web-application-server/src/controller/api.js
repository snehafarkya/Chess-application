import {Hono} from "hono";
import Board from "../model/board.js";
import {serializeBoard} from "../server-view/serialize.js";

const api = new Hono();

api.get("/board", (c) => {
    const fen = c.req.query("fen") || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

  const board = Board.parse(fen);

  return Response.json(serializeBoard(board));
});


export default api;
