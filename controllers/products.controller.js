import Product from "../models/product.model.js";

async function getAllProduct(req, res, next) {
  try {
    const products = await Product.findAll();
    res.render("customer/products/all-products", { products: products });
  } catch (error) {
    next(error);
  }
}

async function getProductDetails(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    res.render("customer/products/product-details", {product: product});
  } catch (error) {
    next(error);
  }
}

export default { getAllProduct, getProductDetails };
