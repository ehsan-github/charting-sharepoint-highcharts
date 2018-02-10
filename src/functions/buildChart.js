import Highcharts from 'highcharts';
import Exporting from 'highcharts/modules/exporting';
import * as R from 'ramda';

import { setTitle, setSubTitle } from './staticProps';
import { buildTooltip } from './dynamicProps';

Exporting(Highcharts);

export default function buildChart(app, type, series, ...x){

    let chartcontainer = document.createElement('div');
    const chartId = 'chartcontainer';
    chartcontainer.setAttribute('id', chartId);

    app.appendChild(chartcontainer);

    // set different chart props
    let title = setTitle(window.TITLE || 'Solar Employment Growth by Sector, 2010-2016');

    let subTitle = setSubTitle(window.SUB_TITLE || 'Source: thesolarfoundation.com');
    let yAxis = window.Y_AXIS_TITLE || '';

    let tooltip = buildTooltip(type, {})();

    if (series.length == 0) {
        series = {
            series: [{
                name: 'London',
                data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
            }]
        };
    }
    let remaining = {
        chart: { type },
        yAxis: {
            title: {
                text: yAxis
            },
            reversed: false
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },

        // plotOptions: {
        //     series: {
        //         label: {
        //             connectorAllowed: false
        //         },
        //         pointStart: 2010
        //     }
        // },

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }

    }

    // merge all chat props together

    let chartProps = R.mergeAll([title, subTitle, tooltip, series, remaining, ...x])

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
            drillUpText: 'Back to {series.name}',
            loading: 'Loading...',
            months:[ 'January' , 'February' , 'March' , 'April' , 'May' , 'June' , 'July' , 'August' , 'September' , 'October' , 'November' , 'December'],
            noData: 'No data to display',
            numericSymbolMagnitude: 1000,
            numericSymbols:[ 'هزار' , 'میلیون' , 'میلیارد' , 'تیلیارد' ],
            printChart: 'Print chart',
            resetZoom: 'Reset zoom',
            resetZoomTitle: 'Reset zoom level 1:1',
            shortMonths:[ 'Jan' , 'Feb' , 'Mar' , 'Apr' , 'May' , 'Jun' , 'Jul' , 'Aug' , 'Sep' , 'Oct' , 'Nov' , 'Dec'],
            shortWeekdays:undefined
        }
    });
    /// building chart
    return Highcharts.chart(chartId, chartProps)
}
