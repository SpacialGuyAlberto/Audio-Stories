// routes/api/books.js
const Audiobook = require('../models/AudioBook/Book');
const express = require('express');
const app = express();
const Category = require('../models/Category/Category');
const router = express.Router();
const ModelControllers = require('../controllers/book.controller');
const fs = require("fs");
const bodyParser = require('body-parser');
// Ruta para obtener los libros
router.get(`/`, async (req, res) => {
    const booklist = await Audiobook.find().populate('category');
    if (!booklist){
        res.status(500).json({success: false})
    }
    res.send(booklist);
});

router.get('/:id', async (req, res) => {
    let audiobook = await Audiobook.findById(req.params.id).populate('category');
    if(!audiobook){
        res.status(500).json({sucess: false})
    }
    res.send(audiobook);
});

router.get('/search-by-category/:categoryName', ModelControllers.filterByCategory);

router.get('/search-by-language/:language', ModelControllers.filterByLanguage);

router.get('/search-by-title/:title', ModelControllers.filterByTitle);

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


router.post(`/`, async (req, res) => {
  let categoryIds = [];

  try {
    if (req.body.categories && req.body.categories.length > 0) {
      const existingCategories = await Category.find({ name: { $in: req.body.categories } });
      categoryIds = existingCategories.map(category => category._id);
    }

    // Check if req.body.categories is defined before filtering
    const missingCategoryIds = req.body.categories ? req.body.categories.filter(categoryId => !categoryIds.includes(categoryId)) : [];

    for (const missingCategoryId of missingCategoryIds) {
      const miscCategory = await Category.findOne({ name: 'Miscellaneous' });
      if (miscCategory) {
        categoryIds.push(miscCategory._id);
      } else {
        const newMiscCategory = new Category({ name: 'Miscellaneous' });
        const savedMiscCategory = await newMiscCategory.save();
        categoryIds.push(savedMiscCategory._id);
      }
    }

    if (!categoryIds.length) {
      return res.status(500).send('Category could not be created or found');
    }

    let audiobook = new Audiobook({
      title: req.body.title,
      duration: req.body.duration,
      publication: req.body.publication,
      category: categoryIds,
      textContent: req.body.textContent,
      audioContent: req.body.audioContent,
      cover: req.body.cover,
      language: req.body.language
    });

    audiobook = await audiobook.save();

    if (!audiobook) {
      return res.status(500).send('The Audiobook could not be created');
    }

    return res.status(201).json(audiobook);
  } catch (error) {
    console.error('Error creating audiobook:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.delete('/:id', (req, res) => {
    Audiobook.findByIdAndRemove(req.params.id).then(audiobook => {
        if(audiobook){
            return res.status(200).json({success: true,  message: 'The product is deleted'})
        } else {
            return res.status(404).json({sucess: false, message: 'Category not found'})
        }
    }).catch(err => {
        return res.status(400).json({sucess: false, error: err})
    })
})

module.exports = router;



