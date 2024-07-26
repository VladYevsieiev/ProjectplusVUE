function fetchWeatherData(city) {
  const apiKey = "f0472c034053bf2d36c5687dab2fdcd9";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      let temperature = data.main.temp;
      const weatherCondition = data.weather[0].main.toLowerCase();
      const windSpeed = data.wind.speed;
      const precipitation = data.weather[0].description;
      const pressure = data.main.pressure;
      const location = `${data.name}, ${data.sys.country}`;
      const mainDescription = data.weather[0].description;

      if (getCookie("temperatureUnit") == "F") {
        temperature = `${((temperature.toFixed(0) * 9) / 5 + 32).toFixed(0)} °F`;
      } else {
        temperature = `${temperature.toFixed(0)} °C`;
      }
      document.getElementById("current_temperature").innerText = temperature;
      document.getElementById("current_wind_speed").innerText =
        `Wind: ${windSpeed} kmph`;
      document.getElementById("current_precip").innerText =
        `Precip: ${precipitation}`;
      document.getElementById("current_pressure").innerText =
        `Pressure: ${pressure} mb`;
      document.getElementById("location").innerText = location;
      document.getElementById("current_main_descr").innerText = mainDescription;

      const weatherIconMap = {
        clear: "full_sun",
        clouds: "partly_cloudy",
        rain: "rainy",
        thunderstorm: "thunder",
        snow: "full_clouds",
      };
      const iconClass = weatherIconMap[weatherCondition] || "partly_cloudy";
      document.getElementById("current_icon").className = iconClass;
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });
}

function fetchWeatherForecast(city) {
  const apiKey = "f0472c034053bf2d36c5687dab2fdcd9";
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      const forecastElements = document.querySelectorAll(".prediction .day");
      const now = new Date();
      const today = now.toISOString().split("T")[0];
      const forecasts = data.list.filter((item) =>
        item.dt_txt.includes("12:00:00"),
      );

      let dayIndex = 0;
      for (const forecast of forecasts) {
        const forecastDate = forecast.dt_txt.split(" ")[0];
        if (forecastDate >= today && dayIndex < forecastElements.length) {
          let temperature = forecast.main.temp;
          const weatherCondition = forecast.weather[0].main.toLowerCase();
          const weatherIconMap = {
            clear: "full_sun",
            clouds: "partly_cloudy",
            rain: "rainy",
            thunderstorm: "thunder",
            snow: "full_clouds",
          };
          const iconClass = weatherIconMap[weatherCondition] || "partly_cloudy";
          const dayElement = forecastElements[dayIndex];
          if (getCookie("temperatureUnit") == "F") {
            temperature = `${((temperature * 9) / 5 + 32).toFixed(0)} °F`;
          } else {
            temperature = `${temperature.toFixed(0)} °C`;
          }
          dayElement.querySelector(".temperature").innerText = temperature;
          dayElement.querySelector("i").className = iconClass;
          dayElement.querySelector(".name").innerText = new Date(
            forecastDate,
          ).toLocaleDateString("en-US", { weekday: "short" });
          dayIndex++;
        }
        if (dayIndex >= forecastElements.length) break;
      }
    })
    .catch((error) => {
      console.error("Error fetching weather forecast:", error);
    });
}

document.querySelector("form").addEventListener("submit", function (event) {
  event.preventDefault();
  const city = document.querySelector('input[name="city"]').value;
  fetchWeatherData(city);
  fetchWeatherForecast(city);
});
////
document.addEventListener("DOMContentLoaded", () => {
  const pinButton = document.querySelector(".pin-button");
  const pinnedContainer = document.querySelector(".pinned-container");
  const locationName = document.getElementById("location");
  const temperatureElement = document.getElementById("current_temperature");
  const weatherIconElement = document.getElementById("current_icon");
  const locationKey = "pinnedLocations";

  function loadPinnedLocations() {
    const pinnedLocations = JSON.parse(localStorage.getItem(locationKey)) || [];
    pinnedLocations.forEach((location) => addPinnedLocation(location));
  }

  function addPinnedLocation(location) {
    const { name, temperature, iconClass } = location;
    const item = document.createElement("div");
    item.classList.add("pinned-item");
    item.innerHTML = `
            <span>${name}</span>
            <span>${temperature}</span>
            <i class="${iconClass}"></i>
            <button class="remove-button">X</button>
        `;
    pinnedContainer.appendChild(item);

    item.querySelector(".remove-button").addEventListener("click", () => {
      removePinnedLocation(name);
      item.remove();
    });
  }

  function removePinnedLocation(name) {
    let pinnedLocations = JSON.parse(localStorage.getItem(locationKey)) || [];
    pinnedLocations = pinnedLocations.filter((loc) => loc.name !== name);
    localStorage.setItem(locationKey, JSON.stringify(pinnedLocations));
  }

  pinButton.addEventListener("click", () => {
    const location = locationName.textContent.trim();
    const temperature = temperatureElement.textContent.trim();
    const iconClass = weatherIconElement.className.trim();

    if (
      location &&
      temperature &&
      iconClass &&
      !Array.from(pinnedContainer.children).some((item) =>
        item.textContent.includes(location),
      )
    ) {
      const pinnedLocations =
        JSON.parse(localStorage.getItem(locationKey)) || [];
      pinnedLocations.push({ name: location, temperature, iconClass });
      localStorage.setItem(locationKey, JSON.stringify(pinnedLocations));
      addPinnedLocation({ name: location, temperature, iconClass });
    }
  });

  loadPinnedLocations();
});

function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + d.toUTCString();
  document.cookie = `${name}=${value};${expires};path=/`;
}

//  куки
function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function initTemperatures() {
  const currentTemperatureElement = document.getElementById(
    "current_temperature",
  );

  const currentTemperature = parseFloat(currentTemperatureElement.innerText);
  if (getCookie("temperatureUnit") == "C") {
    currentTemperatureElement.innerText = `${currentTemperature} °C`;
  } else {
    currentTemperatureElement.innerText = `${((currentTemperature * 9) / 5 + 32).toFixed(0)} °F`;
  }

  const forecastElements = document.getElementsByClassName("temperature");
  for (const element of forecastElements) {
    const temp = parseFloat(element.innerText);
    if (getCookie("temperatureUnit") == "C") {
      element.innerText = `${temp} °C`;
    } else {
      element.innerText = `${((temp * 9) / 5 + 32).toFixed(0)} °F`;
    }
  }
}

function updateTemperatures() {
  const currentTemperatureElement = document.getElementById(
    "current_temperature",
  );
  const currentTemperature = parseFloat(currentTemperatureElement.innerText);
  currentTemperatureElement.innerText = formatTemperature(currentTemperature);

  const forecastElements = document.getElementsByClassName("temperature");
  for (const element of forecastElements) {
    const temp = parseFloat(element.innerText);
    element.innerText = formatTemperature(temp);
  }
}

function formatTemperature(floor) {
  if (getCookie("temperatureUnit") === "C") {
    return `${((floor * 9) / 5 + 32).toFixed(0)} °F`;
  }
  if (getCookie("temperatureUnit") === "F") {
    return `${((floor - 32) * (5 / 9)).toFixed(0)} °C`;
  }
}

document.getElementById("celsius").addEventListener("click", function () {
  if (getCookie("temperatureUnit") == "F") {
    updateTemperatures();
    setCookie("temperatureUnit", "C", 7);
  }
});

document.getElementById("fahrenheit").addEventListener("click", function () {
  if (getCookie("temperatureUnit") == "C") {
    updateTemperatures();
    setCookie("temperatureUnit", "F", 7);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  initTemperatures();
  if (getCookie("temperatureUnit") == null) {
    setCookie("temperatureUnit", "C", 7);
  }
});
