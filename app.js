// MONGO user: manny
// MONGO password for user: 14M48nVzC5AbDwsm
// MONGO Connection: mongodb+srv://manny:<password>@cluster0-dmszo.mongodb.net/test?retryWrites=true&w=majority

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Recipe = require('./model/recipe');

const app = express();

//connecting to database
mongoose.connect('mongodb+srv://manny:14M48nVzC5AbDwsm@cluster0-dmszo.mongodb.net/test?retryWrites=true&w=majority')
    .then(() => {
        console.log('Successfully connected to MongoDB Atlas!')
    })
    .catch((error) => {
        console.log('Unable to connect to MongoDB Atlas!');
        console.error(error);
    });

//avoiding CORS(Cross Origin Resource Sharing), this adds to the headed
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type,' +
        ' Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

//Create New Recipe
app.post('/api/recipes', (req, res, next) => {
    const recipe = new Recipe({
        title: req.body.title,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        difficulty: req.body.difficulty,
        time: req.body.time
    });
    recipe.save()
        .then(() => {
            res.status(201).json({
                message: "Post saved successfully"
            });
        })
        .catch(error => {
            res.status(400).json({
                error: error
            });
        });
});

//view all about a particular recipe
app.get('/api/recipes/:id', (req, res, next) => {
    Recipe.findOne({
        _id: req.params.id
    }).then((thing) => {
        res.status(200).json(thing)
    }).catch(error => {
        res.status(404).json({
            error: error
        })
    });
});

//Update a particular recipe
app.put('/api/recipes/:id', (req, res, next) => {
    const thing = new Recipe({
        _id: req.params.id,
        title: req.body.title,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        difficulty: req.body.difficulty,
        time: req.body.time
    });
    Recipe.updateOne({_id: req.params.id}, thing)
        .then(() => {
            res.status(201).json({
                message: 'Thing updated successfully'
            });
        })
        .catch(error => {
            res.status(400).json({
               error: error
            });
        });
});

//delete a particular recipe
app.delete('/api/recipes/:id', (req, res, next) => {
   Recipe.deleteOne({
       _id: req.params.id
   }).then(() => {
       res.status(200).json({
           message: 'Deleted!'
       })
   }).catch(error => {
      res.status(400).json({
         error: error
      });
   });
});



//View all recipe in db
app.use('/api/recipes', (req, res, next) => {
    Recipe.find()
        .then((recipe) => {
            res.status(200).json(recipe)
        })
        .catch(error => {
            res.status(400).json({
                error: error
            })
        });
});

module.exports = app;
