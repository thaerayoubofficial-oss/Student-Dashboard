const signUpForm = document.getElementById("signUpForm");

signUpForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const firstName = document.getElementById("firstname");
    const lastName = document.getElementById("lastname");
    const university = document.getElementById("university");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmpassword");

    const fields = [
        firstName,
        lastName,
        university,
        email,
        password,
        confirmPassword
    ];

    let formIsValid = true;


    // -------------------- HELPERS --------------------

    function showError(field, message) {
        const formGroup = field.closest(".form-group");
        const label = formGroup.querySelector("label");

        label.classList.add("invalid-label");

        let error = formGroup.querySelector(".field-error");

        if (!error) {
            error = document.createElement("small");
            error.classList.add("field-error");
            formGroup.appendChild(error);
        }

        error.textContent = message;

        formIsValid = false;
    }


    function clearError(field) {
        const formGroup = field.closest(".form-group");
        const label = formGroup.querySelector("label");
        const error = formGroup.querySelector(".field-error");

        label.classList.remove("invalid-label");

        if (error) {
            error.remove();
        }
    }


    // -------------------- RESET --------------------

    for (const field of fields) {
        clearError(field);
    }


    // -------------------- REQUIRED FIELDS --------------------

    for (const field of fields) {
        if (!field.value.trim()) {
            showError(field, "This field is required");
        }
    }


    // -------------------- EMAIL --------------------

    if (email.value.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email.value.trim())) {
            showError(email, "Enter a valid email address");
        }
    }


    // -------------------- PASSWORD --------------------

    if (password.value) {
        const passwordIsQualified =
            password.value.length >= 8 &&
            /[A-Z]/.test(password.value) &&
            /[a-z]/.test(password.value) &&
            /[0-9]/.test(password.value);

        if (!passwordIsQualified) {
            showError(
                password,
                "Password must contain 8+ characters, uppercase, lowercase, and a number"
            );
        }
    }


    // -------------------- CONFIRM PASSWORD --------------------

    if (
        confirmPassword.value &&
        password.value !== confirmPassword.value
    ) {
        showError(confirmPassword, "Passwords do not match");
    }


    if (!formIsValid) {
        return;
    }


    // -------------------- REQUEST --------------------

    try {
        const response = await fetch("http://localhost:3000/signup", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                firstName: firstName.value.trim(),
                lastName: lastName.value.trim(),
                university: university.value.trim(),
                email: email.value.trim(),
                password: password.value,
                confirmPassword: confirmPassword.value
            })
        });

        const result = await response.json();

        alert(result.message == null ? "Signup successful!" : result.message);

    } catch (error) {
        console.error("Signup request failed:", error);
    }
});