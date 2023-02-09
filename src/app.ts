import express, { Application } from "express";
import { startDatabase } from "./database";
import {
  createMovie,
  createMovieFormat,
  deleteMovie,
  listMovies,
  updateMovie,
} from "./functions";
import { ensureMoviesExists } from "./middlewares";

const app: Application = express();
app.use(express.json());

app.post("/movies", createMovie);
app.post("/movies", ensureMoviesExists, createMovieFormat);
app.get("/movies", listMovies);
app.delete("/movies/:id", ensureMoviesExists, deleteMovie);
app.patch("/movies/:id", ensureMoviesExists, updateMovie);

app.listen(3000, async () => {
  await startDatabase();
  console.log("Server is running!");
});
