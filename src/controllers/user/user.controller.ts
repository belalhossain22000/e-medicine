/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import User from "../../models/user/user.model";


// Register a new user
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, photo } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ name, email, password, photo });
    await user.save();

    const token = user.generateAuthToken();
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Login user
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user: any | null = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = user.generateAuthToken();
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get the current user profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    const user: any | null = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Update user profile
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const user: any | null = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, email, photo } = req.body;
    user.name = name || user.name;
    user.email = email || user.email;
    user.photo = photo || user.photo;

    if (req.body.password) {
      user.password = req.body.password;
    }

    await user.save();

    const token = user.generateAuthToken();
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
