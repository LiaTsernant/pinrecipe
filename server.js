const express = require('express');
const bodyParser = require('body-parser');
// Require bcrypt
const bcrypt = require('bcryptjs');
// Require session for auth
const session = require('express-session');
// Ask again what it does
const MongoStore = require('connect-mongo')(session);


const app = express();
const PORT = process.env.PORT || 3000;

// Body parser config to accept our datatypes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Initialize DB
const db = require('./models');

// Serve public assets
app.use(express.static(__dirname + '/public'));

// Express session
app.use(session({
    store: new MongoStore({
        url: process.env.MONGODB_URI || 'mongodb://localhost:27017/pinrecipe',
    }),
    secret: 'Qazxdredcvgytgbnjiujm,lpol',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 * 2 // Two weeks
    },
}));

// -------------------- VIEW ROUTES

//--------------------------------------------------------------RECIPE VIEWS

// // testing view routes
app.get('/', (req, res) => {
    res.sendFile('views/index.html', {
        root: __dirname
    });
});

// SHOW recipe
app.get('/recipes/:recipeId', (req, res) => {
    res.sendFile('views/recipe/showRecipe.html', {
        root: __dirname
    });
});

// Breakfast filter view
app.get('/breakfast', (req, res) => {
    res.sendFile('views/recipe/categories.html', {
        root: __dirname
    });
});

// Lunch filter view
app.get('/lunch', (req, res) => {
    res.sendFile('views/recipe/categories.html', {
        root: __dirname
    });
});

// Dinner filter view
app.get('/dinner', (req, res) => {
    res.sendFile('views/recipe/categories.html', {
        root: __dirname
    });
});

// Dessert filter view
app.get('/dessert', (req, res) => {
    res.sendFile('views/recipe/categories.html', {
        root: __dirname
    });
});

//--------------------------------------------------------------USER VIEWS

// SHOW user
app.get('/profile', (req, res) => {
    res.sendFile('views/user/userProfile.html', {
        root: __dirname
    });
});

// LogIn page
app.get('/login', (req, res) => {
    if (req.session.currentUser) {
        res.redirect('/');
    };

    res.sendFile('views/user/logInPage.html', {
        root: __dirname
    });
});

// Register page
app.get('/register', (req, res) => {
    if (req.session.currentUser) {
        res.redirect('/');
    };
    
    res.sendFile('views/user/registerPage.html', {
        root: __dirname
    });
});

// -------------------- API RECIPE ROUTES

// GET recipes index

app.get('/api/v1/recipes', (req, res) => {
    db.Recipe.find({})
        .populate('reviews.user', 'firstName lastName _id')
        .exec((err, foundRecipes) => {
            if (err) return res.status(404).json({ status: 404, error: 'Cannot find all recipes.' });

            res.json(foundRecipes);
        });
});

// GET recipe show

app.get('/api/v1/recipes/:id', (req, res) => {
    db.Recipe.findById(req.params.id, (err, foundRecipe) => {
        if (err) return res.status(404).json({ status: 404, error: 'Cannot find one recipe.' })

        res.json(foundRecipe);
    });
});

// POST recipe create

app.post('/api/v1/recipes', (req, res) => {

    db.Recipe.create(req.body, (err, newRecipe) => {
        if (err) return res.status(404).json({ status: 404, error: 'Cannot create recipe.' })

        res.json(newRecipe);
    });
})

// PUT recipe update
app.put('/api/v1/recipes/:id', (req, res) => {
    db.Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, updatedRecipe) => {
        if (err) return res.status(404).json({ status: 404, error: 'Cannot update recipe.' })

        res.json(updatedRecipe);
    });
});

// DELETE recipe destroy
app.delete('/api/v1/recipes/:id', (req, res) => {
    db.Recipe.findByIdAndDelete(req.params.id, (err, deletedRecipe) => {
        if (err) return res.status(404).json({ status: 404, error: 'Cannot deleted recipe.' })

        res.json(deletedRecipe);
    });
});

// ---------------------------------------------API REVIEW ROUTES

//GET reviews index
app.get('/api/v1/reviews', (req, res) => {
    db.Review.find({}, (err, foundReviews) => {
        if (err) {
            return res.status(404).json({ status: 404, error: 'Cannot find all reviews.' });
        }

        res.json(foundReviews);
    });
});

//POST new review
app.post('/api/v1/recipes/:recipeId/reviews', (req, res) => {
    // First create review in Review collection
    db.Review.create(req.body, (err, newReview) => {
        if (err) {
            return res.status(404).json({ status: 404, error: 'Cannot create a review.' });
        };

        // Find recipe where to attach a review
        db.Recipe.findById(req.params.recipeId, (err, foundRecipe) => {
            if (err) {
                return res.status(404).json({ status: 404, error: 'Cannot find a recipe to add review.' });
            };

            //Push review object to reviews Array
            foundRecipe.reviews.push(newReview);

            // SAVE recipe after modifications
            foundRecipe.save((err, savedRecipe) => {
                if (err) {
                    return res.status(404).json({ status: 404, error: 'Cannot save a recipe with a new review.' });
                };

                res.json(savedRecipe);
            });
        });
    });
});

// PUT a review by id
app.put('/api/v1/recipes/:recipeId/reviews/:reviewId', (req, res) => {
    // Find Recipe that contains review
    db.Recipe.findById(req.params.recipeId, (err, foundRecipe) => {
        if (err) {
            return res.status(404).json({ status: 404, error: 'Cannot find a recipe to update review.' });
        };

        // In the  recipe found review by its ID
        const reviewToUpdate = foundRecipe.reviews.id(req.params.reviewId);

        if (!reviewToUpdate) {
            return res.status(404).json({ status: 404, error: 'Cannot find a review to update.' });
        };

        // Update review body
        reviewToUpdate.body = req.body.body;

        // SAVE recipe after modification
        foundRecipe.save((err, savedRecipe) => {
            if (err) {
                return res.status(404).json({ status: 404, error: 'Cannot save a recipe with updated review.' });
            };

            // Find Review in Review collection and update
            db.Review.findByIdAndUpdate(req.params.reviewId, (err, updatedReview) => {
                if (err) {
                    return res.status(404).json({ status: 404, error: 'Cannot save a recipe with updated review.' });
                };

                res.json(updatedReview);
            });

            res.json(savedRecipe);
        });
    });
});

// DELETE a review by id
app.delete('/api/v1/recipes/:recipeId/reviews/:reviewId', (req, res) => {
    // Find Recipe where to delete the review
    db.Recipe.findById(req.params.recipeId, (err, foundRecipe) => {
        if (err) return res.status(404).json({ status: 404, error: 'Cannot find a recipe to delete review' });

        // Find review by ID in the recipe
        const reviewToDelete = foundRecipe.reviews.id(req.params.reviewId);

        if (!reviewToDelete) {
            return res.status(404).json({ status: 404, error: 'Cannot find a review to delete.' });
        };

        // REMOVE from recipe!
        reviewToDelete.remove();

        // SAVE after modification
        foundRecipe.save((err, savedRecipe) => {
            if (err) return res.status(404).json({ status: 404, error: 'Cannot save recipe with deleted review' });

            // Find review in Review collection and delete it
            db.Review.findByIdAndDelete(req.params.reviewId, (err, deletedReview) => {
                if (err) return res.status(404).json({ status: 404, error: 'Cannot delete a review' });
                res.json(deletedReview);
            });
        });
    });
});

// ---------------------------------------------API USER ROUTES

// GET user show
app.get('/api/v1/users/:id', (req, res) => {
    db.User.findById(req.params.id, (err, User) => {
        if (err) return res.status(404).json({ status: 404, error: 'Cannot find users.' });

        res.json(User);
    })
})

// POST new user
app.post('/api/v1/users', (req, res) => {
    db.User.create(req.body, (err, newUser) => {
        if (err) return res.status(404).json({ status: 404, error: 'Cannot find users.' });

        res.json(newUser);
    });
});

// PUT a user by id
app.put('/api/v1/users/:id', (req, res) => {
    db.User.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, updatedUser) => {
        if (err) return res.status(404).json({ status: 404, error: 'Cannot find users.' });

        res.json(updatedUser);
    });
});

// DELETE a user by id
app.delete('/api/v1/users/:id', (req, res) => {
    db.User.findByIdAndDelete(req.params.id, (err, deletedUser) => {
        if (err) return res.status(404).json({ status: 404, error: 'Cannot find user.' });

        // when deleting user, we also log him out
        req.session.destroy((err) => {
            if (err) return res.status(400).json({
                status: 400,
                error: "Something went wrong, please try again."
            });
            res.json({status: 200, message: `User deleted, ${deletedUser.email}`});
        });
    });
});

// ---------------------------------------------- AUTH ROUTES

// User Register

app.post('/api/v1/register', (req, res) => {
    db.User.findOne({ email: req.body.email }, (err, foundUser) => {
        if (err) return res.status(400).json({
            status: 400,
            message: "Something went wrong, please try again."
        });
        if (foundUser) return res.status(400).json({
            status: 400,
            message: "Email is already registered. Please try again."
        });
        bcrypt.genSalt(10, (err, salt) => {
            if (err) return res.status(400).json({
                status: 400,
                message: "Something went wrong, please try again."
            });
            bcrypt.hash(req.body.password, salt, (err, hash) => {
                if (err) return res.status(400).json({
                    status: 400,
                    message: "Something went wrong, please try again",
                });
                const { firstName, lastName, email } = req.body;
                const newUser = {
                    firstName,
                    lastName,
                    email,
                    password: hash,
                };
                // Create new user
                db.User.create(newUser, (err, createdUser) => {
                    if (err) return res.status(400).json({
                        status: 400,
                        message: "Something went wrong, please try again",
                    });

                    // Creating session for the user, so we can log him in after registering
                    const currentUser = {
                        _id: createdUser._id,
                        firstName: createdUser.firstName,
                        lastName: createdUser.lastName,
                        email: createdUser.email
                    };
    
                    // Create a new session
                    req.session.currentUser = currentUser;
    
                    // Respond
                    res.status(200).json({ status: 200, message: "Success!", userId: currentUser._id});
                });
            });
        });
    });
});

// *************************************************************************  USER LOGIN
app.post('/api/v1/login', (req, res) => {

    // Find user by email
    db.User.findOne({ email: req.body.email }, (err, foundUser) => {
        if (err) return res.status(400).json({ status: 400, error: "Something went wrong, please try again" });

        //  If no user exists - return error
        if (!foundUser) return res.status(400).json({ status: 400, error: "Invalid credentials" });

        // Compare passwords using bcrypt method compare()
        bcrypt.compare(req.body.password, foundUser.password, (err, isMatch) => {
            if (err) return res.status(400).json({ status: 400, error: "Something went wrong, please try again" });

            if (isMatch) {
                // Construct a current user obj for session WITHOUT password
                const currentUser = {
                    _id: foundUser._id,
                    firstName: foundUser.firstName,
                    lastName: foundUser.lastName,
                    email: foundUser.email
                };

                // Create a new session
                req.session.currentUser = currentUser;

                // Respond
                res.status(200).json({ status: 200, message: "Success!", userId: currentUser._id});
            } else {
                res.status(401).json({ status: 401, error: "Unauthorized, please try again" });
            }
        })
    })
})


app.get('/api/v1/verify', (req, res) => {
    if (req.session.currentUser) {                
        return res.json({
            status: 200,
            message: 'Authorized',
            currentUser: req.session.currentUser,
        });
    }

    res.status(401).json({ status: 401, error: 'Unauthorized, please login and try again' });
});

// *************************************************************************  USER LOGOUT

app.delete('/api/v1/logout', (req, res) => {
    if (!req.session.currentUser) {
        return res.status(401).json({
            status: 401,
            message: "Unauthorized."
        });
    }
    req.session.destroy((err) => {
        if (err) return res.status(400).json({
            status: 400,
            error: "Something went wrong, please try again."
        });
        res.json({status: 200, message: "User has logged out."});
    });
});

//********************************************************************************* 


// ----------------- VIEW ROUTES

app.use('*', (req, res) => {
    res.sendFile('views/errorPage.html', {
        root: __dirname
    });
});

// Start Server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}/`));
