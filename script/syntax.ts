//@ts-nocheck
function textSyntax(syn: string = "") {
  const pre = document.createElement("pre");
  const lines = syn.split("§");
  let selectedContainer = pre;

  for (const line of lines) {
    const span = document.createElement("span");
    selectedContainer.append(span);
    let selectedSpan = span;
    let index = 0;

    do {
      const currentLine = line.substring(index);
      const nspan = document.createElement("span");
      let [lineText] = currentLine.split("<");

      if (currentLine.startsWith("<c>")) {
        const [, color, text = ""] = currentLine.split("<c>");
        [lineText] = text.split("<");
        if (selectedSpan.style.color) {
          selectedSpan.append(nspan);
          selectedSpan = nspan;
        } selectedSpan.style.color = runVariableTest(color);
        index = line.indexOf("<c>", index + 1);
        if (index == -1) return console.error(`"<c>" has no closing!`);
      } else if (currentLine.startsWith("<f>")) {
        const [, fontSize, text = ""] = currentLine.split("<f>");
        [lineText] = text.split("<");
        if (selectedSpan.style.fontSize) {
          selectedSpan.append(nspan);
          selectedSpan = nspan;
        } selectedSpan.style.fontSize = runVariableTest(fontSize);
        index = line.indexOf("<f>", index + 1);
        if (index == -1) return console.error(`"<f>" has no closing!`);
      } else if (currentLine.startsWith("<b>")) {
        const [, fontWeight, text = ""] = currentLine.split("<b>");
        [lineText] = text.split("<");
        if (selectedSpan.style.fontWeight) {
          selectedSpan.append(nspan);
          selectedSpan = nspan;
        } selectedSpan.style.fontWeight = runVariableTest(fontWeight);
        index = line.indexOf("<b>", index + 1);
        if (index == -1) return console.error(`"<b>" has no closing!`);
      } else if (currentLine.startsWith("<cl>")) {
        const [, classList, text = ""] = currentLine.split("<cl>");
        [lineText] = text.split("<");
        if (selectedSpan.classList.value) {
          selectedSpan.append(nspan);
          selectedSpan = nspan;
        } selectedSpan.classList = runVariableTest(classList);
        index = line.indexOf("<cl>", index + 1);
        if (index == -1) return console.error(`"<cl>" has no closing!`);
      } else if (currentLine.startsWith("<ff>")) {
        const [, fontFamily, text = ""] = currentLine.split("<ff>");
        [lineText] = text.split("<");
        if (selectedSpan.style.fontFamily) {
          selectedSpan.append(nspan);
          selectedSpan = nspan;
        } selectedSpan.style.fontFamily = runVariableTest(fontFamily);
        index = line.indexOf("<ff>", index + 1);
        if (index == -1) return console.error(`"<ff>" has no closing!`);
      } else if (currentLine.startsWith("<css>")) {
        const [, rawCss, text = ""] = currentLine.split("<css>");
        [lineText] = text.split("<");
        if (line.indexOf("<css>") !== index) {
          selectedSpan.append(nspan);
          selectedSpan = nspan;
        } selectedSpan.style.cssText += runVariableTest(rawCss);
        index = line.indexOf("<css>", index + 1);
        if (index == -1) return console.error(`"<css>" has no closing!`);
      } else if (currentLine.startsWith("<bcss>")) {
        const [, rawCss, text = ""] = currentLine.split("<bcss>");
        [lineText] = text.split("<");
        selectedContainer.style.cssText += runVariableTest(rawCss);
        index = line.indexOf("<bcss>", index + 1);
        if (index == -1) return console.error(`"<bcss>" has no closing!`);
      } else if (currentLine.startsWith("<v>")) {
        const [, variable, text = ""] = currentLine.split("<v>");
        [lineText] = text.split("<");
        try { lineText = eval(variable) ?? "" + lineText; }
        catch { return console.error(`"${variable}" is not defined`); }
        index = line.indexOf("<v>", index + 1);
        if (index == -1) return console.error(`"<v>" has no closing!`);
      } else if (currentLine.startsWith("<i>")) {
        const [, source, text = ""] = currentLine.split("<i>");
        const img = document.createElement("img");
        const className = source.indexOf("[") != -1 ? source.split("[")[1].split("]")[0] : "";
        img.src = runVariableTest(source.replace("[" + className + "]", ""));
        [lineText] = text.split("<");
        selectedSpan.append(img);
        img.classList = className;
        index = line.indexOf("<i>", index + 1);
        if (index == -1) return console.error(`"<i>" has no closing!`);
      } else if (currentLine.startsWith("<ct>")) {
        const [, className, text = ""] = currentLine.split("<ct>", 3);
        const container = document.createElement("div");
        if (className.length) container.classList = runVariableTest(className);
        [lineText] = text.split("<", 1);
        selectedContainer.append(container);
        selectedContainer = container;
        if (selectedSpan.outerHTML !== "<span></span>") {
          selectedContainer.append(nspan);
          selectedSpan = nspan;
        } else selectedContainer.append(selectedSpan);
        index = line.indexOf("<ct>", index + 1);
        if (index == -1) return console.error(`"<ct>" has no closing!`);
      } else if (currentLine.startsWith("<nct>")) {
        const [, className, text = ""] = currentLine.split("<nct>", 3);
        const container = document.createElement("div");
        if (className.length) container.classList = runVariableTest(className);
        [lineText] = text.split("<", 1);
        pre.append(container);
        selectedContainer = container;
        if (selectedSpan.outerHTML !== "<span></span>") {
          selectedContainer.append(nspan);
          selectedSpan = nspan;
        } else selectedContainer.append(selectedSpan);
        index = line.indexOf("<nct>", index + 1);
        if (index == -1) return console.error(`"<nct>" has no closing!`);
      } selectedSpan.innerHTML += lineText;
      index = line.indexOf("<", index + 1);
    } while (index !== -1);
  } return pre as any;

  function runVariableTest(data) {
    if (data.indexOf("<v>") == -1) return data;
    let index = 0;
    let finalText = "";

    while (index !== -1) {
      const currentLine = data.substring(index);
      let [lineText] = currentLine.split("<");
      if (currentLine.startsWith("<v>")) {
        const [, variable, text = ""] = currentLine.split("<v>");
        [lineText] = text.split("<");
        try { lineText = eval(variable) ?? "" + lineText; }
        catch { return console.error(`"${variable}" is not defined`); }
        index = data.indexOf("<v>", index + 1);
        if (index == -1) return console.error(`"<v>" has no closing!`);
      } finalText += lineText;
      index = data.indexOf("<", index + 1);
    } return finalText;
  }
}


// <f><f> = font size
// \n = line break
// <css><css> = raw css
// <c><c> = color
// <v><v> = variable
// <bcss><bcss> = raw css on base pre or container element
// <cl><cl> = set classlist on span
// <b><b> = fontweight
// <ff><ff> = font-family
// <i>img src [class name]<i> = add image
// § = new span
// <ct>class name<ct> = add div container
// <nct>class name<nct> = add new div container