const userService = require('../services/users.service');
const HTTPError = require('../errors/HTTPError');

const createUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.createUser(email, password);
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof HTTPError) {
      res.status(error.code).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await userService.loginUser(email, password);
    res.status(200).json({ token });
  } catch (error) {
    if (error instanceof HTTPError) {
      res.status(error.code).json({ message: error.message });
    } else res.status(500).json({ message: error.message });
  }
};
module.exports = { createUser, loginUser };
