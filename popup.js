/*
  popup.js — verifies a Gumroad membership by email and stores the result in chrome.storage.local
  Replace PRODUCT_PERMALINK with your Gumroad product permalink (example: "mkitfa")
*/


const PRODUCT_PERMALINK = "mkitfa"; // <-- change here if needed
const GUMROAD_API_BASE = "https://api.gumroad.com/v2";

const emailInput = document.getElementById("emailInput");
const verifyButton = document.getElementById("verifyButton");
const statusEl = document.getElementById("status");
const purchaseLink = document.getElementById("purchaseLink");

purchaseLink.href = `https://basharov.gumroad.com/l/${PRODUCT_PERMALINK}`;

function setStatus(text, isError = false) {
  statusEl.textContent = text;
  statusEl.style.color = isError ? "#b00020" : "#0b6623";
}

async function verifySubscription(email) {
  setStatus("Checking...", false);
  verifyButton.disabled = true;

  try {
    const url = `${GUMROAD_API_BASE}/sales?product_permalink=${PRODUCT_PERMALINK}&email=${encodeURIComponent(email)}`;
    const resp = await fetch(url, { method: "GET", cache: "no-store" });
    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`HTTP ${resp.status}: ${text}`);
    }
    const data = await resp.json();
    console.log("Gumroad response:", data);

    if (data && data.success && Array.isArray(data.sales) && data.sales.length > 0) {
      const activeSale = data.sales.find(sale => {
        if (sale.refunded || sale.chargeback) return false;
        if (sale.subscription_ended_at) return false;
        return true;
      });

      if (activeSale) {
        chrome.storage.local.set({ subscription_valid: true, subscription_email: email }, () => {
          setStatus("✅ Subscription active — access granted.");
          verifyButton.disabled = false;
        });
        return;
      }
    }

    chrome.storage.local.set({ subscription_valid: false }, () => {
      setStatus("❌ No active subscription found for this email.", true);
      verifyButton.disabled = false;
    });

  } catch (err) {
    console.error("Verification error:", err);
    chrome.storage.local.set({ subscription_valid: false }, () => {
      setStatus("Error: " + err.message, true);
      verifyButton.disabled = false;
    });
  }
}

verifyButton.addEventListener("click", () => {
  const email = emailInput.value && emailInput.value.trim();
  if (!email) {
    setStatus("Please enter a valid email.", true);
    return;
  }
  verifySubscription(email);
});

chrome.storage.local.get(["subscription_email"], (res) => {
  if (res && res.subscription_email) {
    emailInput.value = res.subscription_email;
  }
});
