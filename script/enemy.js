"use strict";
class Enemy extends Character {
    constructor(base) {
        var _a, _b, _c, _d;
        super(base);
        this.sprite = base.sprite;
        this.aggroRange = (_a = base.aggroRange) !== null && _a !== void 0 ? _a : 5;
        this.attackRange = (_b = base.attackRange) !== null && _b !== void 0 ? _b : 1;
        this.xp = base.xp;
        this.damages = base.damages;
        this.isFoe = true;
        this.firesProjectile = base.firesProjectile;
        this.canFly = (_c = base.canFly) !== null && _c !== void 0 ? _c : false;
        this.alive = (_d = base.alive) !== null && _d !== void 0 ? _d : true;
        this.spawnCords = base.spawnCords;
        this.spawnMap = base.spawnMap;
        this.loot = base.loot;
        this.shootsProjectile = base.shootsProjectile;
        this.decideAction = async () => {
            // Will make enemy take their turn
            // For now just move towards player
            // @ts-ignore
            if (this.shootsProjectile && generateArrowPath(this.cords, player.cords, true) <= this.attackRange) {
                fireProjectile(this.cords, player.cords, this.shootsProjectile, abilities.attack, false, this);
            }
            else if (!this.shootsProjectile && generatePath(this.cords, player.cords, this.canFly, true) <= this.attackRange) {
                // regular attack for now
                // @ts-ignore
                attackTarget(this, player, weaponReach(this, this.attackRange, player));
                // @ts-ignore
                regularAttack(this, player, this.abilities[0]);
            }
            else {
                var path = generatePath(this.cords, player.cords, this.canFly);
                try {
                    this.cords.x = path[0].x;
                    this.cords.y = path[0].y;
                    if (settings.log_enemy_movement)
                        displayText(`<c>crimson<c>[ENEMY] <c>yellow<c>${this.name} <c>white<c>moves to [${this.cords.x}, ${this.cords.y}]`);
                }
                catch (_a) {
                    console.warn("Enemy pathfinding can't find correct path!");
                }
            }
            setTimeout(modifyCanvas, 200);
        };
        this.kill = () => {
            player.level.xp += this.xp;
            this.spawnMap = currentMap;
            const index = maps[currentMap].enemies.findIndex(e => e.cords == this.cords);
            displayText(`<c>white<c>[WORLD] <c>yellow<c>${lang[this.id + "_name"]}<c>white<c> ${lang["death"]}`);
            lootEnemy(this);
            fallenEnemies.push(Object.assign({}, this));
            maps[currentMap].enemies.splice(index, 1);
            this.alive = false;
        };
        this.aggro = () => {
            // @ts-ignore
            if (generatePath(this.cords, player.cords, this.canFly, true) <= this.aggroRange)
                return true;
            return false;
        };
    }
}
var fallenEnemies = [];
var greySlime = new Enemy(enemies.greySlime);
