import User from '../Models/User.js';

// Get all users
export const getAllUsers = async (req, res) => {
     try {
          const users = await User.find();
          res.json(users);
     } catch (err) {
          res.status(500).json({ message: err.message });
     }
};

// Get user by ID
export const getUserById = async (req, res) => {
     try {
          const user = await User.findById(req.params.id);
          if (!user) return res.status(404).json({ message: 'User not found' });
          res.json(user);
     } catch (err) {
          res.status(500).json({ message: err.message });
     }
};

// Create new user
export const createUser = async (req, res) => {
     try {
          const user = new User(req.body);
          const savedUser = await user.save();
          res.status(201).json(savedUser);
     } catch (err) {
          res.status(400).json({ message: err.message });
     }
};

// Update user
export const updateUser = async (req, res) => {
     try {
          const updatedUser = await User.findByIdAndUpdate(
               req.params.id,
               req.body,
               { new: true }
          );
          if (!updatedUser) return res.status(404).json({ message: 'User not found' });
          res.json(updatedUser);
     } catch (err) {
          res.status(400).json({ message: err.message });
     }
};

// Delete user
export const deleteUser = async (req, res) => {
     try {
          const deletedUser = await User.findByIdAndDelete(req.params.id);
          if (!deletedUser) return res.status(404).json({ message: 'User not found' });
          res.json({ message: 'User deleted' });
     } catch (err) {
          res.status(500).json({ message: err.message });
     }
};