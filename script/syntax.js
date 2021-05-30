function textSyntax(syn = "") {
  const pre = document.createElement("pre");
  const lines = syn.split("§");

  for(const line of lines) {
    const span = document.createElement("span");
    pre.append(span);
    let selectedSpan = span;
    let index = 0;

    do {
      const currentLine = line.substring(index);
      const nspan = document.createElement("span");
      let [lineText] = currentLine.split("<");
      
      if(currentLine.startsWith("<c>")) {
        const [,color, text=""] = currentLine.split("<c>");
        [lineText] = text.split("<");
        if(line.indexOf("<c>") !== index) {
          selectedSpan.append(nspan);
          selectedSpan = nspan;
        } selectedSpan.style.color = runVariableTest(color);
        index = line.indexOf("<c>", index + 1);
        if(index == -1) return console.error(`"<c>" has no closing!`);
      } else if(currentLine.startsWith("<f>")) {
        const [,fontSize, text=""] = currentLine.split("<f>");
        [lineText] = text.split("<");
        if(line.indexOf("<f>") !== index) {
          selectedSpan.append(nspan);
          selectedSpan = nspan;
        } selectedSpan.style.fontSize = runVariableTest(fontSize);
        index = line.indexOf("<f>", index + 1);
        if(index == -1) return console.error(`"<f>" has no closing!`);
      } else if(currentLine.startsWith("<b>")) {
        const [,fontWeight, text=""] = currentLine.split("<b>");
        [lineText] = text.split("<");
        if(line.indexOf("<b>") !== index) {
          selectedSpan.append(nspan);
          selectedSpan = nspan;
        } selectedSpan.style.fontWeight = runVariableTest(fontWeight);
        index = line.indexOf("<b>", index + 1);
        if(index == -1) return console.error(`"<b>" has no closing!`);
      } else if(currentLine.startsWith("<cl>")) {
        const [,classList, text=""] = currentLine.split("<cl>");
        [lineText] = text.split("<");
        if(line.indexOf("<cl>") !== index) {
          selectedSpan.append(nspan);
          selectedSpan = nspan;
        } selectedSpan.classList = runVariableTest(classList);
        index = line.indexOf("<cl>", index + 1);
        if(index == -1) return console.error(`"<cl>" has no closing!`);
      } else if(currentLine.startsWith("<ff>")) {
        const [,fontFamily, text=""] = currentLine.split("<ff>");
        [lineText] = text.split("<");
        if(line.indexOf("<ff>") !== index) {
          selectedSpan.append(nspan);
          selectedSpan = nspan;
        } selectedSpan.style.fontFamily = runVariableTest(fontFamily);
        index = line.indexOf("<ff>", index + 1);
        if(index == -1) return console.error(`"<ff>" has no closing!`);
      } else if(currentLine.startsWith("<css>")) {
        const [,rawCss, text=""] = currentLine.split("<css>");
        [lineText] = text.split("<");
        if(line.indexOf("<css>") !== index) {
          selectedSpan.append(nspan);
          selectedSpan = nspan;
        } selectedSpan.style.cssText += runVariableTest(rawCss);
        index = line.indexOf("<css>", index + 1);
        if(index == -1) return console.error(`"<css>" has no closing!`);
      } else if(currentLine.startsWith("<bcss>")) {
        const [,rawCss, text=""] = currentLine.split("<bcss>");
        [lineText] = text.split("<");
        pre.style.cssText += runVariableTest(rawCss);
        index = line.indexOf("<bcss>", index + 1);
        if(index == -1) return console.error(`"<bcss>" has no closing!`);
      } else if(currentLine.startsWith("<v>")) {
        const [,variable, text=""] = currentLine.split("<v>");
        [lineText] = text.split("<");
        try {lineText = eval(variable) ?? "" + lineText}
        catch {return console.error(`"${variable}" is not defined`)}
        index = line.indexOf("<v>", index + 1);
        if(index == -1) return console.error(`"<v>" has no closing!`);
      } else if(currentLine.startsWith("<i>")) {
        const [,source, text=""] = currentLine.split("<i>");
        const img = document.createElement("img");
        const className = source.indexOf("[") != -1 ? source.split("[")[1].split("]")[0] : "";
        img.src = runVariableTest(source.replace("[" + className + "]", ""));
        [lineText] = text.split("<");
        if(line.indexOf("<i>") !== index) {
          selectedSpan.append(nspan);
          selectedSpan = nspan;
        } selectedSpan.append(img);
        img.classList = className;
        index = line.indexOf("<i>", index + 1);
        if(index == -1) return console.error(`"<i>" has no closing!`);
      } selectedSpan.innerHTML += lineText;
      index = line.indexOf("<", index + 1);
    } while(index !== -1);
  } return pre;

  function runVariableTest(data) {
    if(data.indexOf("<v>") == -1) return data;
    let index = 0;
    let finalText = "";

    while(index !== -1) {
      const currentLine = data.substring(index);
      let [lineText] = currentLine.split("<");
      if(currentLine.startsWith("<v>")) {
        const [,variable, text=""] = currentLine.split("<v>");
        [lineText] = text.split("<");
        try {lineText = eval(variable) ?? "" + lineText}
        catch {return console.error(`"${variable}" is not defined`)}
        index = data.indexOf("<v>", index + 1);
        if(index == -1) return console.error(`"<v>" has no closing!`);
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
// <bcss><bcss> = raw css on base pre element
// <cl><cl> = set classlist on span
// <b><b> = fontweight
// <ff><ff> = font-family
// <i>img src [class name]<i> = add image
// § = new span