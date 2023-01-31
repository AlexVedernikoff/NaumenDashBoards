// @flow
import {
	Button,
	Checkbox,
	Datepicker,
	FormControl,
	Icon,
	IconButton,
	Loader,
	Select,
	TextInput
} from 'naumen-common-components';
import cn from 'classnames';
import ColorPanel from 'src/components/molecules/ColorPanel';
import type {Column, ResourceSetting} from 'src/store/App/types';
import {CommonSettings} from 'store/App/types';
import {connect, useDispatch, useSelector} from 'react-redux';
import {deepClone, isEmpty, normalizeDate, shiftTimeZone} from 'src/helpers';
import {defaultColumn} from 'src/store/App/constants';
import {defaultResourceSetting} from 'store/App/constants';
import {ERROR_MESSAGES, IntervalSelectionCriterion, JobTitleType, ScaleNames} from './consts';
import Form from 'src/components/atoms/Form';
import {functions, props} from './selectors';
import {gantt} from 'naumen-gantt';
import {
	getChild,
	getIndexBottomNeighbor,
	getNeighbor,
	getUpdatedLevel,
	skipChildren
} from './utils';
import GridLayout from 'react-grid-layout';
import Modal from 'src/components/atoms/Modal';
import type {Props} from './types';
import React, {useEffect, useState} from 'react';
import Resource from './components/Resource';
import {
	setColumnTask,
	setTextWork,
	switchMultiplicityCheckbox,
	switchViewOfNestingCheckbox,
	updateWorks
} from 'store/App/actions';
import ShowBox from 'src/components/atoms/ShowBox';
import styles from './styles.less';
import {v4 as uuidv4} from 'uuid';
import Work from './components/Work';

const FormPanel = (props: Props) => {
	const dispatch = useDispatch();
	const store = useSelector(state => state);
	const {
		endDate,
		errorSettings,
		handleToggleLinks,
		handleToggleMilestoneBlock,
		handleToggleProgress,
		handleToggleStateMilestoneBlock,
		loading,
		resources,
		settings,
		startDate
	} = props;
	const {columnSettings} = settings;
	const [showModal, setShowModal] = useState(false);
	const [columnSettingsModal, setColumnSettingsModal] = useState([]);
	const [layout, setLayout] = useState([]);
	const [error, setError] = useState('');
	const [inputStartDate, setInputStartDate] = useState('');
	const [inputEndDate, setInputEndDate] = useState('');
	const [inputMonthDays, setInputMonthDays] = useState('');
	const [inputLastDays, setinputLastDays] = useState('');
	const [currentInterval, setCurrentInterval] = useState(store.APP.currentInterval);
	const [showDatePickerStartDate, setShowDatePickerStartDate] = useState(false);
	const [showDatePickerEndDate, setShowDatePickerEndDate] = useState(false);
	const [valueError, setValueError] = useState('');
	const [diagramStartDate, setDiagramStartDate] = useState(new Date(store.APP.startDate));
	const [diagramEndDate, setDiagramEndDate] = useState(new Date(store.APP.endDate));
	const [valueInterval, setValueInterval] = useState(store.APP.currentInterval);
	const [href, setHref] = useState('#');
	const [isErrorHref, setIsErrorHref] = useState(false);
	const [viewWork, setViewWork] = useState(store.APP.viewWork);

	useEffect(() => {
		setViewWork(store.APP.viewWork);

		if (store.APP.viewWork?.value === 'about') {
			gantt.templates.rightside_text = (start, end, task) => task.text;
			gantt.templates.task_text = () => '';
			gantt.render();
		} else if (store.APP.viewWork?.value === 'work') {
			gantt.templates.rightside_text = () => '';
			gantt.templates.task_text = (start, end, task) => task.text;
			gantt.render();
		} else {
			gantt.templates.rightside_text = () => '';
			gantt.templates.task_text = () => '';
			gantt.render();
		}
	}, [store.APP.viewWork]);

	useEffect(() => {
		if (store.APP.currentInterval) {
			setCurrentInterval(store.APP.currentInterval);
			setValueInterval(store.APP.currentInterval);
		}
	}, [store.APP.currentInterval]);

	useEffect(() => {
		if (store.APP.startDate && store.APP.endDate) {
			const sd = store.APP.startDate
				? typeof store.APP.startDate === 'string'
					? normalizeDate(store.APP.startDate).toLocaleString()
					: new Date(store.APP.startDate).toLocaleString()
				: undefined;
			const ed = store.APP.endDate
				? typeof store.APP.endDate === 'string'
					? normalizeDate(store.APP.endDate).toLocaleString()
					: new Date(store.APP.endDate).toLocaleString()
				: undefined;

			if (currentInterval?.value === 'INTERVAL') {
				sd && setInputStartDate(sd);
				ed && setInputEndDate(ed);
				setinputLastDays('');
				setInputMonthDays('');
				setDiagramStartDate(normalizeDate(sd));
				setDiagramEndDate(normalizeDate(ed));
			} else if (currentInterval?.value === 'MONTH' || currentInterval?.value === 'LASTDAYS') {
				const newStartDate = typeof store.APP?.startDate === 'string' ? normalizeDate(startDate) : startDate;
				const newEndDate = typeof store.APP?.endDate === 'string' ? normalizeDate(endDate) : endDate;
				const msInOneDay = 86400000;
				const msStartDate = new Date(newStartDate).getTime();
				const msEndTime = new Date(newEndDate).getTime();
				const days = Math.round((msEndTime - msStartDate) / msInOneDay);

				days && setinputLastDays(days);
				days && setInputMonthDays(days);

				setInputStartDate('');
				setInputEndDate('');
				setDiagramStartDate(normalizeDate(sd));
				setDiagramEndDate(normalizeDate(ed));
			} else if (currentInterval?.value === 'NEXTDAYS') {
				setInputStartDate('');
				setInputEndDate('');
				setinputLastDays('');
				setInputMonthDays('');
				setDiagramStartDate(normalizeDate(sd));
				setDiagramEndDate(normalizeDate(ed));
			}
		}
	}, [store.APP.startDate, store.APP.endDate]);

	const handleAddNewBlock = (index: number, value: string) => {
		const {setResourceSettings} = props;
		const newLevel = (value === 'WORK' && resources[index].type !== 'WORK') ? resources[index].level + 1 : resources[index].level;
		const newParent = (value === 'WORK' && resources[index].type !== 'WORK') ? resources[index].id : resources[index].parent;

		let indexForNewBlock = index;

		if ((value === 'WORK' && resources[index].type === 'WORK') || (value === 'RESOURCE')) {
			indexForNewBlock = skipChildren(index) - 1;
		}

		setResourceSettings([
			...resources.slice(0, indexForNewBlock + 1),
			{
				...defaultResourceSetting,
				id: uuidv4(),
				level: newLevel,
				parent: newParent,
				type: value
			},
			...resources.slice(indexForNewBlock + 1)
		]);
	};

	const handleDeleteBlock = (index: number) => {
		const {setResourceSettings} = props;
		let indexLastChild = index;

		for (let i = index + 1; i < resources.length && resources[i].level > resources[index].level; i++) {
			indexLastChild = i;
		}

		setResourceSettings([...resources.slice(0, index), ...resources.slice(indexLastChild + 1)]);
	};

	const handleUpdateResourceSettings = (value: ResourceSetting, index: number, updateChildren: false) => {
		const {setResourceSettings} = props;
		const newSettings = deepClone(resources);

		newSettings[index] = value;

		if (updateChildren) {
			for (let i = index + 1; i < resources.length && resources[i].level > resources[index].level; i++) {
				newSettings[i] = {...newSettings[i], communicationResourceAttribute: null, communicationWorkAttribute: null};
			}
		}

		setResourceSettings(newSettings);
	};

	const handleUpdateChildrenLevel = (index: number, isNested: boolean) => {
		const {setResourceSettings} = props;
		const newSettings = deepClone(resources);

		if (isNested) {
			const newParent = getNeighbor(index, newSettings[index].level);

			newSettings[index].nested = true;
			newSettings[index].parent = newParent.id;
			newSettings[index].level = newParent.level + 1;

			for (let i = index + 1; i < resources.length && resources[i].level > resources[index].level; i++) {
				newSettings[i].level = getUpdatedLevel(newSettings[i].level, isNested);
			}

			setResourceSettings(newSettings);
		} else {
			// при снятии галочки - ресурс/работа переезжает со своими детьми на место после бывших соседей, то есть перед новым соседом
			const newIndex = getIndexBottomNeighbor(index, newSettings[index].level - 1);
			const children = [];

			newSettings[index].nested = false;
			newSettings[index].level = newSettings[index].level > 0 ? newSettings[index].level - 1 : 0;
			newSettings[index].parent = newSettings.filter(el => el.id === newSettings[index].parent)[0]?.parent;
			newSettings[index].communicationResourceAttribute = null;
			newSettings[index].communicationWorkAttribute = null;

			for (let i = index + 1; i < resources.length && resources[i].level > resources[index].level; i++) {
				newSettings[i].level = getUpdatedLevel(newSettings[i].level, isNested);
				children.push(newSettings[i]);
			}

			setResourceSettings([
				...resources.slice(0, index),
				...resources.slice(index + children.length + 1, newIndex),
				newSettings[index],
				...children,
				...resources.slice(newIndex)
			]);
		}
	};

	const handleUpdateCommonSettings = (target: string, value: CommonSettings) => {
		const {setCommonSettings, settings} = props;
		const newSettings = deepClone(settings);

		newSettings[target] = value;
		setCommonSettings(newSettings);
	};

	const handleScaleChange = ({value}) => {
		handleUpdateCommonSettings('scale', value.value);
	};

	const handleIntervalChange = ({value}) => {
		setValueInterval(value);
		setCurrentInterval(value);
		setValueError('');
		setIsErrorHref(false);
	};

	const handleCheckboxChange = () => {
		const {settings} = props;

		handleUpdateCommonSettings('rollUp', !settings.rollUp);
	};

	const handleColumnShowChange = (index: number) => {
		const newColumnSettings = deepClone(columnSettingsModal);

		newColumnSettings[index].show = !columnSettingsModal[index].show;
		setColumnSettingsModal(newColumnSettings);
	};

	const handleColumnNameChange = (target: Column, index: number) => {
		const newColumnSettings = deepClone(columnSettingsModal);

		newColumnSettings[index].title = target.value;
		setColumnSettingsModal(newColumnSettings);
	};

	const handleAddNewColumn = () => {
		const newColumnSettings = deepClone(columnSettingsModal);

		setColumnSettingsModal([...newColumnSettings, { ...defaultColumn, code: uuidv4() }]);
	};

	const handleDeleteColumn = (index: number) => {
		const newColumnSettings = deepClone(columnSettingsModal);

		setColumnSettingsModal([...newColumnSettings.slice(0, index), ...newColumnSettings.slice(index + 1)]);
	};

	const handleSaveColumnSettings = () => {
		const newColumnSettings = Array(columnSettingsModal.length);

		layout.forEach((item, index) => { newColumnSettings[item.y] = columnSettingsModal[index]; });

		if (!newColumnSettings[0].title) {
			newColumnSettings[0].title = 'Название';
		}

		handleUpdateCommonSettings('columnSettings', newColumnSettings.filter(item => !!item.title));
		setShowModal(!showModal);
		setColumnSettingsModal([]);
	};

	const handleCancelColumnSettings = () => {
		setShowModal(!showModal);
		setColumnSettingsModal([]);
	};

	const renderCheckbox = (handle, label, value) => {
		return (
			<div onClick={handle}>
				<FormControl className={styles.checkbox} label={label} small={true}>
					<Checkbox checked={value} name="Checkbox" onChange={handle} value={value} />
				</FormControl>
			</div>
		);
	};

	const handleSave = () => {
		const res = sibmitRange();
		const {
			diagramKey,
			milestonesCheckbox,
			multiplicityCheckbox,
			progressCheckbox,
			saveSettings,
			settings,
			stateMilestonesCheckbox,
			viewOfNestingCheckbox,
			workRelationCheckbox,
			worksWithoutStartOrEndDateCheckbox
		} = props;
		const {endDate, startDate} = store.APP;
		const newError = checkingSettings();

		const shiftedEndDate = typeof startDate === 'string' ? shiftTimeZone(normalizeDate(startDate)) : shiftTimeZone(startDate);
		const shiftedStartDate = typeof endDate === 'string' ? shiftTimeZone(normalizeDate(endDate)) : shiftTimeZone(endDate);

		setError(newError);

		if (valueInterval === null || isEmpty(valueInterval)) {
			setHref('#interval');
			setIsErrorHref(true);
		} else {
			setIsErrorHref(false);
		}

		if (store.APP.currentInterval?.value === 'INTERVAL') {
			if (!inputEndDate && !inputStartDate) {
				setHref('#interval');
			}
		} else if (store.APP.currentInterval?.value === 'MONTH') {
			if (!inputMonthDays) {
				setHref('#interval');
			}
		} else if (store.APP.currentInterval?.value === 'LASTDAYS') {
			if (!inputLastDays) {
				setHref('#interval');
			}
		}

		const condition = (((inputEndDate && inputStartDate) || inputMonthDays || inputLastDays || inputLastDays || currentInterval?.value === 'NEXTDAYS') ? true : false);

		const newInputEndDate = inputEndDate && normalizeDate(inputEndDate);
		const newInputStartDate = inputStartDate && normalizeDate(inputStartDate);

		if (!newError && !isErrorHref && href === '#' && valueInterval && condition) {
			if (store.APP.currentInterval?.value === 'MONTH' || store.APP.currentInterval?.value === 'LASTDAYS') {
				setDiagramEndDate(gantt.date.add(res.endDate, shiftedEndDate, 'hour'));
				setDiagramStartDate(gantt.date.add(res.startDate, shiftedStartDate, 'hour'));
			} else {
				setDiagramEndDate(gantt.date.add(new Date(diagramEndDate), shiftedEndDate, 'hour'));
				setDiagramStartDate(gantt.date.add(new Date(diagramStartDate), shiftedStartDate, 'hour'));
			}

			const {isPersonal} = store.APP;
			const condition = (currentInterval?.value === 'MONTH' || currentInterval?.value === 'LASTDAYS' || currentInterval?.value === 'NEXTDAYS');

			saveSettings(
				{
					commonSettings: settings,
					currentInterval,
					diagramKey,
					endDate: condition ? res.endDate : newInputEndDate,
					isPersonal,
					milestonesCheckbox,
					multiplicityCheckbox,
					progressCheckbox,
					resourceAndWorkSettings: resources,
					startDate: condition ? res.startDate : newInputStartDate,
					stateMilestonesCheckbox,
					viewOfNestingCheckbox,
					viewWork,
					workRelationCheckbox,
					worksWithoutStartOrEndDateCheckbox
				}
			);
		}
	};

	const handleCancel = () => {
		const {cancelSettings} = props;

		props.handleToggle();
		cancelSettings();
	};

	const handleOpenColumnSettingsModal = () => {
		setColumnSettingsModal(deepClone(columnSettings));
		setShowModal(!showModal);
	};

	const renderHeaderCommonBlock = () => (
		<h3 className={styles.contentTitle}>Общий блок</h3>
	);

	const renderSelectCommonBlock = () => (
		<div className={styles.select}>
			<span className={styles.label}>Масштаб по умолчанию</span>
			<Select className={cn(styles.selectIcon, styles.top)} icon={'CHEVRON'} onSelect={handleScaleChange} options={ScaleNames} placeholder='Масштаб по умолчанию' value={ScaleNames.find(item => item.value === settings.scale)} />
		</div>
	);

	const onSelectStartDate = value => {
		setInputStartDate(new Date(value).toLocaleString());
		setShowDatePickerStartDate(false);
		setDiagramStartDate(new Date(value));
	};

	const onSelectEndDate = value => {
		setInputEndDate(new Date(value).toLocaleString());
		setShowDatePickerEndDate(!showDatePickerEndDate);
		setDiagramEndDate(new Date(value));
	};

	const renderDatePickerStartDate = () => {
		if (showDatePickerStartDate) {
			return <div className={styles.datepicker}><Datepicker onSelect={(value) => onSelectStartDate(value)} value="" /></div>;
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

	useEffect(() => {
		document.addEventListener('click', onCloseDateModal);
		return () => document.removeEventListener('click', onCloseDateModal);
	});

	const renderDatePickerEndDate = () => {
		if (showDatePickerEndDate) {
			return <div className={styles.datepicker}><Datepicker onSelect={(value) => onSelectEndDate(value)} value="" /> </div>;
		}
	};

	const sibmitRange = () => {
		if (valueInterval?.value === 'INTERVAL') {
			let newStartDate = '';
			let newEndDate = '';

			if (!inputStartDate || !inputEndDate) {
				setValueError(ERROR_MESSAGES.emptyFields);
				setHref('#interval');
			} else {
				newStartDate = normalizeDate(inputStartDate);
				newEndDate = normalizeDate(inputEndDate);
			}

			if (Date.parse(newEndDate) >= Date.parse(newStartDate) && (inputStartDate.length && inputEndDate.length)) {
				const date = {
					endDate: newEndDate,
					startDate: newStartDate
				};

				setDiagramStartDate(newStartDate);
				setDiagramEndDate(newEndDate);

				props.setRangeTime(date);
				setValueError('');
				setHref('#');

				return date;
			} else if (Date.parse(newEndDate) <= Date.parse(newStartDate)) {
				setValueError(ERROR_MESSAGES.wrongDate);
				setHref('#interval');
			} else if (!inputStartDate || !inputEndDate) {
				setValueError(ERROR_MESSAGES.emptyFields);
				setHref('#interval');
			} else {
				setValueError(ERROR_MESSAGES.incorrectDate);
				setHref('#interval');
			}
		} else if (['MONTH', 'LASTDAYS'].includes(valueInterval.value)) {
			const month = valueInterval.value === 'MONTH';
			const inputValue = month ? parseInt(inputMonthDays, 10) : parseInt(inputLastDays, 10);

			if (isNaN(inputValue)) {
				setValueError(ERROR_MESSAGES.incorrectValue);
				setHref('#interval');
			// eslint-disable-next-line no-negated-condition
			} else if (!inputValue) {
				setValueError(ERROR_MESSAGES.emptyField);
				setHref('#interval');
			} else {
				const today = new Date();
				const calculatedDate = month ? new Date(today.setDate(today.getDate() + inputValue)) : new Date(today.setDate(today.getDate() - inputValue));

				const endDate = month ? new Date(calculatedDate) : new Date();
				const startDate = month ? new Date() : new Date(calculatedDate);

				setDiagramStartDate(startDate);
				setDiagramEndDate(endDate);

				props.setRangeTime({endDate, startDate});
				setValueError('');
				setHref('#');

				return {endDate, startDate};
			}
		} else if (valueInterval?.value === 'NEXTDAYS') {
			const todayStartDate = new Date();
			const todayEndDate = new Date();

			const hours = todayStartDate.getHours();

			todayStartDate.setHours(0);

			const balanceHours = 23 - hours;

			todayEndDate.setHours(hours + balanceHours);

			const endDate = new Date(todayEndDate);
			const startDate = new Date(todayStartDate);

			setDiagramStartDate(startDate);
			setDiagramEndDate(endDate);

			props.setRangeTime({endDate, startDate});

			return {endDate, startDate};
		}
	};

	const changeStartDate = target => {
		setInputStartDate(target.value);
	};

	const changeMonthDays = target => {
		setInputMonthDays(target.value);
	};

	const changeinputLastDays = target => {
		setinputLastDays(target.value);
	};

	const changeEndDate = target => {
		setInputEndDate(target.value);
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

	const dataMonthAndLastDays = [
		{
			changeinputLastDays: changeinputLastDays,
			inputLastDays: inputLastDays,
			text: 'За последние n дней'
		},
		{
			changeinputLastDays: changeMonthDays,
			inputLastDays: inputMonthDays,
			text: 'В ближайшие n дней'
		}
	];

	const listDataInterval = dataInterval.map((item, index) => {
		return (
			<div className={styles.interval__wrapper_input} key={index}>
				<span className={styles.interval__label}>{item.text}</span>
				<div className={styles.interval__inner_wrapper_input}>
					<TextInput className={styles.input} maxLength={30} onChange={item.changeDate} placeholder="дд.мм.гггг, чч:мм:сс" value={item.inputDate} />
					<IconButton className={styles.basket} icon="CALENDAR" onClick={() => item.setShowDatePickerDate(!item.showDatePickerDate)} />
				</div>
				{item.renderDatePickerDate()}
			</div>
		);
	});

	const listDataMonthAndLastDays = dataMonthAndLastDays.map((item, index) => {
		return (
			<div className={styles.interval} key={index}>
				<div className={styles.interval__wrapper_input}>
					<span className={styles.interval__label}>{item.text}</span>
					<div className={styles.interval__inner_wrapper_input}>
						<TextInput className={styles.input} maxLength={4} onChange={item.changeinputLastDays} placeholder="Количество дней" value={item.inputLastDays} />
					</div>
				</div>
				<div className={styles.error}>{valueError}</div>
				<button onClick={sibmitRange}>Применить</button>
			</div>
		);
	});

	const renderFormNextdays = () => {
		return (
			<div className={styles.interval}>
				<div className={styles.error}>{valueError}</div>
				<button onClick={sibmitRange}>Применить</button>
			</div>
		);
	};

	const renderIntervalFromTo = () => {
		if (valueInterval) {
			switch (valueInterval.value) {
				case 'INTERVAL':
					return (
						<div>
							{listDataInterval}
							<div className={styles.error}>{valueError}</div>
							<button onClick={sibmitRange}>Применить</button>
						</div>
					);
				case 'LASTDAYS':
					return listDataMonthAndLastDays[0];
				case 'MONTH':
					return listDataMonthAndLastDays[1];
				case 'NEXTDAYS':
					return renderFormNextdays();
			}
		}
	};

	const renderHrefError = () => {
		if (isErrorHref) {
			return (
				<div className={styles.errorInterval}>
					Выберите интервал
				</div>
			);
		}

		return null;
	};

	const renderSelectInterval = () => (
		<div className={styles.select} id='interval'>
			<span className={styles.label}>Критерий</span>
			<Select
				className={cn(styles.selectIcon, styles.top)}
				icon={'CHEVRON'}
				onSelect={handleIntervalChange}
				options={IntervalSelectionCriterion}
				placeholder="Критерий"
				value={valueInterval?.label || ''}
			/>
			{renderIntervalFromTo()}
			{renderHrefError()}
		</div>
	);

	const handleOpenFilterForm = async () => {
		try {
			const {worksWithoutStartOrEndDateCheckbox} = store.APP;
			const res = await updateWorks(!worksWithoutStartOrEndDateCheckbox)(dispatch);

			dispatch(setColumnTask(res));
			gantt.clearAll();
			setTimeout(() => {
				res.forEach(item => {
					if (item.type === 'milestone') {
						item.hide_bar = !store.APP.milestonesCheckbox;
					}
				});
				gantt.parse(JSON.stringify({data: res, links: store.APP.workRelations}));
				gantt.render();
			}, 500);
		} catch (e) {
			console.error(e);
		}
	};

	const handleToggleWorksWithoutDates = () => {
		props.switchWorksWithoutStartOrEndDateCheckbox(!props.worksWithoutStartOrEndDateCheckbox);
		handleOpenFilterForm();
	};

	const handleToggleSplitTasks = () => {
		const tasks = gantt.getTaskByTime();

		tasks.forEach(item => {
			if (!props.viewOfNestingCheckbox) {
				if (item.type === 'RESOURCE' || item.type === 'project') {
					item.render = 'split';
				}
			} else {
				delete item.render;
			}
		});
		gantt.render();
		dispatch(switchViewOfNestingCheckbox(!props.viewOfNestingCheckbox));
	};

	const handleToggleMultiplicityTasks = () => {
		dispatch(switchMultiplicityCheckbox(!props.multiplicityCheckbox));

		gantt.config.round_dnd_dates = !props.multiplicityCheckbox;
	};


	const renderButtonCommonBlock = () => (
		<Button className={styles.button} variant="ADDITIONAL">
			<div className={styles.bigButton} onClick={handleOpenColumnSettingsModal}> </div>
			Настройки столбцов таблицы
		</Button>
	);

	const renderForm = () => {
		if (showModal) {
			const top = document.getElementById('panelSettingsButton')?.getBoundingClientRect().top;
			return <Form className={styles.hidden} header={getHeaderModal()} onClose={handleCancelColumnSettings} onSubmit={handleSaveColumnSettings} top={top}>{getContentModal()}</Form>;
		}

		return null;
	};

	const toggleModal = (value: boolean) => () => {
		setIsColorsModal(value);
	};

	const renderButtonColorPanel = () => (
		<div>
			<Button className={styles.button} onClick={toggleModal(true)} variant="ADDITIONAL">
				<div className={styles.bigButton}> </div>
				Открыть панель цветов
			</Button>
		</div>
	);

	const [isColorsModal, setIsColorsModal] = useState(false);

	const renderColorPanel = () => {
		if (isColorsModal) {
			return (
				<Modal
					className={styles.modalColors}
					onClose={toggleModal(false)}
					onSubmit={toggleModal(false)}
					submitText="Сохранить"
				>
					<ColorPanel isColorsModal={isColorsModal} setIsColorsModal={setIsColorsModal} />
				</Modal>
			);
		}
	};

	const renderCheckboxProgress = () => renderCheckbox(handleToggleProgress, 'Отображать прогресс выполнения работ на диаграмме', props.progressCheckbox);

	const renderCheckboxСonnections = () => renderCheckbox(handleToggleLinks, 'Отображать связи работ на диаграмме', props.workRelationCheckbox);

	const renderCheckboxSplitTasks = () => renderCheckbox(handleToggleSplitTasks, 'Выстроить работы в одну линию ресурса', props.viewOfNestingCheckbox);

	const renderCheckboxMultiplicityTasks = () => renderCheckbox(handleToggleMultiplicityTasks, 'Включить кратность календарной сетки для работ', props.multiplicityCheckbox);

	const renderCheckboxCommonBlock = () => renderCheckbox(handleCheckboxChange, 'Свернуть работы по умолчанию', props.settings.rollUp);

	const renderCheckboxMilestoneBlock = () => renderCheckbox(handleToggleMilestoneBlock, 'Отображать контрольные точки', props.milestonesCheckbox);

	const renderCheckboxStateMilestoneBlock = () => props.milestonesCheckbox && renderCheckbox(handleToggleStateMilestoneBlock, 'Отображать состояние контрольных точек', props.stateMilestonesCheckbox);

	const renderCheckboxWorksWithoutDates = () => renderCheckbox(handleToggleWorksWithoutDates, 'Отображать работы с открытыми датами', props.worksWithoutStartOrEndDateCheckbox);

	const renderCheckboxes = () => {
		return (
			<>
				{renderCheckboxProgress()}
				{renderCheckboxСonnections()}
				{renderCheckboxCommonBlock()}
				{renderCheckboxMilestoneBlock()}
				{renderCheckboxStateMilestoneBlock()}
				{renderCheckboxWorksWithoutDates()}
				{renderCheckboxSplitTasks()}
				{renderCheckboxMultiplicityTasks()}
			</>
		);
	};

	const renderCommonBlock = () => {
		return (
			<div className={styles.field}>
				{renderHeaderCommonBlock()}
				{renderSelectCommonBlock()}
				{renderSelectInterval()}
				{renderButtonColorPanel()}
				{renderViewWork()}
				{renderCheckboxes()}
				<div className={styles.form} id='panelSettingsButton'>
					{renderButtonCommonBlock()}
					{renderForm()}
				</div>
			</div>
		);
	};

	const renderBottom = () => {
		return (
			<div className={styles.bottom}>
				<a className={styles.href} href={href}>
					<Button onClick={handleSave} variant="INFO">
						Сохранить
					</Button>
				</a>
				<Button onClick={handleCancel} variant="GREY">
					Отменить
				</Button>
			</div>
		);
	};

	const renderError = () => {
		if (error) {
			return (
				<Modal
					notice={false}
					onClose={() => setError('')}
					onSubmit={() => setError('')}
					submitText="Ок"
					text={''}
				>
					{error}
				</Modal>
			);
		}

		return null;
	};

	const checkingSettings = () => {
		for (let i = 0; i < resources.length; i++) {
			if (!resources[i]?.source?.value?.label) {
				return `Заполните метакласс у ${resources[i].type === 'WORK' ? 'добавленной работы' : 'добавленного ресурса'}`;
			}

			if (resources[i].type === 'RESOURCE' && resources[i].nested && !resources[i].communicationResourceAttribute) {
				return `У ресурса "${resources[i]?.source?.value?.label}" не заполнен обязательный параметр связи с родительским ресурсом`;
			}

			if (resources[i].type === 'RESOURCE' && !getChild(i, resources[i].level)) {
				return `Для ресурса "${resources[i]?.source?.value?.label}" не добавлено ни одной работы`;
			}

			if (resources[i].type === 'WORK' && !resources[i].communicationResourceAttribute) {
				return `У работы "${resources[i]?.source?.value?.label}" не заполнен обязательный параметр связи c родительским ресурсом`;
			}

			if (resources[i].type === 'WORK' && resources[i].nested && !resources[i].communicationWorkAttribute) {
				return `У работы "${resources[i]?.source?.value?.label}" не заполнен обязательный параметр связи с родительской работой`;
			}

			if (resources[i].type === 'WORK' && (!resources[i].startWorkAttribute || !resources[i].endWorkAttribute)) {
				return `Заполните у работы "${resources[i]?.source?.value?.label}" атрибуты начала/окончания`;
			}
		}
		return '';
	};

	const getHeaderModal = () => {
		return (
			<Button onClick={handleAddNewColumn} outline={true} variant='INFO'>
				Добавить столбец
			</Button>
		);
	};

	const editColumn = (index, method) => () => {
		return (index !== 0) ? method(index) : false;
	};

	const getContentModal = () => {
		return (
			<GridLayout className="layout" cols={1} layouts={layout} onLayoutChange={layout => setLayout(layout)} rowHeight={35} width={300}>
				{columnSettingsModal.map((item, index) => (
					<div className={styles.item} data-grid={{h: 1, static: !index, w: 1, x: 0, y: index}} key={item.code}>
						<Icon className={styles.kebab} name="KEBAB" />
						<ShowBox checked={item.show} className={index === 0 && styles.disabled} name={item.code} onChange={editColumn(index, handleColumnShowChange)} value={item.show} />
						<TextInput className={styles.input} maxLength={30} name={item.code} onChange={target => handleColumnNameChange(target, index)} onlyNumber={false} placeholder="Введите название столбца" value={item.title} />
						<IconButton className={index === 0 ? styles.disabled : styles.basket} icon="BASKET"onClick={editColumn(index, handleDeleteColumn)} />
					</div>
				))}
			</GridLayout>
		);
	};

	const getFormByType = (item: ResourceSetting, index: number) => {
		const {settings, sources} = props;
		const {columnSettings} = settings;
		const FormByType = item.type === 'WORK' ? Work : Resource;

		return (
			<FormByType
				columns={columnSettings}
				handleAddNewBlock={value => handleAddNewBlock(index, value)}
				handleDeleteBlock={() => handleDeleteBlock(index)}
				handleUpdateChildrenLevel={isNested => handleUpdateChildrenLevel(index, isNested)}
				index={index}
				key={item.source.value ? item.source.value.value + index : index}
				level={item.level}
				onChange={(value, updateChildren) => handleUpdateResourceSettings(value, index, updateChildren)}
				options={sources}
				value={item}
			/>
		);
	};

	const changeViewWork = ({value}) => {
		setViewWork(value);

		dispatch(setTextWork(value));
	};

	const renderViewWork = () => {
		return (
			<div className={styles.select}>
				<span className={styles.label}>Вывод названий на диаграмме</span>
				<Select
					className={cn(styles.selectIcon, styles.top)}
					icon={'CHEVRON'}
					onSelect={changeViewWork}
					options={JobTitleType}
					placeholder='Вывод названий работ'
					value={viewWork} />
			</div>
		);
	};

	if (loading) {
		return <div className={styles.center}><Loader size={50} /></div>;
	}

	if (errorSettings) {
		return <p className={styles.center}>Ошибка загрузки панели настроек</p>;
	}

	return (
		<div className={styles.content}>
			{renderCommonBlock()}
			{resources.map((item, index) => getFormByType(item, index))}
			{renderError()}
			{renderColorPanel()}
			{renderBottom()}
		</div>
	);
};

export default connect(props, functions)(FormPanel);
