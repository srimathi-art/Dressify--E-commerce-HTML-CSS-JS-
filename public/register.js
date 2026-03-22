document.getElementById("registerForm").addEventListener("submit", async function (e) {
  e.preventDefault(); // Prevent page reload

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!name || !email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    });

    const result = await response.text();

    if (response.ok) {
      alert("✅ Registration successful!");
      document.getElementById("registerForm").reset();
      window.location.href = "login.html";
    } else {
      alert("❌ " + result);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("❌ Failed to connect to server");
  }
});

// Toggle password visibility
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