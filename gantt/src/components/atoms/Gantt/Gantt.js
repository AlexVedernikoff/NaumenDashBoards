// @flow
import './styles.less';
import 'naumen-gantt/codebase/dhtmlxgantt.css';
import CheckedMenu from 'components/atoms/CheckedMenu';
import {codeMainColumn} from 'src/store/App/constants';
import {deepClone} from 'helpers';
import {gantt} from 'naumen-gantt';
import {setColumnSettings, setColumnTask} from 'store/App/actions';
import Modal from 'src/components/atoms/Modal';
import ModalTask from 'components/atoms/ModalTask';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import './gant-export';

const HEIGHT_HEADER = 70;

const Gantt = (props: Props) => {
	const {attributesMap, columns, getListOfWorkAttributes, links, resources, rollUp, scale, tasks, workProgresses} = props;
	const [showMenu, setShowMenu] = useState(false);
	const [showModalConfirm, setShowModalConfirm] = useState(true);
	const [openModal, setOpenModal] = useState(false);
	const [initPage, setInitPage] = useState(false);
	const [res, setRes] = useState([]);
	const [position, setPosition] = useState({left: 0, top: 0});
	const dispatch = useDispatch();
	const ganttContainer = useRef(null);
	const store = useSelector(state => state);
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
						return '#' + weekNum + ', ' + dateToStr(endDate) + ' - ' + dateToStr(date);
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

		const dateToStr = gantt.date.date_to_str('%d.%m.%Y %H:%i');

		gantt.config.open_tree_initially = true;
		gantt.config.columns = configureAdaptedColumns();
		gantt.config.resize_rows = true;
		gantt.config.duration_unit = 'minute';
		gantt.config.duration_step = 1;
		gantt.config.scroll_size = 6;
		gantt.templates.parse_date = (dateStr) => {
			const timezone = /(GMT.*\))/.exec(new Date(dateStr));
			const deviation = timezone[0].slice(5, 6);
			const sign = timezone[0].slice(3, 4);
			let deleteDeviation = `${deviation}`;

			if (sign === '-') {
				deleteDeviation = `'-'${deviation}`;
				return deleteDeviation;
			}

			const newDate = gantt.date.add(new Date(dateStr), deleteDeviation, 'hour');
			return gantt.date.convert_to_utc(new Date(newDate));
		};

		gantt.ext.zoom.init(zoomConfig);

		gantt.attachEvent('onAfterTaskDrag', function (id, mode, e) {
			const taskId = gantt.getTask(id);

			const newTasks = store.APP.tasks;

			newTasks.forEach(i => {
				if (i.id === taskId.id) {
					i.progress = taskId.progress;
					i.start_date = taskId.start_date;
					i.end_date = taskId.end_date;
				}
			});
			const {saveChangedWorkInterval, saveChangedWorkProgress} = props;
			const wholeId = taskId.id.split('_');
			const finishProgress = taskId.progress;
			const finishId = wholeId[0];

			saveChangedWorkProgress(finishId, finishProgress);
			saveChangedWorkInterval ([
				{dateType: 'startDate', value: taskId.start_date, workUUID: finishId},
				{dateType: 'endDate', value: taskId.end_date, workUUID: finishId}
			]);

			dispatch(setColumnTask(newTasks));

			setOpenModal(true);
			setShowModalConfirm(true);
		});

		gantt.i18n.setLocale('ru');
		gantt.plugins({marker: true});
		gantt.plugins({
			tooltip: true
		});
		gantt.templates.tooltip_text = function (start, end, task) {
			return task[codeMainColumn];
		};

		if (!gantt._markers.fullOrder.length) {
			gantt.addMarker({
				css: 'today',
				start_date: new Date(),
				text: dateToStr(new Date()),
				title: dateToStr(new Date())
			});
		}

		generateGridWidth();
		gantt.config.fit_tasks = true;
		gantt.init(ganttContainer.current);
		gantt.clearAll();
	}, []);

	gantt.templates.drag_link = (from, from_start, to, to_start) => {
		const links = gantt.getLinks();

		if (links.length && !firstUpdate) {
			props.saveChangedWorkRelations(links);
		}
	};

	// Изменяет прогресс в задачах при изменении store.APP.workProgresses
	useEffect(() => {
		let arrProgressValues = [];

		if (Object.keys(store.APP.workProgresses).length && !firstUpdate) {
			if (store.APP.workProgresses) {
				arrProgressValues = Object.values(store.APP.workProgresses);

				for (let i = 0; i < tasks.length; i++) {
					tasks[i].progress = arrProgressValues[i];
				}
			}

			dispatch(setColumnTask(tasks));

			gantt.render();
		}

		gantt.parse((JSON.stringify({data: tasks, links: links})));
	}, [store.APP.workProgresses]);

	const [firstUpdate, setFirstUpdate] = useState(true);

	// Изменяет время и дату настроек диаграммы гантта при изменении [store.APP.startDate, store.APP.endDate]
	useLayoutEffect(() => {
		if (!firstUpdate) {
			gantt.config.start_date = store.APP.startDate;
			gantt.config.end_date = store.APP.endDate;
			gantt.render();
		}

		setFirstUpdate(false);
	}, [store.APP.startDate, store.APP.endDate]);

	// Изменяет временной формат на диграемме при изменении scale
	useEffect(() => {
		gantt.ext.zoom.setLevel(String(scale).toLowerCase());
	}, [scale]);

	// Отображает или скрывает детей задач при изменении rollUp
	useEffect(() => {
		tasks
			.filter(task => !task.parent)
			.map(task => task.id)
			.forEach(taskId => rollUp ? gantt.close(taskId) : gantt.open(taskId));
	}, [rollUp]);

	// Изменяет состояние ресурсов при изменении props.resources
	useEffect(() => {
		setRes(resources);
	}, [props.resources]);

	// Изменяет дефолтные настройки при изменения tasks
	useEffect(() => {
		const dateToStr = gantt.date.date_to_str('%d.%m.%Y %H:%i');

		gantt.clearAll();
		gantt.parse((JSON.stringify({data: tasks, links: links})));
		gantt.showDate(new Date());
		gantt.render();

		tasks
			.filter(task => !task.parent)
			.map(task => task.id)
			.forEach(taskId => rollUp ? gantt.close(taskId) : gantt.open(taskId));

		const dateX = gantt.posFromDate(new Date());
		const scrollTo = Math.max(dateX - gantt.config.task_scroll_offset, 0);

		gantt.scrollTo(scrollTo);
		gantt.addMarker({
			css: 'today',
			start_date: new Date(),
			text: dateToStr(new Date()),
			title: dateToStr(new Date())
		});
	}, [tasks]);

	// Отображает или скрывает прогресс при изменении props.progress
	useEffect(() => {
		gantt.config.show_progress = props.progress;
		gantt.render();
	}, [props.progress]);

	// Отображает связи между задачами при изменении props.allLinks
	useEffect(() => {
		gantt.config.show_links = props.allLinks;
		gantt.render();
	}, [props.allLinks]);

	// Экспортирует диаграмму при изменении props.flag
	useEffect(() => {
		if (initPage) {
			gantt.exportToPDF({
				name: "mygantt.pdf"
			});
		}

		setInitPage(true);
	}, [props.flag]);

	// Обновляет диаграмму при изменении props.refresh
	useEffect(() => {
		if (initPage) {
			props.getGanttData();
			gantt.render();
		}

		setInitPage(true);
	}, [props.refresh]);

	const handleHeaderClick = () => {
		gantt.attachEvent('onGridHeaderClick', function (name, e) {
			let ids;

			if (!e.target.childNodes[1]) {
				ids = e.target.id;
			}

			const column = gantt.getGridColumn(ids);

			if (column && !column.tree && name !== 'button') {
				gantt.getGridColumn('button').hide = false;
				column.hide = true;
				column.show = false;
				generateGridWidth();
				gantt.render();
			} else if (name === 'button') {
				setPosition({left: e.x, top: e.y - 52});
				setShowMenu(!showMenu);
			}
		});
	};

	const debounce = (f, t) => {
		return function (args) {
			const previousCall = this.lastCall;

			this.lastCall = Date.now();

			if (previousCall && ((this.lastCall - previousCall) <= t)) {
				clearTimeout(this.lastCallTimer);
			}

			this.lastCallTimer = setTimeout(() => f(args), t);
		};
	};

	const inlineEditors = gantt.ext.inlineEditors;

	inlineEditors.attachEvent('onBeforeSave', debounce(function (state) {
		const newTasks = deepClone(tasks);

		newTasks.map(function (i) {
			if (i.id === state.id) {
				for (const key in i) {
					if (key === state.columnName) {
						i[key] = state.newValue;
						i.text = i.code1;
					}
				}
			}
		});

		dispatch(setColumnTask(newTasks));

		return true;
	}, 100));

	const configureAdaptedColumns = () => {
		const adaptedColumns = [];

		if (columns && columns.length) {
			columns.forEach(item => adaptedColumns.push({
				...item,
				editor: item.editor,
				hide: !item.show,
				label: item.title + `<div id="${item.code}"></div>`,
				minWidth: 100,
				name: item.code,
				resize: true,
				width: '*'
			}));

			adaptedColumns[0].tree = true;
			adaptedColumns.push({hide: !columns.find(item => !item.show), name: 'button', width: 50});
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

		generateGridWidth();
		gantt.render();
	};

	const generateGridWidth = () => {
		const countColumns = gantt.config.columns.filter((col) => col.show).length;
		const isShowButton = gantt.config.columns.some((col) => !col.hide && col.name === 'button');

		gantt.config.grid_width = countColumns * 200 + (isShowButton ? 50 : 0);

		const newColums = deepClone(gantt.config.columns);

		const columnSettings = newColums.map(i => {
			const {hide, label, minWidth, name, resize, tree, width, ...column} = i;
			return column;
		});

		columnSettings.pop();
		dispatch(setColumnSettings(columnSettings));
	};

	const renderCheckedMenu = () => {
		const columns = gantt.config.columns;
		const items = [];

		for (let i = 0; i < columns.length; i++) {
			if (columns[i].hide) {
				items.push(columns[i]);
			}
		}

		if (items.length !== 0 && items[0].name === 'button') {
			setShowMenu(false);
		}

		return <CheckedMenu items={items} onCheck={checkItemMenuHide} onToggle={() => setShowMenu(!showMenu)} position={position} />;
	};

	const renderConfirmModal = () => {
		if (showModalConfirm) {
			return (
				<Modal
					notice={true}
					onClose={() => setShowModalConfirm(false)}
					onSubmit={() => setShowModalConfirm(false)}
					submitText="Подтвердить"
				>
					Изменение диапазона времени задачи выходит за рамки проекта!
				</Modal>
			);
		}

		return null;
	};

	const renderModalTask = () => {
		return (
			<ModalTask
				attributesMap={attributesMap}
				getListOfWorkAttributes={getListOfWorkAttributes}
				newTask={props.newTask}
				workAttributes={props.workAttributes}
			/>
		);
	};

	return (
		<>
			<div ref={ganttContainer} style={{height: '100%', width: '100%'}} />
			{showMenu && renderCheckedMenu()}
			{openModal && renderConfirmModal()}
			{renderModalTask()}
		</>
	);
};

export default Gantt;
