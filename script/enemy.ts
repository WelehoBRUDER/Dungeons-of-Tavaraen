interface enemy extends characterObject {
  sprite: string,
  aggroRange: number,
  tempAggro?: number,
  tempAggroLast?: number,
  attackRange: number,
  isFoe?: boolean,
  xp: number,
  damages: damageClass;
  alive: boolean;
  canFly: boolean,
  retreatLimit: number;
  firesProjectile?: string;
  decideAction?: Function,
  aggro?: Function;
  spawnCords?: tileObject;
  spawnMap?: number;
  loot: Array<any>;
  shootsProjectile?: string;
  hasBeenLeveled?: boolean;
  level?: number;
  isUnique?: boolean;
  statsPerLevel: any;
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
  spawnMap?: number;
  loot: Array<any>;
  shootsProjectile?: string;
  hasBeenLeveled?: boolean;
  level?: number;
  isUnique?: boolean;
  statsPerLevel: any;
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
  constructor(base: enemy) {
    super(base);
    const defaultModel: any = {...enemies[base.id]};
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
    this.xp = this.level > 1 ? Math.floor(defaultModel.xp * (1 + (this.level / 15))) : defaultModel.xp;
    this.statsPerLevel = { ...defaultModel.statsPerLevel } ?? { str: 1, vit: 1, dex: 1, int: 1, cun: 1 };
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

    if (!this.hasBeenLeveled && this.level > 1) {
      for (let i = 1; i < this.level; i++) {
        Object.entries(this.statsPerLevel).forEach((stat: any) => {
          this.stats[stat[0]] += stat[1];
        });
      }
      Object.entries(this.damages).forEach((dmg: any) => {
        this.damages[dmg[0]] = Math.floor(this.damages[dmg[0]] * (1 + this.level / 30)) + 1;
      });
      this["stats"]["hp"] = this.getHpMax();
      this["stats"]["mp"] = this.getMpMax();
      this.hasBeenLeveled = true;
    }

    this.decideAction = async () => {
      if(this.tempAggroLast > 0) {
        this.tempAggroLast--;
        if(this.tempAggroLast <= 0) this.tempAggro = 0;
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
      if (this.currentTargetInterval <= 0 || this.chosenTarget == null || !this.chosenTarget.alive) {
        // @ts-ignore
        let targets = combatSummons.concat([player]);
        this.chosenTarget = threatDistance(targets, this);
        this.currentTargetInterval = this.targetInterval;
      }
      else this.currentTargetInterval--;

      // Choose a random ability
      if (this.chosenTarget) {
        let chosenAbility = this.chooseAbility();
        let pathToTarget: any = generatePath(this.cords, this.chosenTarget.cords, this.canFly, false);
        let arrowPathToTarget: any = generateArrowPath(this.cords, this.chosenTarget.cords, false);
        let missileWillLand = arrowHitsTarget(this.cords, this.chosenTarget.cords);
        let punchingDistance: any = generatePath(this.cords, this.chosenTarget.cords, this.canFly, true);
        let pathDistance: number = pathToTarget.length;
        let arrowPathDistance: number = arrowPathToTarget.length;
        if(pathDistance < 1) pathDistance = 9999;
        if(arrowPathDistance < 1) arrowPathDistance = 9999;
        // Check if it should be used
        if (chosenAbility && ((chosenAbility?.type == "charge" ? parseInt(chosenAbility.use_range) >= pathDistance : (parseInt(chosenAbility.use_range) >= arrowPathDistance && missileWillLand)) || chosenAbility.self_target)) {
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
          fireProjectile(this.cords, this.chosenTarget.cords, this.shootsProjectile, abilities.attack, false, this);
        }
        // Check if enemy should instead punch the target (and is in range)
        else if (!this.shootsProjectile && punchingDistance <= this.attackRange) {
          // regular attack for now
          // @ts-ignore
          attackTarget(this, this.chosenTarget, weaponReach(this, 1, this.chosenTarget));
          // @ts-ignore
          regularAttack(this, this.chosenTarget, this.abilities[0]);
          updateEnemiesTurn();
        }
        // If there's no offensive action to be taken, just move towards the target.
        else if (!this.isRooted()) {
          var path: any = pathToTarget;

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
            if (settings.log_enemy_movement) displayText(`<c>crimson<c>[ENEMY] <c>yellow<c>${lang[this.id + "_name"] ?? this.id} <c>white<c>${lang["moves_to"]} [${this.cords.x}, ${this.cords.y}]`);
          }
          catch { }

          updateEnemiesTurn();
        }
        else updateEnemiesTurn();
      }
      else updateEnemiesTurn();
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
      let dmg: number = 0;
      let dmgs = {} as damageClass;
      // @ts-ignore
      // @ts-ignore
      Object.entries(this.damages).forEach((value: any) => {
        const key: string = value[0];
        const num: number = value[1];
        let { v: val, m: mod } = getModifiers(this, key + "Damage");
        val += getModifiers(this, "damage").v;
        mod *= getModifiers(this, "damage").m;
        let bonus: number = 0;
        // @ts-ignore
        // @ts-ignore
        if (this.shootsProjectile) bonus += num * this.getStats().dex / 50;
        // @ts-ignore
        else bonus += num * this.getStats().str / 50;
        // @ts-ignore
        dmg += Math.floor((num + val + bonus) * mod);
        dmgs[key] = Math.floor((num + val + bonus) * mod);
      });
      return { total: dmg, split: dmgs };
    };

    this.kill = () => {
      player.level.xp += Math.floor(this.xp * player.allModifiers.expGainP);
      this.spawnMap = currentMap;
      const index: number = maps[currentMap].enemies.findIndex((e: any) => e.cords == this.cords);
      displayText(`<c>white<c>[WORLD] <c>yellow<c>${lang[this.id + "_name"]}<c>white<c> ${lang["death"]}`);
      displayText(`<c>white<c>[WORLD] <c>lime<c>${lang["gained"]} <c>yellow<c>${Math.floor(this.xp * player.allModifiers.expGainP)}<c>lime<c> EXP.`);
      lootEnemy(this);
      this.chosenTarget = null;
      fallenEnemies.push({ id: this.id, level: this.level, spawnCords: this.spawnCords, spawnMap: this.spawnMap, isUnique: this.isUnique  });
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
      let range = this.aggroRange + this.tempAggro;
      // @ts-ignore
      if (target) {
        if (generatePath(this.cords, target.cords, this.canFly, true) <= range) return true;
      }
      return false;
    };

    this.distToPlayer = () => {
      return generatePath(this.cords, player.cords, this.canFly, true);
    }
  }
}

var fallenEnemies: Array<any> = [];

var greySlime = new Enemy(enemies.greySlime);