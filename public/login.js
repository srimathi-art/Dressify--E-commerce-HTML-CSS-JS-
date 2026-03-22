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


document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.status === "success") {
      document.getElementById("loginMessage").textContent = "Login Success";
      document.getElementById("loginMessage").style.color = "green";

      // ✅ STORE USER
      localStorage.setItem("user", JSON.stringify(data.user));

      // 🔥 redirect
      setTimeout(() => {
        window.location.href = "home.html";
      }, 1000);

    } else {
      throw new Error();
    }

  } catch (err) {
    document.getElementById("loginMessage").textContent = "Invalid credentials.";
    document.getElementById("loginMessage").style.color = "red";
  }
});