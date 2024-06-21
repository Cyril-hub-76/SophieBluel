import { datas } from "./tools/datasParse.js"; // Api treatment

const form = document.querySelector("form");
let allInput = document.querySelectorAll("form input");
let allLabel = document.querySelectorAll("form label");
const initialLabelTexts = Array.from(allLabel).map(label => label.innerText);

const regexMail = new RegExp("^[a-zA-Z.0-9_-]{2,100}@[a-zA-Z.0-9_-]{2,100}\\.[a-zA-Z]{2,10}$");


form.addEventListener("submit",(e)=>{

    e.preventDefault();
    let isEmpty = isEmptyForm();
    if (!isEmpty){
        checkEmail(allInput[0], allInput[1]);
    }
})


function isEmptyForm(){

    let isEmpty = false;

    for (let i = 0; i < allInput.length ; i ++){
        
        if (allInput[i].value == ""){
            const message = "Ce champ est obligatoire";
            danger(allInput[i], allLabel[i], message); 
            isEmpty = true;
        } else {
            repair(allInput[i], allLabel[i], initialLabelTexts[i]);
        }
    }
    return isEmpty;
}

function checkEmail(inputMail, inputPassword) {
    
    if (!regexMail.test(inputMail.value)){
        const message = "Entrez un format d'e-mail valide";
        danger(inputMail, allLabel[0], message);
    } else {

        const loginData = {
            email: inputMail.value,
            password: inputPassword.value
        };

        const apiEndpoint = "http://localhost:5678/api/users/login";
        const method = "POST";

        datas(apiEndpoint, method, loginData)
        
        .then(data => {
            
            if (data.userId && data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('id', data.userId);
                window.location.href = "index.html";
            } 
            
        })
        .catch(error => {
            danger(inputMail, allLabel[0], "E-mail ou mot de passe incorrect");
            console.log(error);
        })
    }
}

export function danger(input, label, text){

    const warnMessage = text;
    const warn = `box-shadow: 0px 4px 14px rgba(255, 0, 0, 0.5);`;
    const red = `color: red;`;
    label.style = red; 
    label.innerText = warnMessage;
    input.style = warn;

}

function repair(input, label, text){

    input.style = `box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.1);`;
    label.innerText = text;
    label.style.color = "black"; 
}

