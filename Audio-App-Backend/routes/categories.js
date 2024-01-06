const Category = require('../models/Category/Category');
const express = require('express');
const router = express.Router();


// Ruta para obtener los categories
router.get(`/`, async (req, res) => {
    const categoriesList = await Category.find();
    if (!categoriesList){
        res.status(500).json({success: false})
    }
    res.send(categoriesList);
});


router.get(`/:id`, async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category){
        res.status(500).json({success: false, message: 'The Category with the given ID was not found.'})
    }
    res.status(200).send(category);
});


//Updating the categories

router.put(`/:id`, async (req, res) => {
    const category = await Category.findByIdAndUpdate(req.params.id, {
        name: req.body.name
    }, {new: true});
    if (!category){
        res.status(400).json({success: false, message: 'The Category cannot be created.'})
    }
    res.status(200).send(category);
});


router.post(`/`,  (req, res) => {
    const category = new Category({ 
        name: req.body.name,
    });

     category.save()
        .then(createdCategory => {
            res.status(201).json(createdCategory);
        })
        .catch(err => {
            res.status(500).json({
                error: err,
                success: false
            });
        });
});

router.delete('/:id', (req, res) => {
    Category.findByIdAndRemove(req.params.id).then(category => {
        if(category){
            return res.status(200).json({success: true,  message: 'The category is deleted'})
        } else {
            return res.status(404).json({sucess: false, message: 'Category not found'})
        }
    }).catch(err => {
        return res.status(400).json({sucess: false, error: err})
    })
})


module.exports = router;

