const karakter = document.getElementById("karakter");
const cake = document.getElementById("cake");
const playerScore = document.getElementById("score");

let score = 0;
let interval = null;

let jumlahScore = () => {
    score++;
    playerScore.innerHTML = `Score : ${score}`;
};

function lompat() {
    if (karakter.classList != "animate") {
        karakter.classList.add("animate");
    }
    setTimeout(function () {
        karakter.classList.remove("animate");
    }, 500);
    interval = setInterval(jumlahScore, 100);
}

const kenaCake = setInterval(function () {
    const karakterTop = parseInt(window.getComputedStyle(karakter).getPropertyValue("top"));
    const cakeLeft = parseInt(window.getComputedStyle(cake).getPropertyValue("left"));
    if (cakeLeft < 30 && cakeLeft > 0 && karakterTop >= 60) {
        cake.style.animation = "none";
        cake.style.display = "none";
        if (confirm("Sorry, karakter nabrak cake T.T, mau main lagi?")) {
            window.location.reload();
        }
    }
});
