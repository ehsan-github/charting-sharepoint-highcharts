
export default function Select({ options }){
    let selectList = document.createElement('select');
    options.forEach(item => {
        let option = document.createElement('option');
        option.value = item
        option.text = item
        selectList.appendChild(option);
    })
    selectList.setAttribute('multiple', 'multiple');
    return selectList
}

