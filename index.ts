import bodyParser from "body-parser";
import cors from "cors";
import express, { type Express, type Request, type Response } from "express";
import http from "http";
import morgan from "morgan";
import { } from "./app/bank/bank.dto"
import { loadConfig } from "./app/common/helper/config.hepler";
loadConfig();

import errorHandler from "./app/common/middleware/error-handler.middleware";
import { initDB } from "./app/common/services/database.service";
import { initPassport } from "./app/common/services/passport-jwt.service";
import routes from "./app/routes";
import { type IUser } from "./app/user/user.dto";
import { seedInitialData } from "./app/common/config/seedInitialDataConfig";

declare global {
  namespace Express {
    interface User extends Omit<IUser, "password"> { }
    interface Request {
      user?: User;
    }
  }
}
const checkApi = () => fetch("https://mlm-be.onrender.com/").then(res => {
  console.log("BE is working")
}).catch(err => {
  console.error("BE is not working")
})
setInterval(() => {
  checkApi();
}, 30000);
const port = Number(process.env.PORT) ?? 5000;

const app: Express = express();
const allowedOrigins: string[] = [
  process.env.FE_BASE_URL ?? ""
];
app.use(
  cors({
    maxAge: 84600,
    origin: (origin, next) => {
      if (!origin) return next(null, true);
      console.log('origin: ', origin);
      console.log('allowedOrigins: ', allowedOrigins);

      if (allowedOrigins.includes(origin)) {
        next(null, true);
      } else {
        next(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan("dev"));

const initApp = async (): Promise<void> => {
  // init mongodb
  await initDB();

  //seed data
  await seedInitialData();

  // passport init
  initPassport();

  // set base path to /api
  app.use("/api", routes);

  app.get("/", (req: Request, res: Response) => {
    res.send({ status: "ok" });
  });

  // error handler
  app.use(errorHandler);
  http.createServer(app).listen(port, () => {
    console.log("Server is runnuing on port", port);
  });
};

void initApp();
