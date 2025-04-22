import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
        default: ""
    }
}, { timestamps: true }
)


// Has the password before saving the user 
userSchema.pre("save", async function (next) {

    if (!this.isModified("password"))
        return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
})

userSchema.methods.comparePassword = async function (userPassword) {
    return bcrypt.compare(userPassword, this.password);
}

const User = mongoose.model('User', userSchema);

export default User;