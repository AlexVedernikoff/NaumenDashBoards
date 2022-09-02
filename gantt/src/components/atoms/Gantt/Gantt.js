// @flow
import './gant-export';
import './styles.less';
import 'naumen-gantt/codebase/dhtmlxgantt.css';
import CheckedMenu from 'components/atoms/CheckedMenu';
import {codeMainColumn} from 'src/store/App/constants';
import {deepClone, shiftTimeZone} from 'helpers';
import {gantt} from 'naumen-gantt';
import ModalTask from 'components/atoms/ModalTask';
import {postEditedWorkData, setColumnSettings, setColumnTask} from 'store/App/actions';
import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

const HEIGHT_HEADER = 70;

const Gantt = (props: Props) => {
	const {
		attributesMap,
		columns,
		currentVersion,
		getListOfWorkAttributes,
		resources, rollUp, scale,
		tasks,
		workProgresses,
		workRelations
	} = props;
	const [showMenu, setShowMenu] = useState(false);
	const [initPage, setInitPage] = useState(false);
	const [column, setColumn] = useState('');
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
				min_column_width: 120,
				name: 'week',
				scale_height: HEIGHT_HEADER,
				scales: [
					{format: function (date) {
						const dateToStr = gantt.date.date_to_str('%d %M');
						const endDate = gantt.date.add(date, 6, 'day');
						const weekNum = gantt.date.date_to_str('%W')(date);
						return '#' + weekNum + ', ' + dateToStr(date) + ' - ' + dateToStr(endDate);
					},
					step: 1,
					unit: 'week'},
					{format: '%j %D', step: 1, unit: 'day'}
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

	const editWorkInterval = () => {
		const tasks = gantt.getTaskByTime();
		const keys = ['end_date', 'start_date', 'id'];

		const tasksWithoutExcess = tasks.map((obj) => keys.reduce((acc, key) => {
			acc[key] = obj[key];
			return acc;
		}, {}));

		const newTasks = tasksWithoutExcess.map(function (obj) {
			return {'endDate': obj.end_date, 'startDate': obj.start_date, 'workUUID': obj.id};
		});

		const arr = [];

		newTasks.map(obj => {
			const startDateTask = {
				dateType: 'startDate',
				value: obj.startDate,
				workUUID: obj.workUUID
			};

			arr.push(startDateTask);

			const EndDateTask = {
				dateType: 'endDate',
				value: obj.endDate,
				workUUID: obj.workUUID
			};

			arr.push(EndDateTask);
		});

		const taskswithoutResource = arr.filter(i => !i.workUUID.includes('employee'));

		currentVersion === '' ? props.saveChangedWorkInterval(taskswithoutResource) : props.editWorkDateRangesFromVersion(currentVersion, taskswithoutResource);
	};

	useEffect(() => {
		gantt.config.auto_scheduling = true;
		gantt.config.autoscroll = true;
		gantt.config.auto_scheduling = true;
		gantt.config.columns = configureAdaptedColumns();
		gantt.config.drag_project = true;
		gantt.config.drag_multiple = true;
		gantt.config.duration_unit = 'minute';
		gantt.config.duration_step = 1;
		gantt.config.fit_tasks = true;
		gantt.config.open_tree_initially = true;
		gantt.config.resize_rows = true;
		gantt.config.scale_offset_minimal = false;
		gantt.config.scroll_size = 6;
		gantt.config.round_dnd_dates = false;
		gantt.config.order_branch = true;
		gantt.config.readonly = true;

		gantt.templates.progress_text = (start, end, task) => gantt.getState().drag_id === task.id ? Math.round(task.progress * 100) + '%' : '';
		gantt.templates.rightside_text = (start, end, task) => task.type === gantt.config.types.milestone ? task.text : '';

		const dateToStr = gantt.date.date_to_str('%d.%m.%Y %H:%i');

		gantt.attachEvent('onAfterLinkDelete', () => {
			const links = gantt.getLinks();

			props.saveChangedWorkRelations(links);
		});

		gantt.plugins({
			auto_scheduling: true,
			marker: true,
			multiselect: true,
			tooltip: true
		});

		gantt.plugins({
			tooltip: true
		});

		setTimeout(() => {
			gantt.ext.tooltips.tooltipFor({
				html: (event) => event.target.innerHTML,
				selector: '.gantt_cell'
			});
		}, 500);

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

		handleHeaderClick();

		gantt.ext.zoom.init(zoomConfig);
		gantt.i18n.setLocale('ru');

		if (!gantt._markers.fullOrder.length) {
			gantt.addMarker({
				css: 'today',
				start_date: new Date(),
				text: dateToStr(new Date()),
				title: dateToStr(new Date())
			});
		}

		generateGridWidth();
		gantt.init(ganttContainer.current);
		gantt.clearAll();

		gantt.attachEvent('onAfterLinkAdd', () => {
			const links = gantt.getLinks();

			props.saveChangedWorkRelations(links);
			editWorkInterval();
		});

		//Переход на карточку работы по клику на иконку
		gantt.templates.grid_file = item => {
			const task = tasks.find(task => task.id === item.id);

			if (task?.workOfLink) {
				return `<a href=${task.workOfLink} class='gantt_tree_icon gantt_file'></a>`;
			}
		};

		gantt.config.auto_scheduling_compatibility = true;

		gantt.config.auto_scheduling = true;
	}, []);

	gantt.attachEvent('onAfterTaskDrag', debounce(function (id) {
		const task = gantt.getTask(id);
		const newTasks = store.APP.tasks;

		const deleteDeviationForEndDate = shiftTimeZone(task.end_date);
		const deleteDeviationForStartDate = shiftTimeZone(task.start_date);

		const startDate = gantt.date.add(new Date(task.start_date), deleteDeviationForStartDate, 'hour');
		const endDate = gantt.date.add(new Date(task.end_date), deleteDeviationForEndDate, 'hour');

		const {saveChangedWorkProgress} = props;

		newTasks.forEach(i => {
			i.code1 = task.text;
			i.title = task.text;
			i.text = task.text;

			if (i.id === task.id) {
				i.start_date = startDate;
				i.end_date = endDate;
				i.progress = task.progress;
			}
		});

		editWorkInterval();

		task.start_date = startDate;
		task.end_date = endDate;
		saveChangedWorkProgress(task.id, task.progress);
		dispatch(setColumnTask(newTasks));
	}, 100));

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

		gantt.parse((JSON.stringify({data: tasks, links: workRelations})));
	}, [store.APP.workProgresses]);

	const [firstUpdate, setFirstUpdate] = useState(true);

	// Изменяет время и дату настроек диаграммы гантта при изменении [store.APP.startDate, store.APP.endDate]
	useEffect(() => {
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

		tasks.forEach(task => {
			for (let key in task) {
				if (task[key] === true) {
					task[key] = 'да';
				} else if (task[key] === false) {
					task[key] = 'нет';
				} else if (typeof task[key] === 'object') {
					task[key] = '';
				}
			}
		});

		gantt.clearAll();
		gantt.parse((JSON.stringify({data: tasks, links: workRelations})));
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

	// Отображает или скрывает прогресс при изменении props.progressCheckbox
	useEffect(() => {
		gantt.config.show_progress = props.progressCheckbox;
		gantt.render();
	}, [props.progressCheckbox]);

	// Отображает связи между задачами при изменении props.workRelationCheckbox
	useEffect(() => {
		gantt.config.show_links = props.workRelationCheckbox;
		gantt.render();
	}, [props.workRelationCheckbox]);

	// Отображает контрольные точки при изменении props.workMilestonesCheckbox
	useEffect(() => {
		const tasks = gantt.getTaskByTime();

		tasks.forEach(item => {
			if (item.hide_bar === '') {
				item.hide_bar = true;
			} else if (item.hide_bar === true) {
				item.hide_bar = '';
			}
		});

		gantt.render();
	}, [props.milestones]);

	// Экспортирует диаграмму при изменении props.flag
	useEffect(() => {
		if (initPage) {
			gantt.exportToPDF({
				name: 'mygantt.pdf'
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

	const inlineEditors = gantt.ext.inlineEditors;

	inlineEditors.attachEvent('onBeforeSave', debounce(function (state) {
		setColumn(state.columnName);

		const code = props.resources[0].attributeSettings.find(item => item.code === state.columnName
			? item.attribute : props.resources[1].attributeSettings.find(item => item.code === state.columnName ? item.attribute : null));
		const attributeCode = code.attribute.code;
		const newTasks = deepClone(tasks);

		newTasks.map(function (i) {
			if (i.id === state.id) {
				for (const key in i) {
					if (key === state.columnName) {
						i[key] = state.newValue;
						i.text = state.newValue;
					}
				}
			}
		});

		newTasks.find(i => {
			if (i.id === state.id) {
				const workDate = {};

				workDate[attributeCode] = state.newValue;

				if (i.id.includes('s')) {
					const metaClassStr = 'serviceCall$PMTask';

					dispatch(postEditedWorkData(workDate, metaClassStr, i.id));
				} else {
					const metaClassStr = 'employee';

					dispatch(postEditedWorkData(workDate, metaClassStr, i.id));
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

	const renderModalTask = () => {
		return (
			<ModalTask
				attributesMap={attributesMap}
				getListOfWorkAttributes={getListOfWorkAttributes}
				mandatoryAttributes={props.mandatoryAttributes}
				newTask={props.newTask}
				postEditedWorkData={props.postEditedWorkData}
				postNewWorkData={props.postNewWorkData}
				resources={props.resources}
				workAttributes={props.workAttributes}
				workLink={props.workLink}
			/>
		);
	};

	return (
		<>
			<div ref={ganttContainer} style={{height: '100%', width: '100%'}} />
			{showMenu && renderCheckedMenu()}
			{renderModalTask()}
		</>
	);
};

export default Gantt;
