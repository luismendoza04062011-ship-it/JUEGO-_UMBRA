(() => {
  "use strict";

  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  const overlay = document.getElementById("overlay");
  const title = document.getElementById("dialog-title");
  const copy = document.getElementById("dialog-copy");
  const startButton = document.getElementById("start");
  const healthLabel = document.getElementById("health");
  const lumenLabel = document.getElementById("lumens");
  const objectiveLabel = document.getElementById("objective");
  const width = canvas.width;
  const height = canvas.height;
  const floor = 615;
  const requiredLumens = 5;
  const platforms = [
    { x: 126, y: 508, w: 175, h: 18 },
    { x: 348, y: 445, w: 176, h: 18 },
    { x: 578, y: 505, w: 164, h: 18 },
    { x: 790, y: 426, w: 188, h: 18 },
    { x: 1010, y: 502, w: 152, h: 18 }
  ];
  const keys = new Set();
  const pressed = new Set();
  const background = new Image();
  background.src = "hand_drawn_2d_metroidvania_side_scrolling_gameplay_scene_inside_minas_de/screen.png";
  let mode = "ready";
  let player;
  let enemies;
  let lumens;
  let particles = [];
  let clock = 0;
  let lastTime = 0;
  let nextAttackId = 0;
  let lastHud = "";
  let flash = 0;

  function reset() {
    player = {
      x: 72, y: floor, vx: 0, vy: 0, facing: 1, health: 5, energy: 100,
      jumps: 0, grounded: true, invulnerable: 0, attack: 0, attackCooldown: 0,
      attackId: 0, power: 0, dash: 0, dashCooldown: 0
    };
    enemies = [
      { x: 386, left: 352, right: 510, hp: 3, maxHp: 3, speed: 58, direction: 1, hurt: 0, cooldown: 0 },
      { x: 728, left: 686, right: 864, hp: 3, maxHp: 3, speed: 72, direction: -1, hurt: 0, cooldown: 0 },
      { x: 1062, left: 1016, right: 1190, hp: 4, maxHp: 4, speed: 82, direction: -1, hurt: 0, cooldown: 0 }
    ];
    lumens = [
      { x: 184, y: 462, collected: false },
      { x: 405, y: 398, collected: false },
      { x: 657, y: 459, collected: false },
      { x: 856, y: 379, collected: false },
      { x: 1082, y: 455, collected: false }
    ];
    particles = [];
    nextAttackId = 0;
    flash = 0;
    syncHud();
  }

  function showOverlay(nextMode, heading, message, buttonText) {
    mode = nextMode;
    title.textContent = heading;
    copy.textContent = message;
    startButton.textContent = buttonText;
    overlay.hidden = false;
  }

  function begin() {
    reset();
    mode = "playing";
    overlay.hidden = true;
    canvas.focus({ preventScroll: true });
  }

  function keyAction(event) {
    const key = event.key.toLowerCase();
    if (["arrowleft", "arrowright", "arrowup", " ", "shift"].includes(key)) event.preventDefault();
    const map = {
      arrowleft: "left", a: "left",
      arrowright: "right", d: "right",
      arrowup: "jump", w: "jump", " ": "jump",
      j: "attack", k: "power", shift: "dash"
    };
    const action = map[key];
    if (!action) {
      if (key === "escape" || key === "p") {
        if (mode === "playing") showOverlay("paused", "PAUSA", "Tu aventura está en pausa.", "CONTINUAR");
        else if (mode === "paused") {
          mode = "playing";
          overlay.hidden = true;
          canvas.focus({ preventScroll: true });
        }
      } else if (key === "r" && mode !== "ready") begin();
      return;
    }
    if (!event.repeat && !keys.has(action)) pressed.add(action);
    keys.add(action);
  }

  function clearKey(event) {
    const map = {
      arrowleft: "left", a: "left",
      arrowright: "right", d: "right",
      arrowup: "jump", w: "jump", " ": "jump",
      j: "attack", k: "power", shift: "dash"
    };
    const action = map[event.key.toLowerCase()];
    if (action) keys.delete(action);
  }

  window.addEventListener("keydown", keyAction);
  window.addEventListener("keyup", clearKey);
  window.addEventListener("blur", () => keys.clear());

  document.querySelectorAll("[data-action]").forEach((button) => {
    const action = button.dataset.action;
    const release = (event) => {
      event.preventDefault();
      keys.delete(action);
    };
    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      if (!keys.has(action)) pressed.add(action);
      keys.add(action);
      button.setPointerCapture(event.pointerId);
    });
    button.addEventListener("pointerup", release);
    button.addEventListener("pointercancel", release);
    button.addEventListener("lostpointercapture", release);
    button.addEventListener("contextmenu", (event) => event.preventDefault());
  });

  startButton.addEventListener("click", () => {
    if (mode === "paused") {
      mode = "playing";
      overlay.hidden = true;
      canvas.focus({ preventScroll: true });
      return;
    }
    begin();
  });

  function syncHud() {
    const value = `${player.health}|${lumens.filter((item) => item.collected).length}|${Math.floor(player.energy)}`;
    if (value === lastHud) return;
    lastHud = value;
    healthLabel.textContent = `${"♥ ".repeat(player.health)}${"♡ ".repeat(5 - player.health)}`.trim();
    lumenLabel.textContent = `✧ ${lumens.filter((item) => item.collected).length} / ${requiredLumens}`;
    const remaining = requiredLumens - lumens.filter((item) => item.collected).length;
    objectiveLabel.textContent = remaining > 0
      ? `Reúne ${remaining} ${remaining === 1 ? "lumen" : "lúmenes"} y encuentra el portal.`
      : "¡Portal abierto! Alcanza el resplandor dorado.";
    objectiveLabel.title = `Energía ancestral: ${Math.floor(player.energy)}%`;
  }

  function damageEnemy(enemy) {
    enemy.hp -= 1;
    enemy.hurt = 0.22;
    enemy.direction = Math.sign(enemy.x - player.x) || 1;
    player.energy = Math.min(100, player.energy + 14);
    flash = 0.12;
    if (enemy.hp <= 0) {
      particles.push(...Array.from({ length: 12 }, () => ({
        x: enemy.x, y: floor - 30, vx: (Math.random() - 0.5) * 220,
        vy: -80 - Math.random() * 180, life: 0.8, color: "#9ef7df"
      })));
    }
  }

  function attack() {
    if (player.attackCooldown > 0 || player.dash > 0) return;
    player.attack = 0.28;
    player.attackCooldown = 0.4;
    player.attackId = ++nextAttackId;
    for (const enemy of enemies) {
      const distance = (enemy.x - player.x) * player.facing;
      if (enemy.hp > 0 && distance > 0 && distance < 112 && Math.abs(player.y - floor) < 70) {
        damageEnemy(enemy);
      }
    }
  }

  function castPower() {
    if (player.energy < 35 || player.dash > 0) return;
    player.energy -= 35;
    player.power = 0.42;
    for (const enemy of enemies) {
      const distance = (enemy.x - player.x) * player.facing;
      if (enemy.hp > 0 && distance > -24 && distance < 255) damageEnemy(enemy);
    }
    for (let index = 0; index < 30; index += 1) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 80 + Math.random() * 330;
      particles.push({
        x: player.x, y: player.y - 30,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        life: 0.55 + Math.random() * 0.45, color: index % 2 ? "#64f3df" : "#ffd77d"
      });
    }
    flash = 0.18;
  }

  function hurtPlayer(enemy) {
    if (player.invulnerable > 0) return;
    player.health -= 1;
    player.invulnerable = 1.15;
    player.vx = Math.sign(player.x - enemy.x || -player.facing) * 330;
    player.vy = -300;
    player.grounded = false;
    player.jumps = 1;
    flash = 0.22;
    if (player.health <= 0) {
      player.health = 0;
      syncHud();
      showOverlay("lost", "LA SOMBRA TE VENCE", "Las raíces aún recuerdan tu camino. Vuelve a intentarlo.", "REINTENTAR");
    }
  }

  function update(dt) {
    if (mode !== "playing") return;
    clock += dt;
    player.attack = Math.max(0, player.attack - dt);
    player.attackCooldown = Math.max(0, player.attackCooldown - dt);
    player.invulnerable = Math.max(0, player.invulnerable - dt);
    player.power = Math.max(0, player.power - dt);
    player.dashCooldown = Math.max(0, player.dashCooldown - dt);
    flash = Math.max(0, flash - dt);

    if (pressed.has("jump") && player.jumps < 2) {
      player.vy = player.jumps === 0 ? -700 : -610;
      player.grounded = false;
      player.jumps += 1;
    }
    if (pressed.has("attack")) attack();
    if (pressed.has("power")) castPower();
    if (pressed.has("dash") && player.dashCooldown <= 0) {
      player.dash = 0.18;
      player.dashCooldown = 0.82;
      player.invulnerable = Math.max(player.invulnerable, 0.3);
      player.vx = player.facing * 860;
    }

    const direction = (keys.has("right") ? 1 : 0) - (keys.has("left") ? 1 : 0);
    if (direction && player.dash <= 0) {
      player.facing = direction;
      player.vx += direction * 2050 * dt;
      player.vx = Math.max(-310, Math.min(310, player.vx));
    } else if (player.dash <= 0) {
      player.vx *= Math.exp(-10 * dt);
    }
    if (player.dash > 0) player.dash = Math.max(0, player.dash - dt);

    const previousY = player.y;
    player.x += player.vx * dt;
    player.x = Math.max(22, Math.min(width - 22, player.x));
    player.vy = Math.min(950, player.vy + 1850 * dt);
    player.y += player.vy * dt;
    player.grounded = false;
    if (player.vy >= 0) {
      for (const platform of platforms) {
        const crossed = previousY <= platform.y && player.y >= platform.y;
        const overlaps = player.x + 13 > platform.x && player.x - 13 < platform.x + platform.w;
        if (crossed && overlaps) {
          player.y = platform.y;
          player.vy = 0;
          player.grounded = true;
          player.jumps = 0;
          break;
        }
      }
      if (player.y >= floor) {
        player.y = floor;
        player.vy = 0;
        player.grounded = true;
        player.jumps = 0;
      }
    }

    for (const lumen of lumens) {
      if (!lumen.collected && Math.hypot(player.x - lumen.x, (player.y - 32) - lumen.y) < 44) {
        lumen.collected = true;
        player.energy = Math.min(100, player.energy + 12);
        for (let index = 0; index < 10; index += 1) {
          particles.push({
            x: lumen.x, y: lumen.y,
            vx: (Math.random() - 0.5) * 180, vy: (Math.random() - 0.5) * 180,
            life: 0.55, color: "#9ef7df"
          });
        }
        syncHud();
      }
    }

    for (const enemy of enemies) {
      enemy.hurt = Math.max(0, enemy.hurt - dt);
      enemy.cooldown = Math.max(0, enemy.cooldown - dt);
      if (enemy.hp <= 0) continue;
      enemy.x += enemy.direction * enemy.speed * dt;
      if (enemy.x <= enemy.left || enemy.x >= enemy.right) {
        enemy.direction *= -1;
        enemy.x = Math.max(enemy.left, Math.min(enemy.right, enemy.x));
      }
      if (Math.abs(player.x - enemy.x) < 36 && player.y >= floor - 78 && enemy.cooldown === 0) {
        enemy.cooldown = 0.72;
        hurtPlayer(enemy);
      }
    }

    for (const particle of particles) {
      particle.life -= dt;
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.vy += 340 * dt;
    }
    particles = particles.filter((particle) => particle.life > 0);
    syncHud();

    const collected = lumens.filter((item) => item.collected).length;
    if (collected === requiredLumens && player.x > 1205) {
      showOverlay("won", "LA LUZ RENACE", "Has despertado las raíces y encontrado una salida del bosque. ¡La aventura continúa!", "JUGAR DE NUEVO");
    }
  }

  function roundedRect(x, y, w, h, radius) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
  }

  function drawBackground() {
    if (background.complete && background.naturalWidth > 0) {
      const scale = Math.max(width / background.naturalWidth, height / background.naturalHeight);
      const cropWidth = width / scale;
      const cropHeight = height / scale;
      ctx.drawImage(
        background,
        (background.naturalWidth - cropWidth) / 2,
        (background.naturalHeight - cropHeight) / 2,
        cropWidth,
        cropHeight,
        0, 0, width, height
      );
    } else {
      const sky = ctx.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0, "#152c31");
      sky.addColorStop(1, "#101513");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, width, height);
    }
    const shade = ctx.createLinearGradient(0, 0, 0, height);
    shade.addColorStop(0, "rgba(4, 12, 15, .46)");
    shade.addColorStop(0.45, "rgba(4, 12, 15, .24)");
    shade.addColorStop(1, "rgba(4, 10, 10, .64)");
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, width, height);

    for (let index = 0; index < 36; index += 1) {
      const x = (index * 197 + Math.sin(clock * 0.31 + index) * 26 + width) % width;
      const y = 115 + ((index * 83) % 360) + Math.sin(clock + index * 2) * 13;
      ctx.globalAlpha = 0.25 + (Math.sin(clock * 2 + index) + 1) * 0.18;
      ctx.fillStyle = index % 4 === 0 ? "#f3d586" : "#75e6d0";
      ctx.beginPath();
      ctx.arc(x, y, index % 6 === 0 ? 3 : 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function drawTerrain() {
    ctx.fillStyle = "#101719";
    ctx.fillRect(0, floor, width, height - floor);
    ctx.fillStyle = "#395043";
    ctx.fillRect(0, floor, width, 7);
    ctx.fillStyle = "#9be2ad";
    ctx.globalAlpha = 0.54;
    for (let x = 8; x < width; x += 35) {
      ctx.fillRect(x + Math.sin(x) * 5, floor - 2, 12, 3);
    }
    ctx.globalAlpha = 1;

    for (const platform of platforms) {
      ctx.save();
      roundedRect(platform.x, platform.y, platform.w, platform.h, 8);
      const surface = ctx.createLinearGradient(0, platform.y, 0, platform.y + platform.h);
      surface.addColorStop(0, "#b7c28a");
      surface.addColorStop(0.32, "#586f51");
      surface.addColorStop(1, "#172622");
      ctx.fillStyle = surface;
      ctx.shadowColor = "#69e1bc55";
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "#d7d4a677";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "#a9dd9b";
      ctx.globalAlpha = 0.72;
      for (let sprig = 0; sprig < platform.w / 30; sprig += 1) {
        const sprigX = platform.x + 10 + sprig * 29;
        ctx.beginPath();
        ctx.moveTo(sprigX, platform.y + 2);
        ctx.lineTo(sprigX + 3, platform.y - 5 - (sprig % 2) * 3);
        ctx.lineTo(sprigX + 7, platform.y + 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function drawLumen(item) {
    if (item.collected) return;
    const bob = Math.sin(clock * 3 + item.x) * 5;
    ctx.save();
    ctx.translate(item.x, item.y + bob);
    ctx.shadowColor = "#82ffe0";
    ctx.shadowBlur = 24;
    ctx.fillStyle = "#c7fff1";
    ctx.strokeStyle = "#69e8d2";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -15);
    ctx.lineTo(10, 0);
    ctx.lineTo(0, 15);
    ctx.lineTo(-10, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function drawPortal() {
    const open = lumens.filter((item) => item.collected).length === requiredLumens;
    const glow = 14 + Math.sin(clock * 3) * 5;
    ctx.save();
    ctx.translate(1226, floor - 43);
    ctx.shadowColor = open ? "#f4ce75" : "#679b81";
    ctx.shadowBlur = open ? glow * 2 : glow;
    ctx.strokeStyle = open ? "#f3d286" : "#88aa91";
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.ellipse(0, 0, 25, 41, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = open ? 0.68 : 0.28;
    ctx.fillStyle = open ? "#fae19c" : "#8fb9a0";
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 34, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawEnemy(enemy) {
    if (enemy.hp <= 0) return;
    ctx.save();
    ctx.translate(enemy.x, floor - 3 + Math.sin(clock * 4 + enemy.x) * 3);
    ctx.scale(enemy.direction, 1);
    ctx.globalAlpha = enemy.hurt > 0 && Math.floor(clock * 30) % 2 === 0 ? 0.42 : 1;
    ctx.shadowColor = "#ab69d2";
    ctx.shadowBlur = 18;
    ctx.fillStyle = "#47314e";
    ctx.strokeStyle = "#d7a5ee";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, -20, 25, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#a36ec1";
    ctx.beginPath();
    ctx.ellipse(-14, -34, 13, 20, -0.6, 0, Math.PI * 2);
    ctx.ellipse(12, -35, 12, 19, 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 7;
    ctx.fillStyle = "#aaffeb";
    ctx.beginPath();
    ctx.arc(8, -23, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = "#14181a";
    roundedRect(enemy.x - 22, floor - 56, 44, 5, 3);
    ctx.fill();
    ctx.fillStyle = "#e6a2ae";
    roundedRect(enemy.x - 22, floor - 56, 44 * (enemy.hp / enemy.maxHp), 5, 3);
    ctx.fill();
  }

  function drawPlayer() {
    if (player.invulnerable > 0 && Math.floor(clock * 24) % 2 === 0) return;
    ctx.save();
    ctx.translate(player.x, player.y);
    if (player.dash > 0) {
      ctx.globalAlpha = 0.62;
      for (let trail = 1; trail < 4; trail += 1) {
        ctx.fillStyle = trail % 2 ? "#66e7d3" : "#f0c16b";
        ctx.globalAlpha = 0.19 / trail;
        ctx.beginPath();
        ctx.ellipse(-player.facing * trail * 17, -32, 13, 25, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    ctx.scale(player.facing, 1);
    const step = player.grounded ? Math.sin(clock * 12) * Math.min(4, Math.abs(player.vx) / 65) : 0;

    ctx.fillStyle = "#080e10aa";
    ctx.beginPath();
    ctx.ellipse(0, -2, 22, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#382f29";
    ctx.beginPath();
    ctx.moveTo(-13, -38);
    ctx.quadraticCurveTo(-23, -13, -18 - step, -3);
    ctx.lineTo(-7, -7);
    ctx.lineTo(0, -22);
    ctx.lineTo(11, -5);
    ctx.lineTo(20 + step, -4);
    ctx.quadraticCurveTo(14, -27, 12, -40);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#8f7849";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.strokeStyle = "#221f1a";
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-6, -9);
    ctx.lineTo(-10 - step, 0);
    ctx.moveTo(7, -9);
    ctx.lineTo(11 + step, 0);
    ctx.stroke();

    ctx.fillStyle = "#725a38";
    ctx.beginPath();
    ctx.ellipse(0, -45, 16, 19, -0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#d9bc76";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#a98e56";
    ctx.beginPath();
    ctx.moveTo(-14, -54);
    ctx.quadraticCurveTo(-26, -67, -17, -70);
    ctx.lineTo(-4, -59);
    ctx.lineTo(1, -76);
    ctx.lineTo(7, -58);
    ctx.quadraticCurveTo(22, -69, 19, -55);
    ctx.quadraticCurveTo(12, -58, 13, -51);
    ctx.closePath();
    ctx.fill();

    ctx.shadowColor = "#6af5de";
    ctx.shadowBlur = 8;
    ctx.fillStyle = "#93ffe6";
    ctx.fillRect(5, -48, 5, 3);
    ctx.shadowBlur = 0;

    ctx.strokeStyle = "#9b8051";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(9, -35);
    ctx.lineTo(17, -27);
    ctx.stroke();
    ctx.strokeStyle = "#7ef2dd";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(17, -28);
    ctx.lineTo(37, -47);
    ctx.stroke();
    ctx.fillStyle = "#d6fff2";
    ctx.beginPath();
    ctx.moveTo(37, -47);
    ctx.lineTo(34, -37);
    ctx.lineTo(28, -39);
    ctx.closePath();
    ctx.fill();

    if (player.attack > 0) {
      ctx.globalAlpha = Math.min(1, player.attack * 4);
      ctx.shadowColor = "#91fff0";
      ctx.shadowBlur = 25;
      ctx.strokeStyle = "#b5fff1";
      ctx.lineWidth = 10 * (player.attack / 0.28);
      ctx.beginPath();
      ctx.arc(22, -39, 69, -1.02, 0.96);
      ctx.stroke();
    }
    if (player.power > 0) {
      ctx.globalAlpha = player.power * 1.7;
      ctx.strokeStyle = "#f7d27f";
      ctx.lineWidth = 7;
      ctx.shadowColor = "#71ffe5";
      ctx.shadowBlur = 28;
      ctx.beginPath();
      ctx.arc(0, -36, 48 + (0.42 - player.power) * 260, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawParticles() {
    for (const particle of particles) {
      ctx.globalAlpha = Math.min(1, particle.life * 2);
      ctx.fillStyle = particle.color;
      ctx.shadowColor = particle.color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, 3 + Math.min(2, particle.life * 2), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    drawBackground();
    drawTerrain();
    drawPortal();
    for (const lumen of lumens) drawLumen(lumen);
    for (const enemy of enemies) drawEnemy(enemy);
    drawPlayer();
    drawParticles();
    if (flash > 0) {
      ctx.fillStyle = `rgba(197, 255, 232, ${flash * 0.48})`;
      ctx.fillRect(0, 0, width, height);
    }
    if (player && player.energy < 100) {
      ctx.fillStyle = "#e7d18d";
      ctx.font = "700 13px Segoe UI, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`ENERGÍA ${Math.floor(player.energy)}%  ·  K`, 24, height - 22);
    }
  }

  function frame(time) {
    const dt = Math.min(0.032, Math.max(0, (time - lastTime) / 1000 || 0));
    lastTime = time;
    update(dt);
    render();
    pressed.clear();
    requestAnimationFrame(frame);
  }

  reset();
  showOverlay("ready", "UMBRA", "El bosque ha perdido su luz. Reúne los 5 lúmenes, aparta a las criaturas y alcanza el portal ancestral.", "JUGAR");
  requestAnimationFrame(frame);
})();
