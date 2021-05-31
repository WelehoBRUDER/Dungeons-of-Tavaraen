interface enemy extends characterObject {
  sprite: string,
  aggroRange: number,
  attackRange: number,
  isFoe?: boolean,
  xp: number,
  damages: damageClass;
  alive: boolean;
  canFly: boolean,
  firesProjectile?: string;
  decideAction?: Function,
  aggro?: Function;
  spawnCords?: tileObject;
  spawnMap?: number;
  loot: Array<any>;
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
  spawnCords?: tileObject;
  spawnMap?: number;
  loot: Array<any>;
  constructor(base: enemy) {
    super(base);
    this.sprite = base.sprite;
    this.aggroRange = base.aggroRange ?? 5;
    this.attackRange = base.attackRange ?? 1;
    this.xp = base.xp;
    this.damages = base.damages;
    this.isFoe = true;
    this.firesProjectile = base.firesProjectile;
    this.canFly = base.canFly ?? false;
    this.alive = base.alive ?? true;
    this.spawnCords = base.spawnCords;
    this.spawnMap = base.spawnMap;
    this.loot = base.loot;

    this.decideAction = async () => {
      // Will make enemy take their turn
      // For now just move towards player
      // @ts-ignore
      if (generatePath(this.cords, player.cords, this.canFly, true) <= this.attackRange) {
        // regular attack for now
        // @ts-ignore
        attackTarget(this, player, weaponReach(this, this.attackRange, player));
        // @ts-ignore
        regularAttack(this, player, this.abilities[0]);
      }
      else {
        var path: any = generatePath(this.cords, player.cords, this.canFly);
        try {
          this.cords.x = path[0].x;
          this.cords.y = path[0].y;
          if(settings.log_enemy_movement) displayText(`<c>crimson<c>[ENEMY] <c>yellow<c>${this.name} <c>white<c>moves to [${this.cords.x}, ${this.cords.y}]`);
        }
        catch { console.warn("Enemy pathfinding can't find correct path!"); }
      }
      setTimeout(modifyCanvas, 200);
    };

    this.kill = () => {
      player.level.xp += this.xp;
      this.spawnMap = currentMap;
      const index: number = maps[currentMap].enemies.findIndex(e => e.cords == this.cords);
      displayText(`<c>white<c>[WORLD] <c>yellow<c>${this.name}<c>white<c> dies.`);
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