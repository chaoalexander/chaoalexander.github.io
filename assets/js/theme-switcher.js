document.addEventListener("DOMContentLoaded", function() {
  var themeSwitcher = document.getElementById("theme-switcher");

  themeSwitcher.addEventListener("change", function(event) {
    var selectedTheme = event.target.value;
    document.documentElement.setAttribute("data-theme", selectedTheme);
    localStorage.setItem("theme", selectedTheme);
  });

  var currentTheme = localStorage.getItem("theme") || "default";
  document.documentElement.setAttribute("data-theme", currentTheme);
  themeSwitcher.value = currentTheme;
});
