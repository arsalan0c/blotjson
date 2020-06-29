/*
gives the slider in the html page functionality to change theme of the page
*/

var themeButton = document.querySelector(".slider");
var clickCount = 0;
themeButton.addEventListener("click", function () {
  document.querySelector("body").classList.toggle("darktheme");
  clickCount++;
  var image = document.querySelector(".main-logo");
  if (clickCount % 2 === 0) {
    image.src = "../static/images/Frame_1.svg";
  } else {
    image.src = "../static/images/Frame_2-3.svg";
  }
});
