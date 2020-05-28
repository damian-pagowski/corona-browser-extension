const getSettings = () => JSON.parse(localStorage.getItem("corona-settings"));

async function getCountryStats() {
  const settings = getSettings();
  const country = settings ? settings.country : "thailand";
  const URL_STATS = `https://damian-corona-api.herokuapp.com/countries/${country}?latest_only=1`;
  console.log(`Checking stats for: ${country} ${Date.now()}`);
  await fetch(URL_STATS)
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("name").innerText = data.name;
      document.getElementById("totalCases").innerText = data.totalCases;
      document.getElementById("totalDeaths").innerText = data.totalDeaths;
      document.getElementById("totalRecovered").innerText = data.totalRecovered;
      document.getElementById("newDeaths").innerText = data.newDeaths || 0;
      document.getElementById("newCases").innerText = data.newCases || 0;
      // BADGE
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
        const select = document.getElementById("country-select");
        select.appendChild(option);
      });
    })
    .then(() => {
      const settings = getSettings();
      if (settings)
        document.getElementById("country-select").value = settings.country;
      document.getElementById("synchronization-select").value =
        settings.synchronization;
    });
}

async function main() {
  await getCountryStats();
  await buildDropdowOptions();
}

document.getElementById("globe").addEventListener("click", () => {
  const coronaPanel = document.getElementById("corona-data");
  const settingsPanel = document.getElementById("settings");
  settingsPanel.classList.toggle("hidden");
  coronaPanel.classList.toggle("hidden");
});

document.getElementById("ok-button").addEventListener("click", (e) => {
  e.preventDefault();
  const coronaPanel = document.getElementById("corona-data");
  const settingsPanel = document.getElementById("settings");
  //   dropdowns
  const country = document.getElementById("country-select").value;
  const synchronization = document.getElementById("synchronization-select")
    .value;
  // save settings
  const settings = { country, synchronization };
  //   localStorage.setItem("corona-country", country);
  localStorage.setItem("corona-settings", JSON.stringify(settings));
  
  //   switch displayed panel
  settingsPanel.classList.toggle("hidden");
  coronaPanel.classList.toggle("hidden");
  setSynchronization(synchronization);
  getCountryStats();
});
const settings = getSettings();
const synchronization = settings ? settings.synchronization : 5;

function setSynchronization(synchronization) {
  setInterval(getCountryStats, synchronization * 60 * 1000);
}
main();
