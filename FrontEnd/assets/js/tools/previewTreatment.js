
export function buildPic(pic){
        
    let blobImage = URL.createObjectURL(pic);
    let newImg = document.createElement("img");
    newImg.src = blobImage;
    newImg.height = "270";
    const label = document.querySelector(".middle label.add");
    const i = document.querySelector(".middle i");
    const p = document.querySelector(".middle p");
    label.style.display = "none";
    p.style.display = "none";
    i.style.display = "none";
    const screen = document.querySelector(".middle")
    screen.appendChild(newImg);
    
}