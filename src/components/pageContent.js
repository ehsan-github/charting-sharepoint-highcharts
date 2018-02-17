import '../assets/global.css';
import * as R from 'ramda';
// import update from '../updates';
import { getSpItems, getAddressItems } from '../api';

import chartBuilder  from '../functions/buildChart';
import SelectFilter from './SelectFilter';
import MultiSelectFilter from './MultiSelectFilter';
import { buildXAxis } from '../functions/dynamicProps';
import Elem from '../elements/Element';

export default function PageContent(parentId){
    let app = document.getElementById(parentId);
    // let myChart = null;

    let chartItems = window.CHART_ITEMS || [];
    let dataSource = window.DATA_SOURCE  || 'SQL';

    // let address = window.ADDRESS || 'GetStatusPC,null,null,null,null';
    // let chartType = window.CHART_TYPE || 'line';
    // let yAxis = window.Y_AXIS || 'ContractID' || [
    //     { name: 'تیر 96', type: 'column' },
    //     { name: 'اردیبهشت 96', type: 'column' },
    //     { name: 'مهر96', type: 'column' },
    //     { name: 'خرداد 96', type: 'line', index: 1 },
    //     { name: 'آبان 96', type: 'line', index: 1 },
    // ];
    // let xAxis = window.X_AXIS || 'PeriodID';
    // let filterItems = window.FILTER_ITEMS || [
    //     { name: 'Status', dispName: 'وضعیت', multi: false },
    // ];

    let address = window.ADDRESS || '';
    let chartType = window.CHART_TYPE || 'column';
    let yAxis = window.Y_AXIS || [];
    let xAxis = window.X_AXIS || '';
    let filterItems = window.FILTER_ITEMS || [];

    let legend = window.LEGEND || null ;
    let renamings = window.RENAMINGS || {};

    let xAxisProps = buildXAxis(xAxis, chartItems);
    let filters = buildFilters(filterItems);


    let setItems = items => {
        chartItems = stringReplacement(renamings, items);
        let { chartSeries } = buildChartData(legend, filters, yAxis, chartItems);
        xAxisProps = buildXAxis(xAxis, chartItems);
        chartBuilder(app, chartType, { series: chartSeries }, xAxisProps);
        filters = buildFilters(filterItems);
        // SelectChartType(app, myChart);

        // Add Filters to page
        let filterBox = Elem({ type: 'div', className: 'filters-box' });
        app.appendChild(filterBox);
        let filterHeader = Elem({ type: 'h3', title: 'فیلترها' });
        filterBox.appendChild(filterHeader);
        filterItems.forEach(({ name, dispName, multi })=> {
            let options = getUniqOptions(name, items, multi);
            if (multi) {
                MultiSelectFilter(app, filterBox, { name, dispName, multi }, options);
            } else {
                SelectFilter(app, filterBox, { name, dispName, multi }, options);
            }
        });

        // adding select2 to all selects
        window.jQuery('select').select2()
    }
    app.setItems = setItems;

    // filter functions
    // simple select filter
    let changeFilter = ({ name, value }) => {
        let index = R.findIndex(R.propEq('name', name), filters);
        filters[index] = R.assoc('value', value, filters[index]);
        let { chartSeries, chartData } = buildChartData(legend, filters, yAxis, chartItems);
        xAxisProps = buildXAxis(xAxis, chartData);
        chartBuilder(app, chartType, { series: chartSeries }, xAxisProps);
    };
    app.changeFilter = changeFilter;

    // multi select filter

    let changeMultiFilter = ({ name, value }) => {
        let index = R.findIndex(R.propEq('name', name), filters);
        filters[index] = R.assoc('value', value, filters[index]);
        let { chartSeries, chartData } = buildChartData(legend, filters, yAxis, chartItems);
        xAxisProps = buildXAxis(xAxis, chartData);
        chartBuilder(app, chartType, { series: chartSeries }, xAxisProps);
    };
    app.changeMultiFilter = changeMultiFilter;
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

const buildFilters = R.map(x => {
    let { multi, name } = x;
    return multi ? { name, value: [] } : { name, value: 'همه' };
});

const buildChartData = (legend, filters, yAxis, data) => {
    let chartData = reduceFilters(filters)(data);
    if (typeof yAxis == 'string') {
        return {
            chartSeries: R.pipe(
                R.groupBy(R.prop(legend)),
                R.mapObjIndexed((rows, key) => {   // select yAxis from each Group
                    return {
                        name: key == 'undefined' ? '' : key,
                        data: R.map(R.prop(yAxis), rows)
                        // pointPlacement: 'on'
                    };
                }),
                R.values
            )(chartData),
            chartData
        };
    }
    return {
        chartSeries: R.pipe(
            buildLegends(yAxis)
        )(chartData),
        chartData
    };
};

const getUniqOptions = (prop, data, multi) => R.pipe(
    R.map(R.prop(prop)),
    R.uniq,
    R.reject( x => x == null),
    x => multi ? R.identity(x) : R.prepend('همه', x)
)(data);

const reduceFilters = filters => R.reduce(
    (acc, { name, value }) => {
        if (!isNaN(value)) value = Number(value);
        if (typeof value == 'object') {
            return R.filter(
                R.propSatisfies(
                    x => value.includes(x),
                    name),
                acc)
        } else {
            return value == 'همه' ? acc : R.filter(R.propEq(name, value), acc);
        }
    },
    R.__,
    filters
);

const buildLegends = yAxises => data => R.map(yAxis => { return {
    type: yAxis.type,
    name: yAxis.name,
    data: R.map(R.prop(yAxis.name), data),
    yAxis: yAxis.index || 0
    // pointPlacement: 'on'
};}, yAxises);

const stringReplacement = (replacements, data) => R.map(
    R.map(value => R.propOr(value, value, replacements)),
    data);
