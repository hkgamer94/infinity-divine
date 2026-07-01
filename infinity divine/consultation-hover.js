const image = document.getElementById("serviceImage");

document.getElementById("birthChart")
    .addEventListener("mouseenter", () => {
        console.log("Birth Chart Hovered");
        image.src = "assets/astro.png";
    });

document.getElementById("oneQuestion")
    .addEventListener("mouseenter", () => {
        image.src = "assets/tarot.png";
    });

document.getElementById("relationship")
    .addEventListener("mouseenter", () => {
        image.src = "assets/relationship.png";
    });

document.querySelectorAll(".session-types > div")
    .forEach(card => {
        card.addEventListener("mouseleave", () => {
            image.src = "assets/moon-default.png";
        });
    });

document.getElementById("birthChart")
    .addEventListener("mouseenter", () => {
        console.log("Birth Chart Hovered");
        image.src = "assets/birth-chart.png";
    });

document.getElementById("eKundli").addEventListener("mouseenter", () => {
    image.src = "assets/e-kundli.png";
});

