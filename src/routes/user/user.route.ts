import express from 'express';

import {
  getProfile,
  loginUser,
  registerUser,
  updateUserProfile,
} from '../../controllers/user/user.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

// User registration
router.post('/register', registerUser);

// User login
router.post('/login', loginUser);

// Get user profile
router.get('/profile',auth('admin','user','superAdmin'), getProfile);

// Update user profile
router.put('/profile',auth('admin','user','superAdmin'), updateUserProfile);


export const UserRoutes = router;