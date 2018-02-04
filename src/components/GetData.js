import { getItems } from '../api';

import Elem from '../elements/Element';

export default function GetData(parent){
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
                err     => alert('addError', err),
                items   => {
                    parent.setItems(items);
                }
            );
    };

    parent.appendChild(div);
}
