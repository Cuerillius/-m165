import express, { type Request, type Response } from "express";

const app = express();
const port = 3000;

app.get("/metrics", (req: Request, res: Response) => {
  const randomNumber = Math.floor(Math.random() * 100) + 1;
  const metrics = `# HELP my_app_number A simple number from my Express app
  # TYPE my_app_number gauge
  my_app_number ${randomNumber}
  `;

  res.setHeader("Content-Type", "text/plain");
  res.send(metrics);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
