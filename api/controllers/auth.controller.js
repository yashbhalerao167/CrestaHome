import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
    const { username, password, email } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const user = new User({ username, password: hashedPassword, email });
    try {
        await user.save();
        res.status(201).json("User created successfully");
    } catch (error) {
        // This error handling middleware is defined in index.js file
        next(error);
    }
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(404, "User not found"));
        }
        const validPassword = bcryptjs.compareSync(
            password,
            validUser.password
        );
        if (!validPassword) {
            next(errorHandler(400, "Invalid password"));
        }

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const { password: hashedPassword, ...user } = validUser._doc;

        // Set expiry date of 1 hour for token
        const expiryDate = new Date(Date.now() + 3600000);

        res.cookie("access_token", token, {
            httpOnly: true,
            expires: expiryDate,
        })
            .status(200)
            .json(user);
    } catch (error) {
        next(error);
    }
};

export const signout = (req, res, next) => {
    try {
        res.clearCookie("access_token");
        res.status(200).json("User has been logged out!");
    } catch (error) {
        next(error);
    }
};

export const google = async (req, res, next) => {
    try {
        const { email, name, photo } = req.body;

        let user = await User.findOne({ email });

        const createTokenAndRespond = (userData) => {
            const token = jwt.sign({ id: userData._id }, process.env.JWT_SECRET, {
                expiresIn: "1h",
            });
            const { password, ...rest } = userData._doc;

            res.cookie("access_token", token, {
                httpOnly: true,
                expires: new Date(Date.now() + 3600000),
            }).status(200).json(rest);
        };

        if (user) {
            // User exists → return token
            return createTokenAndRespond(user);
        }

        // User does not exist → create new
        const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
        const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
        const username = (name ? name.split(" ").join("").toLowerCase() : "user") + Math.random().toString(36).slice(-4);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            avatar: photo || "",
        });

        await newUser.save();
        createTokenAndRespond(newUser);
    } catch (error) {
        next(error);
    }
};
