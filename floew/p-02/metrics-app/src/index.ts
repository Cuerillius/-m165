import express, { type Request, type Response } from "express";

const app = express();
const port = 3000;

app.get("/metrics", (req: Request, res: Response) => {
  const randomNumber = Math.floor(Math.random() * 100) + 1;
  res.setHeader("Content-Type", "text/plain");
  res.send(randomNumber.toString());
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
