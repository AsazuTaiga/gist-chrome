window.onload = () => {
  // nodes
  const apiKeyInput = document.querySelector("#api-key");
  const gistList = document.querySelector("#gist-list");
  const updateButton = document.querySelector("#update-button");
  const filter = document.querySelector("#filter");
  // nodes end

  // setup
  const apiKey = localStorage.getItem("apiKey");
  const gists = JSON.parse(localStorage.getItem("gists"));
  const filterValue = localStorage.getItem("filter");
  if (apiKey) {
    apiKeyInput.value = apiKey;
    updateButton.removeAttribute("disabled");
  }
  if (gists) {
    gists.forEach((gist) => {
      const a = document.createElement("a");
      a.href = gist.html_url;
      a.textContent = gist.owner.login + "/" + Object.keys(gist.files)[0];
      a.target = "_blank";
      const li = document.createElement("li");

      if (filterValue && !a.textContent.includes(filterValue)) {
        li.setAttribute("hidden", "true");
      }

      li.appendChild(a);
      gistList.appendChild(li);
    });
  }
  if (filterValue) {
    filter.value = filterValue;
  }
  // setup end

  // events
  // apiKeyInputの変更を監視して、更新ボタンのdisabledを切り替える
  apiKeyInput.addEventListener("input", () => {
    if (apiKeyInput.value) {
      updateButton.removeAttribute("disabled");
    } else {
      updateButton.setAttribute("disabled", "true");
    }
  });

  // api Key を入力して更新ボタンを押したら、githubのgistを取得する
  updateButton.addEventListener("click", () => {
    // gistの一覧を初期化する
    gistList.innerHTML = "";

    const apiKey = apiKeyInput.value;
    const url = "https://api.github.com/gists";

    // aria-busyをtrueにする
    updateButton.setAttribute("aria-busy", "true");
    // fetchでgistを取得する
    fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    })
      .then((response) => response.json())
      .then((gists) => {
        localStorage.setItem("apiKey", apiKey);
        localStorage.setItem("gists", JSON.stringify(gists));
        // aria-busyをfalseにする
        updateButton.setAttribute("aria-busy", "false");
        // gistの一覧を表示する
        gists.forEach((gist) => {
          const a = document.createElement("a");
          a.href = gist.html_url;
          a.textContent = gist.owner.login + "/" + Object.keys(gist.files)[0];
          a.target = "_blank";
          const li = document.createElement("li");
          li.appendChild(a);
          gistList.appendChild(li);
        });
      })
      .catch((error) => {
        // aria-busyをfalseにする
        updateButton.setAttribute("aria-busy", "false");
        // エラーを表示する
        const li = document.createElement("li");
        li.textContent = error;
        // crimson
        li.style.color = "#dc143c";
        gistList.appendChild(li);
      });
  });

  // fitlerの変更を監視して、gistの一覧をフィルタリングする
  filter.addEventListener("input", () => {
    const filterText = filter.value;
    localStorage.setItem("filter", filterText);
    const listItems = document.querySelectorAll("#gist-list li");
    listItems.forEach((listItem) => {
      const a = listItem.querySelector("a");
      if (a.textContent.includes(filterText)) {
        listItem.removeAttribute("hidden");
      } else {
        listItem.setAttribute("hidden", "true");
      }
    });
  });
  // events end
};
