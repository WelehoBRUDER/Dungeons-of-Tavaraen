"use strict";
// THIS FUNCTION IS A MESS AND A HALF, BUT ATLEAST IT WORKS (MOSTLY) //
async function animateTitle(e, title) {
    var _a, _b, _c, _d;
    // all this shit defines some dumb logic
    let extraParts = 0; // make the parent bigger
    let extraHeight = 0; // still making the parent bigger
    let alsoChangeParent = false; // does the parent element change its height
    let subList = null; // whether or not the title has a <ul> element in it
    // @ts-expect-error
    if (!((_b = (_a = e === null || e === void 0 ? void 0 : e.target) === null || _a === void 0 ? void 0 : _a.classList) === null || _b === void 0 ? void 0 : _b.contains("title"))) { // you didn't click a title
        clickListEntry(e.target);
        return;
    }
    // @ts-expect-error
    else if ((_d = (_c = e === null || e === void 0 ? void 0 : e.target) === null || _c === void 0 ? void 0 : _c.classList) === null || _d === void 0 ? void 0 : _d.contains("subCategory")) { // this shit is dumb but works
        title = e.target;
    }
    let subHeight = 0;
    // Now we know we're dealing with the highest element already.
    if (title.parentElement.classList.contains("content")) {
        let maximumHeight = title.getBoundingClientRect().height;
    }
    // This time we're dealing with a sublist.
    else if (title.parentElement.classList.contains("title")) {
        subList = title.childNodes[1];
        subHeight += title.getBoundingClientRect().height;
    }
    let childrenToRead = title.childNodes; // Where to find the crap we want to display
    if (subList)
        childrenToRead = subList.childNodes; // Oh look, this was a sub category so the kids are in a <ul>
    let transitionTime = 1; // animation lasts 1 second
    let transitionDelay = 0; // applies delay to animatable objects so no async needed, more responsive
    const defaultHeight = 30 * settings.ui_scale / 100;
    if (title.classList.contains("isOpen")) { // this section handles the closing animation.
        title.style.height = `${defaultHeight}px`;
        title.style.transition = `all ${transitionTime}s, text-shadow 1ms 1ms, background 1ms 1ms`;
        for (let listObject of childrenToRead) {
            if (listObject === null || listObject === void 0 ? void 0 : listObject.style) {
                transitionDelay += transitionTime / childrenToRead.length * 750;
                listObject.style.transition = `all ${transitionTime / childrenToRead.length * 4}s ${transitionDelay}ms, text-shadow 1ms 1ms, background 1ms 1ms`;
                listObject.style.transform = "scale(0)";
            }
        }
    }
    else { // this section handles the opening section
        title.style.transition = `all ${transitionTime}s 0ms, text-shadow: 1ms 1ms, background 1ms 1ms`;
        if (!title.classList.contains("subCategory")) { // We know it's the original title
            let test = 0;
            title.childNodes.forEach((child) => {
                if (!(child === null || child === void 0 ? void 0 : child.style))
                    return;
                let height = +child.style.height.substring(0, child.style.height.length - 2);
                if (height < 1)
                    test += defaultHeight;
                else
                    test += height;
            });
            title.style.height = `${test + defaultHeight}px`;
        }
        // This is a sublist
        else {
            let test = 0;
            let parent = title.parentElement;
            parent.childNodes.forEach((child) => {
                if (!(child === null || child === void 0 ? void 0 : child.style))
                    return;
                if (child.getBoundingClientRect().height < 1)
                    test += defaultHeight;
                else
                    test += child.getBoundingClientRect().height;
            });
            let test2 = 0;
            title.childNodes[1].childNodes.forEach((subItem) => {
                if (!(subItem === null || subItem === void 0 ? void 0 : subItem.style))
                    return;
                if (subItem.getBoundingClientRect().height < 1)
                    test2 += defaultHeight;
                else
                    test2 += subItem.getBoundingClientRect().height;
            });
            // @ts-ignore
            title.childNodes[1].style.height = `${test2}px`;
            title.style.height = `${test2 + defaultHeight}px`;
            parent.style.height = `${test + test2 + defaultHeight}px`;
        }
        /* THIS SHIT DOESN'T WORK!!!! */
        /* IT WON'T RUN ON FIRST TRY NO MATTER WHAT! */
        for (let listObject of childrenToRead) {
            if (listObject === null || listObject === void 0 ? void 0 : listObject.style) {
                transitionDelay += transitionTime / childrenToRead.length * 750;
                listObject.style.transition = `all ${transitionTime / childrenToRead.length * 4}s ${transitionDelay}ms, text-shadow 1ms 1ms, background 1ms 1ms`;
                listObject.style.transform = "scale(1)";
            }
        }
    }
    title.classList.toggle("isOpen");
}
//# sourceMappingURL=animation.js.map