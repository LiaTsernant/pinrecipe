const db = require('./models');

const recipes = [
    {
        name: "Mushroom soup",
        description: "Use porcini and wild mushrooms to make this rich and creamy soup that makes a filling yet light supper for cold nights.",
        calories: 347,
        ingredients: [
            "25g dried porcini",
            "50g butter",
            "1 onion",
            "1 garlic clove",
            "thyme",
            "400g mixed wild mushrooms",
            "850ml vegetable stock",
            "200ml tub crème fraîche",
            "truffle oil",
        ],
        category: ['Lunch', 'Dinner'],
        cookingTime: "1h 10min",
        category: ["Dinner", "Lunch"],
        image: "https://www.bbcgoodfood.com/sites/default/files/styles/recipe/public/recipe_images/recipe-image-legacy-id--458510_12.jpg?itok=EF_1bnMj",
        link: "https://www.bbcgoodfood.com/recipes/creamy-mushroom-soup",
    },
    {
        name: "Almond meal cookies",
        description: "A healthy and tasty treat - almond cookies with chocolate chips and coconut. A simple recipe.",
        calories: 120,
        ingredients: [
            "1 1/4 cups almond meal",
            "1/4 cup chopped dairy-free dark chocolate (Sara used cacao nibs)",
            "1/2 cup shredded unsweetened coconut",
            "1/2 tsp baking powder",
            "1/4 tsp salt (Sara used sea salt)",
            "1/3 cup brown sugar (Sara used muscovado)",
            "1 large egg",
            "3 Tbsp coconut oil (melted)",
            "1/2 tsp vanilla extract",
        ],
        cookingTime: "55min",
        category: ["Dessert"],
        image: "https://minimalistbaker.com/wp-content/uploads/2012/11/chewy-gluten-free-choc-chip-cookies.jpg",
        link: "https://minimalistbaker.com/coconut-chocolate-chip-almond-meal-cookies/",
    },
    {
        name: "Eggs Benedict",
        description: "Eggs Benedict, poached eggs over bacon and buttered toasted English muffin, topped with Hollandaise sauce.",
        calories: 728,
        ingredients: [
            "8 pieces of bacon or 4 pieces of Canadian bacon",
            "2 tablespoons chopped parsley, for garnish",
            "4 eggs",
            "2 teaspoons white or rice vinegar",
            "2 English muffins",
            "Butter",
        ],
        category: ['Breakfast'],
        cookingTime: "25min",
        category: ["Breakfast"],
        image: "https://www.simplyrecipes.com/wp-content/uploads/2010/04/eggs-benedict-vertical-a-1600-809x1024.jpg",
        link: "https://www.simplyrecipes.com/recipes/eggs_benedict/",
    },
    {
        name: "Pesto Pasta",
        description: "Easy to make, but full of flavor! Good hot or cold.",
        calories: 225,
        ingredients: [
            "1/2 cup chopped onion",
            "2 1/2 tablespoons pesto2 tablespoons olive oil",
            "Extra Virgin Robust Olive Oil",
            "2 tablespoons grated Parmesan cheese",
            "1 (16 ounce) package pasta",
        ],
        category: ['Lunch', 'Dinner'],
        cookingTime: "15min",
        category: ["Lunch", "Dinner"],
        image: "https://www.recipetineats.com/wp-content/uploads/2019/02/Pesto-Pasta_2-1.jpg",
        link: "https://www.allrecipes.com/recipe/11887/pesto-pasta/",
    },
    {
        ingredients: ["1 1/2 cups all-purpose flour", "3 1/2 teaspoons baking powder", "1 teaspoon salt", " butter", " milk", " egg"],
        category: ["breakfast", "dessert"],
        name: "Old Fashioned Pancakes",
        description: "Delicious pancakes to be savoured with coffee at breakfast.",
        image: "https://images.media-allrecipes.com/userphotos/720x405/4948036.jpg",
        link: "https://www.allrecipes.com/recipe/21014/good-old-fashioned-pancakes/",
        calories: "158",
        cookingTime: "20min",
    },
    {
        ingredients: ["oats", "almond milk", "peanut butter"],
        category: ["breakfast"],
        name: "Peanut butter oats",
        description: "Overnight oats",
        image: "https://minimalistbaker.com/wp-content/uploads/2015/07/CRAZY-DELICIOUS-AMAZING-Peanut-Butter-Overnight-Oats-Just-5-ingredients-5-minutes-prep-and-SO-delicious-vegan-recipe-glutenfree-meal-breakfast-oats-oatmeal.jpg",
        calories: "300",
        link: "https://minimalistbaker.com/peanut-butter-overnight-oats/",
        cookingTime: "3h",
    },
    {
        ingredients: ["1/2 cup raisins", "1/4 cup rum", "2 tbsp active dry yeast", "1/4 cup warm water", "2 cups milk", "1 cup butter unsalted", "3 tbsp lemon zest", "1 1/2 cups sugar", "8 cups all-purpose flour", "5 eggs separated", "2 tsp vanilla extract", "walnuts or pecans", "5 tbsp sugar", "2 tbsp cocoa powder", "2 tbsp vegetable oil", "1 egg beaten"],
        category: (2)["breakfast", "dessert"],
        name: "Walnut roll",
        description: "Sweet Walnut Roll known as “Cozonac cu Nuca” is a traditional Romanian sweet bread made with raisins and walnuts or pecans enjoyed at Christmas and Easter.",
        image: "https://www.jocooks.com/wp-content/uploads/2016/12/cozonac-cu-nuca-1-4.jpg",
        calories: "264",
        link: "https://www.jocooks.com/recipes/walnut-roll/",
        cookingTime: "3h 35min",
    }
];

const users = [
    {
        firstName: "Anca",
        lastName: "Agapi",
        email: "anca@test.com",
        password: "123",
    },
    {
        firstName: "Lia",
        lastName: "Tsernat",
        email: "lia@test.com",
        password: "321",
    }
];


db.Recipe.deleteMany({}, (err, result) => {
    if (err) {
        console.log(err);
        process.exit();
    }
    console.log(`Deleted ${result.deletedCount} recipes.`);

    console.log('Deleting all reviews');
    db.Review.deleteMany({}, (err, result) => {
        if (err) {
            console.log(err);
            process.exit();
        };
        console.log(`Deleted ${result.deletedCount} reviews.`);

        db.User.deleteMany({}, (err, result) => {
            if (err) {
                console.log(err);
                process.exit();
            };
            console.log(`Deleted ${result.deletedCount} users.`);

            db.User.create(users, (err, newUsers) => {
                if (err) {
                    console.log(err);
                    process.exit();
                }
                console.log(`Created ${newUsers.length} users.`);

                console.log("Creating new recipes.");
                db.Recipe.create(recipes, (err, newRecipes) => {
                    if (err) {
                        console.log(err);
                        process.exit();
                    } 
                    console.log(`Created ${newRecipes.length} recipes.`);
                    process.exit();
                });
            });
        });
    });
});
