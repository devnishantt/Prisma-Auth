import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import { PORT } from "./config/serverConfig";
import logger from "./config/loggerConfig";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/health", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is live!" });
});

app.listen(PORT, () => {
  logger.info(`Server is running on: http://localhost:${PORT}/`);
});
