var perksData: Array<any> = [];
var perks: Array<any> = [];
var tree = "necromancer"; // replace with player class when added

class perk {
  [id: string]: any;
  name: string;
  desc: string;
  commands?: any;
  effects?: any;
  commandsExecuted?: boolean;
  pos: tileObject;
  relative_to?: any;
  requires: Array<string>;
  icon: string;
  absolutePos: Function;
  available: Function;
  bought: Function;
  constructor(base: perk) {
    this.id = base.id;
    const basePerk = perksArray[tree]["perks"][this.id];
    if(!basePerk) console.error("Perk invalid! Most likely id is wrong!");
    this.name = basePerk.name;
    this.desc = basePerk.desc;
    this.commands = {...basePerk.commands} ?? {};
    this.effects = {...basePerk.effects} ?? {};
    this.commandsExecuted =  base.commandsExecuted ?? false;
    this.pos = basePerk.pos;
    this.relative_to = basePerk.relative_to ?? "";
    this.requires = basePerk.requires ?? [];
    this.icon = basePerk.icon;
    this.absolutePos = () => {
      let cords = {x: this.pos.x, y: this.pos.y};
      if(this.relative_to) {
        let last = perksArray[tree]["perks"][this.relative_to];
        do {
          cords.x += last.pos.x;
          cords.y += last.pos.y;
          last = perksArray[tree]["perks"][last.relative_to];  
        } while (last);
      }
      return cords;
    }
    this.available = () => {
      if(this.requires?.length > 0) {
        let needed = this.requires?.length;
        let cur = 0;
        this.requires?.forEach(req=>{
          perksData.forEach(prk=>{prk.id == req ? cur++: ''}); 
        });
        if(cur >= needed) return true;
      }
      if(this.requires?.length <= 0) return true;
      return false;
    }
    this.bought = () => {
      let isBought = false;
      perksData.forEach(prk=>{
        if(prk.id == this.id) {isBought = true; return;};
      });
      return isBought;
    }
  }
}

function formPerks() {
  perks = [];
  const perkArea = document.querySelector<HTMLDivElement>(".playerImprovement .perkArea");
  const perkCanvas = perkArea.querySelector<HTMLCanvasElement>(".prkcanvas");
  const perkCtx = perkCanvas.getContext("2d");
  const perkSize: number = 128;
  Object.entries(perksArray[tree].perks).forEach((_perk: any)=>{
    perks.push(new perk(_perk[1]));
  });
  if(innerWidth > 2148) {
    perkCanvas.width = 1610;
    perkCanvas.height = 920;
  }
  else {
    perkCanvas.width = 1360;
    perkCanvas.height = 720;
  }
  perks.forEach((_perk: perk)=>{
    const perkImg = new Image();
    perkImg.src = _perk.icon;
    const perkBg = new Image();
    perkBg.addEventListener('load', function(e) {
      perkCtx.drawImage(this, ((_perk.absolutePos().x) * perkSize/2), ((_perk.absolutePos().y) * perkSize/2), perkSize, perkSize);
        //ctx.fill();
    //ctx.stroke();
    }, true);
    perkBg.src = `resources/ui/${tree}_perk.png`;
    setTimeout(()=>perkCtx.drawImage(perkImg, ((_perk.absolutePos().x) * perkSize/2) + 14, ((_perk.absolutePos().y) * perkSize/2) + 14, perkSize - 28, perkSize - 28), 50);
    perkCtx.beginPath();
    perkCtx.lineWidth = 8;
    if(_perk.bought()) perkCtx.strokeStyle = 'gold';
    else perkCtx.strokeStyle = 'purple';
    perkCtx.arc(((_perk.absolutePos().x) * perkSize/2) + perkSize/2, ((_perk.absolutePos().y) * perkSize/2) + perkSize/2, perkSize/2, 0, 2 * Math.PI);
    perkCtx.stroke();
    if(!_perk.available()) {
      setTimeout(()=>{
        const dim = new Image();
        dim.addEventListener('load', function(e) {
          perkCtx.drawImage(this, ((_perk.absolutePos().x) * perkSize/2), ((_perk.absolutePos().y) * perkSize/2), perkSize, perkSize);
            //ctx.fill();
        //ctx.stroke();
        }, true);
        dim.src = `resources/ui/dim_perk.png`;
      }, 55);
    }
    if(_perk.requires) {
      _perk.requires.forEach(req=>{
        const prk = new perk(perksArray[tree]["perks"][req]);
        const start_pos = {x: ((prk.absolutePos().x) * perkSize/2) + perkSize/2, y: ((prk.absolutePos().y) * perkSize/2) + perkSize/2};
        const end_pos = {x: ((_perk.absolutePos().x) * perkSize/2) + perkSize/2, y: ((_perk.absolutePos().y) * perkSize/2) + perkSize/2};
        perkCtx.beginPath();
        perkCtx.lineWidth = 8;
        perkCtx.strokeStyle = "grey";
        perkCtx.moveTo(start_pos.x, start_pos.y);
        perkCtx.lineTo(end_pos.x, end_pos.y);
        perkCtx.stroke();
      })
    }
    
  })
  console.log(perks);
}