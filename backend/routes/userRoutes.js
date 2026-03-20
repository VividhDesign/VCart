import express from 'express';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { isAuth, isAdmin, generateToken, baseUrl } from '../utils.js';
import { Resend } from 'resend';
const userRouter = express.Router();

userRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({});
    res.send(users);
  })
);

userRouter.get(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  })
);

userRouter.post(
  '/forget-password',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '3h',
      });
      user.resetToken = token;
      await user.save();
      const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

      // --- THE NEW RESEND API CODE ---
      const resend = new Resend(process.env.RESEND_API_KEY);

      const { data, error } = await resend.emails.send({
        from: 'onboarding@resend.dev', // This is Resend's default testing address
        to: user.email, // Make sure this matches the email you signed up to Resend with!
        subject: 'VCart - Password Reset Link',
        html: `
          <h2>Password Reset Request</h2>
          <p>You requested to reset your password. Click the link below to set a new one:</p>
          <a href="${resetLink}" style="padding: 10px 20px; background-color: #6c63ff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p>This link is valid for 3 hours.</p>
        `,
      });

      if (error) {
        console.error('Resend Error:', error);
        return res.status(500).send({ message: 'Error sending email via API' });
      }

      console.log('Email successfully sent via Resend API:', data);
      res.send({ message: 'We sent reset password link to your email.' });
      // -------------------------------

    } else {
      res.status(404).send({ message: 'User not found' });
    }
  })
);
userRouter.post(
  '/reset-password',
  expressAsyncHandler(async (req, res) => {
    // 1. Unlock the token using your secret key
    jwt.verify(req.body.token, process.env.JWT_SECRET, async (err, decode) => {
      if (err) {
        // If the token is fake, expired, or the secret doesn't match
        console.error("JWT Error:", err.message);
        return res.status(401).send({ message: 'Invalid or Expired Token' });
      } else {
        // 2. The token is valid! 'decode' now contains the _id we hid inside it
        const user = await User.findById(decode._id);

        if (user) {
          if (req.body.password) {
            // 3. Hash the new password, clear the reset token, and save
            user.password = bcrypt.hashSync(req.body.password, 8);
            user.resetToken = undefined;
            await user.save();
            res.send({ message: 'Password reset successfully' });
          } else {
            res.status(400).send({ message: 'Password is required' });
          }
        } else {
          res.status(404).send({ message: 'User not found' });
        }
      }
    });
  })
);

userRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin = Boolean(req.body.isAdmin);
      const updatedUser = await user.save();
      res.send({ message: 'User Updated', user: updatedUser });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.email === 'admin@example.com') {
        res.status(400).send({ message: 'Can Not Delete Admin User' });
        return;
      }
      await user.deleteOne();
      res.send({ message: 'User Deleted' });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: 'Invalid email or password' });
  })
);

userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    });
    const user = await newUser.save();
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);

export default userRouter;
