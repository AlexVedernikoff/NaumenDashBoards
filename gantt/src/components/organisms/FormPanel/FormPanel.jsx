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
import {deepClone} from 'src/helpers';
import {defaultColumn} from 'src/store/App/constants';
import {defaultResourceSetting} from 'store/App/constants';
import Form from 'src/components/atoms/Form';
import {functions, props} from './selectors';
import {getChild, getIndexBottomNeighbor, getNeighbor, getUpdatedLevel, skipChildren} from './utils';
import GridLayout from 'react-grid-layout';
import {IntervalSelectionCriterion, ScaleNames} from './consts';
import Modal from 'src/components/atoms/Modal';
import type {Props} from './types';
import React, {useState} from 'react';
import Resource from './components/Resource';
import ShowBox from 'src/components/atoms/ShowBox';
import styles from './styles.less';
import {v4 as uuidv4} from 'uuid';
import Work from './components/Work';

const FormPanel = (props: Props) => {
	const {errorSettings, loading, resources, settings} = props;
	const {columnSettings} = settings;
	const [showModal, setShowModal] = useState(false);
	const [columnSettingsModal, setColumnSettingsModal] = useState([]);
	const [layout, setLayout] = useState([]);
	const [error, setError] = useState('');

	const handleAddNewBlock = (index: number, value: string) => {
		const {setResourceSettings} = props;
		const newLevel = (value === 'WORK' && resources[index].type !== 'WORK') ? resources[index].level + 1 : resources[index].level;
		const newParent = (value === 'WORK' && resources[index].type !== 'WORK') ? resources[index].id : resources[index].parent;

		let indexForNewBlock = index;

		// новая работа [от ресурса] встает сразу под ресурсом
		// новая работа [от работыА] встает сразу после детей-работ работыА
		// новый ресурс встает сразу после всех детей
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

	const [valueInterval, setValueInterval] = useState({label: 'c ... по', value: 'INTERVAL'});
	const handleIntervalChange = ({value}) => {
		setValueInterval(value);
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
		const {diagramKey, saveSettings, settings, workProgresses} = props;
		const newError = checkingSettings();

		setError(newError);

		if (!newError) {
			saveSettings({commonSettings: settings, diagramKey: diagramKey, resourceAndWorkSettings: resources, workProgresses});
		}
	};

	const handleCancel = () => {
		const {cancelSettings} = props;

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

	const [inputStartDate, setinputStartDate] = useState('');
	const [inputEndDate, setinputEndDate] = useState('');
	const [showDatePickerStartDate, setShowDatePickerStartDate] = useState(false);
	const [showDatePickerEndDate, setShowDatePickerEndDate] = useState(false);

	const onSelectStartDate = (value) => {
		setinputStartDate(value);
		setShowDatePickerStartDate(!showDatePickerStartDate);
	};

	const onSelectEndDate = (value) => {
		setinputEndDate(value);
		setShowDatePickerEndDate(!showDatePickerEndDate);
	};

	const renderDatePickerStartDate = () => {
		if (showDatePickerStartDate) {
			return <Datepicker onSelect={(value) => onSelectStartDate(value)} value="" />;
		}
	};

	const renderDatePickerEndDate = () => {
		if (showDatePickerEndDate) {
			return <Datepicker onSelect={(value) => onSelectEndDate(value)} value="" />;
		}
	};

	const sibmitRange = () => {
		const date = {
			endDate: inputEndDate,
			startDate: inputStartDate
		};

		props.setRangeTime(date);
	};

	const renderIntervalFromTo = () => {
		if (valueInterval.value === 'INTERVAL') {
			return (
				<div className={styles.interval}>
					<div className={styles.interval__wrapper_input}>
						<span className={styles.interval__label}>С</span>
						<div className={styles.interval__inner_wrapper_input}>
							<TextInput className={styles.input} maxLength={30} placeholder="" value={inputStartDate} />
							<IconButton className={styles.basket} icon='CALENDAR' onClick={() => setShowDatePickerStartDate(!showDatePickerStartDate)} />
						</div>
						{renderDatePickerStartDate()}
					</div>
					<div className={styles.interval__wrapper_input}>
						<span className={styles.interval__label}>По</span>
						<div className={styles.interval__inner_wrapper_input}>
							<TextInput className={styles.input} maxLength={30} placeholder="" value={inputEndDate} />
							<IconButton className={styles.basket} icon='CALENDAR' onClick={() => setShowDatePickerEndDate(!showDatePickerEndDate)} />
						</div>
						{renderDatePickerEndDate()}
					</div>
					<button onClick={sibmitRange}>Применить</button>
				</div>
			);
		}
	};

	const renderSelectInterval = () => (
		<div className={styles.select}>
			<span className={styles.label}>Критерий</span>
			<Select className={cn(styles.selectIcon, styles.top)} icon={'CHEVRON'} onSelect={handleIntervalChange} options={IntervalSelectionCriterion} placeholder='Критерий' value={valueInterval.label} />
			{renderIntervalFromTo()}
		</div>
	);

	const renderCheckboxCommonBlock = () => {
		const {settings} = props;

		return (
			<div onClick={handleCheckboxChange}>
				<FormControl className={cn(styles.checkbox)} label='Свернуть работы по умолчанию' small={true}>
					<Checkbox checked={settings.rollUp} name='Checkbox' onChange={handleCheckboxChange} value={settings.rollUp} />
				</FormControl>
			</div>
		);
	};

	const renderButtonCommonBlock = () => (
		<Button className={styles.button} variant='ADDITIONAL'>
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
				<Button onClick={handleSave} variant='INFO'>
					Сохранить
				</Button>
				<Button onClick={handleCancel} variant='GREY'>
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
					submitText='Ок'
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

	const getContentModal = () => {
		return (
			<GridLayout className="layout" cols={1} layouts={layout} onLayoutChange={layout => setLayout(layout)} rowHeight={35} width={300}>
				{columnSettingsModal.map((item, index) => (
					<div className={styles.item} data-grid={{h: 1, static: !index, w: 1, x: 0, y: index}} key={item.code}>
						<Icon className={styles.kebab} name='KEBAB' />
						<ShowBox checked={item.show} className={!index && styles.disabled} name={item.code} onChange={() => index && handleColumnShowChange(index)} value={item.show} />
						<TextInput className={styles.input} maxLength={30} name={item.code} onChange={target => handleColumnNameChange(target, index)} onlyNumber={false} placeholder='Введите название столбца' value={item.title} />
						<IconButton className={!index ? styles.disabled : styles.basket} icon='BASKET' onClick={() => index && handleDeleteColumn(index)} />
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
				<FormControl className={cn(styles.checkbox)} label='Отображать прогресс выполнения работ на диаграмме' small={true}>
					<Checkbox checked={props.progress} name='Checkbox' onChange={props.handleToggleProgress} value={props.progress} />
				</FormControl>
			</div>
		);
	};

	const renderCheckboxСonnections = () => {
		return (
			<div onClick={props.handleToggleLinks}>
				<FormControl className={cn(styles.checkbox)} label='Отображать связи работ на диаграмме' small={true}>
					<Checkbox checked={props.allLinks} name='Checkbox' onChange={props.handleToggleLinks} value={props.allLinks} />
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
