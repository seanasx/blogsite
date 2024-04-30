import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import userRouter from "./route/userRoutes.js";
import blogRouter from "./route/blogRoutes.js";
import userModel from "./model/userModel.js";
import {createUser} from "./controller/userController.js";
import UserModel from "./model/userModel.js";

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/IST256Proj2",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoCreate: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.error("Error connecting to MongoDB", error);
});

const db = mongoose.connection;

app.use("/users", userRouter);
app.use("/blogs", blogRouter);

app.use(express.static(path.join(__dirname, "frontend"),
    {
        setHeaders: (res, filePath) =>
        {
            if (filePath.endsWith(".js"))
            {
                res.setHeader("Content-Type", "application/javascript");
            }
        }
    }));

app.get("/", (req, res) =>
{
    res.sendFile(path.join(__dirname + "/frontend/index.html"));
});


app.post("/users", async (req, res) =>
{
    const { firstName, lastName, email, phone } = req.body;

    const data =
        {
            "firstName": firstName,
            "lastName": lastName,
            "email": email,
            "phone": phone
        };

    await UserModel.insertMany([data]);
})


app.listen(port, () =>
{
    console.log("Server is running");
})