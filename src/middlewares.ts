import { Request, Response, NextFunction } from "express";
import { QueryConfig } from "pg";
import { client } from "./database";
import { movieResult } from "./interfaces";

export const ensureMoviesExists = async (
  req: Request,
  resp: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id: number = parseInt(req.params.id);

  const queryString: string = `
        SELECT
            *
        FROM
            movies
        WHERE
            id = $1;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: movieResult = await client.query(queryConfig);

  if (!queryResult.rowCount) {
    return resp.status(404).json({
      message: "Movie not found.",
    });
  }

  return next();
};
