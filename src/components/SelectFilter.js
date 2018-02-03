// import * as $ from 'jquery'

import Select from '../elements/Select'

export default function SelectFilter(parent, name, options){

    let selectList = Select({ options });


    selectList.onchange = ({ target: { value } }) => {
        parent.changeFilter({ name, value })
    };

    parent.appendChild(selectList);
}

