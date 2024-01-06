const config = require("../config/auth.config");
const db = require("../models/Users/index");
const BookModel = require("../models/AudioBook/Book");
const CategoryModel = require("../models/Category/Category")

// exports.filterByCategory = (req, res) => {
//     const categoryId = req.params.categoryId;
  
//     BookModel.find({ category: categoryId })
//       .then((books) => {
//         if (books.length === 0) {
//           return res.status(404).json({ error: 'No books found for the specified category' });
//         }
  
//         res.json(books);
//       })
//       .catch((err) => {
//         res.status(500).json({ error: 'There was an error when trying to filter the books' });
//       });
//   };

// exports.filterByCategory = (req, res) => {
//     const categoryName = req.params.categoryName;
  
//     CategoryModel.findOne({ name: categoryName })
//       .then((category) => {
//         if (!category) {
//           return res.status(404).json({ error: 'Category not found' });
//         }
  
//         BookModel.find({ category: category._id })
//           .then((books) => {
//             if (books.length === 0) {
//               return res.status(404).json({ error: 'No books found for the specified category' });
//             }
  
//             res.json(books);
//           })
//           .catch((err) => {
//             res.status(500).json({ error: 'There was an error when trying to filter the books' });
//           });
//       })
//       .catch((err) => {
//         res.status(500).json({ error: 'There was an error when trying to find the category' });
//       });
//   };


  exports.filterByCategory = (req, res) => {
    const categoryName = req.params.categoryName;
  
    CategoryModel.findOne({ name: categoryName })
      .then((category) => {
        if (!category) {
          return res.status(404).json({ error: 'Category not found' });
        }
  
        BookModel.find({ category: category._id })
          .then((books) => {
            if (books.length === 0) {
              return res.status(404).json({ error: 'No books found for the specified category' });
            }
  
            res.json(books);
          })
          .catch((err) => {
            res.status(500).json({ error: 'There was an error when trying to filter the books' });
          });
      })
      .catch((err) => {
        res.status(500).json({ error: 'There was an error when trying to find the category' });
      });
  };


  exports.filterByLanguage = (req, res) => {
    const language = req.params.language;
  
    BookModel.find({ language })
      .then((books) => {
        if (books.length === 0) {
          return res.status(404).json({ error: 'No books found for the specified language' });
        }
  
        res.json(books);
      })
      .catch((err) => {
        res.status(500).json({ error: 'There was an error when trying to filter the books' });
      });
  };
  

  exports.filterByTitle = (req, res) => {
    const title = req.params.title;
  
    BookModel.find({ title })
      .then((books) => {
        if (books.length === 0) {
          return res.status(404).json({ error: 'No books found with the specified title' });
        }
        res.json(books);
      })
      .catch((err) => {
        res.status(500).json({ error: 'There was an error when trying to filter the books' });
      });
  };
  
  

