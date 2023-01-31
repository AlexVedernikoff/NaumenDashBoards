// @flow
import './gant-export';
import './styles.less';
import 'naumen-gantt/codebase/dhtmlxgantt.css';
import CheckedMenu from 'components/atoms/CheckedMenu';
import {deepClone, normalizeDate, shiftTimeZone} from 'helpers';
import {gantt} from 'naumen-gantt';
import ModalTask from 'components/atoms/ModalTask';
import {postEditedWorkData, savePositionOfWork, setColumnSettings, setColumnTask, setDiagramLinksData} from 'store/App/actions';
import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {config} from './config';

const HEIGHT_HEADER = 70;

const Gantt = (props: Props) => {
	const {
		attributesMap,
		columns,
		currentVersion,
		getListOfWorkAttributes,
		resources, rollUp, scale,
		tasks
	} = props;
	const [showMenu, setShowMenu] = useState(false);
	const [initPage, setInitPage] = useState(false);
	const [column, setColumn] = useState('');
	const [res, setRes] = useState([]);
	const [position, setPosition] = useState({left: 0, top: 0});
	const [errorAttr, setErrorAttr] = useState(false);
	const [tIndex, setTindex] = useState('');
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
						return `#${weekNum}, ${dateToStr(date)} - ${dateToStr(endDate)}`;
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
		const {tasks} = store.APP;
		const keys = ['end_date', 'start_date', 'id'];

		const tasksWithoutExcess = tasks.map(task => keys.reduce((acc, key) => {
			if (task[key]) {
				if (typeof task[key] === 'object') {
					const minutes = task[key].getMinutes();

					if (task.unscheduled) {
						acc.end_date = '';
						acc.start_date = '';
					} else if (minutes === 1 && key === 'end_date') {
						acc.end_date = '';
					} else {
						for (let item = 0; task < tasks.length; item++) {
							if (task.id === tasks[item].id) {
								if (tasks[item].start_date === '') {
									acc.start_date = '';
								} else {
									acc[key] = task[key];
								}
							}
						}
					}
				} else {
					acc[key] = task[key];
				}
			}

			acc[key] = task[key];
			return acc;
		}, {}));

		const newTasks = tasksWithoutExcess.map(task => {
			let startDate = null;
			let endDate = null;

			const shiftedEndDate = shiftTimeZone(task.end_date);
			const shiftedStartDate = shiftTimeZone(task.start_date);

			startDate = gantt.date.add(new Date(task.start_date), shiftedStartDate, 'hour');
			endDate = gantt.date.add(new Date(task.end_date), shiftedEndDate, 'hour');

			return {endDate, startDate, workUUID: task.id};
		});

		const arr = [];

		newTasks.map(task => {
			const startDateTask = {
				dateType: 'startDate',
				value: task.startDate,
				workUUID: task.workUUID
			};

			arr.push(startDateTask);

			const EndDateTask = {
				dateType: 'endDate',
				value: task.endDate,
				workUUID: task.workUUID
			};

			arr.push(EndDateTask);
		});

		const taskswithoutResource = arr.filter(i => !i.workUUID.includes('employee'));

		currentVersion === '' ? props.saveChangedWorkInterval(taskswithoutResource) : props.editWorkDateRangesFromVersion(currentVersion, taskswithoutResource);
	};

	useEffect(() => {
		gantt.attachEvent('onGanttReady', () => {
			const el = document.querySelector('.gantt_hor_scroll');

			if (el) {
				el.addEventListener('scroll', () => {
					document.documentElement.style.setProperty(
						'--gantt-frozen-column-scroll-left', el.scrollLeft + 'px'
					);
				});
			}
		});

		gantt.config.layout = config;
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
		gantt.config.order_branch = true;
		gantt.config.readonly = true;
		gantt.config.show_unscheduled = true;
		gantt.config.sort = true;
		gantt.config.grid_elastic_columns = 'min-width';

		gantt.config.round_dnd_dates = !!store.APP.multiplicityCheckbox;

		gantt.config.date_grid = '%d.%m.%Y %H:%i';

		gantt.templates.progress_text = (start, end, task) => Math.round(task.progress * 100) + '%';

		gantt.templates.task_unscheduled_time = () => '';

		const dateToStr = gantt.date.date_to_str('%d.%m.%Y %H:%i');

		gantt.attachEvent('onAfterLinkDelete', () => {
			const links = gantt.getLinks();

			dispatch(setDiagramLinksData(links));

			props.saveChangedWorkRelations(links);
		});

		gantt.plugins({
			auto_scheduling: true,
			marker: true,
			tooltip: true
		});

		gantt.plugins({
			tooltip: true
		});

		setTimeout(() => {
			gantt.ext.tooltips.tooltipFor({
				html: event => event.target.innerHTML,
				selector: '.gantt_cell'
			});

			gantt.templates.tooltip_text = (_, __, task) => {
				const storeTask = store.APP.tasks.find(TASK => TASK.id === task.id);

				if (task.type === 'milestone') {
					return `<br /><b>Название:</b> ${task.text} <br /><b>Контрольная точка:</b> ${dateToStr(task.start_date)}`;
				} else if (storeTask?.end_date && storeTask?.start_date) {
					return `<br /><b>Название:</b> ${task.text} <br /><b>Начальная дата:</b> ${dateToStr(task.start_date)}
						<br /><b>Конечная дата:</b> ${dateToStr(task.end_date)}`;
				} else {
					if (storeTask?.end_date) {
						return `<br /><b>Название:</b> ${task.text} <br /><b>Конечная дата:</b> ${dateToStr(task.end_date)}`;
					} else if (storeTask?.start_date) {
						return `<br /><b>Название:</b> ${task.text} <br /><b>Начальная дата:</b> ${dateToStr(task.start_date)}`;
					}
				}
			};
		}, 500);

		gantt.templates.parse_date = dateStr => {
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

			links.forEach(link => {
				link.editable = true;
			});

			dispatch(setDiagramLinksData(links));

			props.saveChangedWorkRelations(links);
			editWorkInterval();
		});

		// Переход на карточку работы по клику на иконку
		gantt.templates.grid_file = item => {
			const task = tasks.find(task => task.id === item.id);

			if (task?.workOfLink) {
				return `<a href=${task.workOfLink} target="_blank" class="gantt_tree_icon gantt_file"></a>`;
			}
		};

		gantt.config.auto_scheduling_compatibility = true;

		gantt.config.auto_scheduling = true;

		gantt.attachEvent('onAfterTaskMove', (id, parent, tindex) => {
			gantt.batchUpdate(function () {
				const tasksClone = deepClone(tasks);

				setTindex(tindex);
				tasksClone.forEach(task => {
					if (task.id === id) {
						task.parent = parent;
					}
				});

				dispatch(setColumnTask(tasksClone));
			});
		});

		gantt.attachEvent('onRowDragStart', function (id, target, e) {
			return true;
		});
	}, []);

	gantt.attachEvent('onBeforeRowDragEnd', debounce(async function (id, _, tindex) {
		const parent = gantt.getTask(id).parent;

		const res = await savePositionOfWork(id, parent, store.APP.diagramKey, tIndex, store.APP.currentVersion)(dispatch);

		if (res && res.status === 500) {
			gantt.moveTask(id, tindex, parent);

			alert('Нередактируемый атрибут, нельзя переместить работу');
		}
	}, 100));

	gantt.attachEvent('onAfterTaskDrag', debounce(function (id, parent) {
		const task = gantt.getTask(id);
		const newTasks = store.APP.tasks;

		const {saveChangedWorkProgress} = props;

		newTasks.forEach(i => {
			if (i.id === task.id) {
				i.code1 = task.text;
				i.title = task.text;
				i.text = task.text;
				i.start_date = task.start_date;
				i.end_date = task.end_date;
				i.progress = task.progress;
			}
		});

		editWorkInterval();

		saveChangedWorkProgress(task.id, task.progress);
		dispatch(setColumnTask(newTasks));


		gantt.render();
	}, 100));

	// Изменяет прогресс в задачах при изменении store.APP.workProgresses
	useEffect(() => {
		let arrProgressValues = [];
		const {workProgresses} = store.APP;

		if (Object.keys(workProgresses).length && !firstUpdate) {
			if (workProgresses) {
				arrProgressValues = Object.values(workProgresses);

				for (let i = 0; i < tasks.length; i++) {
					tasks[i].progress = arrProgressValues[i];
				}
			}

			dispatch(setColumnTask(tasks));
			gantt.render();
		}

		gantt.parse(JSON.stringify({data: tasks, links: store.APP.workRelations}));
		gantt.render();
	}, [store.APP.workProgresses]);

	const [firstUpdate] = useState(true);

	// Изменяет время и дату настроек диаграммы гантта при изменении [store.APP.startDate, store.APP.endDate]
	useEffect(() => {
		const {endDate, startDate} = store.APP;

		gantt.config.start_date = typeof startDate === 'string' ? normalizeDate(startDate) : normalizeDate((startDate).toLocaleString());
		gantt.config.end_date = typeof endDate === 'string' ? normalizeDate(endDate) : normalizeDate((endDate).toLocaleString());
		gantt.render();
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
			// eslint-disable-next-line no-unused-vars
			for (const key in task) {
				if (task[key] === true && key !== 'completed') {
					task[key] = 'да';
				} else if (task[key] === false && key !== 'completed') {
					task[key] = 'нет';
				} else if (typeof task[key] === 'object') {
					task[key] = '';
				}
			}
		});

		gantt.render();

		tasks
			.filter(task => !task.parent)
			.map(task => task.id)
			.forEach(taskId => rollUp ? gantt.close(taskId) : gantt.open(taskId));

		if (!gantt._markers.fullOrder.length) {
			gantt.addMarker({
				css: 'today',
				start_date: new Date(),
				text: dateToStr(new Date()),
				title: dateToStr(new Date())
			});
		}
	}, [tasks]);

	useEffect(() => {
		const milestone = document.querySelector('.gantt_bars_area');

		if (milestone) {
			if (store.APP.stateMilestonesCheckbox) {
				milestone.classList.add('isStateMilestone');
			} else {
				milestone.classList.remove('isStateMilestone');
			}
		}
	}, [store.APP.stateMilestonesCheckbox]);

	gantt.templates.task_class = (start, end, task) => {
		if (task.type === 'milestone' && task.completed) return `completed`;
	};

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

	// Отображает контрольные точки при изменении props.milestonesCheckbox
	useEffect(() => {
		const tasks = gantt.getTaskByTime();

		tasks.forEach(item => {
			if (item.type === 'milestone') {
				item.hide_bar = !store.APP.milestonesCheckbox;
			}
		});
		gantt.render();
	}, [store.APP.milestonesCheckbox, store.APP.worksWithoutStartOrEndDateCheckbox]);

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

	inlineEditors.attachEvent('onBeforeEditStart', state => {
		const tasksGantt = gantt.getTaskByTime();
		const columns = props.columns;
		const column = columns.find(column => column.code === state.columnName);

		tasksGantt.find(task => {
			if (task.id === state.id) {
				if (column.editor.type === 'text') {
					task.text = task[state.columnName];
				}
			}
		});

		return true;
	});

	inlineEditors.attachEvent('onBeforeSave', debounce(async function (state) {
		setColumn(state.columnName);
		const columns = props.columns;
		const column = columns.find(column => column.code === state.columnName);
		const columnOption = column.editor.options?.find(option => option.key === state.newValue);

		const code = props.resources[1].attributeSettings.find(item => item.code === state.columnName
			? item.attribute : null);
		const attributeCode = code.attribute.code;
		const newTasks = deepClone(tasks);

		const newTask = newTasks.find(i => i.id === state.id);

		if (newTask) {
			const workDate = {};

			if (column.editor.type === 'select') {
				workDate[attributeCode] = columnOption.value;
			} else if (column.editor.type === 'date') {
				const hours = shiftTimeZone(state.newValue);
				const newDate = gantt.date.add(new Date(state.newValue), +hours, 'hour');

				workDate[attributeCode] = newDate;
			} else {
				workDate[attributeCode] = state.newValue;
			}

			if (newTask.id.includes('s')) {
				const metaClassStr = 'serviceCall$PMTask';

				const res = await postEditedWorkData(workDate, metaClassStr, newTask.id)(dispatch);

				if (res) {
					res.status === 500 ? setErrorAttr(true) : setErrorAttr(false);
					const tasksGantt = gantt.getTaskByTime();

					tasksGantt.forEach(task => {
						if (task.id === state.id) {
							task.text = state.oldValue;
						}
					});
					gantt.render();
					alert('Нередактируемый атрибут');
					return false;
				} else {
					dispatch(postEditedWorkData(workDate, metaClassStr, newTask.id));

					// eslint-disable-next-line no-unused-vars
					for (const key in newTask) {
						if (key === state.columnName) {
							newTask[key] = state.newValue;
						}
					}
					dispatch(setColumnTask(newTasks));

					const tasksGantt = gantt.getTaskByTime();

					tasksGantt.forEach(task => {
						if (task.id === state.id) {
							task[state.columnName] = state.newValue;
							task.unscheduled = false;
							gantt.updateTask(state.id);
							gantt.updateTask(task.id);

							if (task.name === state.oldValue) {
								if (column.editor.type === 'text') {
									task.text = state.newValue;
									task.name = state.newValue;
								} else {
									task.text = state.oldValue;
								}
							} else {
								if (column.editor.type === 'text') {
									task.text = task.name;
								} else {
									task.text = task.name;
									store.APP.tasks.forEach(item => {
										if (item.id === task.id) {
											if (state.columnName === 'end_date' && item.start_date === '' && item.end_date === '') {
												task.start_date = task.end_date;
												task.duration = 0;
												gantt.updateTask(task.id);
											}
										}
									});
								}
							}

							gantt.render();
						}
					});
				}
			} else {
				const metaClassStr = 'employee';

				const res = await postEditedWorkData(workDate, metaClassStr, newTask.id)(dispatch);

				if (res) {
					res.status === 500 ? setErrorAttr(true) : setErrorAttr(false);
					const tasksGantt = gantt.getTaskByTime();

					tasksGantt.forEach(task => {
						task.text = state.oldValue;
					});
					gantt.render();
					alert('Нередактируемый атрибут');
					return false;
				} else {
					dispatch(postEditedWorkData(workDate, metaClassStr, newTask.id));

					// eslint-disable-next-line no-unused-vars
					for (const key in newTask) {
						if (key === state.columnName) {
							newTask[key] = state.newValue;
							newTask.text = state.newValue;
						}
					}
					dispatch(setColumnTask(newTasks));

					const tasksGantt = gantt.getTaskByTime();

					tasksGantt.forEach(task => {
						if (task.id === state.id) {
							task[state.columnName] = state.newValue;

							if (task.name === state.oldValue) {
								task.text = state.newValue;
								task.name = state.newValue;
							} else {
								task.text = task.name;
							}
						}
					});
				}
			}
		}

		gantt.render();

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
				min_width: 200,
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
		const countColumns = gantt.config.columns.filter(col => col.show).length;
		const isShowButton = gantt.config.columns.some(col => !col.hide && col.name === 'button');

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
				workData={props.workData}
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
