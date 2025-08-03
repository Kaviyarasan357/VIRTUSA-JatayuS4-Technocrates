/*document.addEventListener("DOMContentLoaded", function () {
  const emailInput = document.getElementById("emailInput");
  const passwordInput = document.getElementById("passwordInput");
  const confirmPasswordInput = document.getElementById("confirmPasswordInput");
  const errorDiv = document.getElementById("error");
  const signupBtn = document.getElementById("signupBtn");

  // Toast element
  const toast = document.createElement("div");
  toast.className = "toast";
  document.body.appendChild(toast);

  const showToast = (message, success = true) => {
    toast.textContent = success ? `✅ ${message}` : `❌ ${message}`;
    toast.style.backgroundColor = success ? "#28a745" : "#dc3545";
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
      if (success) {
        window.location.href = "login.html";
      }
    }, 2000);
  };

  signupBtn.addEventListener("click", () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    errorDiv.textContent = "";

    // Basic validations
    if (!email || !password || !confirmPassword) {
      errorDiv.textContent = "All fields are required.";
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errorDiv.textContent = "Invalid email format.";
      return;
    }

    if (password.length < 6) {
      errorDiv.textContent = "Password must be at least 6 characters.";
      return;
    }

    if (password !== confirmPassword) {
      errorDiv.textContent = "Passwords do not match.";
      return;
    }

    // Save user credentials and login status to Chrome storage
    chrome.storage.local.set({
      userEmail: email,
      userPassword: password,
      isLoggedIn: true,
      currentUserEmail: email
    }, () => {
      showToast("Account created successfully!");
    });
  });
});
*/

document.addEventListener("DOMContentLoaded", function () {
  const emailInput = document.getElementById("emailInput");
  const passwordInput = document.getElementById("passwordInput");
  const confirmPasswordInput = document.getElementById("confirmPasswordInput");
  const errorDiv = document.getElementById("error");
  const signupBtn = document.getElementById("signupBtn");
  const toast = document.getElementById("toast");

  const showToast = (message, success = true) => {
    toast.textContent = success ? `✅ ${message}` : `❌ ${message}`;
    toast.style.backgroundColor = success ? "#28a745" : "#dc3545";
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
      if (success) {
        window.location.href = "login.html";
      }
    }, 2000);
  };

  signupBtn.addEventListener("click", () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    errorDiv.textContent = "";

    if (!email || !password || !confirmPassword) {
      errorDiv.textContent = "All fields are required.";
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errorDiv.textContent = "Invalid email format.";
      return;
    }

    if (password.length < 6) {
      errorDiv.textContent = "Password must be at least 6 characters.";
      return;
    }

    if (password !== confirmPassword) {
      errorDiv.textContent = "Passwords do not match.";
      return;
    }

    // Save user data
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({
        userEmail: email,
        userPassword: password,
        isLoggedIn: true,
        currentUserEmail: email
      }, () => {
        showToast("Account created successfully!");
      });
    } else {
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userPassword", password);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currentUserEmail", email);
      showToast("Account created successfully! (Local Storage)");
    }
  });
});

