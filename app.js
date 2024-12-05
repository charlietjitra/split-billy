import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { fileURLToPath } from 'url';
import indexRouter from './app/routes/public/index.js';
import authRouter from './app/routes/public/auth.js';
import passport from 'passport';
import session from 'express-session';
import mongoose, { mongo } from 'mongoose';
import dotenv from 'dotenv';
import methodOverride from 'method-override';
import expenseRoutes from './app/routes/private/expense.js';
import historyRoutes from './app/routes/private/history.js';
import groupRoutes from './app/routes/private/group.js';

dotenv.config()
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//setup mongoose
const mongoURI = process.env.NODE_ENV === 'production' ? process.env.MONGO_URI_PROD : process.env.MONGO_URI_DEV;
mongoose.connect(mongoURI)
.then(() => console.log("Connected to MongoDB", mongoURI))
.catch((err) => console.error("MongoDB connection error:", err));

// view engine setup
app.set('views', path.join(__dirname, 'app', 'views'));
app.set('view engine', 'ejs');

app.use(methodOverride('_method'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));  

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/split/group', groupRoutes);   
app.use('/split/expense', expenseRoutes); 
app.use('/split/history', historyRoutes); 


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // send JSON response
  res.status(err.status || 500).json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

export const createServer = () => {
  const port = process.env.PORT || 3000;
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  return { server, port }
}

createServer();

export default app;
