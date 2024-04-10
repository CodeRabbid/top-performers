import express from 'express';
const port = 5000;

const app = express();

app.use(express.json());

app.get('/api/hello', (req, res)=>{
  res.json({message: "Top Performers"})
});

app.listen(port, () => console.log(`Server started on port ${port}`));
