import { datas } from "./tools/datasParse.js"; // Api treatment

let works = "http://localhost:5678/api/works";

const gallery = document.querySelector(".gallery");
const login = document.querySelector("a#login");
const logout = document.querySelector("a#logout");
const modalModify = document.querySelector("#modalLink");


document.addEventListener('DOMContentLoaded', async ()=> {

    buttonsBuilder(); // Build buttons first

    // Then we initialize the first button to active
    let init = document.getElementById("allProjects");
    init.classList.add("active");

    displayWorks(await datas(works)); // Display all works by default after fetching data
    filterCategory(); // Initialize category filters
    checkAuthStatus(); // Check authentication status

});

export function displayWorks(worksData){
    
    for (let i = 0; i < worksData.length; i ++) {
        // tags building
        const figure = document.createElement("figure");
        figure.setAttribute("data-id", [(i+1)]);
        const img = document.createElement("img");
        const figcaption = document.createElement("figcaption");

        // tags fill
        img.src = worksData[i].imageUrl
        img.setAttribute("alt", worksData[i].title);
        figcaption.innerText = worksData[i].title;

        figure.appendChild(img);
        figure.appendChild(figcaption);

        // we fill the gallery div
        gallery.appendChild(figure);
    }
}

async function filterCategory(){

    const categoryDatas = await datas(works);        // Waiting for api datas
    const allButtons = document.querySelectorAll("#portfolio button");

    for (let i = 0; i < allButtons.length; i ++) {
        allButtons[i].addEventListener("click", (e)=>{
            
            if (allButtons[ i ].id == "allProjects"){
                gallery.innerHTML = "";
                displayWorks(categoryDatas);

            } else {

                const worksFiltered = categoryDatas.filter(category => category.categoryId == i);
                gallery.innerHTML = "";
                displayWorks(worksFiltered);

            }
            coloringButton(allButtons, e.target);
        })
    }
}

function coloringButton(buttons, selectedButton){

    // Here we remove active style to all buttons
    for (let i = 0; i < buttons.length; i ++){
        buttons[i].classList.remove("active");
    }
    // Then we add style for selected button
    selectedButton.classList.add("active");
}

function buttonsBuilder(){

    const titleSection = document.querySelector("#portfolio h2")

    const divFilter = document.createElement("div");
    divFilter.style = `display: flex; justify-content: center; margin-bottom: 20px`;
    divFilter.setAttribute("class", "selectWorks");

    // Building buttons for all works
    const allProjects = document.createElement("button");
    allProjects.setAttribute("id", "allProjects");
    allProjects.classList.add("button");
    allProjects.innerText = "Tous";

    const objects = document.createElement("button");
    objects.setAttribute("id", "objects");
    objects.classList.add("button");
    objects.innerText = "Objets";

    const appartments = document.createElement("button");
    appartments.setAttribute("id", "appartments");
    appartments.classList.add("button");
    appartments.innerText = "Appartements";

    const restaurents = document.createElement("button");
    restaurents.setAttribute("id", "allPrestaurentsrojects");
    restaurents.classList.add("button");
    restaurents.innerText = "Hotels & Restaurants";

    // we fill the div with all buttons
    divFilter.appendChild(allProjects);
    divFilter.appendChild(objects);
    divFilter.appendChild(appartments);
    divFilter.appendChild(restaurents);

    titleSection.parentNode.insertBefore(divFilter, titleSection.nextElementSibling);

}

// if authentified, we add admin options
function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const categoryFilter = document.querySelector(".selectWorks");
    if (token) {

        login.style.display = "none";
        logout.style.display = "inline";
        modalModify.style.display = "inline-block";
        categoryFilter.style.display = "none";

    } else {

        login.style.display = "inline";
        logout.style.display = "none";
        modalModify.style.display ="none";
        categoryFilter.style.display = "flex";

    }
}
logout.addEventListener('click', async() => {
    localStorage.removeItem('token');
    checkAuthStatus();
    gallery.innerHTML = "";
    displayWorks(await datas(works));
});

