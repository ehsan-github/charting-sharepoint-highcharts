
export default function Elem({ type, title = '', className = null }){

    let elem = document.createElement(type);
    elem.innerHTML = title
    if (className) elem.classList.add(className);

    return elem
}

