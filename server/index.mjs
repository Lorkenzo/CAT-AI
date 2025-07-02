// imports
import {json} from 'express';
import morgan from 'morgan';
import express from 'express';
import cors from 'cors';
import routes from './src/routes.mjs'
import passport from 'passport';
import session from 'express-session';
import path from 'path';

// init express
const app = new express();
const port = 3001;

//Middleware
app.use(json());
app.use(morgan('dev'));
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use(session({
  secret: "shhhhh... it's a secret!",
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.authenticate('session'));

app.use("/api",routes);

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

export{app}