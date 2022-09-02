// @flow
import 'naumen-gantt/codebase/dhtmlxgantt.css';
import cn from 'classnames';
import {
	Checkbox, Datepicker, IconButton, Select, TextInput
} from 'naumen-common-components';
import {deepClone} from 'helpers';
import {deleteWork, getWorlLink, postEditedWorkData, postNewWorkData, setColumnTask} from 'store/App/actions';
import {gantt} from 'naumen-gantt';
import {listMetaClass} from './consts';
import Modal from 'components/atoms/Modal/Modal';
import React, {useEffect, useState} from 'react';
import styles from './styles.less';
import {useDispatch, useSelector} from 'react-redux';
import MandatoryAttributes from 'components/atoms/MandatoryAttributes';

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
	const [attr, setAttr] = useState([]);
	const [options, setOptions] = useState([]);
	const [currentMetaClassFqn, setCurrentMetaClassFqn] = useState('');
	const [currentMandatoryAttributes, setCurrentMandatoryAttributes] = useState([]);
	const {attributesMap, getListOfWorkAttributes, mandatoryAttributes, resources} = props;
	const dispatch = useDispatch();
	const store = useSelector(state => state);

	const onChange = target => {
		setCurrentValue(target.value);
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

	const [currentTask, setCurrentTask] = useState({});

	gantt.showLightbox = id => {
		setTaskId(id);

		const task = gantt.getTask(id);
		setCurrentTask(task);

		dispatch(getWorlLink(task.id));

		let defaultCurrentMetaClass = 'serviceCall$PMTask';

		setCurrentMetaClassFqn(defaultCurrentMetaClass);

		let attributeKey = '';

		for (let key in attributesMap) {
			const taskId = task.id;
			const metaClass = taskId.split('$')[0];

			if (key.includes(metaClass)) {
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
		setInputStartDate(new Date((task.start_date)).toLocaleString());
		setInputEndDate(new Date((task.end_date)).toLocaleString());
		// изменения нужны для селдующего мр по 3 итерации

		// const cloneMandatoryAttributes = deepClone(mandatoryAttributes);

		// for (let key in cloneMandatoryAttributes) {
		// 	if (key === currentMetaClass) {
		// 		setCurrentMandatoryAttributes(cloneMandatoryAttributes[key]);
		// 	}
		// }
	};

	gantt.hideLightbox = () => {
		setTaskId(null);
	};

	let ID = '';
	const generateId = function () {
		ID = 'serviceCall$' + Math.random().toString(36).substr(2, 9) + '_' + Math.random().toString(36).substr(2, 9);
	};

	const save = (e) => {
		// const formik = formref.current.elements;
		// const arr = [];

		// for (let key of formik) {
		// 	let b = key.name;
		// 	let a = {[b]: key.value}

		// 	arr.push(a);
		// }
		// setAttr(arr);

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
					code1: currentValue,
					end_date: newEndDate,
					id: ID,
					start_date: newStartDate,
					text: currentValue,
					type: 'WORK'
				});

				const attrStartDate = resources[1].startWorkAttribute.code;
				const attrEndDate = resources[1].endWorkAttribute.code;

				const workDate = {
					title: currentValue
				};

				workDate[attrStartDate] = newStartDate;
				workDate[attrEndDate] = newEndDate;

				const tasksTwo = gantt.getTaskByTime();

				tasks.push(tasksTwo[tasksTwo.length - 1]);
				dispatch(postNewWorkData(workDate, currentMetaClassFqn));
				// следующая итерация
				// dispatch(postNewWorkData(workDate, currentMetaClassFqn, attr));
				dispatch(setColumnTask(tasks));
				gantt.render();
			} else {
				tasks.forEach(i => {
					if (i.id === task.id) {
						i.start_date = newStartDate;
						i.end_date = newEndDate;
						i.code1 = currentValue;
						i.text = currentValue;
						i.title = currentValue;
						const attrStartDate = resources[1].startWorkAttribute.code;
						const attrEndDate = resources[1].endWorkAttribute.code;
						const workDate = {
							title: currentValue
						};

						workDate[attrStartDate] = newStartDate;
						workDate[attrEndDate] = newEndDate;

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
					<a className="workLink" href={props.workLink} rel="noreferrer" target="_blank">Переход на карточку работы</a>
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

	// нужно для следующего мр
	// const [active, setActive] = useState(false);

	// setActive(false);

	// const handleCheckboxChange = () => {
	// 	setActive(!active);

	// 	if (currentTask.type === 'milestone') {
	// 		const gantt_selected = document.querySelector('.gantt_milestone.gantt_selected');

	// 		if (active) {
	// 			gantt_selected.classList.remove('completed');
	// 		} else {
	// 			gantt_selected.classList.add('completed');
	// 		}
	// 	}
	// };

	const renderModalTask = () => {
		if (showModal) {
			return (
				<div id="my-form">
					{renderHeader()}
					<div className={styles.modalFooter}>
						<label htmlFor="description">Название:
							<TextInput label="Название" maxLength={30} onChange={onChange} value={currentValue} />
						</label>
						{/* // следующая итерация */}
						{/* <div className={styles.select}>
							<label>Группа аттрибутов:</label>
							<Select className={cn(styles.selectIcon, styles.top)} icon={'CHEVRON'} onSelect={handleIntervalChange} options={options} placeholder='Критерий' value={valueInterval} />
						</div> */}
						{/* <form ref={formref} id="form" onSubmit={save}>
						{currentMandatoryAttributes.map((item, index) => <MandatoryAttributes code={item.code} key={index} title={item.title} value='' />)}
						</form> */}
						<div className={styles.interval}>
							{listDataInterval}
							{/* <Checkbox checked={active} name="Checkbox" onChange={handleCheckboxChange} value={active} /> */}
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
