
import * as R from 'ramda';
import update from '../updates';

import chartBuilder  from '../functions/buildChart';
import GetData from './GetData';
import SelectFilter from './SelectFilter';
import SelectChartType from './SelectChartType';
import { buildXAxis } from '../functions/dynamicProps';

export default function PageContent(parentId){
    let app = document.getElementById(parentId);
    let myChart = null;
    let chartItems = [];
    let yAxis = 'ProjectCost';
    let xAxis = 'Title';
    let legend = 'ContractorUserId';
    let filterItems = ['AreaId', 'Status'];

    let xAxisProps = buildXAxis(xAxis, chartItems);
    let filters = buildFilters(filterItems);
    // let chartSeries = buildChartData(legend, filters, yAxis, chartItems);

    // let myChart = chartBuilder(app, { series: chartSeries }, xAxisProps);

    let setItems = items => {
        chartItems = items;
        let chartSeries = buildChartData(legend, filters, yAxis, chartItems);
        xAxisProps = buildXAxis(xAxis, chartItems);
        myChart = chartBuilder(app, { series: chartSeries }, xAxisProps);
        SelectChartType(app, myChart);

        // Build Selects
        filterItems.forEach(item => {
            let options = getUniqOptions(item, items);
            SelectFilter(app, item, options);
        });

    };
    app.setItems = setItems;

    let changeFilter = ({ name, value }) => {
        let index = R.findIndex(R.propEq('name', name), filters);
        filters[index] = R.assoc('value', value, filters[index]);
        let chartSeries = buildChartData(legend, filters, yAxis, chartItems);
        myChart = chartBuilder(app, { series: chartSeries }, xAxisProps);
    };
    app.changeFilter = changeFilter;

    let changeChartType = value => {
        let chartProp = { chart: { type: value } };
        if (myChart != null) update(myChart, chartProp);
    };
    app.changeChartType = changeChartType;

    GetData(app, myChart);
}

const buildFilters = R.map(x => { return { name: x, value: 'همه' }; });

const buildChartData = (legend, filters, yAxis, data) => R.pipe(
    R.groupBy(R.prop(legend)),
    R.map(                             // apply all filters over each Group
        row => R.reduce(
            (acc, { name, value }) => value == 'همه' ? acc : R.filter(R.propEq(name, value), acc),
            row,
            filters)),
    R.reject(x => R.length(x) == 0),
    R.mapObjIndexed((rows, key) => {   // select yAxis from each Group
        return {
            name: key,
            data: R.map(R.prop(yAxis), rows)
        };
    }),
    R.values
)(data);

const getUniqOptions = (prop, data) => R.pipe(
    R.map(R.prop(prop)),
    R.uniq,
    R.reject( x => x == null),
    R.prepend('همه')
)(data);
