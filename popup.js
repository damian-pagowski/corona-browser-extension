async function getCountryStats() {
  const country = localStorage.getItem("corona-country") || "poland";
  const URL_STATS = `https://damian-corona-api.herokuapp.com/countries/${country}?latest_only=1`;
  await fetch(URL_STATS)
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("name").innerText = data.name;
      document.getElementById("totalCases").innerText = data.totalCases;
    //   localStorage.setItem("corona-badge", data.totalCases);

    //   const value = localStorage.getItem("corona-badge") || 0;

    document.getElementById("totalDeaths").innerText = data.totalDeaths;
    document.getElementById("totalRecovered").innerText = data.totalRecovered;
    document.getElementById("newDeaths").innerText = data.newDeaths;
    //   badge
      document.getElementById("newCases").innerText = data.newCases;
      chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
      chrome.browserAction.setBadgeText({ text: `${data.newCases || 0}` });
    //   
    });
}

async function buildDropdowOptions() {
  const URL_COUNTRIES = `https://damian-corona-api.herokuapp.com/list/countries`;
  await fetch(URL_COUNTRIES)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((element) => {
        const option = document.createElement("option");
        option.text = element;
        option.value = element.toLowerCase().replace(/\s/g, "");
        var select = document.getElementById("select");
        select.appendChild(option);
      });
    });
}

async function main() {
  await getCountryStats();
  await buildDropdowOptions();
}
main();

document.getElementById("globe").addEventListener("click", () => {
  const coronaPanel = document.getElementById("corona-data");
  const countrySelect = document.getElementById("country-select");
  countrySelect.classList.toggle("hidden");
  coronaPanel.classList.toggle("hidden");
});

document.getElementById("ok-button").addEventListener("click", () => {
  const coronaPanel = document.getElementById("corona-data");
  const countrySelect = document.getElementById("country-select");
  const country = document.getElementById("select").value;
  localStorage.setItem("corona-country", country);
  countrySelect.classList.toggle("hidden");
  coronaPanel.classList.toggle("hidden");
  getCountryStats();
});
