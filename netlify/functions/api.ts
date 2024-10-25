import cors from "cors";
import dotenv from "dotenv";
import express, { Router } from "express";
import serverless from "serverless-http";
import { echoHelloWorld } from "./hello";

dotenv.config();

const port = process.env.PORT || 5173;
const localUrl = `http://localhost:${port}`;
const frontendUrl = process.env.FRONTEND_URL || localUrl;

const initApp = () => {
  const app: express.Express = express();
  const router = Router();

  router.get("/", (_req, res) => {
    res.send("Echo!\n");
  });

  router.get("/hello", echoHelloWorld);

  app.use(
    cors({
      origin: [frontendUrl, localUrl],
      credentials: true,
      optionsSuccessStatus: 200,
    })
  );
  app.use("/api/", router);

  return app;
};

export async function handler(event: Object, context: Object) {
  const app = initApp();
  return serverless(app)(event, context);
}

// ローカルデバッグ用
if (require.main === module) {
  const app = initApp();
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}
