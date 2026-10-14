const signUpForm = document.getElementById('signUpForm');

signUpForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const firstName = document.getElementById("firstname").value;
  const lastName = document.getElementById("lastname").value;
  const university = document.getElementById("university").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmpassword").value;



  const response = await fetch("/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ firstName, lastName, university, email, password, confirmPassword })
  });

  const result = await response.json();
  alert(result.message);
});

