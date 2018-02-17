// import * as $ from 'jquery'
import * as R from 'ramda';

import MultiSelect from '../elements/MultiSelect';
import Elem from '../elements/Element';

export default function MultiSelectFilter(app, parent, { name, dispName }, options){
    let wrapper = Elem({ type: 'div' });
    wrapper.classList.add('filter');

    let title = Elem({ type: 'span', title: dispName, className: 'filtertitle' });
    wrapper.appendChild(title);
    let selectList = MultiSelect({ options });
    wrapper.appendChild(selectList);
    selectList.selectedIndex = -1
    selectList.onchange = () => {
        let value = R.map(R.prop('value'),selectList.selectedOptions)
        app.changeMultiFilter({ name, value });
    };

    parent.appendChild(wrapper);     // [div [span] [select]] // cljs syntax
}

