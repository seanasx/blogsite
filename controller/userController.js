import UserModel from "../model/userModel.js";
import mongoose from "mongoose";

// get all users
export async function getAllUsers(req, res)
{
    try
    {
        const users = await UserModel.find();
        res.json(users);
    }
    catch (error)
    {
        res.status(500).json({ error: error.message })
    }
}

// get user by ID
export async function getUserByID(req, res)
{
    try
    {
        const user = await UserModel.findById(req.params.id);
        if (!user)
        {
            res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    }
    catch (error)
    {
        res.status(500).json({ error: error.message })
    }
}

// create user
export async function createUser(req, res)
{
    try
    {
        const newUser = new UserModel(
            {
            firstName: req.body.firstName,
            lastName: req.body.regLastName,
            email: req.body.regEmail,
            phone: req.body.phone
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    }
    catch (error)
    {
        res.status(400).json({ error: error.message })
    }
}

// login
export async function login(req, res)
{
    const {lastName, email} = req.body;
    try
    {
        const user = await UserModel.findOne({lastName});
        if (!user || user.email !== email)
        {
            return res.status(401).json({ message: "Invalid last name or email" });
        }
        res.json(user);
    }
    catch (error)
    {
        res.status(500).json({ error: error.message })
    }
}