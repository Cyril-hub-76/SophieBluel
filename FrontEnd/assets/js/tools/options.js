// add categories option on adding photo event
export function options (categories){

    for ( let i = 0; i < categories.length; i ++) {

        const categoryName = categories[i].name
        const option = document.createElement("option");
        option.setAttribute("value", [(i + 1)]);
        option.innerText = categoryName;
        const select = document.querySelector(".modalContent form select");

        select.appendChild(option);

    }

}