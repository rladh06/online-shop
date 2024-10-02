import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import Stripe from "stripe";

const stripe = new Stripe(
  "sk_test_51Q5NAdExJjQJ4bCg1byq3vKHEQgAUdiHCQIgRSoVFtv1cr4IF1dRZP01mMXAGGvg7EwNbpyo9mokZizlT76NrKNJ00g4ruLroy"
);

async function getOrders(req, res) {
  try {
    const orders = await Order.findAllForUser(res.locals.uid);
    res.render("customer/orders/all-orders", {
      orders: orders,
    });
  } catch (error) {
    next(error);
  }
}

async function addOrder(req, res, next) {
  const cart = res.locals.cart;
  let userDocument;
  try {
    userDocument = await User.findById(res.locals.uid);
  } catch (error) {
    return next(error);
  }

  const order = new Order(cart, userDocument);

  try {
    await order.save();
  } catch (error) {
    next(error);
    return;
  }

  req.session.cart = null;

  const session = await stripe.checkout.sessions.create({
    line_items: cart.items.map((item) => {
      return {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price_data: {
          currency: "usd",
          product_data: {
            name: item.product.title
          },
          unit_amount: +item.product.price.toFixed(2) * 100
        },
        quantity: item.quantity
      }
    }),
    mode: 'payment',
    success_url: `http://localhost:3000/orders/success`,
    cancel_url: `http://localhost:3000/orders/failure`,
  });

  res.redirect(303, session.url);

}

function getSuccess(req, res){
  res.render("customer/orders/success");
}


function getFailure(req, res){
  res.render("customer/orders/failure");
}

export default {
  addOrder,
  getOrders,
  getSuccess,
  getFailure
};
