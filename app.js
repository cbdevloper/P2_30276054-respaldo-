import express from 'express'
import dotenv from 'dotenv';
import indexRouter from './routes/routes.js';
import bodyParser from 'body-parser'

const app = express();
const PORT = process.env.PORT || 7000;

app.set("view engine", "ejs");
app.set("views", "./views");
dotenv.config();
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.render("index")
});

app.set('trust proxy', true); 
app.use(bodyParser.urlencoded({extended: true}));
app.use('/', indexRouter);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});   
  
