//------------------ Render the navbar ------------------
let currentUser;
let logoutBtn;

fetch('/api/v1/verify')
    .then((res) => res.json())
    .then((data) => {        
        // Assign the data about currentUser to the variable
        currentUser = data.currentUser;
    
        // if currentUser exists (=== true), then set the information on the page
        if (currentUser) {
            renderAuthorizedNav();
        } else {
          renderUnauthorizedNav();
        }
    });

function renderAuthorizedNav() {
  let navSection = document.getElementById('authorized');

  // MAIN PAGE section
  let mainPage = document.createElement('h4');
  mainPage.setAttribute('class', 'text-white nav justify-content-end mb-3');
  let mainLink = document.createElement('a');
  mainLink.setAttribute('href', '/');
  mainLink.textContent = "Main Page";
  mainPage.appendChild(mainLink);

  // PROFILE section
  let profile = document.createElement('h4');
  profile.setAttribute('class', 'text-white nav justify-content-end mb-3');
  let profileLink = document.createElement('a');
  profileLink.setAttribute('href', '/profile');
  profileLink.textContent = "Profile";
  profile.appendChild(profileLink);


  // CATEGORY LINKS
  let linksUl = document.createElement('ul');

  // Breakfast
  linksUl.setAttribute('class', 'list-unstyled');
  let breakfastLi = document.createElement('li');
  breakfastLi.setAttribute('class', 'nav-item nav justify-content-end');
  let breakfastLink = document.createElement('a');
  breakfastLink.setAttribute('href', '/breakfast');
  breakfastLink.setAttribute('class', 'text-white');
  breakfastLink.textContent = 'Breakfast';
  breakfastLi.appendChild(breakfastLink);
  linksUl.appendChild(breakfastLi);

  // Lunch
  let lunchLi = document.createElement('li');
  lunchLi.setAttribute('class', 'nav-item nav justify-content-end');
  let lunchLink = document.createElement('a');
  lunchLink.setAttribute('href', '/lunch');
  lunchLink.setAttribute('class', 'text-white');
  lunchLink.textContent = 'Lunch';
  lunchLi.appendChild(lunchLink);
  linksUl.appendChild(lunchLi);

  //Dinner
  let dinnerLi = document.createElement('li');
  dinnerLi.setAttribute('class', 'nav-item nav justify-content-end');
  let dinnerLink = document.createElement('a');
  dinnerLink.setAttribute('href', '/dinner');
  dinnerLink.setAttribute('class', 'text-white');
  dinnerLink.textContent = 'Dinner';
  dinnerLi.appendChild(dinnerLink);
  linksUl.appendChild(dinnerLi);

  //Dessert
  let dessertLi = document.createElement('li');
  dessertLi.setAttribute('class', 'nav-item nav justify-content-end');
  let dessertLink = document.createElement('a');
  dessertLink.setAttribute('href', '/dessert');
  dessertLink.setAttribute('class', 'text-white');
  dessertLink.textContent = 'Dessert';
  dessertLi.appendChild(dessertLink);
  linksUl.appendChild(dessertLi);

  // Logout
  let logoutLi = document.createElement('li');
  logoutLi.setAttribute('class', 'nav-item nav justify-content-end mt-2');
  let logoutLink = document.createElement('a');
  logoutLink.setAttribute('href', '#');
  logoutLink.setAttribute('class', 'text-white text-white font-weight-bold');
  logoutLink.setAttribute('id', 'logout');
  logoutBtn = logoutLink;
  logoutBtn.addEventListener("click", logout);
  logoutLink.textContent = 'Log Out';
  logoutLi.appendChild(logoutLink);
  linksUl.appendChild(logoutLi);

  navSection.appendChild(mainPage);
  navSection.appendChild(profile);
  navSection.appendChild(linksUl);
};

function renderUnauthorizedNav() {
  let navSection = document.getElementById('unauthorized');

  // MAIN PAGE section
  let mainPage = document.createElement('h4');
  mainPage.setAttribute('class', 'text-white nav justify-content-end mb-3');
  let mainLink = document.createElement('a');
  mainLink.setAttribute('href', '/');
  mainLink.textContent = "Main Page";
  mainPage.appendChild(mainLink);

  // LOGIN section
  let login = document.createElement('h4');
  login.setAttribute('class', 'text-white nav justify-content-end mb-3');
  login.setAttribute('id', 'login');
  let loginLink = document.createElement('a');
  loginLink.setAttribute('href', '/login');
  loginLink.textContent = "Login";
  login.appendChild(loginLink);


  // REGISTER section
  let register = document.createElement('h4');
  register.setAttribute('class', 'text-white nav justify-content-end mb-3');
  register.setAttribute('id', 'register');

  let registerLink = document.createElement('a');
  registerLink.setAttribute('href', '/register');
  registerLink.textContent = "Create Account";
  register.appendChild(registerLink);

  navSection.appendChild(mainPage);
  navSection.appendChild(login);
  navSection.appendChild(register);
};

// ------------------------------- SHOW RECIPE

// getting recipe container for adding the recipe card
const card = document.querySelector('#recipe')

fetch('/api/v1/recipes')
    .then((buffer) => buffer.json())
    .then((data) => {
        render(data);
    })
    .catch((err) => console.log(err));

// for each recipe create recipe card and insert in container
function render(recipesArray) {
    const recipeTemplate = recipesArray.map((recipe) => {
        return getRecipeCard(recipe);
    }).join('');
    card.insertAdjacentHTML('beforeend', recipeTemplate);
};

function reset() {
    // resets recipe page
    const recipeCard = document.getElementById("recipe");
    // alternative to while: recipeCard.innerHTML=" "; 
    while (recipeCard.childNodes.length) {
        recipeCard.removeChild(recipeCard.childNodes[recipeCard.childNodes.length - 1]);
    };
    // resets add new recipe form
    document.getElementById('recipeName').value = "";
    document.getElementById('recipeDesc').value="";
    document.getElementById('ingredients').value="";
    document.getElementById('linkImg').value="";
    document.getElementById('linkMethod').value="";
    document.getElementById('calories').value="";
    document.getElementById('cookingTime').value="";
    // resets category checkboxes
    $("input[name='categoryGroup[]']:checked").each(function () {
        this.checked = false;
    });
};

// creates recipe card html
function getRecipeCard(recipe) {
    // ternary operator: if condition is true ? add recipe.image, otherwise : add link
    let image = recipe.image ? recipe.image : "https://blog.myfitnesspal.com/wp-content/uploads/2018/01/UACF_EG_Hero_NoBadge_Healthy-Eating-752x472.jpg";
    return `
    <div id="recipeCard" class="col-md-3">
    <div class="card mb-4 shadow-sm">
      <img class="bd-placeholder-img card-img-top" width="100%" height="225"
        src="${image}"></img>
      <div class="card-body">
        <p class="card-text">${recipe.name}</p>
        <div class="d-flex justify-content-between align-items-center">
          <small class="text-muted">${recipe.calories}Cal/${recipe.cookingTime}</small>

          <div class="btn-group">
            <a href="/recipes/${recipe._id}" class="btn btn-sm btn-outline-secondary viewRecipe">View</a>
          </div>
        </div>
      </div>
    </div>
  </div>
    `
}

// ---------------------------- POST NEW RECIPE

const postRecipe = document.getElementById("createRecipe");

// gets added recipe
function getRecipes () {
    fetch('/api/v1/recipes/')
    .then((stream) => stream.json())
    .then(res => render(res))
    .catch((err) => console.log(err));
}

postRecipe.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('recipeName');
    const description = document.getElementById('recipeDesc');
    const ingredients = document.getElementById('ingredients');
    const linkImage = document.getElementById('linkImg');
    const linkMethod = document.getElementById('linkMethod');
    const calories = document.getElementById('calories');
    const cookingTime = document.getElementById('cookingTime');
    
    // category is a group of checkboxes and needs to be handled separately
    // added name 'categoryGroup[]' to every checkbox and selected only the checked ones
    let categories = [];
    $("input[name='categoryGroup[]']:checked").each(function () {
        // push the value of the checked boxes into categories array
        categories.push($(this).val());
    });

    const newRecipe = {
        name: name.value, 
        description: description.value,
        image: linkImage.value,
        calories: calories.value,
        link: linkMethod.value,
        cookingTime: cookingTime.value,
        ingredients: ingredients.value.split(','),
        category: categories,
    }

    // Posting the new recipe
    fetch('/api/v1/recipes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRecipe),
    })
    .then((stream) => stream.json())
    .then((res) => {
        // reset page
        reset();
        // Updates the pages with the new recipe
        getRecipes();
        // Hides the model on submit
        $('.recipeModal').modal('hide')
    })
    .catch((err) => console.log(err));
});

// --------------------- LOGOUT

const logout = () => {
    fetch('/api/v1/logout', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'credentials': 'include', 
        },
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.status === 200) {
            window.location='/';
        }
    });
};

// ------------------------ SHOW ADD RECIPE BUTTON ONLY IF USER IS LOGGED IN

fetch('/api/v1/verify')
    .then((res) => res.json())
    .then((data) => {        
        // Assign the data about currentUser to the variable
        currentUser = data.currentUser;
        const addRecipeBtn = document.getElementById("addRecipeBtn");
    
        // if currentUser exists (=== true), then set the information on the page
        if (currentUser) {
            addRecipeBtn.disabled = false;
        } else {
            // Disables the button when user is logged out
            addRecipeBtn.disabled = true;
            // Adds tooltip to the button
            $('[data-toggle="tooltip"]').tooltip();
        }
    });
    