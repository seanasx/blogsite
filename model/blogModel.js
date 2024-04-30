import mongoose, {SchemaTypes} from 'mongoose';
const {Schema, model} = mongoose;

const blogSchema = new Schema({
    title:
        {
            type: String,
            required: true
        },
    content:
        {
            type: String,
            required: true
        },
    likes:
        {
            type: Number,
            default: 0
        },
    time:
        {
            type: Date,
            default: () => Date.now,
            immutable: true
        },
    author:
        {
            type: SchemaTypes.ObjectId,
            ref: 'User',
            required: true
        },
    url:
        {
            type: String,
            required: false
        },
    comments:
        [{
            user:
                {
                    type: SchemaTypes.ObjectId,
                    ref: 'User',
                    required: true
                },

            content: String,
            likes: Number
        }]
});

const BlogModel = model('BlogModel', blogSchema);

export default BlogModel;