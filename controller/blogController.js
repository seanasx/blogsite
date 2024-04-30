import BlogModel from "../model/blogModel.js";

// get all blogs
export async function getAllBlogs(req, res)
{
    try
    {
        const blogs = await BlogModel.find();
        res.json(blogs);
    }
    catch (error)
    {
        res.status(500).json({ error: error.message })
    }
}

// get blog by ID
export async function getBlogByID(req, res)
{
    try
    {
        const blog = await BlogModel.findById(req.params.id);
        if (!blog)
        {
            res.status(404).json({ message: "Blog not found" });
        }
        res.json(blog);
    }
    catch (error)
    {
        res.status(500).json({ error: error.message })
    }
}

// create a new blog post
export async function createBlog(req, res)
{
    try
    {
        const { title, content, author } = req.body;
        const newBlog = new BlogModel({
            title,
            content,
            author,
            time: new Date(),
            comments: [],
            likes: 0
        });
        const savedBlog = await newBlog.save();
        res.status(201).json(savedBlog);
    }
    catch (error)
    {
        res.status(400).json({ error: error.message });
    }
}

// like a blog post
export async function likeBlog(req, res)
{
    try
    {
        const blog = await BlogModel.findById(req.params.id);
        if (!blog)
        {
            return res.status(404).json({ message: "Blog not found" });
        }

        blog.likes++;
        const updatedBlog = await blog.save();
        res.json(updatedBlog);
    }
    catch (error)
    {
        res.status(500).json({ error: error.message });
    }
}

// create a blog comment
export async function createComment(req, res)
{
    try
    {
        const { userID, content } = req.body;
        const blog = await BlogModel.findById(req.params.id);
        if (!blog)
        {
            res.status(404).json({ message: "Blog not found" });
        }

        const newComment =
            {
                user: userID,
                content,
                likes: 0
            }
        blog.comments.push(newComment);
        const updatedBlog = await blog.save();
        res.json(updatedBlog);
    }
    catch (error)
    {
        res.status(500).json({ error: error.message });
    }
}

// like comments
export async function likeComment(req, res)
{
    try
    {
        const blog = await BlogModel.findById(req.params.id);
        if (!blog)
        {
            res.status(404).json({message: "Blog not found"});
        }

        const commentIndex = parseInt(req.params.commentIndex);
        if (isNaN(commentIndex) || commentIndex < 0 || commentIndex >= blog.comments.length)
        {
            return res.status(404).json({message: "Invalid comment index"});
        }
        const comment = blog.comments[commentIndex];
        comment.likes++;
        const updatedBlog = await blog.save();
        res.json(updatedBlog);
    }
    catch (error)
    {
        res.status(500).json({ error: error.message });
    }
}