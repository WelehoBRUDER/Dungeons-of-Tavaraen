const originalPos = {
  x: 0,
  y: 0,
};
let dragging = false;

let heldDownTimer: any = null;

function calcElementArea(element: HTMLElement) {
  let width = element.getBoundingClientRect().width;
  let height = element.getBoundingClientRect().height;
  let posX = element.getBoundingClientRect().x;
  let posY = element.getBoundingClientRect().y;
  return { xMin: posX, yMin: posY, xMax: posX + width, yMax: posY + height };
}

function dragElem(elem: HTMLElement, snapContainers: Array<any>, updateFunction: Function = null) {
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  elem.onmousedown = (e: MouseEvent) => {
    clearTimeout(heldDownTimer);
    heldDownTimer = setTimeout(() => dragMouseDown(e), 200);
  };
  elem.onmouseup = (e: any) => {
    clearTimeout(heldDownTimer);
  };

  function dragMouseDown(e: MouseEvent) {
    e = e || (window.event as MouseEvent);
    e.preventDefault();
    pos1 = elem.offsetLeft;
    pos2 = elem.offsetTop;
    pos3 = e.x;
    pos4 = e.y;
    elem.style.position = "absolute";
    elem.style.boxShadow = "inset 0 0 8px 4px gold, 0 0 8px 6px gold";
    elem.style.zIndex = "99";
    hideHover();
    document.onmouseup = closeDragelem;
    document.onmousemove = (e) => elemDrag(e);
  }

  function elemDrag(e: MouseEvent) {
    dragging = true;
    e = e || (window.event as MouseEvent);
    e.preventDefault();
    elem.style.left = `${pos1 + e.x - pos3}px`;
    elem.style.top = `${pos2 + e.y - pos4}px`;
  }

  function closeDragelem(e: MouseEvent) {
    document.onmouseup = null;
    document.onmousemove = null;
    let snapped = false;
    for (const container of snapContainers) {
      Array.from(container.childNodes).some((_area: any, index: number) => {
        let area = calcElementArea(_area);
        if (e.x >= area.xMin && e.x <= area.xMax && e.y >= area.yMin && e.y <= area.yMax) {
          if (elem.classList.contains("ability")) {
            swapAbility(+elem.classList[1], index);
          }
          snapped = true;
          elem.style.position = "absolute";
          elem.style.boxShadow = "";
          resetElemPosition(updateFunction);
          return true;
        }
      });
    }
    if (!snapped) {
      elem.style.left = originalPos.x + "px";
      elem.style.top = originalPos.y + "px";
      elem.style.zIndex = "inherit";
      elem.style.boxShadow = "";
      elem.style.position = "absolute";
      resetElemPosition(updateFunction);
    }
  }
}

function resetElemPosition(updateFunction: Function = null) {
  if (updateFunction) updateFunction();
  hideHover();
}
