
export default function Elem({ type, title = '' }){

    let elem = document.createElement(type);
    elem.innerHTML = title

    return elem
}

