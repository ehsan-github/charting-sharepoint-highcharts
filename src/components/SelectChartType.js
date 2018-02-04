import Select from '../elements/Select';

export default function SelectChartType(parent){

    let selectList = Select({ options: ['line', 'area', 'bar', 'pie', 'scatter'] });

    selectList.onchange = ({ target: { value } }) => {
        parent.changeChartType(value);
    };

    parent.appendChild(selectList);
}

