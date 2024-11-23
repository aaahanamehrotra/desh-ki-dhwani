const hamburger = document.querySelector(".hamburger")
const right = document.querySelector(".right")
const clicked = () => {hamburger.classList.toggle("cross")
right.classList.toggle("visible")
}

hamburger.addEventListener("click", clicked)



