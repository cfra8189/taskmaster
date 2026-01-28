// DEPENDENCIES
const express = require('express');
const app = express();
require('dotenv').config();
const methodOverride = require("method-override")
const mongoose = require('mongoose');
const Book = require('./models/book');

// Database Connection
mongoose.connect(process.env.DATABASE_URL);

// Database Connection Error/Success
// Define callback functions for various events
const db = mongoose.connection
db.on('error', (err) => console.log(err.message + ' is mongo not running?'));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));

// MIDDLEWARE
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.use(express.static("public")); //<-for styling
app.set("view engine", "ejs"); //<-for styling



// ROUTES - INDUCES
// HOME :) Landing Page
app.get('/', (req, res) => {
    res.render('home.ejs')
})

// INDEX
app.get('/books', async (req, res) => {
    try {
        const allBooks = await Book.find({});
        res.render('index.ejs', {
            books: allBooks
        });
    } catch (error) {
        // Handle any errors that happen during db call or rendering
        console.error(error)
        res.status(500).send(error)
    }
})

// NEW
app.get('/books/new', (req, res) => {
    res.render('new.ejs')
})

// DELETE
app.delete("/books/:id", async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.redirect("/books");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting book");
  }
});

// UPDATE
app.put('/books/:id', async (req, res) => {
  if (req.body.completed === 'on') {
    req.body.completed = true;
  } else {
    req.body.completed = false;
  }

  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).exec();
    res.redirect(`/books/${req.params.id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred during the book update.");
  }
});

// CREATE
app.post('/books', (req, res) => {
    if (req.body.completed === 'on') {
        // if checked, req.body.completed is set to on.
        req.body.completed = true;
    } else {
        // if not checked, req.body.completed is set to off.
        req.body.completed = false;
    }

    // Old and Busted
    // Book.create(req.body, (error, createdBook)=>{
    //     res.send(req.body)
    // })

    Book.create(req.body)
        .then(createdBook => {
            console.log('Book successfully created', createdBook)
            res.redirect('/books')
        })
        .catch(error => {
            console.error('Error creating book', error)
            res.status(500).send('Error Creating Book!')
        })


})

// EDIT
app.get('/books/:id/edit', async (req, res) => {
  try {
    // Await the promise returned by findById
    const foundBook = await Book.findById(req.params.id);
    
    // Check if book exists
    if (!foundBook) {
      return res.status(404).send("Book not found");
    }

    res.render('edit.ejs', { book: foundBook });
  } catch (error) {
    // Handle potential errors (e.g., invalid ID format)
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// SHOW
app.get('/books/:id', async (req, res) => {
    try {
        const foundBook = await Book.findById(req.params.id);
        res.render('show.ejs', {
            book: foundBook,
        });
    } catch (err) {
        res.status(500).send(err); // Send error if something goes wrong
    }
});

// PORT - LISTENER
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Sever is listening on port: ${PORT}`)
})