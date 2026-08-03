import express from "express";           
import cors from "cors";

import router from "./routes";

const app = express();

app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use("/", router);

export default app;