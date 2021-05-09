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
	radius: 200,
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
	//create individual particle object
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.size = 3;
		this.baseX = this.x;
		this.baseY = this.y;
		// add randomness to the resistance to mouse pushing particles
		this.density = Math.random() * 40 + 5;
	}

	draw() {
		//draw each particle as a small cirle
		ctx.fillStyle = "white";
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
		ctx.closePath();
		ctx.fill();
	}
	// calc particle movement
	update() {
		//calc distance between mouse and particle
		let dx = mouse.x - this.x;
		let dy = mouse.y - this.y;
		let dist = Math.sqrt(dx * dx + dy * dy);
		// move particle away from mouse depending on direction
		let forceDirectionX = dx / dist;
		let forceDirectionY = dy / dist;
		//move particle if closer than max distance
		let maxDistance = mouse.radius;
		//calc particle movement based on distance to mouse and individual density
		let force = (maxDistance - dist) / maxDistance;
		let directionX = forceDirectionX * force * this.density;
		let directionY = forceDirectionY * force * this.density;
		//update particle position
		if (dist < mouse.radius) {
			this.x -= directionX;
			this.y -= directionY;
		} else {
			// move particled back when not pushed by mouse
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
	//generate particles with position based on initial fill text
	particleArray = [];
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

function connect() {
	// draw lines between nearby particles
	let opacityValue = 1;
	let lineDistance = 50;
	// cycle through all particles an calc lines to each other particle
	for (let a = 0; a < particleArray.length; a++) {
		// iterate through the particles the second time starting at "a" to avoid redrawing the same lines
		for (let b = a; b < particleArray.length; b++) {
			//calc disance between particles
			let dx = particleArray[a].x - particleArray[b].x;
			let dy = particleArray[a].y - particleArray[b].y;
			let distance = Math.sqrt(dx * dx + dy * dy);
			if (distance < lineDistance) {
				//draw lines
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

function animate() {
	// redraw all particles in each frame based on position
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (let i = 0; i < particleArray.length; i++) {
		particleArray[i].draw();
		particleArray[i].update();
	}
	connect();
	requestAnimationFrame(animate);
}
animate();
