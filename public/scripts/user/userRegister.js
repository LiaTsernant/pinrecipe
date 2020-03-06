
// gets register form
const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', handleRegister);

function handleRegister (event) {
    let formIsValid = false;
    const userData = {};
    event.preventDefault();

    document.querySelectorAll('.invalid-feedback').forEach((alert) => alert.remove());

    // creates array from form input values
    const formInputs = [...registerForm.elements];

    formInputs.forEach((input) => {
        // gets class of the input element
        input.classList.remove('is-invalid');
        // checks if password length is > 9 characters
        if (input.type === 'password' && input.value.length < 9) {
            formIsValid = false;
            // adds red border to input
            input.classList.add('is-invalid');
            input.insertAdjacentHTML('afterend', `
                <div class="invalid-feedback ${input.id}-message">
                Password must be at least 9 characters.
                </div>
            `);
        } else if (input.type !== 'submit') {
            formIsValid = true;
        }
        // adds values to userData object from input fields
        if (formIsValid) {
            userData[input.name] = input.value;
        };
    });

    if (formIsValid) {
        // submits user data to server
        fetch('/api/v1/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })

        .then((res) => res.json())
        // res sends the error code, when we do .json we get the status and message with it
        .then((data) => {            
            if (data.status !== 400) {
                localStorage.setItem("userId", data.userId);
                window.location = '/profile';
            } else {
                // if we are here - we have a user with existing email
                handleRegisteredEmail();
            };
        })
        .catch((err) => console.log(err));
    };
};

// Select email input and display alert message 
function handleRegisteredEmail() {
    let emailInput = document.getElementById('inputEmail');
    emailInput.classList.add('is-invalid');
    emailInput.insertAdjacentHTML('afterend', `
        <div class="invalid-feedback">
        Email is already registered.
        </div>
    `);
}