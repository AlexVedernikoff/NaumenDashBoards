// TODO: временно, для целей демонстрации
import moment from 'moment';
import {CHART_VARIANTS, getChartType} from 'utils/chart';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import {WIDGET_VARIANTS} from 'utils/widget';

const getRandomArbitrary = (min, max) => {
	return Math.ceil(Math.random() * (max - min) + min);
};

const getDataset = (count = 12) => {
	const series = [];

	while (series.length < count) {
		let randomNumber = Math.ceil(Math.random() * 1000);
		let found = false;
		for (let i = 0; i < series.length; i++) {
			if (series[i] === randomNumber) {
				found = true;
				break;
			}
		}
		if (!found) {
			series[series.length] = randomNumber;
		}
	}

	return series;
};

const getCategories = (count = 12) => {
	const categories = [];

	while (categories.length < count) {
		categories.push(moment().subtract(count - categories.length, 'd').locale('ru').format('DD MMMM'));
	}

	return categories;
};

const getLabels = (string = 'датасет', count = 5) => {
	const labels = [];

	while (labels.length < count) {
		labels.push(`${string}-${labels.length + 1}`);
	}

	return labels;
};

const getAxisChartData = (widget) => {
	let series = [];

	if (widget.breakdown) {
		series = [];
		const length = getRandomArbitrary(2, 4);

		for (let i = 0; i < length; i++) {
			series.push({
				name: `Датасет ${i}`,
				data: getDataset()
			});
		}
	} else series = [
		{
			data: getDataset()
		}
	];

	const categories = getCategories();

	return {
		categories,
		series
	};
};

const getCircleChartData = () => {
	const series = getDataset(5);
	const labels = getLabels(5);

	return {
		labels,
		series
	};
};

const getComboChartData = (widget) => {
	const labels = getCategories();
	const series = [];

	widget.order.forEach(num => {
		const source = widget[`${FIELDS.source}_${num}`];
		const chart = widget[`${FIELDS.chart}_${num}`];

		if (source && chart)
		series.push({
			name: source.label,
			type: getChartType(chart.value),
			data: getDataset()
		});
	});

	return {
		labels,
		series
	};
};

const getSummaryData = (widget) => {
	return {
		title: widget.indicator ? widget.indicator.title : 'Значение показателя',
		total: Math.ceil(Math.random() * 1000)
	};
};

const getTableData = (widget) => {
	const labels = getLabels('значение');
	const dates = getCategories();
	const data = [];

	for (let i = 0; i < getRandomArbitrary(1, 10); i++) {
		const row = {
			breakdownTitle: dates[i]
		};
		labels.forEach(label => {
			row[label] = getRandomArbitrary(22, 333);
		});

		data.push(row);
	}
	const totalColumn = {};

	data.forEach(row => {
		Object.keys(row).forEach(key => {
			[key] in totalColumn ? totalColumn[key] += row[key] : totalColumn[key] = row[key];
		});
	});

	data.forEach(row => {
		let total = 0;
		Object.keys(row).forEach(key => {
			if (typeof row[key] === 'number') {
				total += row[key];
			}
		});
		row.total = total;
	});

	let columns = labels.map(label => ({
		Header: label,
		accessor: label,
		Footer: totalColumn[label].toString()
	}));

	const breakdown = {
		accessor: 'breakdownTitle'
	};

	columns = [breakdown, ...columns];

	columns.push({
		Header: 'Итого',
		accessor: 'total'
	});

	return {
		columns,
		data
	};
};

const generateData = (widget) => {
	const {BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, COMBO, DONUT, LINE, PIE} = CHART_VARIANTS;
	const {SUMMARY, TABLE} = WIDGET_VARIANTS;

	const variants = {
		[BAR]: getAxisChartData,
		[BAR_STACKED]: getAxisChartData,
		[COLUMN]: getAxisChartData,
		[COLUMN_STACKED]: getAxisChartData,
		[COMBO]: getComboChartData,
		[DONUT]: getCircleChartData,
		[LINE]: getAxisChartData,
		[PIE]: getCircleChartData,
		[SUMMARY]: getSummaryData,
		[TABLE]: getTableData
	};

	return variants[widget.type.value](widget);
};

export default generateData;
