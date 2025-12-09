document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector("input[type='range'][name='barCount']");
  const display = document.querySelector(".slider-value");

  if (slider && display) {
    slider.addEventListener("input", () => {
      display.textContent = slider.value;
    });
  }
});
