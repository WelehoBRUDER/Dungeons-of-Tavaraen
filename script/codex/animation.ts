// THIS FUNCTION IS A MESS AND A HALF, BUT ATLEAST IT WORKS (MOSTLY) //
async function animateTitle(e: MouseEvent, title: HTMLUListElement) {
  // all this shit defines some dumb logic
  let extraParts: number = 0; // make the parent bigger
  let extraHeight: number = 0; // still making the parent bigger
  let alsoChangeParent: boolean = false; // does the parent element change its height
  let subList = null; // whether or not the title has a <ul> element in it
  // @ts-expect-error
  if (!e?.target?.classList?.contains("title")) { // you didn't click a title
    clickListEntry(e.target as HTMLLIElement);
    return;
  }
  // @ts-expect-error
  else if (e?.target?.classList?.contains("subCategory")) { // this shit is dumb but works
    title = e.target as HTMLUListElement;

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
  let childrenToRead = title.childNodes as any; // Where to find the crap we want to display
  if (subList) childrenToRead = subList.childNodes; // Oh look, this was a sub category so the kids are in a <ul>
  let transitionTime = 1; // animation lasts 1 second
  let transitionDelay = 0; // applies delay to animatable objects so no async needed, more responsive
  const defaultHeight = 30 * settings.ui_scale / 100;
  if (title.classList.contains("isOpen")) { // this section handles the closing animation.
    title.style.height = `${defaultHeight}px`;
    title.style.transition = `all ${transitionTime}s, text-shadow 1ms 1ms, background 1ms 1ms`;
    for (let listObject of childrenToRead as any) {
      if (listObject?.style) {
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
      title.childNodes.forEach((child: any) => {
        if (!child?.style) return;
        let height = +child.style.height.substring(0, child.style.height.length - 2);
        if (height < 1) test += defaultHeight;
        else test += height;
      });
      title.style.height = `${test + defaultHeight}px`;
    }
    // This is a sublist
    else {
      let test = 0;
      let parent = title.parentElement;
      parent.childNodes.forEach((child: any) => {
        if (!child?.style) return;
        if (child.getBoundingClientRect().height < 1) test += defaultHeight;
        else test += child.getBoundingClientRect().height;
      });
      let test2 = 0;
      title.childNodes[1].childNodes.forEach((subItem: any) => {
        if (!subItem?.style) return;
        if (subItem.getBoundingClientRect().height < 1) test2 += defaultHeight;
        else test2 += subItem.getBoundingClientRect().height;
      });
      // @ts-ignore
      title.childNodes[1].style.height = `${test2}px`;
      title.style.height = `${test2 + defaultHeight}px`;
      parent.style.height = `${test + test2 + defaultHeight}px`;
    }
    /* THIS SHIT DOESN'T WORK!!!! */
    /* IT WON'T RUN ON FIRST TRY NO MATTER WHAT! */
    for (let listObject of childrenToRead as any) {
      if (listObject?.style) {
        transitionDelay += transitionTime / childrenToRead.length * 750;
        listObject.style.transition = `all ${transitionTime / childrenToRead.length * 4}s ${transitionDelay}ms, text-shadow 1ms 1ms, background 1ms 1ms`;
        listObject.style.transform = "scale(1)";
      }
    }
  }
  title.classList.toggle("isOpen");
}