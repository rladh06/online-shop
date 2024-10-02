import express from 'express';
import cartController from '../controllers/cart.controller.js';

const router = express.Router();

router.get("/", cartController.getCart); // /cart/

router.post("/items", cartController.addCartItem);

router.patch("/items", cartController.updateCartItem);

export default router;