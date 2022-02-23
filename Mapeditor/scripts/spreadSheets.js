function lisaaSpreadSheet(graafiBoxi, taulu, riviNumero, click) {
  const graafiAvain = graafiBoxi.classList.value;
  const tauluBox = graafiBoxi;
  if (!tauluBox) return console.error("tauluBox not defined");

  if (!lisaaSpreadSheet.spreadSheetTree)
    lisaaSpreadSheet.spreadSheetTree = new Map();
  if (!lisaaSpreadSheet.lisaaSpreadSheet?.get(graafiAvain)) {
    // if(graafiBoxi.querySelector(".nappiBox").querySelector("label.container2")) {
    //   window.addEventListener("resize", resize);
    //   graafiBoxi.querySelector(".nappiBox").querySelector("label.container2").addEventListener("change", resize)
    // }
  }
  lisaaSpreadSheet.spreadSheetTree.set(graafiAvain, { taulu, riviNumero });

  luoTauluElementti(taulu);

  function luoTauluElementti(spreadSheetTaulu) {
    tauluBox.innerHTML = "";
    const table = document.createElement("table");
    const tbody = document.createElement("tbody");

    spreadSheetTaulu.forEach((rivi, index) => {
      const tr = document.createElement("tr");
      if (riviNumero) {
        const num = document.createElement(index == 0 ? "th" : "td");
        num.classList.add("riviNumero");
        num.textContent = index || "";
        if (index == 0) num.onclick = () => selectElementContents(tauluBox);
        tr.appendChild(num);
      }

      if (index == 0) {
        // Otsikko
        rivi.forEach(({ nimi: data, jarjestys, lajittelu }, i) => {
          const solu = document.createElement("th");
          solu.textContent = data;
          if (jarjestys) solu.classList.add(jarjestys);
          if (lajittelu !== false) solu.onclick = () => lajittele(i, jarjestys);
          else solu.classList.add("alaLajittele");
          tr.appendChild(solu);
        });
      } else {
        // Keho
        if (click == "tile") {
          tr.onclick = (e) => selectTile(rivi.data[0]);
        } else if (click == "clutter") {
          tr.onclick = (e) => selectClutter(rivi.data[0]);
        } else if (click == "enemy") {
          tr.onclick = (e) => selectEnemy(rivi.data[0]);
        } else if (click == "chest") {
          tr.onclick = (e) => selectChest(rivi.data[0]);
        }
        rivi.data.forEach((data) => {
          const solu = document.createElement("td");
          const a = document.createElement("a");
          a.textContent = data.text || data;
          if (data.linkki) a.href = data.linkki;
          if (data.img) {
            let img = document.createElement("img");
            img.src = data.img;
            a.appendChild(img);
          }
          solu.appendChild(a);
          tr.appendChild(solu);
        });
      }
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    tauluBox.appendChild(table);
  }

  function lajittele(sarakeNum, jarjestys) {
    if (jarjestys == "ba")
      return luoTauluElementti(
        lisaaSpreadSheet.spreadSheetTree.get(graafiAvain).taulu
      );

    const taulu = JSON.parse(
      JSON.stringify(lisaaSpreadSheet.spreadSheetTree.get(graafiAvain).taulu)
    );
    const otsikko = taulu[0].slice();
    let pohja = taulu.slice(1);

    if (!jarjestys) {
      otsikko[sarakeNum].jarjestys = "ab";
    } else if (jarjestys == "ab") {
      otsikko[sarakeNum].jarjestys = "ba";
    }

    pohja.sort((value1, value2) => {
      let vertaileA = value1.data[sarakeNum].text || value1.data[sarakeNum];
      let vertaileB = value2.data[sarakeNum].text || value2.data[sarakeNum];

      if (value1["skip"] == true && !value2["skip"]) return 1;
      else if (!value1["skip"] && value2["skip"] == true) return -1;
      else if (value1["skip"] == true && value2["skip"] == true) return 0;

      if (otsikko[sarakeNum].tyyli == "string") {
        vertaileA = vertaileA.toUpperCase();
        vertaileB = vertaileB.toUpperCase();
      } else if (otsikko[sarakeNum].tyyli == "date") {
        vertaileA = lisaaPaivia(vertaileA);
        vertaileB = lisaaPaivia(vertaileB);
      }

      if (vertaileA < vertaileB) {
        if (jarjestys == "ab") return -1;
        else return 1;
      }
      if (vertaileA > vertaileB) {
        if (jarjestys == "ab") return 1;
        else return -1;
      }
      return 0;
    });

    return luoTauluElementti([otsikko, ...pohja]);
  }

  resize();
  function resize() {
    if (!graafiBoxi.classList.contains("tauluTila")) return;
    if (document.body.classList.contains("tulostus")) return;

    const table = tauluBox.querySelector("table");
    const leveys =
      tauluBox.getBoundingClientRect().width <
      table.getBoundingClientRect().width;
    let korkeus = table.getBoundingClientRect().height;

    if (leveys) korkeus += 17;
    graafiBoxi.style.setProperty("--korkeus", korkeus + "px");
  }
}

function selectElementContents(el) {
  var body = document.body,
    range,
    sel;
  if (document.createRange && window.getSelection) {
    range = document.createRange();
    sel = window.getSelection();
    sel.removeAllRanges();
    try {
      range.selectNodeContents(el);
      sel.addRange(range);
    } catch (e) {
      range.selectNode(el);
      sel.addRange(range);
    }
  } else if (body.createTextRange) {
    range = body.createTextRange();
    range.moveToElementText(el);
    range.select();
    document.execCommand("copy");
  }
}

function naytaTaulu(elem) {
  let kohde = elem.parentNode;
  for (let i = 0; i < 10; i++) {
    kohde = kohde.parentNode;
    if (kohde.classList.contains("box")) break;
    else if (kohde.classList.contains("container")) return false;
  }
  kohde.classList.toggle("tauluTila");
}

function naytaIsoTaulu(e) {
  let kohde = e.parentNode;
  for (let i = 0; i < 10; i++) {
    kohde = kohde.parentNode;
    if (kohde.classList.contains("box")) break;
    else if (kohde.classList.contains("container")) return false;
  }
  kohde.classList.add("tauluTila2");
  document.body.classList.add("isoTaulu");
}
