import { Client } from "@notionhq/client";

import { Request, Response } from "express";

export const getNotionData = async (req: Request, res: Response) => {
  const notionClient = new Client({
    auth: process.env.NOTION_IG_SECRET,
  });
  const { token } = req.query;

  console.log({ token });

  if (typeof token !== "string") {
    res.status(400).send("Invalid token");
    return;
  }

  // POST https://api.line.me/oauth2/v2.1/verifyでLINEのIDトークンを検証
  const lineResponse = await fetch(`https://api.line.me/oauth2/v2.1/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      id_token: token,
      client_id: process.env.LINE_CHANNEL_ID!,
    }),
  });
  const lineResponseJson = await lineResponse.json();

  console.log(lineResponseJson);

  const targetUserId = lineResponseJson["sub"];

  const notionResponse = await notionClient.databases.query({
    database_id: process.env.NOTION_DB_ID!,
    filter: {
      property: "userId",
      rich_text: {
        equals: targetUserId,
      },
    },
  });

  const properties = JSON.parse(
    JSON.stringify(notionResponse.results[0])
  ).properties;
  const userId = properties.userId.rich_text[0].plain_text;
  const point = properties.point.number;

  res.status(200).json({ userId, point });
};
