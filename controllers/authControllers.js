import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import path from "path";
import fs from "fs/promises";
import { nanoid } from "nanoid";
// import crypto from "crypto";
import Jimp from "jimp";

import { User } from "../models/users.js";
import HttpError from "../helpers/HttpError.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import { sendEmail } from "../helpers/sendEmail.js";

const { SECRET_KEY, PROJECT_URL } = process.env;

const avatarsDir = path.join("public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email  in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  // const hashEmail = crypto.createHash("md5").update(email).digest("hex");
  // const avatarUrl = `https://gravatar.com/avatar/S{hashEmail}.jpg?d=robohash`;
  const avatarUrl = gravatar.url(email);
  const verificationToken = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarUrl,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify your email",
    html: `<h1>Verify your email</h1>
     <p>Please click the link below to verify your email</p>
     <p><a target="_blank" href="${PROJECT_URL}/api/users/verify/${verificationToken}">${verificationToken}</a></p>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });

  res.json({
    message: "Verification email sent",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.verify) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: "" });

  res.json({ message: "Logout success" });
};

const updateSubscriptionUsers = async (req, res) => {
  const { _id } = req.user;
  const { subscription } = req.body;

  await User.findOneAndUpdate(_id, { subscription });

  res.status(200).json({ message: `Subscription changed to ${subscription}` });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const fileName = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, fileName);

  const image = await Jimp.read(tempUpload);
  const imageResize = await image.resize(250, 250);
  await imageResize.writeAsync(tempUpload);

  await fs.rename(tempUpload, resultUpload);

  const avatarUrl = path.join("avatars", fileName);
  await User.findByIdAndUpdate(_id, { avatarUrl });

  res.status(200).json({
    avatarUrl,
  });
};

export default {
  register: ctrlWrapper(register),
  verify: ctrlWrapper(verify),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSubscriptionUsers: ctrlWrapper(updateSubscriptionUsers),
  updateAvatar: ctrlWrapper(updateAvatar),
};
