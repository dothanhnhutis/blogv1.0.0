import "express-async-errors";

import express, {
  type Express,
  Request,
  Response,
  NextFunction,
} from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";

import config from "@/config";
import { CustomError, IErrorResponse, NotFoundError } from "@/error-handler";
import { StatusCodes } from "http-status-codes";
import { appRoutes } from "./routes";
import deserializeCookie from "./middleware/deserializeCookie";
import deserializeUser from "./middleware/deserializeUser";

const app: Express = express();

app.set("trust proxy", 1);
app.use(morgan(config.NODE_ENV == "production" ? "combined" : "dev"));
app.use(helmet());
app.use(
  cors({
    origin: config.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(compression());
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ extended: true, limit: "200mb" }));
app.use(deserializeCookie);
app.use(deserializeUser);

appRoutes(app);

app.use("*", (req: Request, res: Response, next: NextFunction) => {
  throw new NotFoundError();
});

app.use(
  (error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json(error.serializeErrors());
    }
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ message: "Something went wrong" });
  }
);

export default app;
