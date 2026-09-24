
const screens = {
  home: document.getElementById("homeScreen"),
  analytics: document.getElementById("analyticsScreen"),
  budget: document.getElementById("budgetScreen"),
  settings: document.getElementById("settingsScreen")
};

document.querySelectorAll(".nav-btn").forEach(btn => {

  btn.addEventListener("click", () => {

    document.querySelectorAll(".nav-btn")
      .forEach(b => b.classList.remove("active"));

    btn.classList.add("active");

    Object.values(screens)
      .forEach(s => s.classList.remove("active-screen"));

    screens[btn.dataset.screen]
      .classList.add("active-screen");

  });

});