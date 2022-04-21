// @flow
import 'naumen-gantt/codebase/dhtmlxgantt.css';
import cn from 'classnames';
import {
	Datepicker, IconButton, TextInput, Select
} from 'naumen-common-components';
import {deepClone} from 'helpers';
import {deleteWork, postEditedWorkData, postNewWorkData, setColumnTask} from 'store/App/actions';
import {gantt} from 'naumen-gantt';
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
	const [initPage, setInitPage] = useState(false);
	const [options, setOptions] = useState([]);
	const [currentMetaClassFqn, setСurrentMetaClassFqn] = useState('');
	const {attributesMap, getListOfWorkAttributes} = props;
	const dispatch = useDispatch();
	const store = useSelector(state => state);

	const onChange = target => {
		setCurrentValue(target.value);
	};

	gantt.showLightbox = id => {
		setTaskId(id);
		const task = gantt.getTask(id);

		const metaClass = toString(task.id).includes('employee');

		if (metaClass) {
			const listEmployeeAtrributes = attributesMap.employee?.map(i => {
				return i.title;
			});

			setOptions(listEmployeeAtrributes);
			setСurrentMetaClassFqn('employee');
		} else {
			const listserviceAtrributes = attributesMap.serviceCall$PMTask ? attributesMap.serviceCall$PMTask : attributesMap.serviceCall;
			const listEmployeeAtrributes = listserviceAtrributes.map(i => {
				return i.title;
			});

			setOptions(listEmployeeAtrributes);
			attributesMap.serviceCall$PMTask ? setСurrentMetaClassFqn('serviceCall$PMTask') : setСurrentMetaClassFqn('serviceCall');
		}

		setShowModal(true);

		setCurrentValue(task.text);
		setInputStartDate('');
		setInputEndDate('');
	};

	gantt.hideLightbox = () => {
		setTaskId(null);
	};

	const convertDateToNormal = date => {
		const chunkDate = date.split(',');
		const dotReplacement = chunkDate[0].replace(/\./g, ',').split(',');

		[dotReplacement[0], dotReplacement[1]] = [dotReplacement[1], dotReplacement[0]];

		const modifiedDate = dotReplacement.join('.') + ',' + chunkDate[1];

		const withoutDotsandDash = modifiedDate.replace(/\./g, '/').replace(/\,/g, '');
		const modifiedDateStr = new Date(withoutDotsandDash);

		return modifiedDateStr;
	};

	let ID = '';
	const generateId = function () {
		ID = 'serviceCall$' + Math.random().toString(36).substr(2, 9) + '_' + Math.random().toString(36).substr(2, 9);
	};

	const save = () => {
		const newStartDate = new Date(convertDateToNormal(inputStartDate));
		const newEndDate = new Date(convertDateToNormal(inputEndDate));
		const tasks = deepClone(store.APP.tasks);
		const task = gantt.getTask(taskId);

		task.text = currentValue;

		const coincidence = tasks.some(i => i.id == taskId);

		if (Date.parse(newEndDate) >= Date.parse(newStartDate)) {
			if (!coincidence) {
				generateId();
				gantt.createTask({
					id: ID,
					code1: currentValue,
					end_date: newEndDate,
					start_date: newStartDate,
					text: currentValue,
					type: 'WORK'
				});

				const workDate = {
					PMFinDateEarly: newEndDate,
					PMPlanDate: newStartDate,
					title: currentValue
				};

				const tasksTwo = gantt.getTaskByTime();

				tasks.push(tasksTwo[tasksTwo.length - 1]);
				dispatch(postNewWorkData(workDate, currentMetaClassFqn, taskId));
				dispatch(setColumnTask(tasks));
				gantt.render();
			} else {
				tasks.forEach(i => {
					if (i.id === task.id) {
						i.start_date = newStartDate;
						i.end_date = newEndDate;
						i.code1 = currentValue;

						const workDate = {
							PMFinDateEarly: newEndDate,
							PMPlanDate: newStartDate,
							title: currentValue
						};

						dispatch(postEditedWorkData(workDate, currentMetaClassFqn, taskId));
					}

					dispatch(setColumnTask(tasks));
					gantt.render();
				});
			}

			setOptions([]);
			setShowModal(false);
		} else if (Date.parse(newEndDate) <= Date.parse(newStartDate)) {
			setValueError('Дата начала не может быть позднее даты завершения');
		} else if (!inputStartDate.length || !inputEndDate.length) {
			setValueError('Заполните все поля');
		} else {
			setValueError('Некорректная дата');
		}
	};

	const cancel = () => {
		const tasks = deepClone(store.APP.tasks);
		const task = gantt.getTask(taskId);

		if (task.$new) {
			gantt.deleteTask(task.id);
			gantt.hideLightbox();
		}

		setShowModal(false);
		dispatch(setColumnTask(tasks));
		setOptions([]);
		gantt.render();
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

	const [valueInterval, setValueInterval] = useState('Группы аттрибутов');
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
				id: ID,
				code1: currentValue,
				end_date: new Date,
				start_date: new Date,
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

	const listDataInterval = dataInterval.map((item, index) => {
		return (
			<div className={styles.interval__wrapper_input} key={index}>
				<span className={styles.interval__label}>{item.text}</span>
				<div className={styles.wrapper_input}>
					<TextInput className={styles.input} maxLength={30} onChange={item.changeDate} placeholder="дд.мм.гггг, чч:мм:сс" value={item.inputDate} />
					<IconButton className={styles.basket} icon="CALENDAR" onClick={() => item.setShowDatePickerDate(!item.showDatePickerDate)} />
				</div>
				{item.renderDatePickerDate()}
			</div>
		);
	});

	const renderModalTask = () => {
		if (showModal) {
			return (
				<div id="my-form">
					{renderHeader()}
					<div className={styles.modalFooter}>
						<label htmlFor="description">Название:
							<TextInput label="Название" maxLength={30} onChange={onChange} value={currentValue} />
						</label>
						<div className={styles.select}>
							<label>Группа аттрибутов:</label>
							<Select className={cn(styles.selectIcon, styles.top)} icon={'CHEVRON'} onSelect={handleIntervalChange} options={options} placeholder='Критерий' value={valueInterval} />
						</div>
						<div className={styles.interval}>
							{listDataInterval}
						</div>
						{props.workAttributes.map(i => <div key={i.code}><label>{i.title}</label> <TextInput className={styles.input} maxLength={30}></TextInput></div>)}
					</div>
				</div>
			);
		} else {
			return null;
		}
	};

	const renderModal = () => {
		if (showModalError) {
			return (
				<Modal
					className={styles.modal}
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
