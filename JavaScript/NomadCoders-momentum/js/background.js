const images = ["0.jpeg", "1.jpeg", "2.jpeg", "Seoul-attractions-Changdeokgung.jpg"];
const chosenImage = images[Math.floor(Math.random() * images.length)];
const bgimage = document.createElement("img");
bgimage.src = `img/${chosenImage}`;
console.log(bgimage)
document.body.appendChild(bgimage)