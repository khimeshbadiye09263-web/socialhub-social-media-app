import User from "../models/user.model.js";

import bcrypt from "bcryptjs";

import generateToken from "../utils/generateToken.js";


export const registerUser = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {

            return res.status(400).json({

                message: "All fields required",

            });

        }

        const userExists = await User.findOne({ email });

        if (userExists) {

            return res.status(400).json({

                message: "User already exists",

            });

        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({

            name,

            email,

            password: hashedPassword,

        });

        res.status(201).json({

            _id: user._id,

            name: user.name,

            email: user.email,

            token: generateToken(user._id),

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Server error",

        });

    }

};


export const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        res.json({

            _id: user._id,

            name: user.name,

            email: user.email,

            token: generateToken(user._id),

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({ message: "Server error" });

    }

};
