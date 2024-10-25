import { Request, Response } from "express";

export const echoHelloWorld = (_req: Request, res: Response) => {
  res.send("Hello World!\n");
};
