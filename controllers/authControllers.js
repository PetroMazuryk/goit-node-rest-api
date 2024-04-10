import { User } from "../models/users.js";
import HttpError from "../helpers/HttpError.js";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";

const register = async (req, res) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    name: newUser.name,
    email: newUser.email,
  });
};

export default {
  register: ctrlWrapper(register),
};
