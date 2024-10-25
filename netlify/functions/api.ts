import express, { Router } from "express";
import serverless from "serverless-http";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 3000;

export async function handler(event: Object, context: Object) {
  const app: express.Express = express();
  const router = Router();

  router.get("/", (_req, res) => {
    res.send("Hi, Tom!");
  });

  app.use("/api/", router);

  return serverless(app)(event, context);
}
