let linksbtn = document.querySelector(".hide");
let closebtn = document.querySelector(".popupCut");
let topNav = document.querySelector(".container .Header .links-box .links-box-child");

function PopUp () {
    topNav.classList.toggle("toggle");
    topNav.classList.toggle("hide-on-pc");
}


function ClosePopUp() {
    topNav.classList.remove("toggle");
}

linksbtn.addEventListener("click", PopUp);
closebtn.addEventListener("click", ClosePopUp);

// Add an event listener to hide the menu when a link is clicked
document.querySelectorAll('.links-item a').forEach(link => {
    link.addEventListener('click', function() {
        topNav.classList.remove('toggle');
    });
});
function w3_open() {
    document.getElementById("mySidebar").style.display = "block";
  }
  
  function w3_close() {
    document.getElementById("mySidebar").style.display = "none";
  }