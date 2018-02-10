// import * as $ from 'jquery'

import Select from '../elements/Select';
import Elem from '../elements/Element';

export default function SelectFilter(app, parent, name, options){
    let wrapper = Elem({ type: 'div' });
    wrapper.classList.add('filter');

    let title = Elem({ type: 'span', title: name });
    wrapper.appendChild(title);

    let selectList = Select({ options });
    wrapper.appendChild(selectList);

    selectList.onchange = ({ target: { value } }) => {
        app.changeFilter({ name, value });
    };

    parent.appendChild(wrapper);     // [div [span] [select]] // cljs syntax
}

