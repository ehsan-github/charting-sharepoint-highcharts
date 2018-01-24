// import * as $ from 'jquery'
import update from '../updates'

import Select from '../elements/Select'

export default function SelectChartType(parent, chart){

    let selectList = Select({ options: ['line', 'area', 'bar', 'pie', 'scatter'] });

    selectList.onchange = ({ target: { value } }) => {
        let chartProp = { chart: { type: value } };
        update(chart, chartProp);
    };

    parent.appendChild(selectList);
}

