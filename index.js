const apiKey = "DEMO_KEY"; // Replace with your real API key

document.addEventListener("DOMContentLoaded", () => {
  getCurrentImageOfTheDay();
  addSearchToHistory();

  document.getElementById("search-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const date = document.getElementById("search-input").value;
    getImageOfTheDay(date);
  });
});

function getCurrentImageOfTheDay() {
  const currentDate = new Date().toISOString().split("T")[0];
  fetchImage(currentDate);
}

function getImageOfTheDay(date) {
  fetchImage(date);
  saveSearch(date);
  addSearchToHistory();
}

function fetchImage(date) {
  fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`)
    .then(response => response.json())
    .then(data => {
      displayImage(data);
    })
    .catch(err => {
      document.getElementById("current-image-container").innerHTML = `<p>Error loading image. Please try again.</p>`;
    });
}

function displayImage(data) {
  const container = document.getElementById("current-image-container");
  container.innerHTML = `
    <h3>${data.title}</h3>
    <p>${data.date}</p>
    ${data.media_type === "image" ? `<img src="${data.url}" alt="${data.title}">` : `<iframe src="${data.url}" frameborder="0" allowfullscreen></iframe>`}
    <p>${data.explanation}</p>
  `;
}

function saveSearch(date) {
  let searches = JSON.parse(localStorage.getItem("searches")) || [];
  if (!searches.includes(date)) {
    searches.push(date);
    localStorage.setItem("searches", JSON.stringify(searches));
  }
}

function addSearchToHistory() {
  const history = document.getElementById("search-history");
  history.innerHTML = "";
  const searches = JSON.parse(localStorage.getItem("searches")) || [];

  searches.forEach(date => {
    const li = document.createElement("li");
    li.textContent = date;
    li.addEventListener("click", () => getImageOfTheDay(date));
    history.appendChild(li);
  });
}
