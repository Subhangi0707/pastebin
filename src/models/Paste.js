import mongoose from "mongoose";

const PasteSchema = new mongoose.Schema(
  {
    _id: {
      type: String,          // ✅ IMPORTANT
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    expires_at: {
      type: Date,
      default: null,
    },
    max_views: {
      type: Number,
      default: null,
    },
    view_count: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Paste ||
  mongoose.model("Paste", PasteSchema);
