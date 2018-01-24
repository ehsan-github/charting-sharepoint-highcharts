
export default function Elem({ options }){
    let selectList = document.createElement('select');
    options.forEach(item => {
        let option = document.createElement('option');
        option.value = item
        option.text = item
        selectList.appendChild(option);
    })
    return selectList
}

