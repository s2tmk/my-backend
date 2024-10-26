import { Client } from "@notionhq/client";

import { Request, Response } from "express";

export const getNotionData = async (req: Request, res: Response) => {
  const notionClient = new Client({
    auth: process.env.NOTION_IG_SECRET,
  });
  const { userId: targetUserId } = req.query;
  if (typeof targetUserId !== "string") {
    res.status(400).send("Invalid userId");
    return;
  }
  const response = await notionClient.databases.query({
    database_id: process.env.NOTION_DB_ID!,
    filter: {
      property: "userId",
      rich_text: {
        equals: targetUserId,
      },
    },
  });

  const properties = JSON.parse(JSON.stringify(response.results[0])).properties;
  const userId = properties.userId.rich_text[0].plain_text;
  const point = properties.point.number;

  res.status(200).json({ userId, point });
};
