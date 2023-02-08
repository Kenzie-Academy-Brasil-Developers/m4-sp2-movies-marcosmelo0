import { QueryResult } from "pg";

export interface IMovie {
  name: string;
  description: string;
  duration: number;
  price: number;
}

export type movieResult = QueryResult<IMovie>;
