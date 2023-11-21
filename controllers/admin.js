const Product = require("../models/product");
const { Op } = require("sequelize");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = async (req, res, next) => {
  try {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    await Product.create({ title, price, imageUrl, description });
    res.redirect("/admin/products");
  } catch (e) {
    console.log("Err at postAddProduct");
  }
};

exports.getEditProduct = async (req, res, next) => {
  try {
    const editMode = req.query.edit;
    if (!editMode) {
      return res.redirect("/");
    }
    const prodId = req.params.productId;
    // // One way
    const product = await Product.findOne({
      where: { id: { [Op.eq]: prodId } },
    });
    if (!product) {
      return res.redirect("/");
    }
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
    });

    // // Second way
    // const product = await Product.findByPk(prodId);
    // if (!product) {
    //   return res.redirect("/");
    // }
    // res.render("admin/edit-product", {
    //   pageTitle: "Edit Product",
    //   path: "/admin/edit-product",
    //   editing: editMode,
    //   product: product,
    // });
  } catch (e) {
    console.log("Err at getEditProduct", e);
  }
};

exports.postEditProduct = async (req, res, next) => {
  try {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;

    const product = await Product.findByPk(prodId);
    if (!product) {
      throw new Error("Invalid product id");
    }
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.imageUrl = updatedImageUrl;
    product.description = updatedDesc;
    await product.save();
    res.redirect("/admin/products");
  } catch (e) {
    console.log("Err at postEditProduct");
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const response = await Product.findAll();
    res.render("admin/products", {
      prods: response,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  } catch (e) {
    console.log("Err at getProducts");
  }
};

exports.postDeleteProduct = async (req, res, next) => {
  try {
    const prodId = req.body.productId;
    const product = await Product.findByPk(prodId);
    if (!product) {
      throw new Error("Invalid product id");
    }
    await product.destroy();
    res.redirect("/admin/products");
  } catch (e) {
    console.log("Err at postDeleteProduct");
  }
  // const prodId = req.body.productId;
  // Product.deleteById(prodId);
  // res.redirect("/admin/products");
};
