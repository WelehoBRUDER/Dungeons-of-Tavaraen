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
  onHit: Function; // Function to call when the projectile hits a target.
  onDestroy: Function; // Function to call when the projectile is destroyed.
  destroy() {
    if (this.onDestroy) {
      this.onDestroy();
    }
    currentProjectiles.splice(currentProjectiles.indexOf(this), 1);
  }
  async move() {
    this.path = generateArrowPath(this.cords, this.target) as any[];
    if (this.path.length > 0) {
      for (let i = 1; i <= this.speed; i++) {
        if (this.path.length == 0) {
          this.checkCollision();
          break;
        }
        this.cords = this.path.shift();
        await helper.sleep(30);
      }
    }
  }
  checkCollision() {
    if (this.originIsEnemy) {
      const targets = player.concat(combatSummons);
      const target = targets.map((tar: any) => {
        if (tar.cords.x === this.cords.x && tar.cords.y === this.cords.y) {
          return tar;
        }
      });
      if (target) {
        this.onHit(this.shooter, target, this.ability);
      }
      this.destroy();
    } else {
      const target = maps[currentMap].enemies.map((enemy: any) => {
        if (enemy.cords.x === this.cords.x && enemy.cords.y === this.cords.y) {
          return enemy;
        }
      });
      if (target) {
        this.onHit(this.shooter, target, this.ability);
      }
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
    speed: number,
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
    this.onHit = onHit;
    this.onDestroy = onDestroy;
  }
}

function createNewProjectile(
  shooter: characterObject,
  projectileTemplate: projectileTemplate,
  target: tileObject,
  ability: Ability,
  onHit: Function,
  onDestroy?: Function
) {
  console.log(projectileTemplate);
  let { id, texture, speed } = projectileTemplate;
  let isEnemy = shooter.isFoe ? true : false;
  speed += shooter.allModifiers.projectileSpeed || 0;
  speed += shooter.allModifiers[`${ability.id}_projectileSpeedV`] ?? 0;
  speed *= shooter.allModifiers[`${ability.id}_projectileSpeedP`] ?? 1;
  speed = Math.round(speed);
  let path = generateArrowPath(shooter.cords, target) as any[];
  const projectile = new Projectile(
    id,
    texture,
    target,
    shooter.cords,
    path,
    isEnemy,
    speed,
    onHit,
    onDestroy
  );
  currentProjectiles.push(projectile);
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
