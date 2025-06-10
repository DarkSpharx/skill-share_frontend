function resizeTitle() {
  const h1 = document.getElementById("title");
  h1.style.transform = "translate(-50%, -50%) scale(1)"; // reset
  const scale = window.innerWidth / h1.offsetWidth;
  h1.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

window.addEventListener("load", resizeTitle);
window.addEventListener("resize", resizeTitle);
