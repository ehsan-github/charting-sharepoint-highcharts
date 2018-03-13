import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import data from 'highcharts/modules/data';
import drilldown from 'highcharts/modules/drilldown';
import HighchartsMore from 'highcharts-more';
import * as R from 'ramda';
import { setTitle, setSubTitle } from './staticProps';
import { buildTooltip, buildYAxis, buildPlotOptions, buildChartType } from './dynamicProps';

data(Highcharts);
Exporting(Highcharts);
HighchartsMore(Highcharts);
drilldown(Highcharts);

export default function buildChart(app, type, series, drillDown, ...x){

    let chartcontainer = document.createElement('div');
    const chartId = 'chartcontainer';
    chartcontainer.setAttribute('id', chartId);

    app.appendChild(chartcontainer);
    // type
    let polar = false;
    if (type == 'spiderweb'){
        polar = true;
        type = 'line';
    } else if (type == 'drilldown'){
        type = 'column';
    }

    let chart = buildChartType(type, polar);

    // set different chart props
    let title = setTitle(window.TITLE || '');

    let subTitle = setSubTitle(window.SUB_TITLE || '');

    let yAxis = buildYAxis(window.Y_AXIS_TITLE || [
        { text: 'Rainfall', format: 'mm' },
        { text: 'Tempreture', format: '°C' },
    ]);

    let tooltip = buildTooltip(drillDown == {} ? type : 'drilldown');

    let legend = drillDown == {} ? {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
    } : {
        enabled: true
    };

    let plotOptions = buildPlotOptions(type);

    let remaining = {
        chart,
        yAxis,
        legend,
        plotOptions,
        colors: ['#64B5F6', '#E57373', '#81C784 ', '#FFD54F', '#9575CD', '#4DD0E1', '#F0B27A', '#F0B27A', '#D35400', '#99FFFF', '#669966', '#F5B041', '#99A3A4', '#FFCCBC', '#9FA8DA']
    };

    // merge all chat props together

    let chartProps = R.mergeAll([title, subTitle, tooltip, series, drillDown, remaining, ...x]);

    ///setting global options
    Highcharts.setOptions({
        lang: {
            contextButtonTitle: 'Chart context menu',
            downloadCSV: 'دانلود CSV',
            downloadJPEG: 'دانلود عکس JPEG ',
            downloadPDF: 'دانلود PDF document',
            downloadPNG: 'دانلود PNG image',
            downloadSVG: 'دانلود SVG vector image',
            downloadXLS: 'دانلود XLS',
            drillUpText: 'برگرد ',
            loading: 'Loading...',
            months:[ 'January' , 'February' , 'March' , 'April' , 'May' , 'June' , 'July' , 'August' , 'September' , 'October' , 'November' , 'December'],
            noData: 'No data to display',
            numericSymbolMagnitude: 1000,
            numericSymbols:[ 'هزار' , 'میلیون' , 'میلیارد' , 'تیلیارد' ],
            printChart: 'Print chart',
            resetZoom: 'Reset zoom',
            resetZoomTitle: 'Reset zoom level 1:1',
            shortMonths:[ 'Jan' , 'Feb' , 'Mar' , 'Apr' , 'May' , 'Jun' , 'Jul' , 'Aug' , 'Sep' , 'Oct' , 'Nov' , 'Dec']
        }
    });
    /// building chart
    return Highcharts.chart(chartId, chartProps);
}
