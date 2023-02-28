// @flow
import 'naumen-gantt/codebase/dhtmlxgantt.css';
import cn from 'classnames';
import {
	Checkbox, Datepicker, FormControl, IconButton, Select, TextInput
} from 'naumen-common-components';
import {deepClone, normalizeDate, shiftTimeZone} from 'helpers';
import {deleteWork, getWorkData, postEditedWorkData, postNewWorkData, setColumnTask} from 'store/App/actions';
import {gantt} from 'naumen-gantt';
import {listMetaClass} from './consts';
import Modal from 'components/atoms/Modal/Modal';
import React, {useEffect, useState} from 'react';
import styles from './styles.less';
import {useDispatch, useSelector} from 'react-redux';

const ModalTask = (props: Props) => {
	const [currentValue, setCurrentValue] = useState(false);
	const [taskId, setTaskId] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [inputStartDate, setInputStartDate] = useState('');
	const [showModalError, setShowModalError] = useState(false);
	const [inputEndDate, setInputEndDate] = useState('');
	const [showDatePickerStartDate, setShowDatePickerStartDate] = useState(false);
	const [showDatePickerEndDate, setShowDatePickerEndDate] = useState(false);
	const [valueError, setValueError] = useState('');
	const [workLink, setWorkLink] = useState('/');
	const [initPage, setInitPage] = useState(false);
	const [options, setOptions] = useState([]);
	const [currentMetaClassFqn, setCurrentMetaClassFqn] = useState('');
	const [active, setActive] = useState(false);
	const {attributesMap, getListOfWorkAttributes, resources} = props;
	const dispatch = useDispatch();
	const store = useSelector(state => state);

	const onChange = target => {
		setCurrentValue(target.value);
	};

	const [currentTask, setCurrentTask] = useState({});

	gantt.showLightbox = id => {
		setTaskId(id);

		const task = gantt.getTask(id);

		setCurrentTask(task);
		setActive(task.completed);

		dispatch(getWorkData(task.id, store.APP.diagramKey));

		let defaultCurrentMetaClass = 'serviceCall$PMTask';

		setCurrentMetaClassFqn(defaultCurrentMetaClass);

		let attributeKey = '';

		for (let key in attributesMap) {
			const taskId = task.id;
			const newTaskId = taskId.split('$')[0];

			if (key.includes(newTaskId)) {
				defaultCurrentMetaClass = key;
			}

			if (defaultCurrentMetaClass === key) {
				attributeKey = attributesMap[key];
			}
		}

		if (defaultCurrentMetaClass) {
			const listEmployeeAtrributes = attributeKey?.map(i => {
				return i.title;
			});

			setOptions(listEmployeeAtrributes);
			setCurrentMetaClassFqn(defaultCurrentMetaClass);
		}

		setShowModal(true);

		setCurrentValue(task.text);

		const tasks = deepClone(store.APP.tasks);

		tasks.forEach(item => {
			if (item.start_date) {
				setInputStartDate(task.start_date.toLocaleString());
			} else {
				setInputStartDate('');
			}

			if (item.end_date) {
				setInputEndDate(task.end_date.toLocaleString());
			} else {
				setInputEndDate('');
			}
		});
	};

	gantt.hideLightbox = () => {
		setTaskId(null);
	};

	let ID = '';
	const generateId = function () {
		ID = 'serviceCall$' + Math.random().toString(36).substr(2, 9) + '_' + Math.random().toString(36).substr(2, 9);
	};

	const save = () => {
		const newStartDate = normalizeDate(inputStartDate);
		const newEndDate = normalizeDate(inputEndDate);
		const tasks = deepClone(store.APP.tasks);
		const task = gantt.getTask(taskId);
		const tasksGantt = gantt.getTaskByTime();

		task.text = currentValue;

		if (Date.parse(newEndDate) >= Date.parse(newStartDate) || currentTask.type === 'milestone') {
			const formatFunc = gantt.date.date_to_str('%Y-%m-%dT%H:%i:%s');
			const newFormatStartDate = formatFunc(newStartDate);
			const newFormatEndDate = formatFunc(newEndDate);

			tasks.forEach(i => {
				if (i.id === task.id) {
					i.start_date = newFormatStartDate;
					i.end_date = currentTask.type === 'milestone' ? newFormatStartDate : newFormatEndDate;
					i.code1 = currentValue;
					i.text = currentValue;
					i.title = currentValue;

					if (currentTask.type === 'milestone') {
						i.completed = active;
					}

					const attrStartDate = resources[1].startWorkAttribute.code;
					const attrEndDate = resources[1].endWorkAttribute.code;
					const attrMilestone = resources[1].checkpointStatusAttr.code;
					const workDate = {
						title: currentValue
					};

					if (currentTask.type === 'milestone') {
						workDate[attrMilestone] = newFormatStartDate;
						workDate.completed = currentTask.type === 'milestone' ? active : null;
					} else {
						workDate[attrStartDate] = newFormatStartDate;
						workDate[attrEndDate] = currentTask.type === 'milestone' ? newFormatStartDate : newFormatEndDate;
					}

					dispatch(postEditedWorkData(workDate, currentMetaClassFqn, taskId));
					task.start_date = newStartDate;
					task.end_date = currentTask.type === 'milestone' ? newStartDate : newEndDate;
				}
			});

			tasksGantt.forEach(i => {
				if (i.id === task.id) {
					i.start_date = newStartDate;
					i.end_date = currentTask.type === 'milestone' ? newStartDate : newEndDate;
					i.text = currentValue;
					i.name = currentValue;
					i.code1 = currentValue;

					if (currentTask.type === 'milestone') {
						i.completed = active;
					}
				}
			});

			dispatch(setColumnTask(tasks));

			gantt.render();
			setShowModal(false);
		} else if (Date.parse(newEndDate) <= Date.parse(newStartDate)) {
			setValueError('Дата начала не может быть позднее даты завершения');
		} else if (!inputStartDate || !inputEndDate) {
			setValueError('Заполните все поля');
		} else {
			setValueError('Некорректная дата');
		}
	};

	const cancel = () => {
		setShowModal(false);
	};

	const remove = () => {
		const tasks = deepClone(store.APP.tasks);
		const task = gantt.getTask(taskId);

		if (task.$target.length || task.$source.length) {
			gantt.hideLightbox();
			setShowModal(false);
			setShowModalError(true);
		} else {
			const newTasks = tasks.filter(i => i.id !== task.id);

			dispatch(deleteWork(task.id));
			dispatch(setColumnTask(newTasks));
			gantt.render();

			gantt.deleteTask(taskId);
			gantt.hideLightbox();
			setOptions([]);
			setShowModal(false);
		}
	};

	const [valueInterval, setValueInterval] = useState('Группы атрибутов');
	const handleIntervalChange = ({value}) => {
		const metaClass = toString(currentMetaClassFqn).includes('employee');
		let attribute = '';
		const newAttributesMapEmployee = deepClone(attributesMap.employee);
		const newAttributesMapService = attributesMap.serviceCall$PMTask ? attributesMap.serviceCall$PMTask : attributesMap.serviceCall;

		if (metaClass) {
			attribute = newAttributesMapEmployee.find(i => {
				if (i.title === value) {
					return i.code;
				}
			});
		} else {
			attribute = newAttributesMapService.find(i => {
				if (i.title === value) {
					return i.code;
				}
			});
		}

		getListOfWorkAttributes(currentMetaClassFqn, attribute.code, taskId);
		setValueInterval(value);
	};

	const onSelectStartDate = value => {
		setInputStartDate(new Date(value).toLocaleString());
		setShowDatePickerStartDate(false);
	};

	const onSelectEndDate = value => {
		setInputEndDate(new Date(value).toLocaleString());
		setShowDatePickerEndDate(!showDatePickerEndDate);
	};

	const renderDatePickerStartDate = () => {
		if (showDatePickerStartDate) {
			return <div className={styles.datepicker}><Datepicker onSelect={value => onSelectStartDate(value)} value="" /></div>;
		}
	};

	const onCloseDateModal = event => {
		const notInteractiveElements = [
			'src-components-Datepicker-styles__container',
			'src-components-Icon-styles__icon',
			'src-components-Datepicker-styles__daysContainer'
		];

		if (notInteractiveElements.includes(event.target.className && event.target.className.animVal) === false) {
			setShowDatePickerStartDate(false);
			setShowDatePickerEndDate(false);
		}
	};

	React.useEffect(() => {
		document.addEventListener('click', onCloseDateModal);
		return () => document.removeEventListener('click', onCloseDateModal);
	});

	useEffect(() => {
		const {link} = store.APP.workData;

		if (link) {
			setWorkLink(link);
		}
	}, [store.APP.workData]);

	const renderDatePickerEndDate = () => {
		if (showDatePickerEndDate) {
			return <div className={styles.datepicker}><Datepicker onSelect={(value) => onSelectEndDate(value)} value="" /> </div>;
		}
	};

	const changeStartDate = target => {
		setInputStartDate(target.value);
	};

	const changeEndDate = target => {
		setInputEndDate(target.value);
	};

	useEffect(() => {
		setCurrentValue('Новое задание');

		if (initPage) {
			gantt.createTask({
				code1: currentValue,
				end_date: new Date(),
				id: ID,
				start_date: new Date(),
				text: currentValue,
				type: 'WORK'
			});
		}

		setInitPage(true);
	}, [props.newTask]);

	const renderHeader = () => {
		return (
			<div className={styles.modalHeader}>
				<div className={styles.buttons}>
					<input name="delete" onClick={remove} type="button" value="Удалить" />
				</div>
				<div className={styles.buttons_grops}>
					<a className="workLink" href={workLink && workLink} rel="noreferrer" target="_blank">Переход на карточку работы</a>
					<input name="close" onClick={cancel} type="button" value="Отмена" />
					<input name="save" onClick={save} type="button" value="Сохранить" />
				</div>
			</div>
		);
	};

	const dataInterval = [
		{
			changeDate: changeStartDate,
			inputDate: inputStartDate,
			renderDatePickerDate: renderDatePickerStartDate,
			setShowDatePickerDate: setShowDatePickerStartDate,
			showDatePickerDate: showDatePickerStartDate,
			text: 'С'
		},
		{
			changeDate: changeEndDate,
			inputDate: inputEndDate,
			renderDatePickerDate: renderDatePickerEndDate,
			setShowDatePickerDate: setShowDatePickerEndDate,
			showDatePickerDate: showDatePickerEndDate,
			text: 'По'
		}
	];

	const dataMilestoneInterval = [
		{
			changeDate: changeStartDate,
			inputDate: inputStartDate,
			renderDatePickerDate: renderDatePickerStartDate,
			setShowDatePickerDate: setShowDatePickerStartDate,
			showDatePickerDate: showDatePickerStartDate,
			text: 'Контрольная точка'
		}
	];

	const dataFinal = currentTask.type === 'milestone' ? dataMilestoneInterval : dataInterval;

	const listDataInterval = dataFinal.map((item, index) => {
		if (item.inputDate) {
			return (
				<div className={styles.interval__wrapper_input} key={index}>
					<span className={styles.interval__label}>{item.text}</span>
					<div className={styles.wrapper_input}>
						<TextInput className={styles.input} maxLength={30} onChange={item.changeDate} placeholder="дд.мм.гггг, чч:мм:сс" value={item.inputDate} />
						<IconButton className={styles.basket} icon="TOUCH_CALENDAR" onClick={() => item.setShowDatePickerDate(!item.showDatePickerDate)} />
					</div>
					{item.renderDatePickerDate()}
				</div>
			);
		}
	});

	// нужно для следующего мр

	const handleCheckboxChange = () => {
		setActive(!active);
	};

	const renderCheckboxMilestone = () => {
		const classNames = cn({
			[styles.checkbox]: true,
			[styles.disabledInput]: store.APP.workData.disabledCompete
		});

		if (typeof currentTask.completed === 'boolean') {
			return (
				<FormControl className={classNames} label="Завершен этап контрольной точки" small={true}>
					<Checkbox checked={active} name="Checkbox" onChange={handleCheckboxChange} value={active} />
				</FormControl>
			);
		}

		return null;
	};

	const renderModalTask = () => {
		if (showModal) {
			return (
				<div id="my-form">
					{renderHeader()}
					<div className={styles.modalFooter}>
						<label className={!store.APP.workData.title && styles.disabledInput} htmlFor="description">Название:
							<TextInput label="Название" maxLength={30} onChange={onChange} value={currentValue} />
						</label>
						<div className={styles.interval}>
							{listDataInterval}
							{renderCheckboxMilestone()}
						</div>
						{props.workAttributes.map(i => <div key={i.code}><label>{i.title}</label> <TextInput className={styles.input} maxLength={30}></TextInput></div>)}
					</div>
				</div>
			);
		} else {
			return null;
		}
	};

	const classs = styles.modal + ' ' + styles.modalLink;

	const renderModal = () => {
		if (showModalError) {
			return (
				<Modal
					className={classs}
					notice={true}
					onClose={() => setShowModalError(false)}
					onSubmit={() => setShowModalError(false)}
					submitText="Ок"
				>
					<div className={styles.inputwrapper}>
						Невозможно удалить задачу, если она имеет связь с другими задачами
					</div>
				</Modal>
			);
		}

		return null;
	};

	return (
		<div className={styles.wrapper}>
			{renderModalTask()}
			{renderModal()}
		</div>
	);
};

export default ModalTask;
