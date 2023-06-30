interface enemy extends characterObject {
  sprite: string;
  aggroRange: number;
  tempAggro?: number;
  tempAggroLast?: number;
  attackRange: number;
  isFoe?: boolean;
  xp: number;
  damages: damageClass;
  alive: boolean;
  canFly: boolean;
  retreatLimit: number;
  firesProjectile?: string;
  decideAction?: Function;
  aggro?: Function;
  spawnCords?: tileObject;
  spawnMap?: string;
  loot: Array<any>;
  shootsProjectile?: string;
  hasBeenLeveled?: boolean;
  level?: number;
  isUnique?: boolean;
  levelingTemplate: string;
  retreatPath?: any;
  retreatIndex?: number;
  hasRetreated?: boolean;
  img?: string;
  restore?: Function;
  type?: string;
  race?: string;
  trueDamage?: Function;
  targetInterval?: number; // How often, in turns, the AI should pick a target.
  currentTargetInterval?: number;
  chosenTarget?: characterObject;
  distToPlayer?: Function;
  questSpawn?: any;
  indexInBaseArray?: number;
  index?: number;
}

class Enemy extends Character {
  sprite: string;
  aggroRange: number;
  tempAggro?: number;
  tempAggroLast?: number;
  attackRange: number;
  isFoe?: boolean;
  xp: number;
  alive: boolean;
  damages: damageClass;
  firesProjectile?: string;
  canFly: boolean;
  decideAction: Function;
  aggro: Function;
  retreatLimit: number;
  spawnCords?: tileObject;
  spawnMap?: string;
  loot: Array<any>;
  shootsProjectile?: string;
  hasBeenLeveled?: boolean;
  level?: number;
  isUnique?: boolean;
  levelingTemplate: string;
  retreatPath?: any;
  retreatIndex?: number;
  hasRetreated?: boolean;
  chooseAbility?: Function;
  img?: string;
  restore?: Function;
  type?: string;
  race?: string;
  trueDamage?: Function; // Misleading, will just give the enemy's damage raw
  targetInterval?: number; // How often, in turns, the AI should pick a target.
  currentTargetInterval?: number;
  chosenTarget?: characterObject;
  oldCords?: tileObject; // Shitty hack to make summon shooting possible.
  distToPlayer?: Function;
  questSpawn?: any;
  indexInBaseArray?: number;
  index?: number;
  spriteMap?: { x: number; y: number };
  constructor(base: enemy) {
    super(base);
    const defaultModel: any = { ...enemies[base.id] };
    this.sprite = defaultModel.sprite;
    this.aggroRange = defaultModel.aggroRange ?? base.aggroRange ?? 5;
    this.tempAggro = base.tempAggro ?? 0;
    this.tempAggroLast = base.tempAggroLast ?? 0;
    this.attackRange = defaultModel.attackRange ?? 1;
    this.damages = { ...defaultModel.damages };
    this.isFoe = true;
    this.firesProjectile = defaultModel.firesProjectile;
    this.canFly = defaultModel.canFly ?? false;
    this.alive = base.alive ?? true;
    this.retreatLimit = base.retreatLimit ?? 30;
    this.spawnCords = { ...base.spawnCords };
    this.spawnMap = base.spawnMap;
    this.loot = defaultModel.loot;
    this.shootsProjectile = defaultModel.shootsProjectile;
    this.hasBeenLeveled = base.hasBeenLeveled ?? false;
    this.level = base.level ?? 1;
    this.isUnique = base.isUnique ?? false;
    this.xp = this.level > 1 ? Math.floor(defaultModel.xp * (1 + this.level / 5)) : defaultModel.xp;
    this.levelingTemplate = defaultModel.levelingTemplate ?? "balanced";
    this.retreatPath = [];
    this.retreatIndex = 0;
    this.hasRetreated = false;
    this.img = defaultModel.img;
    this.type = defaultModel.type;
    this.race = defaultModel.race;
    this.targetInterval = 4;
    this.currentTargetInterval = base.currentTargetInterval ?? 0;
    this.chosenTarget = base.chosenTarget ?? null;
    this.oldCords = { ...base.oldCords } ?? { ...this.cords };
    this.questSpawn = { ...base.questSpawn } ?? null;
    this.indexInBaseArray = Object.keys(enemies).findIndex((en: string) => en == this.id);
    this.index = base.index ?? -1;

    if (!this.hasBeenLeveled && this.level > 1) {
      this.updateTraits();
      const points = (this.level - 1) * 3;
      const template = enemyLevelingTemplates[this.levelingTemplate];
      for (let i = 1; i < points; i++) {
        const stat = helper.weightedRandom(template).stat;
        this.stats[stat]++;
      }
      Object.entries(this.damages).forEach((dmg: any) => {
        this.damages[dmg[0]] = Math.floor(this.damages[dmg[0]] * (1 + (this.level - 1) / 50)) + 1;
      });
      this["stats"]["hp"] = this.getHpMax();
      this["stats"]["mp"] = this.getMpMax();
      this.hasBeenLeveled = true;
    }

    this.decideAction = async () => {
      if (this.tempAggroLast > 0) {
        this.tempAggroLast--;
        if (this.tempAggroLast <= 0) this.tempAggro = 0;
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
      if (this.stats.hp > this.getHpMax()) this.stats.hp = this.getHpMax();
      if (this.stats.mp > this.getMpMax()) this.stats.mp = this.getMpMax();
      if (this.currentTargetInterval <= 0 || this.chosenTarget == null || this.chosenTarget?.stats?.hp <= 0) {
        // @ts-ignore
        let targets = combatSummons.concat([player]);
        this.chosenTarget = threatDistance(targets, this);
        this.currentTargetInterval = this.targetInterval;
      } else this.currentTargetInterval--;

      // Choose a random ability
      if (this.chosenTarget) {
        let chosenAbility = this.chooseAbility();
        let pathToTarget: any = generatePath(this.cords, this.chosenTarget.cords, this.canFly, false);
        let arrowPathToTarget: any = generateArrowPath(this.cords, this.chosenTarget.cords, false);
        let missileWillLand = arrowHitsTarget(null, null, false, arrowPathToTarget);
        let punchingDistance: any = generatePath(this.cords, this.chosenTarget.cords, this.canFly, true);
        let pathDistance: number = pathToTarget.length;
        let arrowPathDistance: number = arrowPathToTarget.length;
        if (pathDistance < 1) pathDistance = 9999;
        if (arrowPathDistance < 1) arrowPathDistance = 9999;
        // Check if it should be used
        if (
          chosenAbility &&
          ((chosenAbility?.type == "charge"
            ? parseInt(chosenAbility.use_range) >= pathDistance
            : parseInt(chosenAbility.use_range) >= arrowPathDistance && missileWillLand) ||
            chosenAbility.self_target)
        ) {
          if (chosenAbility.type == "charge") {
            moveEnemy(this.chosenTarget.cords, this, chosenAbility, chosenAbility.use_range);
          } else if (chosenAbility.self_target) {
            buffOrHeal(this, chosenAbility);
          } else if (chosenAbility.shoots_projectile) {
            fireProjectile(this.cords, this.chosenTarget.cords, chosenAbility.shoots_projectile, chosenAbility, false, this);
          } else {
            regularAttack(this, this.chosenTarget, chosenAbility);
          }
        } else if (chosenAbility && parseInt(chosenAbility.use_range) == 1 && pathDistance <= this.attackRange) {
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
          let path: any = pathToTarget;

          try {
            let willStack = false;
            if (path.length > 0) {
              combatSummons.forEach((summon) => {
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
              const enemyCanvas: HTMLCanvasElement = document.querySelector(`.enemy${this.index}`);
              try {
                enemyCanvas.width = enemyCanvas.width;
              } catch {}
              renderSingleEnemy(this, enemyCanvas);
            }
            if (settings.log_enemy_movement)
              displayText(
                `<c>crimson<c>[ENEMY] <c>yellow<c>${lang[this.id + "_name"] ?? this.id} <c>white<c>${lang["moves_to"]} [${this.cords.x}, ${
                  this.cords.y
                }]`
              );
          } catch (err) {
            if (DEVTOOLS.ENABLED) displayText(`<c>red<c>${err}`);
          }

          updateEnemiesTurn();
        } else updateEnemiesTurn();
      } else updateEnemiesTurn();
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
          if (
            abi.mana_cost <= this.stats.mp &&
            abi.onCooldown == 0 &&
            !(abi.mana_cost > 0 ? this.silenced() : false) &&
            (abi.requires_concentration ? this.concentration() : true)
          ) {
            out.push(this.abilities[i]);
          }
        }
      }

      // And done!
      return out[Math.floor(Math.random() * out.length)];
    };

    this.trueDamage = () => {
      let dmg: number = 0;
      let dmgs = {} as damageClass;
      // @ts-ignore
      // @ts-ignore
      Object.entries(this.damages).forEach((value: any) => {
        const key: string = value[0];
        const num: number = value[1];
        let val = this.allModifiers[`${key}DamageV`] || 0;
        let mod = this.allModifiers[`${key}DamageP`] || 1;
        val += this.allModifiers.damageV || 0;
        mod *= this.allModifiers.damageP || 1;
        let bonus: number = 0;
        // @ts-ignore
        // @ts-ignore
        if (this.shootsProjectile) bonus += (num * this.getStats().dex) / 50;
        // @ts-ignore
        else bonus += (num * this.getStats().str) / 50;
        // @ts-ignore
        dmg += Math.floor((num + val + bonus) * mod);
        dmgs[key] = Math.floor((num + val + bonus) * mod);
      });
      return { total: dmg, split: dmgs };
    };

    this.kill = () => {
      player.addXP(this.xp);
      this.spawnMap = currentMap;
      const index: number = maps[currentMap].enemies.findIndex((e: any) => e.cords == this.cords);
      displayText(`<c>white<c>[WORLD] <c>yellow<c>${lang[this.id + "_name"]}<c>white<c> ${lang["death"]}`);
      displayText(
        `<c>white<c>[WORLD] <c>lime<c>${lang["gained"]} <c>yellow<c>${Math.floor(this.xp * player.allModifiers.expGainP)}<c>lime<c> EXP.`
      );
      lootEnemy(this);
      this.chosenTarget = null;
      if (this.questSpawn?.quest > -1) {
        let index = player.questProgress.findIndex((q: any) => q.id === this.questSpawn.quest);
        player.questProgress[index].prog[this.questSpawn.index] = 1;
        updateQuestProgress({ id: index, quest: Object.keys(quests)[player.questProgress[index].id] });
      } else
        fallenEnemies.push({
          id: this.id,
          level: this.level,
          spawnCords: this.spawnCords,
          spawnMap: this.spawnMap,
          isUnique: this.isUnique,
          turnsToRes: 200,
        });
      player.questProgress.forEach((prog: any) => {
        let questFind: any = Object.values(quests)[prog.id];
        if (prog.obj >= questFind.objectives.length) return;
        let objective: any = questFind.objectives[prog.obj];
        if (objective.objective == "killEnemies") {
          objective.enemiesToKill?.forEach((en: any, index: number) => {
            if (this.id == en.type) {
              if (!prog.prog[index]) prog.prog[index] = 1;
              else prog.prog[index]++;
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
      this.abilities.forEach((abi) => {
        abi.onCooldown = 0;
      });
      this.cords.x = this.spawnCords.x;
      this.cords.y = this.spawnCords.y;
    };

    this.aggro = () => {
      let targets = combatSummons.concat([player]);
      let target = threatDistance(targets, this);
      let range = this.aggroRange + this.tempAggro;
      if (target) {
        // This is checked twice for performance reasons.
        // First to see if the target is in range with an inaccurate but very cheap calculation.
        // Second to see if the target is in range and there is a path of valid length with a more accurate but more expensive calculation.
        if (generatePath(this.cords, target.cords, this.canFly, true) <= range) {
          if (generatePath(this.cords, target.cords, this.canFly).length <= range) {
            let encounter = player.entitiesEverEncountered?.enemies?.[this.id];
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

let fallenEnemies: Array<any> = [];
