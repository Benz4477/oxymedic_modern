import User from "../models/User.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des utilisateurs",
      error: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id }).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de l'utilisateur",
      error: error.message,
    });
  }
};

const createUser = async (req, res) => {
  try {
    const lastUser = await User.findOne().sort({ id: -1 });
    const newId = lastUser ? lastUser.id + 1 : 1;

    const userData = {
      ...req.body,
      id: newId,
    };

    const user = new User(userData);
    await user.save();

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(201).json({
      success: true,
      data: userWithoutPassword,
      message: "Utilisateur créé avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de l'utilisateur",
      error: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({ id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    res.json({
      success: true,
      data: user,
      message: "Utilisateur mis à jour avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour de l'utilisateur",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ id: req.params.id });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    res.json({
      success: true,
      message: "Utilisateur supprimé avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de l'utilisateur",
      error: error.message,
    });
  }
};

export { getAllUsers, getUserById, createUser, updateUser, deleteUser };
