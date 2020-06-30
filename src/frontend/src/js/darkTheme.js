/*
gives the slider in the html page functionality to change theme of the page
*/

const LOGO_LIGHT = "../images/logo_light.svg";
const LOGO_DARK = "../images/logo_dark.svg";

var themeButton = document.querySelector(".slider");
var clickCount = 0;
themeButton.addEventListener("click", function () {
  document.querySelector("body").classList.toggle("darktheme");
  clickCount++;
  var image = document.querySelector(".main-logo");
  if (clickCount % 2 === 0) {
    image.src = LOGO_LIGHT;
  } else {
    image.src = LOGO_DARK;
  }
});
