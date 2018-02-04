// import * as $ from 'jquery'
import update from '../updates';

import Elem from '../elements/Element';

export default function UpdateButton(app, chart, { title = 'Title' }){

    let button = Elem({ type: 'button', title });

    button.onclick = function(){
        let inverted = !chart.chart.inverted;
        let newUpdate = { chart: { inverted, polar: true }, subtitle: { text: 'Polar' } };
        update(chart, newUpdate);
    };

    app.appendChild(button);
}

