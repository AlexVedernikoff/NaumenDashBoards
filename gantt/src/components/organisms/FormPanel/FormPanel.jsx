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
import type {Column, ResourceSetting} from 'src/store/App/types';
import {CommonSettings} from 'store/App/types';
import {connect} from 'react-redux';
import {deepClone, normalizeDate, shiftTimeZone} from 'src/helpers';
import {defaultColumn} from 'src/store/App/constants';
import {defaultResourceSetting} from 'store/App/constants';
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
import {IntervalSelectionCriterion, ScaleNames} from './consts';
import Modal from 'src/components/atoms/Modal';
import type {Props} from './types';
import React, {useEffect, useState} from 'react';
import Resource from './components/Resource';
import {
	setColumnTask,
	switchWorksWithoutStartOrEndDateCheckbox,
	updateWorks
} from 'store/App/actions';
import ShowBox from 'src/components/atoms/ShowBox';
import styles from './styles.less';
import {v4 as uuidv4} from 'uuid';
import Work from './components/Work';
import {useDispatch, useSelector} from 'react-redux';

const FormPanel = (props: Props) => {
	const dispatch = useDispatch();
	const store = useSelector(state => state);
	const {endDate, errorSettings, loading, resources, settings, startDate} = props;
	const {columnSettings} = settings;
	const sd = startDate
		? typeof startDate === 'string'
			? normalizeDate(startDate).toLocaleString()
			: new Date(startDate).toLocaleString()
		: undefined;
	const ed = endDate
		? typeof endDate === 'string'
			? normalizeDate(endDate).toLocaleString()
			: new Date(endDate).toLocaleString()
		: undefined;
	const [showModal, setShowModal] = useState(false);
	const [columnSettingsModal, setColumnSettingsModal] = useState([]);
	const [layout, setLayout] = useState([]);
	const [error, setError] = useState('');
	const [inputStartDate, setInputStartDate] = useState(sd);
	const [inputEndDate, setInputEndDate] = useState(ed);
	const [showDatePickerStartDate, setShowDatePickerStartDate] = useState(false);
	const [showDatePickerEndDate, setShowDatePickerEndDate] = useState(false);
	const [valueError, setValueError] = useState('');
	const [inputMonthDays, setInputMonthDays] = useState('');
	const [inputLastDays, setinputLastDays] = useState('');
	const [currentInterval, setCurrentInterval] = useState(props.currentInterval ? props.currentInterval : {label: 'c ... по', value: 'INTERVAL'});
	const [diagramStartDate, setDiagramStartDate] = useState(new Date(startDate));
	const [diagramEndDate, setDiagramEndDate] = useState(new Date(endDate));

	useEffect(() => {
		setCurrentInterval(props.currentInterval);

		const msStartDate = new Date(startDate).getTime();
		const msEndTime = new Date(endDate).getTime();
		const days = Math.round((msEndTime - msStartDate) / 86400000);

		setinputLastDays(days);
		setInputMonthDays(days);
	}, [props.currentInterval]);

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

	const [valueInterval, setValueInterval] = useState(props.currentInterval ? props.currentInterval : {label: 'c ... по', value: 'INTERVAL'});
	const handleIntervalChange = ({value}) => {
		setValueInterval(value);
		setCurrentInterval(value);
		setValueError('');
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

	const handleSave = () => {
		sibmitRange();
		const {
			diagramKey,
			milestonesCheckbox,
			progressCheckbox,
			saveSettings,
			settings,
			stateMilestonesCheckbox,
			workProgresses,
			workRelationCheckbox,
			worksWithoutStartOrEndDateCheckbox
		} = props;
		const newError = checkingSettings();
		const shiftedEndDate = shiftTimeZone(diagramEndDate);
		const shiftedStartDate = shiftTimeZone(diagramStartDate);

		setError(newError);

		if (!newError) {
			setDiagramEndDate(gantt.date.add(new Date(diagramEndDate), shiftedEndDate, 'hour'));
			setDiagramStartDate(gantt.date.add(new Date(diagramStartDate), shiftedStartDate, 'hour'));

			saveSettings(
				{
					commonSettings: settings,
					currentInterval,
					diagramKey,
					endDate: diagramEndDate,
					milestonesCheckbox,
					progressCheckbox,
					resourceAndWorkSettings: resources,
					startDate: diagramStartDate,
					stateMilestonesCheckbox,
					workProgresses,
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
		if (valueInterval.value === 'INTERVAL') {
			const newStartDate = normalizeDate(inputStartDate);
			const newEndDate = normalizeDate(inputEndDate);

			if (Date.parse(newEndDate) >= Date.parse(newStartDate) && (inputStartDate.length && inputEndDate.length)) {
				const date = {
					endDate: newEndDate,
					startDate: newStartDate
				};

				setDiagramStartDate(newStartDate);
				setDiagramEndDate(newEndDate);

				props.setRangeTime(date);
				setValueError('');
			} else if (Date.parse(newEndDate) <= Date.parse(newStartDate)) {
				setValueError('Дата начала не может быть позднее даты завершения');
			} else if (!inputStartDate.length || !inputEndDate.length) {
				setValueError('Заполните все поля');
			} else {
				setValueError('Некорректная дата');
			}
		} else if (valueInterval.value === 'MONTH') {
			if (isNaN(inputMonthDays)) {
				setValueError('Некорректное значение');
			} else if (!inputMonthDays) {
				setValueError('Заполните поле');
			} else {
				const today = new Date();
				const inWeek = new Date();

				const monthDays = inWeek.setDate(today.getDate() + +inputMonthDays);

				const date = {
					endDate: new Date(monthDays),
					startDate: today
				};

				setDiagramStartDate(today);
				setDiagramEndDate(new Date(monthDays));

				props.setRangeTime(date);
				setValueError('');
			}
		} else if (valueInterval.value === 'LASTDAYS') {
			if (isNaN(inputLastDays)) {
				setValueError('Некорректное значение');
			} else if (!inputLastDays) {
				setValueError('Заполните поле');
			} else {
				const today = new Date();
				const inWeek = new Date();

				const monthDays = inWeek.setDate(today.getDate() - +inputLastDays);

				const date = {
					endDate: today,
					startDate: new Date(monthDays)
				};

				setDiagramStartDate(new Date(monthDays));
				setDiagramEndDate(today);

				props.setRangeTime(date);
				setValueError('');
			}
		} else if (valueInterval.value === 'NEXTDAYS') {
			const todayStartDate = new Date();
			const todayEndDate = new Date();

			const hoursDays = todayStartDate.getHours();

			todayStartDate.setHours(hoursDays - +hoursDays);
			const day = 23 - hoursDays;

			todayEndDate.setHours(hoursDays - -(+day));

			const date = {
				endDate: new Date(todayEndDate),
				startDate: new Date(todayStartDate)
			};

			setDiagramStartDate(new Date(todayStartDate));
			setDiagramEndDate(new Date(todayEndDate));

			props.setRangeTime(date);
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
	};

	const renderSelectInterval = () => (
		<div className={styles.select}>
			<span className={styles.label}>Критерий</span>
			<Select className={cn(styles.selectIcon, styles.top)} icon={'CHEVRON'} onSelect={handleIntervalChange} options={IntervalSelectionCriterion} placeholder="Критерий" value={valueInterval.label} />
			{renderIntervalFromTo()}
		</div>
	);

	const renderCheckboxCommonBlock = () => {
		const {settings} = props;

		return (
			<div onClick={handleCheckboxChange}>
				<FormControl className={cn(styles.checkbox)} label="Свернуть работы по умолчанию" small={true}>
					<Checkbox checked={settings.rollUp} name="Checkbox" onChange={handleCheckboxChange} value={settings.rollUp} />
				</FormControl>
			</div>
		);
	};

	const renderCheckboxMilestoneBlock = () => {
		return (
			<div onClick={props.handleToggleMilestoneBlock}>
				<FormControl className={cn(styles.checkbox)} label="Отображать контрольные точки" small={true}>
					<Checkbox checked={props.milestonesCheckbox} name="Checkbox" onChange={props.handleToggleMilestoneBlock} value={props.milestonesCheckbox} />
				</FormControl>
			</div>
		);
	};

	const renderCheckboxStateMilestoneBlock = () => {
		return (
			props.milestonesCheckbox && <div onClick={props.handleToggleStateMilestoneBlock}>
				<FormControl className={cn(styles.checkbox)} label="Отображать состояние контрольных точек" small={true}>
					<Checkbox checked={props.stateMilestonesCheckbox} name="Checkbox" onChange={props.handleToggleStateMilestoneBlock} value={props.stateMilestonesCheckbox} />
				</FormControl>
			</div>
		);
	};

	const handleOpenFilterForm = async () => {
		try {
			const {worksWithoutStartOrEndDateCheckbox} = store.APP;
			const res = await updateWorks(!worksWithoutStartOrEndDateCheckbox)(dispatch);

			dispatch(setColumnTask(res));
			gantt.clearAll();
			setTimeout(() => {
				gantt.parse(JSON.stringify({data: res, links: store.APP.workRelations}));
				gantt.render();
			}, 500);
		} catch (e) {
			console.error(e);
		}
	};

	const handleToggleWorksWithoutDates = (value) => {
		switchWorksWithoutStartOrEndDateCheckbox(!value.value);
		handleOpenFilterForm();
	};

	const renderCheckboxWorksWithoutDates = () => {
		return (
			<div onClick={props.handleToggleWorksWithoutDates}>
				<FormControl className={styles.checkbox} label="Отображать работы без даты начала и окончания даты" small={true}>
					<Checkbox checked={props.worksWithoutStartOrEndDateCheckbox} name="Checkbox" onChange={handleToggleWorksWithoutDates} value={props.worksWithoutStartOrEndDateCheckbox} />
				</FormControl>
			</div>
		);
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

	const renderCommonBlock = () => {
		return (
			<div className={styles.field}>
				{renderHeaderCommonBlock()}
				{renderSelectCommonBlock()}
				{renderSelectInterval()}
				{renderCheckboxProgress()}
				{renderCheckboxСonnections()}
				{renderCheckboxCommonBlock()}
				{renderCheckboxMilestoneBlock()}
				{renderCheckboxStateMilestoneBlock()}
				{renderCheckboxWorksWithoutDates()}
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
				<Button onClick={handleSave} variant="INFO">
					Сохранить
				</Button>
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

	const lastIndex = columnSettingsModal.length - 1;

	const editColumn = (index, method) => () => {
		return (index !== 0) ? method(index) : false;
	};

	const getContentModal = () => {
		return (
			<GridLayout className="layout" cols={1} layouts={layout} onLayoutChange={layout => setLayout(layout)} rowHeight={35} width={300}>
				{columnSettingsModal.map((item, index) => (
					<div className={styles.item} data-grid={{h: 1, static: !index, w: 1, x: 0, y: index}} key={item.code}>
						<Icon className={styles.kebab} name="KEBAB" />
						<ShowBox checked={item.show} className={index === 0 && styles.disabled} name={item.code} onChange={() => editColumn(index, handleColumnShowChange)} value={item.show} />
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

	const renderCheckboxProgress = () => {
		return (
			<div onClick={props.handleToggleProgress}>
				<FormControl className={cn(styles.checkbox)} label="Отображать прогресс выполнения работ на диаграмме" small={true}>
					<Checkbox checked={props.progressCheckbox} name="Checkbox" onChange={props.handleToggleProgress} value={props.progressCheckbox} />
				</FormControl>
			</div>
		);
	};

	const renderCheckboxСonnections = () => {
		return (
			<div onClick={props.handleToggleLinks}>
				<FormControl className={cn(styles.checkbox)} label="Отображать связи работ на диаграмме" small={true}>
					<Checkbox checked={props.workRelationCheckbox} name="Checkbox" onChange={props.handleToggleLinks} value={props.workRelationCheckbox} />
				</FormControl>
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
			{renderBottom()}
		</div>
	);
};

export default connect(props, functions)(FormPanel);
