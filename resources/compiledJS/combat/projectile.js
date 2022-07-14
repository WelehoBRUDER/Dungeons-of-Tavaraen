"use strict";
/**
 @param {string} id - The id of the tile to be used.
 @param {string} texture - The texture of the tile to be used.
 @param {tileObject} target - The target tile cords {x: x, y: y}
 @param {tileObject} cords - Current tile the projectile is on. {x: x, y: y}
 @param {array} path - The path the projectile will follow.
 @param {boolean} originIsEnemy - Whether the origin of the projectile is an enemy or not.
 @param {number} speed - The speed of the projectile in tiles per round.
 @param {Function} onHit - The function to be called when the projectile hits something.
 @param {Function} onDestroy - The function to be called when the projectile either hits a target or reaches its destination.
 */
class Projectile {
    constructor(id, texture, target, cords, path, originIsEnemy, speed, onHit, onDestroy) {
        this.originIsEnemy = false; // Whether the origin of the projectile is an enemy or not.
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
    destroy() {
        if (this.onDestroy) {
            this.onDestroy();
        }
        currentProjectiles.splice(currentProjectiles.indexOf(this), 1);
    }
    async move() {
        this.path = generateArrowPath(this.cords, this.target);
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
            const target = targets.map((tar) => {
                if (tar.cords.x === this.cords.x && tar.cords.y === this.cords.y) {
                    return tar;
                }
            });
            if (target) {
                this.onHit(target);
            }
            this.destroy();
        }
        else {
            const target = maps[currentMap].enemies.map((enemy) => {
                if (enemy.cords.x === this.cords.x && enemy.cords.y === this.cords.y) {
                    return enemy;
                }
            });
            if (target) {
                this.onHit(target);
            }
            this.destroy();
        }
    }
}
function createNewProjectile(shooter, projectileTemplate, target, ability, onHit, onDestroy) {
    var _a, _b;
    console.log(projectileTemplate);
    let { id, texture, speed } = projectileTemplate;
    let isEnemy = shooter.isFoe ? true : false;
    speed += shooter.allModifiers.projectileSpeed || 0;
    speed += (_a = shooter.allModifiers[`${ability.id}_projectileSpeedV`]) !== null && _a !== void 0 ? _a : 0;
    speed *= (_b = shooter.allModifiers[`${ability.id}_projectileSpeedP`]) !== null && _b !== void 0 ? _b : 1;
    speed = Math.round(speed);
    let path = generateArrowPath(shooter.cords, target);
    const projectile = new Projectile(id, texture, target, shooter.cords, path, isEnemy, speed, onHit, onDestroy);
    currentProjectiles.push(projectile);
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
};
//# sourceMappingURL=projectile.js.map