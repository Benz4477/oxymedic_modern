import Category from "../models/Category.js";

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ id: 1 });
    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findOne({ id: req.params.id });
    if (!category)
      return res.status(404).json({
        success: false,
        message: "Catégorie non trouvée",
      });
    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const lastCategory = await Category.findOne().sort({ id: -1 });
    const newId = lastCategory ? lastCategory.id + 1 : 1;
    const category = new Category({ ...req.body, id: newId });
    const newCategory = await category.save();
    res.status(201).json({
      success: true,
      data: newCategory,
      message: "Catégorie créée avec succès",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true },
    );
    if (!category)
      return res.status(404).json({
        success: false,
        message: "Catégorie non trouvée",
      });
    res.json({
      success: true,
      data: category,
      message: "Catégorie mise à jour avec succès",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({ id: req.params.id });
    if (!category)
      return res.status(404).json({
        success: false,
        message: "Catégorie non trouvée",
      });
    res.json({
      success: true,
      message: "Catégorie supprimée avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
