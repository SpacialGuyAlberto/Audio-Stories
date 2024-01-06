const User = require('../models/Users/user.model');
const express = require('express');
const router = express.Router();


// Ruta para obtener los users
router.get(`/`, async (req, res) => {
    const usersList = await User.find();
    if (!usersList){
        res.status(500).json({success: false})
    }
    res.send(usersList);
});


router.post(`/`, (req, res) => {
    const user = new User({
        
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        isActive: req.body.isActive,
        isStaff: req.body.isStaff
    });

    user.save()
        .then(createdUser => {
            res.status(201).json(createdUser);
        })
        .catch(err => {
            res.status(500).json({
                error: err,
                success: false
            });
        });
});


module.exports = router;


