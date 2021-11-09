// @flow
import './styles.less';
import 'naumen-gantt/codebase/dhtmlxgantt.css';
import CheckedMenu from 'components/atoms/CheckedMenu';
import {codeMainColumn} from 'src/store/App/constants';
import {gantt} from 'naumen-gantt';
import React, {useEffect, useRef, useState} from 'react';

const HEIGHT_HEADER = 70;

const Gantt = (props: Props) => {
	const {columns, rollUp, scale, tasks} = props;
	const [showMenu, setShowMenu] = useState(false);
	const [position, setPosition] = useState({left: 0, top: 0});
	const ganttContainer = useRef(null);
	const zoomConfig = {
		levels: [
			{
				min_column_width: 80,
				name: 'day',
				scale_height: HEIGHT_HEADER,
				scales: [
					{format: '%H:%i', unit: 'hour'},
					{format: '%j %M', unit: 'day'}
				]
			},
			{
				min_column_width: 50,
				name: 'week',
				scale_height: HEIGHT_HEADER,
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
				scale_height: HEIGHT_HEADER,
				scales: [
					{format: '%Y', unit: 'year'}
				]
			},
			{
				min_column_width: 120,
				name: 'month',
				scale_height: HEIGHT_HEADER,
				scales: [
					{format: '%F', unit: 'month'},
					{format: '%Y', unit: 'year'}
				]
			},
			{
				min_column_width: 90,
				name: 'quarter',
				scale_height: HEIGHT_HEADER,
				scales: [
					{format: '%M', unit: 'month'},
					{format: function (date) {
						const month = date.getMonth();
						const year = date.getFullYear();
						let qNum;

						if (month >= 9) {
							qNum = 4;
						} else if (month >= 6) {
							qNum = 3;
						} else if (month >= 3) {
							qNum = 2;
						} else {
							qNum = 1;
						}

						return qNum + ' квартал' + ' | ' + year;
					},
					unit: 'quarter'
					}
				]
			}
		]
	};

	useEffect(() => {
		handleHeaderClick();

		gantt.config.open_tree_initially = true;
		gantt.config.resize_rows = true;
		gantt.config.grid_resize = true;
		gantt.config.keep_grid_width = true;
		gantt.config.columns = configureAdaptedColumns();
		gantt.config.scroll_size = 18;
		gantt.plugins({
			tooltip: true
		});
		gantt.templates.tooltip_text = function (start, end, task) {
			return task[codeMainColumn];
		};
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
		gantt.config.columns = configureAdaptedColumns();
		gantt.render();
	}, [columns]);

	useEffect(() => {
		gantt.clearAll();
		gantt.parse(JSON.stringify({data: tasks}));
		gantt.render();
	}, [tasks]);

	useEffect(() => {
		tasks
			.filter(task => !task.parent)
			.map(task => task.id)
			.forEach(taskId => rollUp ? gantt.close(taskId) : gantt.open(taskId));
	}, [rollUp, tasks]);

	const handleHeaderClick = () => {
		gantt.attachEvent('onGridHeaderClick', function (name, e) {
			const column = gantt.getGridColumn(name);

			if (column && !column.tree && column.name !== 'button') {
				gantt.getGridColumn('button').hide = false;
				column.hide = true;
				column.show = false;
				gantt.render();
			} else if (column.name === 'button') {
				setPosition({left: e.x, top: e.y - 52});
				setShowMenu(!showMenu);
			}
		});
	};

	const configureAdaptedColumns = () => {
		const adaptedColumns = [];

		if (columns && columns.length) {
			columns.forEach(item => adaptedColumns.push({
				...item,
				hide: !item.show,
				label: item.title,
				minWidth: 100,
				name: item.code,
				resize: true,
				width: 180
			}));
			adaptedColumns[0].tree = true;
			adaptedColumns.push({hide: !columns.find(item => !item.show), name: 'button', resize: true, width: 44});
			adaptedColumns[0].template = task => {
				if (!task.parent || task.type === 'RESOURCE') {
					return '<b>' + task[adaptedColumns[0].name] + '</b>';
				}

				return task[adaptedColumns[0].name];
			};
			return adaptedColumns;
		}
	};

	const checkItemMenuHide = (column, value) => {
		gantt.getGridColumn(column.name).hide = !value;
		gantt.getGridColumn(column.name).show = value;
		gantt.getGridColumn('button').hide = value && !gantt.config.columns.find(item => item.hide);
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

		return <CheckedMenu items={items} onCheck={checkItemMenuHide} onToggle={() => setShowMenu(!showMenu)} position={position} />;
	};

	return (
		<>
			<div ref={ganttContainer} style={{height: '100%', width: '100%'}} />
			{showMenu && renderCheckedMenu()}
		</>
	);
};

export default Gantt;
