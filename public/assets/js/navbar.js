document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.querySelector(".navbar .toggle");
  const navLinks = document.querySelector(".navbar .nav-links");

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      toggleBtn.classList.toggle("active");
    });
  }
});
