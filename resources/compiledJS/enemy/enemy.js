"use strict";
class Enemy extends Character {
    constructor(base) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        super(base);
        const defaultModel = { ...enemies[base.id] };
        this.sprite = defaultModel.sprite;
        this.aggroRange = (_b = (_a = defaultModel.aggroRange) !== null && _a !== void 0 ? _a : base.aggroRange) !== null && _b !== void 0 ? _b : 5;
        this.tempAggro = (_c = base.tempAggro) !== null && _c !== void 0 ? _c : 0;
        this.tempAggroLast = (_d = base.tempAggroLast) !== null && _d !== void 0 ? _d : 0;
        this.attackRange = (_e = defaultModel.attackRange) !== null && _e !== void 0 ? _e : 1;
        this.damages = { ...defaultModel.damages };
        this.isFoe = true;
        this.firesProjectile = defaultModel.firesProjectile;
        this.canFly = (_f = defaultModel.canFly) !== null && _f !== void 0 ? _f : false;
        this.alive = (_g = base.alive) !== null && _g !== void 0 ? _g : true;
        this.retreatLimit = (_h = base.retreatLimit) !== null && _h !== void 0 ? _h : 30;
        this.spawnCords = { ...base.spawnCords };
        this.spawnMap = base.spawnMap;
        this.loot = defaultModel.loot;
        this.shootsProjectile = defaultModel.shootsProjectile;
        this.hasBeenLeveled = (_j = base.hasBeenLeveled) !== null && _j !== void 0 ? _j : false;
        this.level = (_k = base.level) !== null && _k !== void 0 ? _k : 1;
        this.isUnique = (_l = base.isUnique) !== null && _l !== void 0 ? _l : false;
        this.xp = this.level > 1 ? Math.floor(defaultModel.xp * (1 + (this.level / 5))) : defaultModel.xp;
        this.levelingTemplate = (_m = defaultModel.levelingTemplate) !== null && _m !== void 0 ? _m : "balanced";
        this.retreatPath = [];
        this.retreatIndex = 0;
        this.hasRetreated = false;
        this.img = defaultModel.img;
        this.type = defaultModel.type;
        this.race = defaultModel.race;
        this.targetInterval = 4;
        this.currentTargetInterval = (_o = base.currentTargetInterval) !== null && _o !== void 0 ? _o : 0;
        this.chosenTarget = (_p = base.chosenTarget) !== null && _p !== void 0 ? _p : null;
        this.oldCords = (_q = { ...base.oldCords }) !== null && _q !== void 0 ? _q : { ...this.cords };
        this.questSpawn = (_r = { ...base.questSpawn }) !== null && _r !== void 0 ? _r : null;
        this.indexInBaseArray = Object.keys(enemies).findIndex((en) => en == this.id);
        this.index = (_s = base.index) !== null && _s !== void 0 ? _s : -1;
        if (!this.hasBeenLeveled && this.level > 1) {
            this.updateTraits();
            const points = (this.level - 1) * 3;
            const template = enemyLevelingTemplates[this.levelingTemplate];
            for (let i = 1; i < points; i++) {
                const stat = helper.weightedRandom(template).stat;
                this.stats[stat]++;
            }
            Object.entries(this.damages).forEach((dmg) => {
                this.damages[dmg[0]] = Math.floor(this.damages[dmg[0]] * (1 + (this.level - 1) / 50)) + 1;
            });
            this["stats"]["hp"] = this.getHpMax();
            this["stats"]["mp"] = this.getMpMax();
            this.hasBeenLeveled = true;
        }
        this.decideAction = async () => {
            var _a, _b, _c;
            if (this.tempAggroLast > 0) {
                this.tempAggroLast--;
                if (this.tempAggroLast <= 0)
                    this.tempAggro = 0;
            }
            // Will make enemy take their turn
            // Right now AI only randomly chooses an ability and checks if there's any point in using it,
            // Which is whether or not it'll actually hit the player.
            // This system already provides plenty of depth, but not truly intelligent foes.
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
            if (this.currentTargetInterval <= 0 || this.chosenTarget == null || ((_b = (_a = this.chosenTarget) === null || _a === void 0 ? void 0 : _a.stats) === null || _b === void 0 ? void 0 : _b.hp) <= 0) {
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
                let pathToTarget = generatePath(this.cords, this.chosenTarget.cords, this.canFly, false);
                let arrowPathToTarget = generateArrowPath(this.cords, this.chosenTarget.cords, false);
                let missileWillLand = arrowHitsTarget(null, null, false, arrowPathToTarget);
                let punchingDistance = generatePath(this.cords, this.chosenTarget.cords, this.canFly, true);
                let pathDistance = pathToTarget.length;
                let arrowPathDistance = arrowPathToTarget.length;
                if (pathDistance < 1)
                    pathDistance = 9999;
                if (arrowPathDistance < 1)
                    arrowPathDistance = 9999;
                // Check if it should be used
                if (chosenAbility && (((chosenAbility === null || chosenAbility === void 0 ? void 0 : chosenAbility.type) == "charge" ? parseInt(chosenAbility.use_range) >= pathDistance : (parseInt(chosenAbility.use_range) >= arrowPathDistance && missileWillLand)) || chosenAbility.self_target)) {
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
                else if (chosenAbility && parseInt(chosenAbility.use_range) == 1 && pathDistance <= this.attackRange) {
                    // @ts-ignore
                    attackTarget(this, this.chosenTarget, weaponReach(this, 1, this.chosenTarget));
                    regularAttack(this, this.chosenTarget, chosenAbility);
                }
                // Check if enemy should shoot the target
                else if (this.shootsProjectile && arrowPathDistance <= this.attackRange && missileWillLand) {
                    this.doNormalAttack(this.chosenTarget);
                }
                // Check if enemy should instead punch the target (and is in range)
                else if (!this.shootsProjectile && punchingDistance <= this.attackRange) {
                    this.doNormalAttack(this.chosenTarget);
                }
                // If there's no offensive action to be taken, just move towards the target.
                else if (!this.isRooted()) {
                    var path = pathToTarget;
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
                            const enemyCanvas = document.querySelector(`.enemy${this.index}`);
                            try {
                                enemyCanvas.width = enemyCanvas.width;
                            }
                            catch (_d) { }
                            renderSingleEnemy(this, enemyCanvas);
                        }
                        if (settings.log_enemy_movement)
                            displayText(`<c>crimson<c>[ENEMY] <c>yellow<c>${(_c = lang[this.id + "_name"]) !== null && _c !== void 0 ? _c : this.id} <c>white<c>${lang["moves_to"]} [${this.cords.x}, ${this.cords.y}]`);
                    }
                    catch (err) {
                        if (DEVMODE)
                            displayText(`<c>red<c>${err}`);
                    }
                    updateEnemiesTurn();
                }
                else
                    updateEnemiesTurn();
            }
            else
                updateEnemiesTurn();
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
            var _a;
            player.level.xp += Math.floor(this.xp * player.allModifiers.expGainP);
            this.spawnMap = currentMap;
            const index = maps[currentMap].enemies.findIndex((e) => e.cords == this.cords);
            displayText(`<c>white<c>[WORLD] <c>yellow<c>${lang[this.id + "_name"]}<c>white<c> ${lang["death"]}`);
            displayText(`<c>white<c>[WORLD] <c>lime<c>${lang["gained"]} <c>yellow<c>${Math.floor(this.xp * player.allModifiers.expGainP)}<c>lime<c> EXP.`);
            lootEnemy(this);
            this.chosenTarget = null;
            if (((_a = this.questSpawn) === null || _a === void 0 ? void 0 : _a.quest) > -1) {
                let index = player.questProgress.findIndex((q) => q.id === this.questSpawn.quest);
                player.questProgress[index].prog[this.questSpawn.index] = 1;
                updateQuestProgress({ id: index, quest: Object.keys(quests)[player.questProgress[index].id] });
            }
            else
                fallenEnemies.push({ id: this.id, level: this.level, spawnCords: this.spawnCords, spawnMap: this.spawnMap, isUnique: this.isUnique, turnsToRes: 200 });
            player.questProgress.forEach((prog) => {
                var _a;
                let questFind = Object.values(quests)[prog.id];
                if (prog.obj >= questFind.objectives.length)
                    return;
                let objective = questFind.objectives[prog.obj];
                if (objective.objective == "killEnemies") {
                    (_a = objective.enemiesToKill) === null || _a === void 0 ? void 0 : _a.forEach((en, index) => {
                        if (this.id == en.type) {
                            if (!prog.prog[index])
                                prog.prog[index] = 1;
                            else
                                prog.prog[index]++;
                            updateQuestProgress({ id: prog.id, quest: questFind.id });
                        }
                    });
                }
            });
            maps[currentMap].enemies.splice(index, 1);
            this.alive = false;
            document.querySelector(`.enemy${this.index}`).remove();
            player.lvlUp();
        };
        this.restore = () => {
            this.updateTraits();
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
            var _a, _b;
            let targets = combatSummons.concat([player]);
            let target = threatDistance(targets, this);
            let range = this.aggroRange + this.tempAggro;
            if (target) {
                // This is checked twice for performance reasons.
                // First to see if the target is in range with an inaccurate but very cheap calculation.
                // Second to see if the target is in range and there is a path of valid length with a more accurate but more expensive calculation.
                if (generatePath(this.cords, target.cords, this.canFly, true) <= range) {
                    if (generatePath(this.cords, target.cords, this.canFly).length <= range) {
                        let encounter = (_b = (_a = player.entitiesEverEncountered) === null || _a === void 0 ? void 0 : _a.enemies) === null || _b === void 0 ? void 0 : _b[this.id];
                        if (encounter < 1 || !encounter) {
                            player.entitiesEverEncountered.enemies[this.id] = 1;
                            displayText("New enemy encountered!");
                            displayText(this.id + " added to codex.");
                            spawnFloatingText(this.cords, "NEW ENEMY ENCOUNTER", "yellow", 22, 2000, 0);
                        }
                        return true;
                    }
                }
            }
            return false;
        };
        this.distToPlayer = () => {
            return generatePath(this.cords, player.cords, this.canFly, true);
        };
    }
}
let fallenEnemies = [];
//# sourceMappingURL=enemy.js.map