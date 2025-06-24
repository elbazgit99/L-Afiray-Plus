import mongoose from "mongoose";

const roleSchema = mongoose.Schema({
    role_name: {
        type: String,
        required: true,
    },
});

export default mongoose.model("Role", roleSchema);
