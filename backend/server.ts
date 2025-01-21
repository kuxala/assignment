import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import routes from './routes';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Use the routes
app.use('/api', routes);

app.use("/", (req,res ) => {
  res.send("Hello from express");
});
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
