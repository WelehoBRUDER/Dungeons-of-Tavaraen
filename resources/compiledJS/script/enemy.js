"use strict";
class Enemy extends Character {
    constructor(base) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        super(base);
        this.sprite = base.sprite;
        this.aggroRange = (_a = base.aggroRange) !== null && _a !== void 0 ? _a : 5;
        this.attackRange = (_b = base.attackRange) !== null && _b !== void 0 ? _b : 1;
        this.damages = Object.assign({}, base.damages);
        this.isFoe = true;
        this.firesProjectile = base.firesProjectile;
        this.canFly = (_c = base.canFly) !== null && _c !== void 0 ? _c : false;
        this.alive = (_d = base.alive) !== null && _d !== void 0 ? _d : true;
        this.retreatLimit = (_e = base.retreatLimit) !== null && _e !== void 0 ? _e : 30;
        this.spawnCords = Object.assign({}, base.spawnCords);
        this.spawnMap = base.spawnMap;
        this.loot = base.loot;
        this.shootsProjectile = base.shootsProjectile;
        this.hasBeenLeveled = (_f = base.hasBeenLeveled) !== null && _f !== void 0 ? _f : false;
        this.level = (_g = base.level) !== null && _g !== void 0 ? _g : 1;
        this.xp = this.level > 1 ? Math.floor(base.xp + (base.xp * this.level / 2.9)) : base.xp;
        this.statsPerLevel = (_h = Object.assign({}, base.statsPerLevel)) !== null && _h !== void 0 ? _h : { str: 1, vit: 1, dex: 1, int: 1, cun: 1 };
        this.retreatPath = [];
        this.retreatIndex = 0;
        this.hasRetreated = false;
        this.img = base.img;
        this.type = base.type;
        this.race = base.race;
        this.targetInterval = 4;
        this.currentTargetInterval = (_j = base.currentTargetInterval) !== null && _j !== void 0 ? _j : 0;
        this.chosenTarget = (_k = base.chosenTarget) !== null && _k !== void 0 ? _k : null;
        this.oldCords = (_l = Object.assign({}, base.oldCords)) !== null && _l !== void 0 ? _l : Object.assign({}, this.cords);
        if (!this.hasBeenLeveled && this.level > 1) {
            for (let i = 1; i < this.level; i++) {
                Object.entries(this.statsPerLevel).forEach((stat) => {
                    this.stats[stat[0]] += stat[1];
                });
            }
            Object.entries(this.damages).forEach((dmg) => {
                this.damages[dmg[0]] = Math.floor(this.damages[dmg[0]] * (1 + this.level / 17)) + 1;
            });
            this["stats"]["hp"] = this.getHpMax();
            this["stats"]["mp"] = this.getMpMax();
            this.hasBeenLeveled = true;
        }
        this.decideAction = async () => {
            // Will make enemy take their turn
            // Right now AI only randomly chooses an ability and checks if there's any point in using it,
            // Which is whether or not it'll actually hit the player.
            // This system already provides plenty of depth, but not truly intelligent foes.
            var _a;
            // Retreating does not work properly, so has been disabled for the time being.
            // @ts-ignore
            // if(this.hpRemain() <= this.retreatLimit && !this.hasRetreated) {
            //   console.log(this.cords);
            //   if(!this.retreatPath?.[0]?.x) {
            //     const path: any = generatePath(this.cords, player.cords, this.canFly, false, 5);
            //     this.retreatPath = path;
            //   }
            //   console.log(this.retreatPath);
            //   try {
            //     this.cords.x = this.retreatPath[this.retreatIndex].x;
            //     this.cords.y = this.retreatPath[this.retreatIndex].y;
            //     if(settings.log_enemy_movement) displayText(`<c>crimson<c>[ENEMY] <c>yellow<c>${this.name} <c>white<c>retreats to [${this.cords.x}, ${this.cords.y}]`);
            //   }
            //   catch { console.warn("Enemy pathfinding can't find correct path!") }
            //   this.retreatIndex++;
            //   if(this.retreatIndex + 1 == this.retreatPath.length) this.hasRetreated = true;
            //   updateEnemiesTurn();
            // }
            if (this.stats.hp > this.getHpMax())
                this.stats.hp = this.getHpMax();
            if (this.stats.mp > this.getMpMax())
                this.stats.mp = this.getMpMax();
            if (this.currentTargetInterval <= 0 || this.chosenTarget == null || !this.chosenTarget.alive) {
                // @ts-ignore
                let targets = combatSummons.concat([player]);
                this.chosenTarget = threatDistance(targets, this);
                this.currentTargetInterval = this.targetInterval;
            }
            else
                this.currentTargetInterval--;
            // Choose a random ability
            if (this.chosenTarget) {
                let chosenAbility = this.chooseAbility();
                // Check if it should be used
                if (chosenAbility && (((chosenAbility === null || chosenAbility === void 0 ? void 0 : chosenAbility.type) == "charge" ? parseInt(chosenAbility.use_range) >= generatePath(this.cords, this.chosenTarget.cords, this.canFly, true) : (parseInt(chosenAbility.use_range) >= generateArrowPath(this.cords, this.chosenTarget.cords, true) && arrowHitsTarget(this.cords, this.chosenTarget.cords))) || chosenAbility.self_target)) {
                    if (chosenAbility.type == "charge") {
                        moveEnemy(this.chosenTarget.cords, this, chosenAbility, chosenAbility.use_range);
                    }
                    else if (chosenAbility.self_target) {
                        buffOrHeal(this, chosenAbility);
                    }
                    else if (chosenAbility.shoots_projectile) {
                        fireProjectile(this.cords, this.chosenTarget.cords, chosenAbility.shoots_projectile, chosenAbility, false, this);
                    }
                    else {
                        regularAttack(this, this.chosenTarget, chosenAbility);
                    }
                }
                else if (chosenAbility && parseInt(chosenAbility.use_range) == 1 && generatePath(this.cords, this.chosenTarget.cords, this.canFly, true) <= this.attackRange) {
                    // @ts-ignore
                    attackTarget(this, this.chosenTarget, weaponReach(this, 1, this.chosenTarget));
                    regularAttack(this, this.chosenTarget, chosenAbility);
                }
                // Check if enemy should shoot the this.chosenTarget
                else if (this.shootsProjectile && generateArrowPath(this.cords, this.chosenTarget.cords, true) <= this.attackRange && arrowHitsTarget(this.cords, this.chosenTarget.cords)) {
                    fireProjectile(this.cords, this.chosenTarget.cords, this.shootsProjectile, abilities.attack, false, this);
                }
                // Check if enemy should instead punch the chosenTarget (and is in range)
                else if (!this.shootsProjectile && generatePath(this.cords, this.chosenTarget.cords, this.canFly, true) <= this.attackRange) {
                    // regular attack for now
                    // @ts-ignore
                    attackTarget(this, this.chosenTarget, weaponReach(this, 1, this.chosenTarget));
                    // @ts-ignore
                    regularAttack(this, this.chosenTarget, this.abilities[0]);
                    updateEnemiesTurn();
                }
                // If there's no offensive action to be taken, just move towards the this.chosenTarget.
                else if (!this.isRooted()) {
                    var path = generatePath(this.cords, this.chosenTarget.cords, this.canFly);
                    try {
                        let willStack = false;
                        if (path.length > 0) {
                            combatSummons.forEach(summon => {
                                if (summon.cords.x == path[0].x && summon.cords.y == path[0].y) {
                                    willStack = true;
                                }
                            });
                        }
                        this.oldCords.x = this.cords.x;
                        this.oldCords.y = this.cords.y;
                        if ((path[0].x != player.cords.x || path[0].y != player.cords.y) && !willStack) {
                            this.cords.x = path[0].x;
                            this.cords.y = path[0].y;
                        }
                        if (settings.log_enemy_movement)
                            displayText(`<c>crimson<c>[ENEMY] <c>yellow<c>${(_a = lang[this.id + "_name"]) !== null && _a !== void 0 ? _a : this.id} <c>white<c>${lang["moves_to"]} [${this.cords.x}, ${this.cords.y}]`);
                    }
                    catch (_b) { }
                    updateEnemiesTurn();
                }
                else
                    updateEnemiesTurn();
            }
            setTimeout(modifyCanvas, 200);
        };
        this.chooseAbility = () => {
            let out = [];
            // Loop through the master entries.
            for (let i = 0; i < this.abilities.length; ++i) {
                // Push the value over and over again according to its
                // weight.
                for (let j = 0; j < this.abilities[i].ai_chance; ++j) {
                    const abi = this.abilities[i];
                    if (abi.mana_cost <= this.stats.mp && abi.onCooldown == 0 && !(abi.mana_cost > 0 ? this.silenced() : false) && (abi.requires_concentration ? this.concentration() : true)) {
                        out.push(this.abilities[i]);
                    }
                }
            }
            // And done!
            return out[Math.floor(Math.random() * out.length)];
        };
        this.trueDamage = () => {
            let dmg = 0;
            let dmgs = {};
            // @ts-ignore
            // @ts-ignore
            Object.entries(this.damages).forEach((value) => {
                const key = value[0];
                const num = value[1];
                let { v: val, m: mod } = getModifiers(this, key + "Damage");
                val += getModifiers(this, "damage").v;
                mod *= getModifiers(this, "damage").m;
                let bonus = 0;
                // @ts-ignore
                // @ts-ignore
                if (this.shootsProjectile)
                    bonus += num * this.getStats().dex / 50;
                // @ts-ignore
                else
                    bonus += num * this.getStats().str / 50;
                // @ts-ignore
                dmg += Math.floor((num + val + bonus) * mod);
                dmgs[key] = Math.floor((num + val + bonus) * mod);
            });
            return { total: dmg, split: dmgs };
        };
        this.kill = () => {
            player.level.xp += this.xp;
            this.spawnMap = currentMap;
            const index = maps[currentMap].enemies.findIndex(e => e.cords == this.cords);
            displayText(`<c>white<c>[WORLD] <c>yellow<c>${lang[this.id + "_name"]}<c>white<c> ${lang["death"]}`);
            lootEnemy(this);
            this.chosenTarget = null;
            fallenEnemies.push(Object.assign({}, this));
            maps[currentMap].enemies.splice(index, 1);
            this.alive = false;
            player.lvlUp();
        };
        this.restore = () => {
            this.stats.hp = this.getHpMax();
            this.stats.mp = this.getMpMax();
            this.statusEffects = [];
            this.abilities.forEach(abi => {
                abi.onCooldown = 0;
            });
            this.cords.x = this.spawnCords.x;
            this.cords.y = this.spawnCords.y;
        };
        this.aggro = () => {
            // @ts-ignore
            let targets = combatSummons.concat([player]);
            let target = threatDistance(targets, this);
            // @ts-ignore
            if (target) {
                if (generatePath(this.cords, target.cords, this.canFly, true) <= this.aggroRange)
                    return true;
            }
            return false;
        };
        this.distToPlayer = () => {
            return generatePath(this.cords, player.cords, this.canFly, true);
        };
    }
}
var fallenEnemies = [];
var greySlime = new Enemy(enemies.greySlime);
//# sourceMappingURL=enemy.js.map