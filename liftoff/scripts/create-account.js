const passwordInput = document.querySelector('input[type="password"]');
const confirmPasswordInput = document.querySelector('input[name="confirm-password"]');
const errorDiv = document.querySelector(".error-message");

function checkPassword(e) {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    if (password.length < 8) {
        errorDiv.innerText = "* Password must be at least 8 characters long"
        passwordInput.classList.add("invalid");
    } else if (password !== confirmPassword) {
        errorDiv.innerText = "* Passwords do not match";
        passwordInput.classList.add("invalid");
        confirmPasswordInput.classList.add("invalid");
    } else {
        errorDiv.innerText = "";
        passwordInput.classList.remove("invalid");
        confirmPasswordInput.classList.remove("invalid");
   }
}

passwordInput.addEventListener("input", (e) => checkPassword(e));
confirmPasswordInput.addEventListener("input", (e) => checkPassword(e));