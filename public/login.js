function togglePassword() {
  const passwordInput = document.getElementById("password");
  const eyeIcon = document.querySelector(".toggle-eye");
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyeIcon.textContent = "🙈";
  } else {
    passwordInput.type = "password";
    eyeIcon.textContent = "👁️";
  }
}

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Login failed");
      }
      return res.text();
    })
    .then((message) => {
      document.getElementById("loginMessage").textContent = message;
      document.getElementById("loginMessage").style.color = "green";
    })
    .catch((err) => {
      document.getElementById("loginMessage").textContent = "Invalid credentials.";
      document.getElementById("loginMessage").style.color = "red";
    });
    setTimeout(function(){
      window.location.href="home.html";
    },1500);

    
    
});
