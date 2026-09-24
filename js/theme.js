
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

function applyTheme(theme) {

  document.body.classList.toggle("light", theme === "light");

  themeIcon.textContent =
    theme === "light"
      ? "light_mode"
      : "dark_mode";

  Storage.saveTheme(theme);

  if (window.expenseChart) {
    expenseChart.options.plugins.legend.labels.color =
      theme === "light"
        ? "#1b2b1f"
        : "#ffffff";

    expenseChart.update();
  }

}

applyTheme(Storage.getTheme());

themeToggle.addEventListener("click", () => {

  const next =
    document.body.classList.contains("light")
      ? "dark"
      : "light";

  applyTheme(next);

});