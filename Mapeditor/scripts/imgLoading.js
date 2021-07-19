function imgLoaded() {
  if(imgLoaded.num) imgLoaded.num += 1;
  else imgLoaded.num = 1;

  if(imgLoaded.num == $("#images").querySelectorAll("img").length) createMap();
}

(() => {

  let allImages = getWebsite("/");
  let imageContainer = document.querySelector("#images");
  for(let i = 0; i < allImages.length; i++) {
    let img = allImages[i];
    img.src = "";
    console.log(img);
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