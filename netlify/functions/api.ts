import cors from "cors";
import dotenv from "dotenv";
import express, { Router } from "express";
import serverless from "serverless-http";
import { echoHelloWorld } from "./hello";
import { getNotionData } from "./notion";

dotenv.config();

const localFrontendUrl = `http://localhost:5173`;
const frontendUrl = process.env.FRONTEND_URL ?? "";

const initApp = () => {
  const app: express.Express = express();
  const router = Router();

  router.get("/", (_req, res) => {
    res.send("Echo!\n");
  });

  router.get("/hello", echoHelloWorld);
  router.get("/notion", getNotionData);

  app.use(
    cors({
      origin: [frontendUrl, localFrontendUrl],
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
  app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
  });
}
