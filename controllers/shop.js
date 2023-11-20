const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = async (req, res, next) => {
  try {
    const response = await Product.findAll();
    res.render("shop/product-list", {
      prods: response,
      pageTitle: "All Products",
      path: "/products",
    });
  } catch (e) {
    console.log("Err at getProducts");
  }
};

exports.getProduct = async (req, res, next) => {
  // // One way
  try {
    const prodId = req.params.productId;
    let response = await Product.findByPk(prodId);
    res.render("shop/product-detail", {
      product: response,
      pageTitle: response.title,
      path: "/products",
    });
  } catch (e) {
    console.log("Err at getProduct", e);
  }
  // // Second way
  // try {
  //   const prodId = req.params.productId;
  //   let response = await Product.findAll({ where: { id: prodId } });
  //   res.render("shop/product-detail", {
  //     product: response[0],
  //     pageTitle: response[0].title,
  //     path: "/products",
  //   });
  // } catch (e) {
  //   console.log("Err at getProduct", e);
  // }
};

exports.getIndex = async (req, res, next) => {
  try {
    const response = await Product.findAll();
    res.render("shop/index", {
      prods: response,
      pageTitle: "Shop",
      path: "/",
    });
  } catch (e) {
    console.log("Err at getIndex");
  }
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find((prod) => prod.id === product.id);
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: cartProducts,
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect("/cart");
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect("/cart");
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
