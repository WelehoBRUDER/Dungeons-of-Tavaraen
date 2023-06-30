"use strict";
//@ts-nocheck
function textSyntax(syn = "") {
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
                }
                selectedSpan.style.color = runVariableTest(color);
                index = line.indexOf("<c>", index + 1);
                if (index == -1)
                    return console.error(`"<c>" has no closing!`);
            }
            else if (currentLine.startsWith("<f>")) {
                const [, fontSize, text = ""] = currentLine.split("<f>");
                [lineText] = text.split("<");
                if (selectedSpan.style.fontSize) {
                    selectedSpan.append(nspan);
                    selectedSpan = nspan;
                }
                selectedSpan.style.fontSize = runVariableTest(fontSize);
                index = line.indexOf("<f>", index + 1);
                if (index == -1)
                    return console.error(`"<f>" has no closing!`);
            }
            else if (currentLine.startsWith("<b>")) {
                const [, fontWeight, text = ""] = currentLine.split("<b>");
                [lineText] = text.split("<");
                if (selectedSpan.style.fontWeight) {
                    selectedSpan.append(nspan);
                    selectedSpan = nspan;
                }
                selectedSpan.style.fontWeight = runVariableTest(fontWeight);
                index = line.indexOf("<b>", index + 1);
                if (index == -1)
                    return console.error(`"<b>" has no closing!`);
            }
            else if (currentLine.startsWith("<cl>")) {
                const [, classList, text = ""] = currentLine.split("<cl>");
                [lineText] = text.split("<");
                if (selectedSpan.classList.value) {
                    selectedSpan.append(nspan);
                    selectedSpan = nspan;
                }
                selectedSpan.classList = runVariableTest(classList);
                index = line.indexOf("<cl>", index + 1);
                if (index == -1)
                    return console.error(`"<cl>" has no closing!`);
            }
            else if (currentLine.startsWith("<ff>")) {
                const [, fontFamily, text = ""] = currentLine.split("<ff>");
                [lineText] = text.split("<");
                if (selectedSpan.style.fontFamily) {
                    selectedSpan.append(nspan);
                    selectedSpan = nspan;
                }
                selectedSpan.style.fontFamily = runVariableTest(fontFamily);
                index = line.indexOf("<ff>", index + 1);
                if (index == -1)
                    return console.error(`"<ff>" has no closing!`);
            }
            else if (currentLine.startsWith("<css>")) {
                const [, rawCss, text = ""] = currentLine.split("<css>");
                [lineText] = text.split("<");
                if (line.indexOf("<css>") !== index) {
                    selectedSpan.append(nspan);
                    selectedSpan = nspan;
                }
                selectedSpan.style.cssText += runVariableTest(rawCss);
                index = line.indexOf("<css>", index + 1);
                if (index == -1)
                    return console.error(`"<css>" has no closing!`);
            }
            else if (currentLine.startsWith("<bcss>")) {
                const [, rawCss, text = ""] = currentLine.split("<bcss>");
                [lineText] = text.split("<");
                selectedContainer.style.cssText += runVariableTest(rawCss);
                index = line.indexOf("<bcss>", index + 1);
                if (index == -1)
                    return console.error(`"<bcss>" has no closing!`);
            }
            else if (currentLine.startsWith("<v>")) {
                const [, variable, text = ""] = currentLine.split("<v>");
                [lineText] = text.split("<");
                try {
                    lineText = eval(variable) ?? "" + lineText;
                }
                catch {
                    return console.error(`"${variable}" is not defined`);
                }
                index = line.indexOf("<v>", index + 1);
                if (index == -1)
                    return console.error(`"<v>" has no closing!`);
            }
            else if (currentLine.startsWith("<i>")) {
                const [, source, text = ""] = currentLine.split("<i>");
                const img = document.createElement("img");
                const className = source.indexOf("[") != -1 ? source.split("[")[1].split("]")[0] : "";
                img.src = runVariableTest(source.replace("[" + className + "]", ""));
                [lineText] = text.split("<");
                selectedSpan.append(img);
                img.classList = className;
                index = line.indexOf("<i>", index + 1);
                if (index == -1)
                    return console.error(`"<i>" has no closing!`);
            }
            else if (currentLine.startsWith("<ct>")) {
                const [, className, text = ""] = currentLine.split("<ct>", 3);
                const container = document.createElement("div");
                if (className.length)
                    container.classList = runVariableTest(className);
                [lineText] = text.split("<", 1);
                selectedContainer.append(container);
                selectedContainer = container;
                if (selectedSpan.outerHTML !== "<span></span>") {
                    selectedContainer.append(nspan);
                    selectedSpan = nspan;
                }
                else
                    selectedContainer.append(selectedSpan);
                index = line.indexOf("<ct>", index + 1);
                if (index == -1)
                    return console.error(`"<ct>" has no closing!`);
            }
            else if (currentLine.startsWith("<nct>")) {
                const [, className, text = ""] = currentLine.split("<nct>", 3);
                const container = document.createElement("div");
                if (className.length)
                    container.classList = runVariableTest(className);
                [lineText] = text.split("<", 1);
                pre.append(container);
                selectedContainer = container;
                if (selectedSpan.outerHTML !== "<span></span>") {
                    selectedContainer.append(nspan);
                    selectedSpan = nspan;
                }
                else
                    selectedContainer.append(selectedSpan);
                index = line.indexOf("<nct>", index + 1);
                if (index == -1)
                    return console.error(`"<nct>" has no closing!`);
            }
            selectedSpan.innerHTML += lineText;
            index = line.indexOf("<", index + 1);
        } while (index !== -1);
    }
    return pre;
    function runVariableTest(data) {
        if (data.indexOf("<v>") == -1)
            return data;
        let index = 0;
        let finalText = "";
        while (index !== -1) {
            const currentLine = data.substring(index);
            let [lineText] = currentLine.split("<");
            if (currentLine.startsWith("<v>")) {
                const [, variable, text = ""] = currentLine.split("<v>");
                [lineText] = text.split("<");
                try {
                    lineText = eval(variable) ?? "" + lineText;
                }
                catch {
                    return console.error(`"${variable}" is not defined`);
                }
                index = data.indexOf("<v>", index + 1);
                if (index == -1)
                    return console.error(`"<v>" has no closing!`);
            }
            finalText += lineText;
            index = data.indexOf("<", index + 1);
        }
        return finalText;
    }
}
const properties = {
    mana_costV: {
        lowerIsBetter: true,
    },
    mana_costP: {
        lowerIsBetter: true,
    },
    critRateV: {
        addPercentageSuffix: true,
    },
    critPowerV: {
        addPercentageSuffix: true,
    },
    powerV: {
        addPercentageSuffix: true,
        multiplyBy: 100,
    },
    penetrationV: {
        addPercentageSuffix: true,
        multiplyBy: 100,
    },
    cooldownP: {
        lowerIsBetter: true,
    },
    cooldownV: {
        lowerIsBetter: true,
    },
    atkPV: {
        addPercentageSuffix: true,
    },
    strPV: {
        addPercentageSuffix: true,
    },
    agiPV: {
        addPercentageSuffix: true,
    },
    vitPV: {
        addPercentageSuffix: true,
    },
    intPV: {
        addPercentageSuffix: true,
    },
    spiPV: {
        addPercentageSuffix: true,
    },
    damagePercentV: {
        addPercentageSuffix: true,
        multiplyBy: 100,
    },
    healingPercentV: {
        addPercentageSuffix: true,
        multiplyBy: 100,
    },
    durationV: {
        addSuffix: "s",
    },
};
function getProperties(key) {
    const props = {
        addPercentageSuffix: false,
        lowerIsBetter: false,
        addSuffix: null,
        multiplyBy: 1,
    };
    if (properties[key]) {
        if (properties[key].addPercentageSuffix) {
            props.addPercentageSuffix = true;
        }
        if (properties[key].lowerIsBetter) {
            props.lowerIsBetter = true;
        }
        if (properties[key].multiplyBy) {
            props.multiplyBy = properties[key].multiplyBy;
        }
        if (properties[key].addSuffix) {
            props.addSuffix = properties[key].addSuffix;
        }
    }
    return props;
}
function effectSyntax(effect, embed = false) {
    // Syntax when value is an ability object
    let key = effect[0];
    let value = effect[1];
    const fs = embed ? "14px" : "16px";
    if (key.startsWith("ability_")) {
        let text = "";
        const id = key.split("ability_")[1];
        const ability = new Ability(abilities[id], player);
        const name = lang[ability.id + "_name"] || ability.id;
        text += `<i>${ability.icon}<i><c>goldenrod<c>${name} modified:<c>white<c>\n`;
        Object.entries(value).forEach(([_key, _value]) => {
            text += ` <f>${fs}<f>${effectSyntax([_key, _value], embed)}`;
        });
        return text + "\n";
    }
    // Syntax when value is an effect object
    else if (key.startsWith("effect_")) {
        let text = "";
        const id = key.split("effect_")[1];
        const effect = new statEffect(statusEffects[id]);
        const name = lang["effect_" + effect.id + "_name"] || effect.id;
        text += `<i>${effect.icon}<i><c>goldenrod<c>${name} effect modified:<c>white<c>\n`;
        Object.entries(value).forEach(([_key, _value]) => {
            text += ` <f>${fs}<f>${effectSyntax([_key, _value], embed)}`;
        });
        return text;
    }
    // Simple syntax when value is a number
    else if (typeof value === "number") {
        const props = getProperties(key);
        const valueType = key.substring(key.length - 1);
        const prefix = value >= 0 ? "+" : "";
        const suffix = valueType === "P" || props.addPercentageSuffix ? "%" : props.addSuffix ? props.addSuffix : "";
        const color = props.lowerIsBetter ? (value < 0 ? "lime" : "red") : value > 0 ? "lime" : "red";
        value *= props.multiplyBy;
        key = key.substring(0, key.length - 1);
        const name = lang[key] || key;
        const id = key.substring(0, key.length - 1);
        const icon = icons[key] ? icons[key] : icons[id] ? icons[id] : icons["fallback"];
        return `<i>${icon}<i><f>${fs}<f><c>white<c>${name}: <c>${color}<c>${prefix}${value.toFixed(2)}${suffix}\n`;
    }
    else if (typeof value === "object") {
        let text = "";
        Object.entries(value).forEach(([_key, _value]) => {
            text += ` <f>${fs}<f>${effectSyntax([_key, _value], embed)}`;
        });
        return text;
    }
}
// Syntax for effects
// function effectSyntax(effect: any, embed: boolean = false, effectId: string = "") {
//   let text: string = "";
//   const rawKey = effect[0];
//   let value = effect[1];
//   let flipColor = false;
//   let key: string = rawKey.substring(0, rawKey.length - 1);
//   let key_: string = key;
//   let tailEnd: string = "";
//   let lastBit: string = "";
//   const _key: string = key;
//   let frontImg: string = "";
//   let backImg: string = "";
//   if (key.includes("Resist")) {
//     key = key.replace("Resist", "");
//     key_ = key;
//     tailEnd = lang["resist"];
//   } else if (key.includes("Def") && !key.includes("status_effect") && !key.includes("Defense")) {
//     key = key.replace("Def", "");
//     key_ = key;
//   } else if (key.includes("Damage") && !key.includes("crit")) {
//     key = key.replace("Damage", "");
//     key_ = key;
//     tailEnd = lang["damage"];
//   } else if (key_.startsWith("ability_")) {
//     let text: string = "";
//     const id = key_.split("ability_")[1];
//     console.log(id, key_);
//     const ability = new Ability(abilities[id]);
//     const name = game.getLocalizedString(ability.id);
//     text += `<i>${ability.icon}<i><c>goldenrod<c>${name} modified:\n`;
//     Object.entries(value).forEach(([_key, _value]) => {
//       text += " " + effectSyntax(_key, _value);
//     });
//     return text + "\n";
//   } else if (key_.startsWith("effect_")) {
//     let text: string = "";
//     const id = key_.split("effect_")[1];
//     const effect = new Effect(effects[id]);
//     const name = game.getLocalizedString(effect.id);
//     text += `<i>${effect.icon}<i><c>goldenrod<c>${name} effect modified:\n`;
//     Object.entries(value).forEach(([_key, _value]) => {
//       text += " " + effectSyntax(_key, _value);
//     });
//     return text;
//   } else if (key.includes("status_effect")) {
//     key_ = key.replace("status_effect_", "");
//     let id = key_;
//     let _d: string = "";
//     const mod_array = possible_modifiers.concat(possible_stat_modifiers);
//     mod_array.forEach((modi: string) => {
//       if (id.includes(modi)) {
//         id = id.replace("_" + modi, "");
//         if (modi[modi.length - 1] == "P" || modi[modi.length - 1] == "V") key_ = modi.substring(0, modi.length - 1);
//         else key_ = modi;
//         _d = modi;
//       }
//     });
//     let statusId = "";
//     Object.keys(statusEffects).forEach((keyStr: string) => {
//       if (id.endsWith(keyStr)) {
//         statusId = keyStr;
//         id = id.replace("_" + keyStr, "");
//       }
//     });
//     key = id + "_name";
//     let _value = 0;
//     if (player.statusEffects.find((eff: any) => eff.id == effectId)) _value = value;
//     frontImg = abilities[id]?.icon ?? icons.damage;
//     if (value < 0) backImg = `<i>${icons[key_ ]}<i>§<c>${flipColor ? "lime" : "red"}<c><f>${embed ? "15px" : "18px"}<f>`;
//     else backImg = `<i>${icons[key_ ]}<i>§<c>${flipColor ? "red" : "lime"}<c><f>${embed ? "15px" : "18px"}<f>`;
//     let _abi: ability;
//     try {
//       _abi = new Ability(
//         player.abilities?.find((__abi: ability) => __abi.id == id),
//         player
//       );
//     } catch (err) {
//       if (DEVTOOLS.ENABLED) displayText(`<c>red<c>${err} at line syntax:220`);
//     }
//     if (!_abi) _abi = new Ability(abilities[id], dummy);
//     let status: statusEffect = new statEffect(statusEffects[statusId], _abi.statusModifiers);
//     if (_d.includes("attack_damage_multiplier")) {
//       tailEnd = lang["attack_name"];
//     } else tailEnd = lang[_d] + " status";
//     if (tailEnd.includes("undefined")) tailEnd = _d + " status";
//     lastBit = `[${status?.effects[_d] - _value || status?.[_d]?.["total"] - _value || status?.[_d] - _value || 0}${
//       _d.endsWith("P") ? "%" : ""
//     }-->${(status?.effects[_d] - _value || status?.[_d]?.["total"] - _value || status?.[_d] - _value || 0) + value}${
//       _d.endsWith("P") ? "%" : ""
//     }]`;
//   } else if (keyIncludesAbility(key)) {
//     key_ = keyIncludesAbility(key);
//     let id = key.replace("_" + key_, "");
//     frontImg = abilities[id]?.icon ?? icons.damage;
//     key = id + "_name";
//     flipColor = less_is_better[key_];
//     if (key !== "attack_name") {
//       if (value < 0) backImg = `<i>${icons[key_ ]}<i>§<c>${flipColor ? "lime" : "red"}<c><f>${embed ? "15px" : "18px"}<f>`;
//       else backImg = `<i>${icons[key_ ]}<i>§<c>${flipColor ? "red" : "lime"}<c><f>${embed ? "15px" : "18px"}<f>`;
//       tailEnd = lang[key_];
//       if (!tailEnd) tailEnd = key_;
//       else if (tailEnd.includes("undefined")) tailEnd = key_;
//     }
//   }
//   if (key.includes("against_type")) {
//     key_ = key.replace("against_type", "");
//     let id1 = key_.split("_")[0];
//     let id2 = key_.split("_")[2];
//     frontImg = icons[id1];
//     key = lang[id1];
//     tailEnd = lang[`plural_type_${id2}`];
//     if (lang.changeWordOrder) tailEnd += lang["against_type_syntax"];
//     else key += lang["against_type_syntax"];
//     backImg = `<i>${icons[id2 + "_type_icon"]}<i>`;
//   } else if (key.includes("against_race")) {
//     key_ = key.replace("against_race", "");
//     let id1 = key_.split("_")[0];
//     let id2 = key_.split("_")[2];
//     frontImg = icons[id1];
//     key = lang[id1];
//     tailEnd = lang[`plural_race_${id2}`];
//     if (lang.changeWordOrder) tailEnd += lang["against_race_syntax"];
//     else key += lang["against_race_syntax"];
//     backImg = `<i>${icons[id2 + "_race_icon"]}<i>`;
//   }
//   if (tailEnd == lang["resist"]) key = lang[key + "_def"];
//   else if (lang[key]) key = lang[key];
//   let img = icons[_key ];
//   tailEnd = tailEnd.trim() + " ";
//   if (tailEnd.length < 2) tailEnd = "";
//   if (!img) img = icons[key_ + tailEnd ];
//   if (!img) img = icons[key_ ];
//   if (value < 0) {
//     text += `§${embed ? " " : ""}<c>${flipColor ? "lime" : "red"}<c><f>${embed ? "15px" : "18px"}<f>${lang["decreases"]}  <i>${
//       frontImg === "" ? img : frontImg
//     }<i>${key} ${backImg ? backImg : ""}${tailEnd}${lang["by"]}${
//       rawKey.endsWith("P") ? value.toFixed(1) + "%" : value.toFixed(1)
//     } ${lastBit}\n`;
//   } else
//     text += `§${embed ? " " : ""}<c>${flipColor ? "red" : "lime"}<c><f>${embed ? "15px" : "18px"}<f>${lang["increases"]} <i>${
//       frontImg === "" ? img : frontImg
//     }<i>${key} ${backImg ? backImg : ""}${tailEnd}${lang["by"]}+${
//       rawKey.endsWith("P") ? value.toFixed(1) + "%" : value.toFixed(1)
//     } ${lastBit}\n`;
//   return text;
// }
document.querySelector(".loading").style.display = "flex";
document.querySelector(".loading-text").textContent = "Loading...";
//# sourceMappingURL=syntax.js.map