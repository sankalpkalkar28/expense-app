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
        default: false,
        description: "User account status"
    },
    role: {
        type: String,
        default: "user",
        enum: ["user","admin"],
        description: "User permissions level"
    },
    mobile: {
       type: String,
       required: true,
       trim: true
   }
},{ timestamps:true });

// userSchema.pre('save', async function(next) {
//     if (!this.isModified('password')) return next();
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
// });

/* PASSWORD COMPARE METHOD */
userSchema.methods.comparePassword = async function(password){
    return bcrypt.compare(password,this.password);
};

const UserModel = model("User", userSchema);
export default UserModel;