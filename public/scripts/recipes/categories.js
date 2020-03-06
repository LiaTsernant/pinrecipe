//------------------ Render the navbar ------------------
let currentUser;

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

//------------------ Render the main section ------------------

const card = document.querySelector('#recipe')
const categorySelected = window.location.pathname.split('/')[1];
const categoryText = document.getElementById('category');
const categoryDescription = document.getElementById('category-description');

fetch('/api/v1/recipes')
    .then((buffer) => buffer.json())
    .then((data) => {
        render(data);
    })
    .catch((err) => console.log(err));

// for each recipe create recipe card and insert in container
function render(recipesArray) {
  if (categorySelected === 'breakfast') {
    renderBreakfast(recipesArray)
  } else if (categorySelected === 'lunch') {
     renderLunch(recipesArray);
  } else if (categorySelected === 'dinner') {
    renderDinner(recipesArray);
  } else if (categorySelected === 'dessert') {
    renderDessert(recipesArray);
  };
};

// If we selected breakfast category
function renderBreakfast(recipesArray) {
  categoryText.textContent = "Breakfast";
  categoryDescription.textContent = "Best ideas for your breakfast"

  const recipeTemplate = recipesArray.map((recipe) => {

    if (recipe.category.indexOf('Breakfast') !== -1) {
      return getRecipeCard(recipe);
    };
  }).join('');
  card.insertAdjacentHTML('beforeend', recipeTemplate);
};

// If we selected lunch category
function renderLunch(recipesArray) {
  categoryText.textContent = "Lunch";
  categoryDescription.textContent = "Best ideas for your lunch"

  const recipeTemplate = recipesArray.map((recipe) => {
    if (recipe.category.indexOf('Lunch') !== -1) {
      return getRecipeCard(recipe);
    };
  }).join('');
  card.insertAdjacentHTML('beforeend', recipeTemplate);
};


// If we selected dinner category
function renderDinner(recipesArray) {
  categoryText.textContent = "Dinner";
  categoryDescription.textContent = "Best ideas for your dinner"

  const recipeTemplate = recipesArray.map((recipe) => {
    if (recipe.category.indexOf('Dinner') !== -1) {
      return getRecipeCard(recipe);
    };
  }).join('');
  card.insertAdjacentHTML('beforeend', recipeTemplate);
};


// If we selected dessert category
function renderDessert(recipesArray) {
  categoryText.textContent = "Dessert";
  categoryDescription.textContent = "Best ideas for your dessert"

  const recipeTemplate = recipesArray.map((recipe) => {

    if (recipe.category.indexOf('Dessert') !== -1) {
      return getRecipeCard(recipe);
    };
  }).join('');
  card.insertAdjacentHTML('beforeend', recipeTemplate);
};

// creates recipe card html
function getRecipeCard(recipe) {
  return `
  <div class="col-md-3">
  <div class="card mb-4 shadow-sm">
    <img class="bd-placeholder-img card-img-top" width="100%" height="225"
      src="${recipe.image}"></img>
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
};


const logout = () => {
   //Remove currentUser data from localStorage
   localStorage.removeItem("currentUser");

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
