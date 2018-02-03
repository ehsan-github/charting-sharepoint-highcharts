Highcharts.setOptions({
	lang: {
		decimalPoint: '.',
		thousandsSep: ','
	}
});
function pieChart(container, title, subtitle, tooltipLable, name, data) {
	return {

		chart: {
			renderTo: container,
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false
		},
		credits: {
			enabled: false
		},
		title: {
			text: title,
			align: 'center'
		},
		subtitle: {
			text: subtitle
		},
		tooltip: {
			useHTML: true,
			pointFormat: '<b> ' + tooltipLable + '{point.y:,.0f}</b><br/></b> %  {point.percentage:.2f}</b>'
		},
		plotOptions: {
			pie: {
				showInLegend: true,
				dataLabels: {

					enabled: false
				}
			}
		},
		series: [{
			states: { hover: { enabled: false } },
			type: 'pie',
			name: name,
			data: data
		}]
	};
}
function curveChart(container, titleText, subtitleText, yAxisText, rotation, cat, seri) {
	return {
		chart: {
			renderTo: container

		},
		title: {
			text: titleText,
			x: -20 //center
		},
		subtitle: {
			text: subtitleText,
			x: -20
		},
		xAxis: {
			categories: cat,
			labels: {
				rotation: rotation,
				rtl: true,
				useHTML: true

			}
		},
		yAxis: {
			title: {
				text: yAxisText
			},
			plotLines: [{
				value: 0,
				width: 1,
				color: '#808080'
			}],
			labels: {
				format: '{value} '
			}
		},
		tooltip: {
			headerFormat: '<div style="width:100%;border:1px solid #aaa"><div style="font-size:10px;font-weight:bold;padding-left:30%">{point.key}</div></div><table>',
			pointFormat: '<div><span style="float:left;">{series.name}: </span><div style="text-align: left;direction: ltr;float:left;">{point.y}</div></div>',
			valueSuffix: '',
			useHTML: true,
			style: { direction: 'ltr' }
		},
		legend: {
			layout: 'vertical',
			align: 'right',
			verticAlalign: 'middle',
			borderWidth: 0,
			rtl: true,
			useHTML: true
		},
		credits: {
			enabled: false
		},

		exporting: {
			enabled: true
		},
		series: seri
	}
}


function columnChart(container, titleText, subtitleText, yAxisText, rotation, cat, seri) {

	return {
		chart: {
			renderTo: container,
			type: 'column'
		},
		title: {
			text: titleText
		},
		subtitle: {
			text: subtitleText
		},
		credits: {
			enabled: false
		},


		legend: { rtl: true, useHTML: true },

		xAxis: {
			categories: cat,
			labels: {
				rotation: rotation,
				//  align: 'center',
				rtl: true,
				useHTML: true

			}

		},
		yAxis: {
			//   min: 0,
			title: {
				text: yAxisText
			},
			labels: {
				format: '{value} '
			}
		},
		exporting: {
			enabled: true
		},
		tooltip: {
			headerFormat: '<div style="font-size:10px;font-weight:bold">{point.key}</div><table>',
			pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:,.2f} </b></td></tr>',
			footerFormat: '</table>',
			shared: true,
			rtl: true, useHTML: true
		},
		plotoptions: {
			column: {
				pointPadding: 0.2,
				borderWidth: 0
			}
		},
		series: seri

	}
}

function drilldownChart(container, titleText, subtitleText, yAxisText, seriesData, drilldownSeries) {
	return {
		chart: {
			renderTo: container,
			type: 'column'
		},
		title: {
			text: titleText
		},
		subtitle: {
			text: subtitleText
		},
		xAxis: {
			type: 'category'
		},
		yAxis: {
			title: {
				text: yAxisText
			}
		},
		legend: {
			enabled: false
		},
		credits: {
			enabled: false
		},
		plotOptions: {
			series: {
				borderWidth: 0,
				dataLabels: {
					enabled: true,
					format: '{point.y:.0f}',
					rtl: true, useHTML: true
				}
			}
		},

		tooltip: {
			//    headerFormat: '<br /><b>{point.key}</b><br />',
			//   pointFormat: '<br /> <span>{point.y:.0f}</span>'
			formatter: function () {

				return this.key + ' : ' + this.y;
			},
			rtl: true, useHTML: true
		},

		exporting: {
			enabled: true
		},

		series: [{
			name: 'йзого Дух',
			colorByPoint: true,
			data: seriesData
		}],
		drilldown: {
			series: drilldownSeries
		}
		//});

	}
}
function drillDownMulti(container, title, xAxis, seri) {
	return {
		chart: {
			renderTo: container,
			type: 'column'
		},
		title: {
			text: title
		},
		xAxis: {
			type: xAxis
		},

		legend: {
			enabled: true
		},

		plotOptions: {
			series: {
				borderWidth: 0,
				dataLabels: {
					enabled: true
				}
			}
		},

		exporting: {
			enabled: true
		},

		series: seri
	}//return
}