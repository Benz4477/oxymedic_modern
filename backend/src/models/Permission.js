import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema(
  {
    module: {
      type: String,
      required: true,
    },
    roles: {
      admin: {
        type: Boolean,
        default: false,
      },
      employe: {
        type: Boolean,
        default: false,
      },
      livreur: {
        type: Boolean,
        default: false,
      },
      caissier: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Permission", permissionSchema);
