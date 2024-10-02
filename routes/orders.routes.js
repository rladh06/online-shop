import express from 'express';
import ordersController from '../controllers/orders.controller.js';

const router = express.Router();

router.post("/", ordersController.addOrder);

router.get("/", ordersController.getOrders);

router.get("/success", ordersController.getSuccess);

router.get("failure", ordersController.getFailure);

export default router;