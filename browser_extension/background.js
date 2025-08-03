// Open login.html in a full tab on install/update
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install" || details.reason === "update") {
    chrome.tabs.create({ url: chrome.runtime.getURL("login.html") });
  }
});

// Monitor tab updates only after login
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === 'complete' &&
    tab.url &&
    tab.title &&
    !tab.url.startsWith("chrome://") &&
    !tab.url.startsWith("devtools://") &&
    !tab.url.startsWith("edge://") &&
    !tab.url.startsWith("chrome-extension://")
  ) {
    // Check if the user is logged in and get the current logged-in email
    chrome.storage.local.get(["isLoggedIn", "currentUserEmail"], (result) => {
      if (!result.isLoggedIn || !result.currentUserEmail) {
        console.warn("⚠️ User not logged in. Monitoring skipped.");
        return;
      }

      const currentUserEmail = result.currentUserEmail;
      const textToAnalyze = tab.title;
      console.log("📌 New tab detected:");
      console.log("🔗 URL:", tab.url);
      console.log("📝 Title:", textToAnalyze);

      // Sentiment analysis request
      fetch(`http://localhost:3000/analyze?text=${encodeURIComponent(textToAnalyze)}`)
        .then(res => {
          if (!res.ok) throw new Error("Failed to analyze sentiment");
          return res.json();
        })
        .then(data => {
          console.log("✅ Sentiment analysis result:", data);

          // Store the result in your backend
          return fetch("http://localhost:3000/collect", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              url: tab.url,
              title: tab.title,
              sentiment: data.sentiment || 'neutral',
              score: typeof data.score === 'number' ? data.score : 0,
              timestamp: Date.now(),
              parentEmail: currentUserEmail  // Now dynamic per session
            })
          });
        })
        .then(res => {
          if (!res.ok) throw new Error("Failed to store data");
          console.log("📥 Data stored successfully.");
        })
        .catch(err => {
          console.error("❌ Error during processing:", err);
        });
    });
  }
});
