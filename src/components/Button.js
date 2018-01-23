
export default function Button(buttonId){
    let button = document.createElement('button');
    button.setAttribute('id', buttonId)

    let app = document.getElementById('app');
    app.appendChild(button);
}

