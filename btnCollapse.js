function buttonCollapse() {
    let collapsers = document.getElementsByClassName("text-collapse-btn");
    console.log(collapsers.length);
    var collapsableData = document.querySelectorAll(".individual-data");

    let collapsers = document.getElementsByClassName("text-collapse-btn");
    console.log(collapsers.length);
    var collapsableData = document.querySelectorAll(".individual-data");
    for (let i = 0; i < collapsers.length; i++) {
        console.log("test");
        collapsers[i].addEventListener("click", function () {
            console.log("clicked");
            //add collapse for this click to all text below
            for (let j = 0; j < collapsableData.length; j++) {
                collapsableData[j].classList.toggle("collapse");
            }
        });
        //reduce size of array for every iteration as we go down the column of buttons
        //so only the text below collapses
        collapsableData.shift();
        //console.log(collapsableData);
    }
}
// console.log("all listeners added to buttons");

// console.log("correct buttons selected");
// // document.querySelector(".text-collapse-btn").addEventListener("click", function(){
// //     document.querySelector(".individual-data").classList.toggle("collapse");
// // });
// console.log("test complete");
// for (let i = 0; i < collapsers.length; i++) {
//     console.log("test");
//     collapsers[i].addEventListener("click", function () {
//         console.log("clicked");
//         //add collapse for this click to all text below
//         for (let j = 0; j < collapsableData.length; j++) {
//             collapsableData[j].classList.toggle("collapse");
//         }
//     });
//reduce size of array for every iteration as we go down the column of buttons
//so only the text below collapses
// collapsableData.shift();
//console.log(collapsableData);
// }
// console.log("all listeners added to buttons");

// collapsableData.forEach(x => {
//     console.log("adding collapse class");
//     x.classList.toggle("collapse");
// });
//});