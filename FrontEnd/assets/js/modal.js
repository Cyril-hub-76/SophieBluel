import { datas } from "./tools/datasParse.js"; // Api treatment
import { buildPic } from "./tools/previewTreatment.js"; // preview pic
import { options } from "./tools/options.js"; // options treatment
//import { displayWorks } from "./app.js";

let token = localStorage.getItem("token");
let userId = localStorage.getItem("id");
let title;
let attrImage;

// we build modal

function builModal(){

    const modal = document.getElementById("modal");
    modal.innerHTML = "";

    const modalWrapper = document.createElement("div");
    modalWrapper.setAttribute("class", "modalWrapper");

    const close = document.createElement("div");
    close.setAttribute("class", "close");

    const iconClose = document.createElement("i");
    iconClose.setAttribute("class","fa-solid fa-xmark");
    close.appendChild(iconClose);

    const title = document.createElement("h2");
    title.setAttribute("class","modalTitle");

    const content = document.createElement("div");
    content.setAttribute("class", "modalContent");

    const validate = document.createElement("button");
    validate.setAttribute("class", null);
    validate.setAttribute("type", "submit");

    modal.appendChild(modalWrapper);
    modalWrapper.appendChild(close);
    modalWrapper.appendChild(title);
    modalWrapper.appendChild(content);
    modalWrapper.appendChild(validate);
    

    modal.style.display = null;

    close.addEventListener("click", ()=>{
        modal.innerHTML="";
        modal.style.display = "none";
    })
}

// we prepare params for modal

function initModal(titleText, classlist, buttonText){

    const title = document.querySelector(".modalTitle");
    const button = document.querySelector(".modal button");
 
    title.innerText = titleText;
    button.classList.add(classlist);
    button.innerText = buttonText;
    
}

// we fill modal content
function displayModalWorks(data){

    const content = document.querySelector(".modalContent");
   
    content.innerHTML = "";
    content.classList.add("grid");

    for (let i = 0; i < data.length; i ++) {
        // tags building
        const imgContainner = document.createElement("div");
        imgContainner.setAttribute("class", "imgContainner");
        // icon anchor
        const iconAnchor = document.createElement("a");
        iconAnchor.setAttribute("title", "supprimer");
        iconAnchor.setAttribute("href", "#");
        
        // trash fAwesome
        const trashIcon = document.createElement("i");
        trashIcon.setAttribute("class", "fa-solid fa-trash-can trash");
        trashIcon.setAttribute("data-id", data[i].id);

        // photos
        const img = document.createElement("img");        
        img.src = data[i].imageUrl;
        img.setAttribute("alt", data[i].title);
        
        
        // tags fill
        iconAnchor.appendChild(trashIcon);
        imgContainner.appendChild(img);
        imgContainner.appendChild(iconAnchor);
        content.appendChild(imgContainner);
    }
    
}
function killModalContent(){

    const content = document.querySelector(".modalContent");
    
    content.innerHTML = "";
    let contentClassList = content.classList[1];
    content.classList.remove(contentClassList);
    
    const button = document.querySelector(".modalWrapper button");
    
    const buttonClass = button.classList[1];
    button.classList.remove(buttonClass);

}

// then we display creating works tools

function buildModalAddWorksContent(){

    const select = document.createElement("select");

    const content =  document.querySelector(".modalContent");
    
    content.innerHTML = "";

    const modalWrapper = document.querySelector(".modalWrapper");

    // build tags and add attributes
    const screenPhoto = document.createElement("div");
    screenPhoto.setAttribute("class", "screenPhoto");

    const middle = document.createElement("div");
    middle.setAttribute("class", "middle");

    const icon = document.createElement("i");
    icon.setAttribute("class", "fa-regular fa-image");

    const arrowLeft = document.createElement("i");
    arrowLeft.setAttribute("class", "fa-solid fa-arrow-left back");

    modalWrapper.appendChild(arrowLeft);

    const inputLabel = document.createElement("label");
    inputLabel.setAttribute("class", "add");

    const inputFile = document.createElement("input");
    inputFile.setAttribute("type", "file");
    inputFile.setAttribute("id", "inputImage");
    inputFile.setAttribute("name", "inputImage");

    inputLabel.innerText = "+ Ajouter photo";
    inputLabel.appendChild(inputFile);

    const para = document.createElement("p");
    para.innerText = "jpg, png : 4Mo max";

    // we fill the div class middle
    middle.appendChild(icon);
    middle.appendChild(inputLabel);
    middle.appendChild(para);

    // we fill div screenPhoto with div class middle
    screenPhoto.appendChild(middle);

    // we create form
    const form = document.createElement("form");
    form.setAttribute("id", "photo");
    form.setAttribute("enctype", "multipart/form-data");
    form.setAttribute("action", "#");
    form.setAttribute("method", "POST");

    const labelTitle = document.createElement("label");
    labelTitle.setAttribute("for","title");
    labelTitle.innerText = "Titre";

    const inputTitle = document.createElement("input");
    inputTitle.setAttribute("type", "text");
    inputTitle.setAttribute("name", "text");
    inputTitle.setAttribute("id", "title");

    const labelCategory = document.createElement("label");
    labelCategory.setAttribute("for","category");
    labelCategory.innerText = "Catégories";

    // we fill form
    form.appendChild(labelTitle);
    form.appendChild(inputTitle);
    form.appendChild(labelCategory);
    form.appendChild(select);

    content.appendChild(screenPhoto);
    content.appendChild(form);

}

const modalLink = document.getElementById("modalLink");

modalLink.addEventListener("click",async()=>{

    // we open modal and dispay works into
    // text & class preparation
    const title = "Galerie photo";
    const classlist = "addPhoto";
    const buttonText = "Ajouter une photo";

    builModal();
    initModal(title, classlist, buttonText);

    let works = "http://localhost:5678/api/works/";
    displayModalWorks(await datas(works)); // We initialize displaying to all Sophies's works into modal

    modalAddPhoto();
    deleteWork();
})
const deleteWork = function() {
    const trashButtons = document.querySelectorAll(".imgContainner .trash");
    const imgContainner = document.querySelectorAll(".imgContainner");
    const imageElements = document.querySelectorAll(".gallery figure")

    for (let i = 0; i < trashButtons.length; i++) {
        trashButtons[i].addEventListener("click", async(e) => {

            const id = e.target.dataset.id;
            let worksId = `http://localhost:5678/api/works/${id}`;

            await datas(worksId, "DELETE", null, token)
            .then(function() {

                // we delete thumbnails from modal
                imgContainner[i].remove();
                // then we remove pic from gallery
                imageElements[i].remove();
                
            })
            .catch(function(error) {
                console.error("Erreur lors de la suppression", error);
            });
        });
    }
};

const modalAddPhoto = function(){
    const addPhotoButton = document.querySelector(".addPhoto");
    
    addPhotoButton.addEventListener("click",()=>{
        // here we change modal view. We display add works options
        killModalContent();
        const title = "Ajout photo";
        const classlist = "validate";
        const buttonText = "Valider";
        initModal(title, classlist, buttonText);
        
        buildModalAddWorksContent();
        
        const arrowLeftButton = document.querySelector("#modal .back");
        
        arrowLeftButton.addEventListener("click", ()=>{
            // turn back in first view
            killModalContent();
            modalLink.click();
        })
        addPhoto();
    })
    
}

const addPhoto = function(){

    const addPhotoLabel = document.querySelector(".middle label.add");
    const addPhotoInput = document.querySelector(".middle .add #inputImage");

    addPhotoInput.addEventListener("change", async()=>{

        const attributesImages = addPhotoLabel.control.files[0];
        attrImage = attributesImages;
        buildPic(attributesImages);
        let categories = "http://localhost:5678/api/categories";

        // we call option function to display options after adding photo
        options(await datas(categories));

        validate();
    })

    
}

const validate = function(){

    let titleWork = document.getElementById("title")
    let greyButton = document.querySelector(".validate");

    // here we change button validation color when input is filled
    titleWork.addEventListener("input", ()=>{

            if (titleWork.value != ""){
                greyButton.style.background = "#1D6154"
            } else {
                greyButton.style.background = "#A7A7A7";
            }

    })

    const options = document.querySelectorAll(".modalContent form select option");
    const select = document.querySelector(".modalContent form select");

    // we set to default category id
    let categoryId = select.options[select.selectedIndex].value;

    
    // if categoryId changes =>
    for (let i = 0 ; i < options.length; i ++){
        select.addEventListener("change",function(){
            return categoryId = select.value;
        })
    }
    // then turn it to number
    categoryId = parseInt(categoryId) //vérifier typeOf avant voir s'il faut garder cette ligne de code.

    const inputTile = document.querySelector(".modalContent form input");
    inputTile.addEventListener("input", (e)=>{
        title = e.target.value;
    })

    const buttonValidate = document.querySelector(".modalWrapper button.validate");

    buttonValidate.addEventListener("click", async()=>{

        title = inputTile.value;

        const formData = new FormData();
        formData.append("title", title);
        formData.append("image", attrImage);
        formData.append("category", categoryId);

        // i check if ok
        /*
        for (const value of formData.values()) {
            console.log(value);
          }
        */
        const api = "http://localhost:5678/api/works";
        const method = "POST";
        await datas(api, method, formData, token, userId);

        //document.querySelector(".gallery").innerHTML = "";
        //displayWorks(await datas(api));

        document.querySelector(".modalWrapper .close").click();

    })

}
