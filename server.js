import express from "express";
import { getToken } from "./token.js";
import morgan from "morgan";

const app = express();
const port = 3000;
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

app.get("/get-token", async (req, res) => {
  try {
    const token = await getToken();
    res.json(token);
  } catch (error) {
    res.statusCode = 500;
    res.json({ error });
  }
});

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
