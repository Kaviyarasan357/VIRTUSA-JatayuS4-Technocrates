document.getElementById("loginBtn").addEventListener("click", async () => {
  await handleAuth("/api/login", "Login successful!");
});

document.getElementById("signupBtn").addEventListener("click", async () => {
  await handleAuth("/api/signup", "Signup successful!");
});

async function handleAuth(endpoint, successMessage) {
  const email = document.getElementById("emailInput").value.trim();
  const password = document.getElementById("passwordInput").value.trim();

  if (!email || !email.includes("@")) {
    showToast("❗ Please enter a valid email.");
    return;
  }

  if (!password || password.length < 4) {
    showToast("❗ Password must be at least 4 characters.");
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      showToast(`❌ ${data.message || "Authentication failed"}`);
      return;
    }

    if (endpoint === "/api/login") {
      chrome.storage.local.set({ parentEmail: email }, () => {
        console.log("✅ Logged in and saved:", email);
      });
    }

    showToast(`✅ ${successMessage}`);
    setTimeout(() => window.close(), 1500);

  } catch (err) {
    console.error("❌ Network error:", err);
    showToast("❌ Network error. Try again.");
  }
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = "show";
  setTimeout(() => {
    toast.className = toast.className.replace("show", "");
  }, 3000);
}
