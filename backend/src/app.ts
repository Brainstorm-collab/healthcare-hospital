import cors from "cors";
import express from "express";
import router from "./routes";

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(
    express.json({
      limit: "10mb",
    }),
  );
  app.use(
    express.urlencoded({
      extended: true,
      limit: "10mb",
    }),
  );

  app.use("/api", router);

  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    if (err instanceof Error) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  });

  return app;
};

