// @flow
import './styles.less';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import CheckedMenu from 'components/atoms/CheckedMenu';
import {gantt} from 'dhtmlx-gantt';
import React, {useEffect, useRef, useState} from 'react';

const Gantt = (props: Props) => {
	const {columns, rollUp, scale, tasks} = props;
	const [showMenu, setShowMenu] = useState(false);
	const [adaptedColumns, setAdaptedColumns] = useState([]);
	const ganttContainer = useRef(null);
	const zoomConfig = {
		levels: [
			{
				min_column_width: 80,
				name: 'day',
				scale_height: 50,
				scales: [
					{format: '%H:%i', unit: 'hour'},
					{format: '%j %M', unit: 'day'}
				]
			},
			{
				min_column_width: 50,
				name: 'week',
				scale_height: 50,
				scales: [
					{format: function (date) {
						const dateToStr = gantt.date.date_to_str('%d %M');
						const endDate = gantt.date.add(date, -6, 'day');
						const weekNum = gantt.date.date_to_str('%W')(date);
						return '#' + weekNum + ', ' + dateToStr(date) + ' - ' + dateToStr(endDate);
					},
					step: 1,
					unit: 'week'},
					{format: '%j %D', unit: 'day'}
				]
			},
			{
				min_column_width: 30,
				name: 'year',
				scale_height: 50,
				scales: [
					{format: '%Y', unit: 'year'}
				]
			},
			{
				min_column_width: 120,
				name: 'month',
				scale_height: 50,
				scales: [
					{format: '%F', unit: 'month'},
					{format: '%Y', unit: 'year'}
				]
			}
		]
	};

	useEffect(() => {
		configureAdaptedColumns();

		gantt.config.open_tree_initially = true;
		gantt.config.resize_rows = true;
		gantt.config.grid_resize = true;
		gantt.config.keep_grid_width = true;
		gantt.config.columns = adaptedColumns;

		gantt.templates.parse_date = (dateStr) => gantt.date.convert_to_utc(new Date(dateStr));
		gantt.ext.zoom.init(zoomConfig);
		gantt.showLightbox = function (id) {};
		gantt.init(ganttContainer.current);
		gantt.i18n.setLocale('ru');
		gantt.config.duration_unit = 'minute';
		gantt.config.duration_step = 1;
	}, []);

	useEffect(() => {
		gantt.ext.zoom.setLevel(String(scale).toLowerCase());
	}, [scale]);

	useEffect(() => {
		tasks
			.filter(task => !task.parent)
			.map(task => task.id)
			.forEach(taskId => rollUp ? gantt.close(taskId) : gantt.open(taskId));
	}, [rollUp]);

	useEffect(() => {
		gantt.config.columns = adaptedColumns;
		gantt.render();
	}, [adaptedColumns]);

	useEffect(() => {
		gantt.clearAll();
		gantt.parse(JSON.stringify({data: tasks}));
		gantt.render();
	}, [tasks]);

	gantt.attachEvent('onGridHeaderClick', function (name, e) {
		const column = gantt.getGridColumn(name);

		if (column && !column.tree && column.name !== 'button') {
			column.hide = true;
			column.show = false;
			gantt.render();
		} else if (column.name === 'button') {
			console.log(name);
			// e.clientX
			// e.clientY
			console.log(e);
			setShowMenu(!showMenu);
		}
	});

	const configureAdaptedColumns = () => {
		columns.forEach(item => adaptedColumns.push({
			...item,
			hide: !item.show,
			label: item.title,
			name: item.code,
			resize: true,
			width: 180
		}));
		adaptedColumns[0].tree = true;
		adaptedColumns.push({hide: false, name: 'button', resize: true, width: 44});
		adaptedColumns[0].template = task => {
			if (!task.parent || task.type === 'RESOURCE') {
				return '<b>' + task[adaptedColumns[0].name] + '</b>';
			}

			return task[adaptedColumns[0].name];
		};

		setAdaptedColumns(adaptedColumns);
	};

	const checkItemMenuHide = column => {
		gantt.getGridColumn(column.name).hide = false;
		gantt.getGridColumn(column.name).show = true;
		gantt.render();
	};

	const renderCheckedMenu = () => {
		const columns = gantt.config.columns;
		const items = [];

		for (let i = 0; i < columns.length; i++) {
			if (columns[i].hide) {
				items.push(columns[i]);
			}
		}

		return <CheckedMenu items={items} onCheck={checkItemMenuHide} onToggle={() => setShowMenu(!showMenu)} />;
	};

	return (
		<>
			<div ref={ganttContainer} style={{height: '100%', width: '100%'}} />
			{showMenu && renderCheckedMenu()}
		</>
	);
};

export default Gantt;
