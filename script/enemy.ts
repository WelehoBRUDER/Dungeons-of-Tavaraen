interface enemy extends characterObject {
  sprite: string,
  aggroRange: number,
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
  statsPerLevel: any;
  retreatPath?: any;
  retreatIndex?: number;
  hasRetreated?: boolean;
  img?: string;
}

class Enemy extends Character {
  sprite: string;
  aggroRange: number;
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
  statsPerLevel: any;
  retreatPath?: any;
  retreatIndex?: number;
  hasRetreated?: boolean;
  chooseAbility?: Function;
  img?: string;
  constructor(base: enemy) {
    super(base);
    this.sprite = base.sprite;
    this.aggroRange = base.aggroRange ?? 5;
    this.attackRange = base.attackRange ?? 1;
    this.damages = { ...base.damages };
    this.isFoe = true;
    this.firesProjectile = base.firesProjectile;
    this.canFly = base.canFly ?? false;
    this.alive = base.alive ?? true;
    this.retreatLimit = base.retreatLimit ?? 30;
    this.spawnCords = { ...base.spawnCords };
    this.spawnMap = base.spawnMap;
    this.loot = base.loot;
    this.shootsProjectile = base.shootsProjectile;
    this.hasBeenLeveled = base.hasBeenLeveled ?? false;
    this.level = base.level ?? 1;
    this.xp = this.level > 1 ? Math.floor(base.xp + (base.xp * this.level / 2.9)) : base.xp;
    this.statsPerLevel = { ...base.statsPerLevel } ?? { str: 1, vit: 1, dex: 1, int: 1, cun: 1 };
    this.retreatPath = [];
    this.retreatIndex = 0;
    this.hasRetreated = false;
    this.img = base.img;

    if (!this.hasBeenLeveled && this.level > 1) {
      for (let i = 1; i < this.level; i++) {
        Object.entries(this.statsPerLevel).forEach((stat: any) => {
          this.stats[stat[0]] += stat[1];
        });
      }
      Object.entries(this.damages).forEach((dmg: any) => {
        this.damages[dmg[0]] = Math.floor(this.damages[dmg[0]] * (1 + this.level / 17)) + 1;
      });
      this["stats"]["hp"] = this.getStats().hpMax;
      this["stats"]["mp"] = this.getStats().mpMax;
      this.hasBeenLeveled = true;
    }

    this.decideAction = async () => {
      // Will make enemy take their turn
      // Right now AI only randomly chooses an ability and checks if there's any point in using it,
      // Which is whether or not it'll actually hit the player.
      // This system already provides plenty of depht, but not truly intelligent foes.

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
      
      // Choose a random ability
      let chosenAbility = this.chooseAbility();
      // Check if it should be used
      if (chosenAbility && ((chosenAbility?.type == "charge" ? chosenAbility.use_range >= generatePath(this.cords, player.cords, this.canFly, true) : (chosenAbility.use_range >= generateArrowPath(this.cords, player.cords, true) && arrowHitsTarget(this.cords, player.cords))) || chosenAbility.self_target)) {
        if(chosenAbility.type == "charge") {
          moveEnemy(player.cords, this, chosenAbility, chosenAbility.use_range);
        }
        else if(chosenAbility.self_target) {
          buffOrHeal(this, chosenAbility);
        }
        else if(chosenAbility.shoots_projectile) {
          fireProjectile(this.cords, player.cords, chosenAbility.shoots_projectile, chosenAbility, false, this); 
        }
        else {
          regularAttack(this, player, chosenAbility);
        }
      }
      // Check if enemy should shoot the player
      else if (this.shootsProjectile && generateArrowPath(this.cords, player.cords, true) <= this.attackRange && arrowHitsTarget(this.cords, player.cords)) {
        fireProjectile(this.cords, player.cords, this.shootsProjectile, abilities.attack, false, this);
      }
      // Check if enemy should instead punch the player (and is in range)
      else if (!this.shootsProjectile && generatePath(this.cords, player.cords, this.canFly, true) <= this.attackRange) {
        // regular attack for now
        // @ts-ignore
        attackTarget(this, player, weaponReach(this, 1, player));
        // @ts-ignore
        regularAttack(this, player, this.abilities[0]);
        updateEnemiesTurn();
      }
      // If there's no offensive action to be taken, just move towards the player.
      else {
        var path: any = generatePath(this.cords, player.cords, this.canFly);
        try {
          this.cords.x = path[0].x;
          this.cords.y = path[0].y;
          if (settings.log_enemy_movement) displayText(`<c>crimson<c>[ENEMY] <c>yellow<c>${this.name} <c>white<c>moves to [${this.cords.x}, ${this.cords.y}]`);
        }
        catch {  }

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
          if(abi.mana_cost <= this.stats.mp && abi.onCooldown == 0 && !(abi.mana_cost > 0 ? this.silenced() : false) && (abi.requires_concentration ? this.concentration() : true)) {
            out.push(this.abilities[i]);
          }
        }
      }

      // And done!
      return out[Math.floor(Math.random() * out.length)];
    };

    this.kill = () => {
      player.level.xp += this.xp;
      this.spawnMap = currentMap;
      const index: number = maps[currentMap].enemies.findIndex(e => e.cords == this.cords);
      displayText(`<c>white<c>[WORLD] <c>yellow<c>${lang[this.id + "_name"]}<c>white<c> ${lang["death"]}`);
      lootEnemy(this);
      fallenEnemies.push({ ...this });
      maps[currentMap].enemies.splice(index, 1);
      this.alive = false;
    };

    this.aggro = () => {
      // @ts-ignore
      if (generatePath(this.cords, player.cords, this.canFly, true) <= this.aggroRange) return true;
      return false;
    };
  }
}

var fallenEnemies: Array<any> = [];

var greySlime = new Enemy(enemies.greySlime);