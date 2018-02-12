import '../assets/global.css';
import * as R from 'ramda';
// import update from '../updates';
import { getSpItems, getAddressItems } from '../api';

import chartBuilder  from '../functions/buildChart';
import SelectFilter from './SelectFilter';
import { buildXAxis } from '../functions/dynamicProps';
import Elem from '../elements/Element';

export default function PageContent(parentId){
    let app = document.getElementById(parentId);
    // let myChart = null;

    let chartItems = window.CHART_ITEMS || [];
    let dataSource = window.DATA_SOURCE  || 'SQL';
    let address = window.ADDRESS || 'GetStatusPC';
    let chartType = window.CHART_TYPE || 'column';
    let yAxis = window.Y_AXIS || ['اردیبهشت 96', 'تیر 96'];
    let xAxis = window.X_AXIS || 'ContractName';
    let legend = window.LEGEND || null ;
    let filterItems = window.FILTER_ITEMS || ['Area', 'ContractName'];

    let xAxisProps = buildXAxis(xAxis, chartItems);
    let filters = buildFilters(filterItems);


    let setItems = items => {
        chartItems = items;
        let chartSeries = buildChartData(legend, filters, yAxis, chartItems);
        xAxisProps = buildXAxis(xAxis, chartItems);
        chartBuilder(app, chartType, { series: chartSeries }, xAxisProps);
        filters = buildFilters(filterItems);
        // SelectChartType(app, myChart);

        // Add Filters to page
        let filterBox = Elem({ type: 'div', className: 'filters-box' });
        app.appendChild(filterBox);
        let filterHeader = Elem({ type: 'h3', title: 'فیلترها' });
        filterBox.appendChild(filterHeader);
        filterItems.forEach(item => {
            let options = getUniqOptions(item, items);
            SelectFilter(app, filterBox, item, options);
        });

    };
    app.setItems = setItems;

    let changeFilter = ({ name, value }) => {
        let index = R.findIndex(R.propEq('name', name), filters);
        filters[index] = R.assoc('value', value, filters[index]);
        let chartSeries = buildChartData(legend, filters, yAxis, chartItems);
        chartBuilder(app, chartType, { series: chartSeries }, xAxisProps);
    };
    app.changeFilter = changeFilter;

    // Get Chart DATA

    if (dataSource == 'SQL'){
        getSpItems(address)
            .then(x => JSON.parse(x))
            .then(items => {
                setItems(items);
            })
            .catch(err => console.log('err: ', err.Message))
        ;

    } else if (dataSource == 'Sharepoint') {
        getAddressItems(address)
            .map(x => JSON.parse(x))
            .fork(
                err     => { console.log('err: ', err.Message) },
                items   => {
                    setItems(items);
                }
            );
    }
    //

    // GetData(app, myChart);

}

const buildFilters = R.map(x => { return { name: x, value: 'همه' }; });

const buildChartData = (legend, filters, yAxis, data) => {
    if (typeof yAxis == 'string') {
        return R.pipe(
            reduceFilters(filters),
            R.groupBy(R.prop(legend)),
            R.mapObjIndexed((rows, key) => {   // select yAxis from each Group
                return {
                    name: key == 'undefined' ? '' : key,
                    data: R.map(R.prop(yAxis), rows)
                };
            }),
            R.values
        )(data);
    }
    return R.pipe(
        reduceFilters(filters),
        buildLegends(yAxis)
    )(data);
};

const getUniqOptions = (prop, data) => R.pipe(
    R.map(R.prop(prop)),
    R.uniq,
    R.reject( x => x == null),
    R.prepend('همه')
)(data);

const reduceFilters = filters => R.reduce(
    (acc, { name, value }) => {
        if (!isNaN(value)) value = Number(value);
        return value == 'همه' ? acc : R.filter(R.propEq(name, value), acc);
    },
    R.__,
    filters
);

const buildLegends = yAxis => data => R.map(x => { return { name: x, data: R.map(R.prop(x), data) };}, yAxis);
