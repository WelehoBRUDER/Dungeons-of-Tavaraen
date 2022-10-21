/**
 @param {string} id - The id of the tile to be used.
 @param {string} texture - The texture of the tile to be used.
 @param {tileObject} target - The target tile cords {x: x, y: y}
 @param {tileObject} cords - Current tile the projectile is on. {x: x, y: y}
 @param {ability} ability - The ability that is being used.
 @param {array} path - The path the projectile will follow.
 @param {boolean} originIsEnemy - Whether the origin of the projectile is an enemy or not.
 @param {number} speed - The speed of the projectile in tiles per round.
 @param {Function} onHit - The function to be called when the projectile hits something.
 @param {Function} onDestroy - The function to be called when the projectile either hits a target or reaches its destination.
 */

class Projectile {
  [id: string]: any; // Projectile id.
  texture: string; // The texture of the projectile.
  target: tileObject; // Target tile
  cords: tileObject; // Current tile the projectile is on.
  ability: ability; // The ability that created the projectile.
  path: any[]; // Path of the projectile.
  originIsEnemy: boolean = false; // Whether the origin of the projectile is an enemy or not.
  speed: number; // Speed of the projectile in tiles per round.
  shooter: characterObject; // The character that shot the projectile.
  index: number; // Index of the projectile in the currentProjectiles array.
  onHit: Function; // Function to call when the projectile hits a target.
  onDestroy: Function; // Function to call when the projectile is destroyed.

  destroy() {
    console.log("destroying projectile");
    if (this.onDestroy) {
      this.onDestroy();
    }
    currentProjectiles.splice(this.index, 1);
    const projectileCanvas = projectileLayers.querySelector(`#projectile${this.index}`);
    if (projectileCanvas) {
      projectileCanvas.remove();
    }
  }

  async move() {
    const { spriteSize } = spriteVariables();
    if (this.path.length > 0) {
      let start = this.path.findIndex((step: any) => {
        return step.x === this.cords.x && step.y === this.cords.y;
      });
      for (let i: number = start; i - start <= this.speed; i++) {
        this.cords = this.path[i];
        this.checkCollision();
        renderProjectiles(spriteSize);
        await helper.sleep(30);
        if (i >= this.path.length - 1) {
          this.destroy();
          break;
        }
      }
    }
  }

  checkCollision(pathStep: number = 0) {
    if (this.originIsEnemy) {
      const targets = combatSummons.concat([player]);
      const target = targets.find((tar: any) => {
        if (tar.cords.x === this.cords.x && tar.cords.y === this.cords.y) {
          return tar;
        }
      });
      if (target) {
        this.onHit(this.shooter, target, this.ability);
        this.destroy();
      }
    } else {
      const target = maps[currentMap].enemies.find((enemy: any) => {
        if (enemy.cords.x === this.cords.x && enemy.cords.y === this.cords.y) {
          return enemy;
        }
      });
      if (target) {
        this.onHit(this.shooter, target, this.ability);
        this.destroy();
      }
    }
    if (pathStep === this.path.length - 1) {
      this.destroy();
    }
  }

  constructor(
    id: string,
    texture: string,
    target: tileObject,
    cords: tileObject,
    path: any[],
    originIsEnemy: boolean,
    ability: ability,
    shooter: characterObject,
    speed: number,
    index: number,
    onHit: Function,
    onDestroy: Function
  ) {
    this.id = id;
    this.texture = texture;
    this.target = target;
    this.cords = cords;
    this.path = path;
    this.originIsEnemy = originIsEnemy;
    this.speed = speed;
    this.ability = ability;
    this.shooter = shooter;
    this.index = index;
    this.onHit = onHit;
    this.onDestroy = onDestroy;
  }
}

function createNewProjectile(shooter: characterObject, projectileTemplate: projectileTemplate, target: tileObject, ability: Ability, onHit: Function, onDestroy?: Function) {
  console.log(projectileTemplate);
  let { id, texture, speed } = projectileTemplate;
  let isEnemy = shooter.isFoe ? true : false;
  speed += shooter.allModifiers.projectileSpeed || 0;
  speed += shooter.allModifiers[`${ability.id}_projectileSpeedV`] ?? 0;
  speed *= shooter.allModifiers[`${ability.id}_projectileSpeedP`] ?? 1;
  speed = Math.round(speed);
  let index = currentProjectiles.length;
  let path = generateArrowPath(shooter.cords, target) as any[];
  const projectile = new Projectile(id, texture, target, shooter.cords, path, isEnemy, ability, shooter, speed, index, onHit, onDestroy);
  const projectileCanvas = document.createElement("canvas");
  projectileCanvas.classList.add("layer");
  projectileCanvas.width = baseCanvas.width;
  projectileCanvas.height = baseCanvas.height;
  projectileCanvas.id = `projectile${index}`;
  projectileLayers.append(projectileCanvas);
  currentProjectiles.push(projectile);
  projectile.move();
}

interface projectileTemplate {
  id: string;
  texture: string;
  speed: number;
}

const projectiles = {
  arrowProjectile: {
    id: "arrowProjectile",
    texture: "arrowProjectile",
    speed: 5,
  },
  arrowChargedProjectile: {
    id: "arrowChargedProjectile",
    texture: "arrowChargedProjectile",
    speed: 7,
  },
  arrowPoisonProjectile: {
    id: "arrowPoisonProjectile",
    texture: "arrowPoisonProjectile",
    speed: 5,
  },
  blightProjectile: {
    id: "blightProjectile",
    texture: "blightProjectile",
    speed: 4,
  },
  fireballProjectile: {
    id: "fireballProjectile",
    texture: "fireballProjectile",
    speed: 4,
  },
  hunterJavelinProjectile: {
    id: "hunterJavelinProjectile",
    texture: "hunterJavelinProjectile",
    speed: 5,
  },
  iceSpikeProjectile: {
    id: "iceSpikeProjectile",
    texture: "iceSpikeProjectile",
    speed: 5,
  },
  magicBlastProjectile: {
    id: "magicBlastProjectile",
    texture: "magicBlastProjectile",
    speed: 4,
  },
  piercingManaBoltProjectile: {
    id: "piercingManaBoltProjectile",
    texture: "piercingManaBoltProjectile",
    speed: 6,
  },
  smokeBombProjectile: {
    id: "smokeBombProjectile",
    texture: "smokeBombProjectile",
    speed: 3,
  },
} as { [id: string]: projectileTemplate };
