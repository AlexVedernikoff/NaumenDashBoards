// @flow
import './styles.less';
import 'naumen-gantt/codebase/dhtmlxgantt.css';
import CheckedMenu from 'components/atoms/CheckedMenu';
import {codeMainColumn} from 'src/store/App/constants';
import {deepClone} from 'helpers';
import {gantt} from 'naumen-gantt';
import {getCommonTask, setColumnSettings, setColumnTask, setTask} from 'store/App/actions';
import Modal from 'src/components/atoms/Modal';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import './gant-export';

const HEIGHT_HEADER = 70;

const Gantt = (props: Props) => {
	let ID;
	const {columns, links, rollUp, scale, tasks} = props;
	const [showMenu, setShowMenu] = useState(false);
	const [showModalConfirm, setShowModalConfirm] = useState(true);
	const [openModal, setOpenModal] = useState(false);
	const [initPage, setinitPage] = useState(false);
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
		gantt.config.lightbox.sections = [
			{focus: true, height: 70, map_to: 'text', name: 'description', type: 'textarea'},
			{height: 72, map_to: 'auto', name: 'time', type: 'time'}
		];

		gantt.attachEvent('onTaskSelected', function (id) {
			gantt.showLightbox(id);
		});

		gantt.attachEvent('onLightboxSave', function (id, obj) {
			const newTasks = deepClone(tasks);
			const resultTasks = [];

			obj.code1 = obj.text;
			newTasks.map(i => {
				if (i.id !== id) {
					resultTasks.push(i);
				} else {
					i.code1 = obj.text;
					i.text = obj.text;
					i.start_date = obj.start_date;
					i.end_date = obj.end_date;
					resultTasks.push(i);
				}
			});
			gantt.render();
			dispatch(setColumnTask(newTasks));

			return true;
		});

		gantt.attachEvent('onAfterTaskDrag', function (id, mode, e) {
			const t = gantt.getTask(id);
			const task = {
				endDate: t.end_date,
				startDate: t.start_date,
				subjectUuid: id
			};

			console.log(task);

			setTask(task);

			setOpenModal(true);
			setShowModalConfirm(true);
			dispatch(getCommonTask());
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

	const [firstUpdate, setFirstUpdate] = useState(true);

	useLayoutEffect(() => {
		if (!firstUpdate) {
			gantt.config.start_date = store.APP.startDate;
			gantt.config.end_date = store.APP.endDate;
			gantt.render();
		}

		setFirstUpdate(false);
	}, [store.APP.startDate, store.APP.endDate]);

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

	useEffect(() => {
		gantt.config.show_progress = props.progress;
		gantt.render();
	}, [props.progress]);

	useEffect(() => {
		gantt.config.show_links = props.allLinks;
		gantt.render();
	}, [props.allLinks]);

	useEffect(() => {
		if (initPage) {
			gantt.exportToPDF({
				name: "mygantt.pdf"
			});
		}

		setinitPage(true);
	}, [props.flag]);

	useEffect(() => {
		gantt.render();
	}, [props.refresh]);

	const generateId = function () {
		ID = '_' + Math.random().toString(36).substr(2, 9);
	};

	useEffect(() => {
		generateId();
		const newTasks = deepClone(tasks);

		if (initPage) {
			gantt.createTask({
				// 5af9985a-79b4-42b9-9d0f-635f6d80561e: "Сотрудник"
				code1: 'Иванов Иван',
				end_date: '2021-11-13T11:55:26',
				id: ID,
				// level: 1,
				// parent: 'serviceCall$2419101_d872205c-edbf-483c-83b2-3334df874887',
				start_date: '2021-11-11T11:55:26',
				text: 'Иванов Иван',
				type: 'WORK'
			});
			// gantt.refreshData();
			const tasksTwo = gantt.getTaskByTime();

			newTasks.push(tasksTwo[tasksTwo.length - 1]);
			setinitPage(true);
			dispatch(setColumnTask(newTasks));
		}
	}, [props.newTask]);

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

	return (
		<>
			<div ref={ganttContainer} style={{height: '100%', width: '100%'}} />
			{showMenu && renderCheckedMenu()}
			{openModal && renderConfirmModal()}
		</>
	);
};

export default Gantt;
