(function () {
  fetch("https://leeds-recipients-transactions-whose.trycloudflare.com/?diag=script-loaded").catch(() => {});
console.log("LUMI_DIAG_SCRIPT_LOADED");
  if (!window.Telegram || !Telegram.WebApp) {
    console.log("Lumi: Telegram WebApp unavailable");
    return;
  }

  Telegram.WebApp.ready();

  const initData = Telegram.WebApp.initData;

  console.log("Lumi: Telegram ready", !!initData);

  if (!initData) {
    console.log("Lumi: initData empty");
    return;
  }

  window.lumiSyncServer = function (profile) {
    const safe = Object.assign({}, profile);
    delete safe.password;

    return fetch("https://leeds-recipients-transactions-whose.trycloudflare.com/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        init_data: initData,
        profile: safe
      })
    })
      .then(r => r.json())
      .then(data => {
        console.log("Lumi server:", data);
        return data;
      })
      .catch(err => console.error("Lumi server error:", err));
  };

  const tgUser = Telegram.WebApp.initDataUnsafe?.user || {};

  window.lumiSyncServer({
    telegram_id: tgUser.id || "",
    telegram_username: tgUser.username || "",
    telegram_first_name: tgUser.first_name || "",
    telegram_last_name: tgUser.last_name || ""
  });
})();
