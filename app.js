import path from "path";

import express from 'express';
import csrf from 'csurf';
import expressSession from 'express-session';
import { fileURLToPath } from 'url';

import createSessionConfig from './config/session.js';
import db from './data/database.js';
import addCsrfTokenMiddleware from './middlewares/csrf-token.js';
import errorHandlerMiddleware from './middlewares/error-handler.js';
import checkAuthStatusMiddleware from './middlewares/check-auth.js';
import protectRoutesMiddleware from './middlewares/protect-routes.js';
import cartMiddleware from './middlewares/cart.js';
import updateCartPricesMiddleware from './middlewares/update-cart-prices.js';
import notFoundMiddleware from "./middlewares/not-found.js";
import authRoutes from './routes/auth.routes.js';
import productsRoutes from './routes/products.routes.js';
import baseRoutes from './routes/base.routes.js';
import adminRoutes from './routes/admin.routes.js';
import cartRoutes from './routes/cart.routes.js';
import ordersRoutes from './routes/orders.routes.js';

// 현재 모듈의 파일 경로를 가져옵니다.
const __filename = fileURLToPath(import.meta.url);

// 현재 파일의 디렉토리 경로를 가져옵니다.
const __dirname = path.dirname(__filename);

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use('/products/assets', express.static('product-data'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));
app.use(csrf());

app.use(cartMiddleware);
app.use(updateCartPricesMiddleware);

app.use(addCsrfTokenMiddleware);
app.use(checkAuthStatusMiddleware);

app.use(baseRoutes);
app.use(authRoutes);
app.use(productsRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', protectRoutesMiddleware, ordersRoutes);
app.use('/admin', protectRoutesMiddleware, adminRoutes);

app.use(notFoundMiddleware);

app.use(errorHandlerMiddleware);

db.connectToDatabase()
  .then(function () {
    app.listen(3000);
  })
  .catch(function (error) {
    console.log('Failed to connect to the database!');
    console.log(error);
  });
