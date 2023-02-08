import { Request, Response } from "express";
import { QueryConfig } from "pg";
import format from "pg-format";
import { client } from "./database";
import { IMovie, movieResult } from "./interfaces";

export const createMovie = async (
  req: Request,
  resp: Response
): Promise<Response> => {
  const orderDataRequest: IMovie = req.body;

  const queryString: string = format(
    `
        INSERT INTO
            movies(%I)
        VALUES
            (%L)
        RETURNING *;
    `,

    Object.keys(orderDataRequest),
    Object.values(orderDataRequest)
  );

  const queryResult: movieResult = await client.query(queryString);

  const newMovieOrder: IMovie = queryResult.rows[0];

  return resp.status(201).json(newMovieOrder);
};

export const createMovieFormat = async (
  req: Request,
  resp: Response
): Promise<Response> => {
  return resp.status(201).json();
};

export const listMovies = async (
  req: Request,
  resp: Response
): Promise<Response> => {
  let page: number = req.query.page === undefined ? 0 : Number(req.query.page);
  const perPage: number =
    req.query.perPage === undefined ? 5 : Number(req.query.perPage);

  page = page * perPage;

  const queryString: string = `
        SELECT
            *   
        FROM
            movies
        LIMIT $1 OFFSET $2;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [perPage, page],
  };

  const queryResult: movieResult = await client.query(queryConfig);

  return resp.status(200).json(queryResult.rows);
};

export const deleteMovie = async (
  req: Request,
  resp: Response
): Promise<Response> => {
  const id: number = Number(req.params.id);

  const queryString: string = `
        DELETE FROM 
            movies
        WHERE
            id = $1;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: movieResult = await client.query(queryConfig);

  return resp.status(204).json();
};

export const updateMovie = async (
  req: Request,
  resp: Response
): Promise<Response> => {
  const id: number = Number(req.params.id);

  const orderData = Object.values(req.body);
  const orderKeys = Object.keys(req.body);

  const formatString: string = format(
    `
        UPDATE
            movies
        SET(%I) = ROW(%L)
        WHERE
            id = $1
        RETURNING *;

    `,
    orderKeys,
    orderData
  );

  const queryConfig: QueryConfig = {
    text: formatString,
    values: [id],
  };

  const queryResult: movieResult = await client.query(queryConfig);

  return resp.status(200).json(queryResult.rows[0]);
};
