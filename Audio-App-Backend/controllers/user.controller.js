
const config = require("../config/auth.config");
const db = require("../models/Users/index");
const User = db.User;
const Role = db.Role;
  

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
  };
  
  exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
  };
  
  exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
  };
  
  exports.moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
  };

  
  exports.findUserByUsername = async (req, res) => {
    try {
      const username = req.params.username;
  
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: 'There was an error when trying to find the user' });
    }
  };
  



