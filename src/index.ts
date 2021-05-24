import express, { urlencoded } from "express";
import cors from "cors";
import routes from "./Routes";

let PORT: string = process.env.PORT || "5000";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cors());

//routes

app.use("/sftp", routes);

app.get("/", (req, res) => {
  res.send("Bioportal SFTP API");
});

app.listen(PORT);
