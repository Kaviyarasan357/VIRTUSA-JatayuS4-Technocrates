/*document.addEventListener("DOMContentLoaded", function () {
  const loginBtn = document.getElementById("loginBtn");
  const emailInput = document.getElementById("emailInput");
  const termsCheckbox = document.getElementById("termsCheckbox");
  const errorDiv = document.getElementById("error");
  const toast = document.getElementById("toast");

  loginBtn.addEventListener("click", function () {
    const email = emailInput.value.trim();
    const termsAccepted = termsCheckbox.checked;

    errorDiv.textContent = "";

    if (!email) {
      errorDiv.textContent = "⚠️ Email is required.";
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errorDiv.textContent = "⚠️ Invalid email format.";
      return;
    }

    if (!termsAccepted) {
      errorDiv.textContent = "⚠️ You must accept the Terms & Conditions.";
      return;
    }

    // Stateless login: Save only the current email and login status
    chrome.storage.local.set(
      {
        currentUserEmail: email,
        isLoggedIn: true,
      },
      () => {
        if (toast) {
          toast.textContent = "✅ Login successful. Monitoring started.";
          toast.classList.add("show");

          setTimeout(() => {
            toast.classList.remove("show");
            window.close(); // Close popup if needed
          }, 2000);
        } else {
          window.close();
        }
      }
    );
  });
});
*/
document.addEventListener("DOMContentLoaded", function () {
  const loginBtn = document.getElementById("loginBtn");
  const emailInput = document.getElementById("emailInput");
  const termsCheckbox = document.getElementById("termsCheckbox");
  const errorDiv = document.getElementById("error");
  const toast = document.getElementById("toast");

  loginBtn.addEventListener("click", function () {
    const email = emailInput.value.trim();
    const termsAccepted = termsCheckbox.checked;

    errorDiv.textContent = "";

    if (!email) {
      errorDiv.textContent = "⚠️ Email is required.";
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errorDiv.textContent = "⚠️ Invalid email format.";
      return;
    }

    if (!termsAccepted) {
      errorDiv.textContent = "⚠️ You must accept the Terms & Conditions.";
      return;
    }

    chrome.storage.local.set(
      {
        currentUserEmail: email,
        isLoggedIn: true,
      },
      () => {
        if (toast) {
          toast.textContent = "✅ Login successful. Monitoring started.";
          toast.classList.add("show");

          setTimeout(() => {
            toast.classList.remove("show");
            window.close();
          }, 2000);
        } else {
          window.close();
        }
      }
    );
  });
});

