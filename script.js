const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];
let adjustX = 5;
let adjustY = 5;

const mouse = {
	x: null,
	y: null,
	radius: 150,
};

window.addEventListener("mousemove", function (e) {
	mouse.x = e.x;
	mouse.y = e.y;
});

ctx.fillStyle = "white";
ctx.font = "30px Verdana";
ctx.fillText("Milica", 0, 50);

const textCoordinates = ctx.getImageData(0, 0, 100, 100);

class Particle {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.size = 3;
		this.baseX = this.x;
		this.baseY = this.y;
		this.density = Math.random() * 40 + 5;
	}
	draw() {
		ctx.fillStyle = "white";
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
		ctx.closePath();
		ctx.fill();
	}
	update() {
		let dx = mouse.x - this.x;
		let dy = mouse.y - this.y;
		let dist = Math.sqrt(dx * dx + dy * dy);
		let forceDirectionX = dx / dist;
		let forceDirectionY = dy / dist;
		let maxDistance = mouse.radius;
		let force = (maxDistance - dist) / maxDistance;
		let directionX = forceDirectionX * force * this.density;
		let directionY = forceDirectionY * force * this.density;
		if (dist < mouse.radius) {
			this.x -= directionX;
			this.y -= directionY;
		} else {
			if (this.x !== this.baseX) {
				let dx = this.x - this.baseX;
				this.x -= dx / 10;
			}
			if (this.y !== this.baseY) {
				let dy = this.y - this.baseY;
				this.y -= dy / 10;
			}
		}
	}
}

function init() {
	particleArray = [];
	console.log(textCoordinates);
	for (let y = 0, y2 = textCoordinates.height; y < y2; y++) {
		for (let x = 0, x2 = textCoordinates.width; x < x2; x++) {
			if (
				textCoordinates.data[
					y * textCoordinates.height * 4 + x * 4 + 3
				] > 128
			) {
				let positionX = x + adjustX;
				let positionY = y + adjustY;
				particleArray.push(
					new Particle(positionX * 15, positionY * 15)
				);
			}
		}
	}
}

init();

function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (let i = 0; i < particleArray.length; i++) {
		particleArray[i].draw();
		particleArray[i].update();
	}
	connect();
	requestAnimationFrame(animate);
}
animate();

function connect() {
	let opacityValue = 1;
	let lineDistance = 50;
	for (let a = 0; a < particleArray.length; a++) {
		for (let b = a; b < particleArray.length; b++) {
			let dx = particleArray[a].x - particleArray[b].x;
			let dy = particleArray[a].y - particleArray[b].y;
			let distance = Math.sqrt(dx * dx + dy * dy);
			if (distance < lineDistance) {
				opacityValue = 1 - distance / lineDistance;
				ctx.strokeStyle = `rgba(255, 255, 255, ${opacityValue})`;
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.moveTo(particleArray[a].x, particleArray[a].y);
				ctx.lineTo(particleArray[b].x, particleArray[b].y);
				ctx.stroke();
			}
		}
	}
}
