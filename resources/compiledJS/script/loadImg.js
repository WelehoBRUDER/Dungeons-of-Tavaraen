function imgLoaded() {
  if(imgLoaded.num) imgLoaded.num += 1;
  else imgLoaded.num = 1;
  if(imgLoaded.num == document.querySelector(".sprites").querySelectorAll("img").length) {
    setTimeout(modifyCanvas, 500);
  } 
}

(() => {
  let allImages = getWebsite("/");
  let imageContainer = document.querySelector(".sprites");
  for(let i = 0; i < allImages.length; i++) {
    imageContainer.appendChild(allImages[i]);
  };

  function getWebsite(href) {
    let div = document.createElement("div");
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", href, false);
    xmlhttp.send();
    div.innerHTML = xmlhttp.responseText;
    return div.querySelector(".sprites").querySelectorAll("img")
  }
})();