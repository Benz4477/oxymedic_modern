import Permission from "../models/Permission.js";

const getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find({});
    res.json(permissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPermissionByModule = async (req, res) => {
  try {
    const permission = await Permission.findOne({ module: req.params.module });
    if (!permission)
      return res.status(404).json({ message: "Permission non trouvée" });
    res.json(permission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPermission = async (req, res) => {
  try {
    const permission = new Permission(req.body);
    const newPermission = await permission.save();
    res.status(201).json(newPermission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updatePermission = async (req, res) => {
  try {
    const permission = await Permission.findOneAndUpdate(
      { module: req.params.module },
      req.body,
      { new: true },
    );
    if (!permission)
      return res.status(404).json({ message: "Permission non trouvée" });
    res.json(permission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deletePermission = async (req, res) => {
  try {
    const permission = await Permission.findOneAndDelete({
      module: req.params.module,
    });
    if (!permission)
      return res.status(404).json({ message: "Permission non trouvée" });
    res.json({ message: "Permission supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getAllPermissions,
  getPermissionByModule,
  createPermission,
  updatePermission,
  deletePermission,
};
