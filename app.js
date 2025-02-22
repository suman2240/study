const introMusic = new Audio("./Music/theam.mp3");
const shootingSound = new Audio("./Music/wepon1.mp3");
const killEnemySound = new Audio("./Music/kill.mp3");
const gameOverSound = new Audio("./Music/gameover.mp3");
const heavyWeaponSound = new Audio("./Music/largewepon.mp3");
const hugeWeaponSound = new Audio("./Music/space.mp3");

introMusic.play();
//-------enviroment basic
const canvas = document.createElement("canvas");
document.querySelector(".myGame").appendChild(canvas);
canvas.width = innerWidth;
canvas.height = innerHeight;
const context = canvas.getContext("2d");
const lightWeaponDamage = 10;
const heavyWeaponDamage = 20;

let difficulty = 2;
const form = document.querySelector("form");
const scoreBoard = document.querySelector(".scoreBoard");
let playerScore = 0;
//-------basic function

//------event listner for dificulty
document.querySelector("input").addEventListener("click", (e) => {
  e.preventDefault();

  introMusic.pause();

  form.style.display = "none";
  scoreBoard.style.display = "block";

  const userValue = document.getElementById("difficulty").value;
  if (userValue === "Easy") {
    setInterval(spawnEnemy, 2000);
    return (difficulty = 5);
  }
  if (userValue === "Medium") {
    setInterval(spawnEnemy, 1400);
    return (difficulty = 7);
  }
  if (userValue === "Hard") {
    setInterval(spawnEnemy, 1000);
    return (difficulty = 9);
  }
  if (userValue === "Insane") {
    setInterval(spawnEnemy, 700);
    return (difficulty = 11);
  }
});

const gameoverLoader = () => {
  const gameOverBanner = document.createElement("div");
  const gameOverBtn = document.createElement("button");
  const highScore = document.createElement("div");

  highScore.innerHTML = `High Score : ${
    localStorage.getItem("highScore")
      ? localStorage.getItem("highScore")
      : playerScore
  }`;
  const oldHighScore =
    localStorage.getItem("highScore") && localStorage.getItem("highScore");
  if (oldHighScore < playerScore) {
    localStorage.setItem("highScore", playerScore);
    highScore.innerHTML = `High Score: ${playerScore}`;
  }

  gameOverBtn.innerText = " Play Again";
  gameOverBanner.appendChild(highScore);
  gameOverBanner.appendChild(gameOverBtn);

  gameOverBanner.classList.add("gameover");
  document.querySelector("body").appendChild(gameOverBanner);
  gameOverBtn.onclick = () => {
    window.location.reload();
  };
};

//--------creating player

playerPosition = {
  x: canvas.width / 2,
  y: canvas.height / 2,
};

class player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }
  draw() {
    context.beginPath();
    context.arc(
      this.x,
      this.y,
      this.radius,
      (Math.PI / 180) * 0,
      (Math.PI / 180) * 360,
      false
    );
    context.fillStyle = this.color;

    context.fill();
  }
}

//------------------------------
class weapon {
  constructor(x, y, radius, color, velocity, damage) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.damage = damage;
  }
  draw() {
    context.beginPath();
    context.arc(
      this.x,
      this.y,
      this.radius,
      (Math.PI / 180) * 0,
      (Math.PI / 180) * 360,
      false
    );
    context.fillStyle = this.color;

    context.fill();
  }
  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

//--------
class hugeWeapon {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.color = "rgba(47,255,0,1)";
  }
  draw() {
    context.beginPath();
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, 200, canvas.height);
  }
  update() {
    this.draw();
    this.x += 30;
  }
}
//------------------------
class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }
  draw() {
    context.beginPath();
    context.arc(
      this.x,
      this.y,
      this.radius,
      (Math.PI / 180) * 0,
      (Math.PI / 180) * 360,
      false
    );
    context.fillStyle = this.color;

    context.fill();
  }
  update() {
    this.draw();
    (this.x += this.velocity.x), (this.y += this.velocity.y);
  }
}

const fraction = 0.99;

class Partical {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.aplha = 1;
  }
  draw() {
    context.save();
    context.globalAlpha = this.aplha;

    context.beginPath();
    context.arc(
      this.x,
      this.y,
      this.radius,
      (Math.PI / 180) * 0,
      (Math.PI / 180) * 360,
      false
    );
    context.fillStyle = this.color;

    context.fill();
    context.restore();
  }
  update() {
    this.draw();
    this.velocity.x *= fraction;
    this.velocity.y *= fraction;
    (this.x += this.velocity.x),
      (this.y += this.velocity.y),
      (this.aplha -= 0.01);
  }
}

//-------------------main logic
const abhi = new player(playerPosition.x, playerPosition.y, 15, "white");

const weapons = [];
const enemies = [];
const particals = [];
const hugeWeapons = [];

const spawnEnemy = () => {
  const enemySize = Math.random() * (40 - 5) + 5;
  const enemyColor = `hsl(${Math.floor(Math.random() * 360)},100%,50%)`;
  let random;
  if (Math.random() < 0.5) {
    random = {
      x: Math.random() < 0.5 ? canvas.width + enemySize : 0 - enemySize,
      y: Math.random() * canvas.height,
    };
  } else {
    random = {
      x: Math.random() * canvas.width,
      y: Math.random() < 0.5 ? canvas.height + enemySize : 0 - enemySize,
    };
  }
  const myAngle = Math.atan2(
    canvas.height / 2 - random.y,
    canvas.width / 2 - random.x
  );
  const velocity = {
    x: Math.cos(myAngle) * difficulty,
    y: Math.sin(myAngle) * difficulty,
  };

  enemies.push(new Enemy(random.x, random.y, enemySize, enemyColor, velocity));
};
let animationId;
function animation() {
  animationId = requestAnimationFrame(animation);

  scoreBoard.innerHTML = `Score : ${playerScore}`;

  context.fillStyle = "rgba(0,0,0,0.2)";

  context.fillRect(0, 0, canvas.width, canvas.height);

  abhi.draw();

  particals.forEach((Partical, particalIndex) => {
    if (Partical.aplha <= 0) {
      particals.splice(particalIndex, 1);
    } else {
      Partical.update();
    }
  });

  hugeWeapons.forEach((hugeWeapon, hugeWeaponIndex) => {
    if (hugeWeapon.x > canvas.width) {
      hugeWeapons.splice(hugeWeaponIndex, 1);
    } else {
      hugeWeapon.update();
    }
  });

  weapons.forEach((weapon, weaponIndex) => {
    weapon.update();

    if (
      weapon.x + weapon.radius < 1 ||
      weapon.y + weapon.radius < 1 ||
      weapon.x - weapon.radius > canvas.width ||
      weapon.y - weapon.radius > canvas.height
    ) {
      weapons.splice(weaponIndex, 1);
    }
  });
  enemies.forEach((enemy, enemyIndex) => {
    enemy.update();

    const distanceBetweenPlayerAndEnemy = Math.hypot(
      abhi.x - enemy.x,
      abhi.y - enemy.y
    );

    if (distanceBetweenPlayerAndEnemy - abhi.radius - enemy.radius < 1) {
      cancelAnimationFrame(animationId);
      gameOverSound.play();
      return gameoverLoader();
    }

    hugeWeapons.forEach((hugeWeapon) => {
      const distanceBetweenHugeWeaponAndEnemy = hugeWeapon.x - enemy.x;
      if (
        distanceBetweenHugeWeaponAndEnemy <= 200 &&
        distanceBetweenHugeWeaponAndEnemy >= -200
      ) {
        playerScore += 10;
        setTimeout(() => {
          killEnemySound.play();
          enemies.splice(enemyIndex, 1);
        }, 0);
      }
    });

    weapons.forEach((weapon, weaponIndex) => {
      const distanceBetweenWeaponAndEnemy = Math.hypot(
        weapon.x - enemy.x,
        weapon.y - enemy.y
      );
      if (distanceBetweenWeaponAndEnemy - weapon.radius - enemy.radius < 1) {
        if (enemy.radius > weapon.damage + 8) {
          gsap.to(enemy, {
            radius: enemy.radius - weapon.damage,
          });
          setTimeout(() => {
            weapons.splice(weaponIndex, 1);
          }, 0);
        } else {
          for (let i = 0; i < enemy.radius * 5; i++) {
            particals.push(
              new Partical(weapon.x, weapon.y, Math.random() * 2, enemy.color, {
                x: (Math.random() - 0.5) * (Math.random() * 7),
                y: (Math.random() - 0.5) * (Math.random() * 7),
              })
            );
          }

          playerScore += 10;

          setTimeout(() => {
            killEnemySound.play();
            enemies.splice(enemyIndex, 1);
            weapons.splice(weaponIndex, 1);
          }, 0);
          scoreBoard.innerHTML = `Score : ${playerScore}`;
        }
      }
    });
  });
}

canvas.addEventListener("click", (e) => {
  shootingSound.play();
  const myAngle = Math.atan2(
    e.clientY - canvas.height / 2,
    e.clientX - canvas.width / 2
  );
  const velocity = {
    x: Math.cos(myAngle) * 6,
    y: Math.sin(myAngle) * 6,
  };

  weapons.push(
    new weapon(
      canvas.width / 2,
      canvas.height / 2,
      6,
      "white",
      velocity,
      lightWeaponDamage
    )
  );
});
canvas.addEventListener("contextmenu", (e) => {
  e.preventDefault();

  if (playerScore <= 0) {
    return;
  }
  heavyWeaponSound.play();
  playerScore -= 2;
  scoreBoard.innerHTML = `Score : ${playerScore}`;
  const myAngle = Math.atan2(
    e.clientY - canvas.height / 2,
    e.clientX - canvas.width / 2
  );
  const velocity = {
    x: Math.cos(myAngle) * 3,
    y: Math.sin(myAngle) * 3,
  };

  weapons.push(
    new weapon(
      canvas.width / 2,
      canvas.height / 2,
      30,
      "cyan",
      velocity,
      heavyWeaponDamage
    )
  );
});
addEventListener("keypress", (e) => {
  if (e.key === " ") {
    if (playerScore < 20) {
      return;
    }
    playerScore -= 20;
    scoreBoard.innerHTML = `Score : ${playerScore}`;
    hugeWeaponSound.play();
    hugeWeapons.push(new hugeWeapon(0, 0));
  }
});
addEventListener("contextmenu", (e) => {
  e.preventDefault();
});
addEventListener("resize", () => {
  window.location.reload();
});
animation();
function showRulesAlert() {
  alert(
    "Game Rules:\n" +
      "1. Use left click (single finger touch on the touchpad), right click (double finger touch on the touchpad), or the space bar to generate a weapon, heavy weapon, and massive weapon, respectively. Tackle the incoming asteroid towards the center and destroy it before it reaches the center.\n" +"\n"+
      "2. If the asteroid is destroyed successfully, the score will increase by 10. If failed to destroy, the game will be over.\n" +"\n"+
      "3. Generating a weapon using left click (single finger touch on the touchpad) does not deduct any points from your scoreboard.\n" +"\n"+
      "4. Generating a heavy weapon using right click (double finger touch on the touchpad) will deduct 2 points from your scoreboard, and this weapon can only be generated if your score is greater than or equal to 2.\n" +"\n"+
      "5. Generating a massive weapon using the space bar will deduct 20 points from your scoreboard, and this weapon can only be generated if your score is greater than or equal to 20.\n" +"\n"+
      "6. This game is designed for laptops and PCs. For the best experience, use the Chrome browser."
  );
}
