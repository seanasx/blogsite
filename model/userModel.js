import mongoose from 'mongoose';
const {Schema, model} = mongoose;

const userSchema = new Schema({
    firstName:
        {
            type: String,
            required: true
        },
    lastName:
        {
            type: String,
            required: true
        },
    email:
        {
            type: String,
            required: true
        },
    phone:
        {
            type: String,
            required: true
        }
});

const UserModel = model('UserModel', userSchema);

export default UserModel;