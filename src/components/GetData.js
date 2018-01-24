import { getItems } from '../api';
import update from '../updates'

import Elem from '../elements/Element'

export default function GetData(app, chart){
    let div = Elem({ type: 'div' });
    let listId = '';

    //input element
    let input = Elem({ type: 'input' });
    div.appendChild(input);
    input.oninput = e => {
        listId = e.target.value;
    };

    //button element
    let fetchButton = Elem({ type: 'button', title: 'fetch data' });
    div.appendChild(fetchButton);

    fetchButton.onclick = () => {
        getItems(listId)
            .fork(
                err     => console.log('addError', err),
                options => console.log('loadOptions', options)
            );
    };

    update(chart, {});

    app.appendChild(div);
}