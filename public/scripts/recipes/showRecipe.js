const API_BASE = '/api/v1';
// Find photo placeholder
const photoPlaceholder = document.getElementById('photo');
// Find recipeID in URL
const recipeId = window.location.pathname.split('/')[2];

//Find details placeholders
const cookingTimePlaceholder = document.getElementById('time');
const caloriesPlaceholder = document.getElementById('calories');
const popoverPlaceholder = document.getElementById('popover');

// GET information from database
function getRecipe() {
    fetch(`${API_BASE}/recipes/${recipeId}`)
        .then((stream) => stream.json())
        .then((res) => render(res))
        .catch((err) => console.log(err))
};

getRecipe();

//-------------------------------------------------------------------------------- RENDER PAGE

// Render the page
function render(recipeObj) {
    setPhotoColumn(recipeObj);
    setIngredients(recipeObj.ingredients);
    setDescription(recipeObj.description);
    provideHowToCookLink(recipeObj.link);
    renderReviews(recipeObj.reviews)
}

//-------------------------------------------------------------------------------- SET PHOTO

function setPhotoColumn(recipeObj) {
    console.log(recipeObj);

    photoPlaceholder.setAttribute('src', recipeObj.image);
    cookingTimePlaceholder.textContent = `Time: ${recipeObj.cookingTime}`
    caloriesPlaceholder.textContent = `Calories: ${recipeObj.calories}`

    // Generates a message to share with friends
    let shareMessage = `Look! I found an awesome recipe ${window.location.pathname}`;

    // Put it on the page
    popoverPlaceholder.setAttribute('data-content', shareMessage);
};

//-------------------------------------------------------------------------------- SET INGREDIENTS

function setIngredients(array) {
    const ingredientsUl = document.getElementById('ingredients');
    if (ingredientsUl.childNodes.length === 0) {

        // Iterate through Recipe.ingredients and render on the page
        for (let i = 0; i < array.length; i += 1) {
            let li = document.createElement('li');
            li.textContent = array[i];
            ingredientsUl.appendChild(li);
        };
    };
};

//-------------------------------------------------------------------------------- SET DESCRIPTION

function setDescription(description) {
    const descriptionPlaceholder = document.getElementById('description')
    descriptionPlaceholder.textContent = description;
};

//-------------------------------------------------------------------------------- SET LINK


function provideHowToCookLink(strLink) {
    const howToCook = document.getElementById('link');
    howToCook.setAttribute('href', strLink);
    howToCook.setAttribute('target', '_blank');
};

//-------------------------------------------------------------------------------- DISPLAY REVIEWS

function renderReviews(reviewsArray) {
    let reviewUl = document.getElementById('reviewsUl');

    // Remove reviews from the page before rendering
    while (reviewUl.childNodes.length) {
        reviewUl.removeChild(reviewUl.childNodes[reviewUl.childNodes.length - 1]);
    };

    // Iterate through Recipe.reviews and render
    for (let i = 0; i < reviewsArray.length; i += 1) {
        let reviewLi = document.createElement('li');
        let editIcon = document.createElement('i');
        let deleteIcon = document.createElement('i');

        reviewLi.setAttribute('class', 'd-flex align-items-start m-4');
        reviewLi.setAttribute('id', reviewsArray[i]._id);

        editIcon.setAttribute('class', 'fa fa-edit edit-review');
        deleteIcon.setAttribute('class', 'fa fa-remove delete-review');
        deleteIcon.setAttribute('style', 'color: red');

        reviewLi.textContent = reviewsArray[i].body;

        reviewLi.appendChild(editIcon);
        editIcon.addEventListener('click', editReview);

        reviewLi.appendChild(deleteIcon);
        deleteIcon.addEventListener('click', deleteReview);

        reviewUl.appendChild(reviewLi);
    };
};

//-------------------------------------------------------------------------------- ADD NEW REVIEW

// Create a review
const reviewForm = document.getElementById('review-modal');
reviewForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const body = document.getElementById('review-text');

    // Continue if review has a text
    if (body.value.length > 0) {
        const newReview = { body: body.value };
        document.getElementById('review-text').value = "";

        // Send POST request to review routes
        fetch(`/api/v1/recipes/${recipeId}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newReview)
        })
            .then((stream) => stream.json())
            .then((res) => {

                // Render a page with a new review
                getRecipe();

                // Hide the modal
                $('#reviewModal').modal('hide')
            });
    };
});


//------------------------------------------------------------------------------------------------- EDIT REVIEW (MODAL)

function editReview(event) {
    // If review for update exist
    if (event.target.classList.contains('edit-review')) {
        const updateBody = document.getElementById('update-review-text');

        // Set the value of the review
        updateBody.value = event.target.parentNode.textContent;

        let reviewId = event.target.parentNode.id;
        document.getElementById("update-review-modal-review-id").setAttribute("value", reviewId);

        $('#updateReviewModal').modal('show');
    };
};
const updateForm = document.getElementById('update-review-modal');

updateForm.addEventListener('submit', function (event) {
    event.preventDefault();

    // Get a new review text
    const updateBody = document.getElementById('update-review-text');
    const reviewId = document.getElementById("update-review-modal-review-id").getAttribute("value")
    let updatedReview = { body: updateBody.value };

    // Send PUT request to review route
    fetch(`/api/v1/recipes/${recipeId}/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedReview)
    })
        .then((stream) => stream.json())
        .then((res) => {
            // Render the page again with a new information
            getRecipe();

            // Close Update modal
            $('#updateReviewModal').modal('hide')
        });

});

//------------------------------------------------------------------------------------------------- EDIT REVIEW (MODAL)


function deleteReview(event) {
    if (event.target.classList.contains('delete-review')) {
        let reviewId = event.target.parentNode.id;

        fetch(`/api/v1/recipes/${recipeId}/reviews/${reviewId}`, {
            method: 'DELETE'
        })
            .then((stream) => console.log(stream))
            .then((res) => {
                console.log(res);
                getRecipe();
            })
            .catch((err) => console.log(err));
    };
};

//------------------------------------------------------------------------------------------------- OPEN REVIEW MODAL

// Functionality of the modal Review
$('#reviewModal').on('show.bs.modal');

//------------------------------------------------------------------------------------------------- Show message "Share..." on click
// Open popover message
$('#popover').on('click', function () {
    $('#popover').popover('show');

    // Get the text from the popover
    let message = $('#popover')[0].dataset.content;

    // Handle copy function
    copyToClipboard(message);
});

//------------------------------------------------------------------------------------------------- Automatically copy message to clipboard

function copyToClipboard(str) {

    // Create textarea
    const el = document.createElement('textarea');

    // Set the value of popover as a text of texarea
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};


