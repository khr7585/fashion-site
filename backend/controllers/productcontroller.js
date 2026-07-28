const product = require("../models/product");

//ADD
const addproduct = async (req, res) => {
  try {
    const newproduct = await product.create(req.body);
    res.status(201).json({
      success: true,
      message: "product added successfully",
      product:newproduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get all
const getproducts = async (req, res) => {
  try {
    const products = await product.find();
    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//GET single
const getproductbyid = async (req, res) => {
  try {
    const foundproduct = await product.findById(req.params.id);
    if (!foundproduct) {
      return res.status(404).json({
        success: false,
        message: "product not found",
      });
    }
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//update
const updateproduct = async (req, res) => {
  try {
    const updateproduct = await product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updateproduct) {
      return res.status(404).json({
        success: false,
        message: "product not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "prodcut updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//DELETE
const deleteproduct = async (req, res) => {
  try {
    const foundproduct = await product.findById(req.params.id);

    if (!foundproduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addproduct,
  getproducts,
  getproductbyid,
  updateproduct,
  deleteproduct,
};
