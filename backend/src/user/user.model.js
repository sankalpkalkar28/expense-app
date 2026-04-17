import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: "user",
        enum: ["user"]
    }
},{ timestamps:true });

/* HASH PASSWORD */
// userSchema.pre("save", async function () {
//     if(!this.isModified("password")) return;
//     this.password = await bcrypt.hash(this.password,12);
// });
// userSchema.pre('save', async function (next) {
//     const hashedPass = await bcrypt.hash(this.password.toString(),12);
//     this.password = hashedPass;
//     next();
// });

/* PASSWORD COMPARE METHOD */
userSchema.methods.comparePassword = async function(password){
    return bcrypt.compare(password,this.password);
};

const UserModel = model("User", userSchema);
export default UserModel;