(function () {
  const box = document.createElement("div");
  box.style.cssText = "position:fixed;z-index:999999;bottom:8px;left:8px;right:8px;padding:12px;background:#171322;color:#fff;border:1px solid #a78bfa;border-radius:12px;font:13px sans-serif;direction:ltr;white-space:pre-wrap;max-height:35vh;overflow:auto";
  box.textContent = "LUMI DIAGNOSTICS\nScript loaded";
  document.addEventListener("DOMContentLoaded", () => document.body.appendChild(box));
  if (document.body) document.body.appendChild(box);

  function status(message) {
    box.textContent += "\n" + message;
  }

  try {
    if (!window.Telegram || !window.Telegram.WebApp) {
      status("Telegram WebApp: NOT FOUND");
      return;
    }

    const tg = window.Telegram.WebApp;
    tg.ready();
    const initData = tg.initData;
    status("Telegram WebApp: FOUND");
    status("initData available: " + Boolean(initData));

    if (!initData) {
      status("Open Lumi using the bot's Telegram button.");
      return;
    }

    const user = tg.initDataUnsafe?.user || {};
    status("Telegram user ID available: " + Boolean(user.id));
    status("Sending request to server...");

    fetch("https://infinite-minolta-twins-holdem.trycloudflare.com/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        init_data: initData,
        profile: {
          telegram_id: user.id || "",
          telegram_username: user.username || "",
          telegram_first_name: user.first_name || "",
          telegram_last_name: user.last_name || ""
        }
      })
    })
      .then(async response => {
        status("Server HTTP status: " + response.status);
        const data = await response.json();
        status("Server response: " + JSON.stringify(data));
      })
      .catch(error => status("Request failed: " + error.message));
  } catch (error) {
    status("Script error: " + error.message);
  }
})();
