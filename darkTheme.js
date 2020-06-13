var themeButton = document.querySelector(".slider");
var clickCount = 0;
themeButton.addEventListener("click", function(){
    document.querySelector("body").classList.toggle("darktheme");
    clickCount++;
    var image = document.querySelector(".main-logo");
    if(clickCount % 2 === 0){
        image.src="images/Frame 1.svg";
    }else{
        image.src= "images/Frame 2-3.svg";
    }    
});