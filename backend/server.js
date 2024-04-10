import path from 'path';
import express from 'express';
const port = 5000;

const app = express();

app.use(express.json());

app.get('/api/hello', (req, res)=>{
  res.json({message: "Top Performers"})
});


const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/frontend/dist')));

app.get('*', (req, res) =>
  res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
);


app.listen(port, () => console.log(`Server started on port ${port}`));
