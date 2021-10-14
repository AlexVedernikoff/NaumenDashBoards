// @flow
import {
	Button,
	Checkbox,
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
import {getChild, getNeighbor, getParent, getUpdatedLevel} from './utils';
import GridLayout from 'react-grid-layout';
import Modal from 'src/components/atoms/Modal';
import type {Props} from './types';
import React, {useState} from 'react';
import Resource from './components/Resource';
import {ScaleNames} from './consts';
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

		setResourceSettings([
			...resources.slice(0, index + 1),
			{
				...defaultResourceSetting,
				id: uuidv4(),
				level: newLevel,
				parent: newParent,
				type: value
			},
			...resources.slice(index + 1)
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

	const handleUpdateResourceSettings = (value: ResourceSetting, index: number) => {
		const {setResourceSettings} = props;
		const newSettings = deepClone(resources);

		newSettings[index] = value;
		setResourceSettings(newSettings);
	};

	const handleUpdateChildrenLevel = (indexParent: number, isNested: boolean) => {
		const {setResourceSettings} = props;
		const newSettings = deepClone(resources);

		const parent = isNested
			? getNeighbor(indexParent, newSettings[indexParent].level)
			: getParent(indexParent, newSettings[indexParent].level);

		if ((isNested && !parent) || (!isNested && !parent)) {
			throw new Error();
		}

		if (isNested) {
			newSettings[indexParent].nested = true;
			newSettings[indexParent].parent = parent.id;
			newSettings[indexParent].level = parent.level + 1;
		} else {
			newSettings[indexParent].nested = false;
			newSettings[indexParent].level = parent.level;
			newSettings[indexParent].parent = !parent.level ? '' : newSettings.filter(el => el.id === parent.parent)[0]?.id;
		}

		for (let i = indexParent + 1; i < resources.length && resources[i].level > resources[indexParent].level; i++) {
			newSettings[i].level = getUpdatedLevel(newSettings[i].level, isNested);
		}

		setResourceSettings(newSettings);
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
		const {diagramKey, saveSettings, settings} = props;
		const newError = checkingSettings();

		setError(newError);

		if (!newError) {
			saveSettings({commonSettings: settings, diagramKey: diagramKey, resourceAndWorkSettings: resources});
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
			<Select className={styles.top} onSelect={handleScaleChange} options={ScaleNames} placeholder='Масштаб по умолчанию' value={ScaleNames.find(item => item.value === settings.scale)} />
		</div>
	);

	const renderCheckboxCommonBlock = () => {
		const {settings} = props;

		return (
			<FormControl className={cn(styles.checkbox)} label='Свернуть работы по умолчанию'>
				<Checkbox checked={settings.rollUp} name='Checkbox' onChange={handleCheckboxChange} value={settings.rollUp} />
			</FormControl>
		);
	};

	const renderButtonCommonBlock = () => (
		<Button className={styles.button} onClick={handleOpenColumnSettingsModal} variant='ADDITIONAL'>
			Настройки столбцов таблицы
		</Button>
	);

	const renderForm = () => {
		if (showModal) {
			const top = document.getElementById('panelSettingsButton')?.getBoundingClientRect().top;
			return <Form header={getHeaderModal()} onClose={handleCancelColumnSettings} onSubmit={handleSaveColumnSettings} top={top}>{getContentModal()}</Form>;
		}

		return null;
	};

	const renderCommonBlock = () => {
		return (
			<div className={styles.field}>
				{renderHeaderCommonBlock()}
				{renderSelectCommonBlock()}
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
				onChange={value => handleUpdateResourceSettings(value, index)}
				options={sources}
				value={item}
			/>
		);
	};

	if (loading) {
		return <div className={styles.center}><Loader size={50} /></div>;
	}

	if (errorSettings) {
		return <p className={styles.center}>Ошибка загрузки панели настроек</p>;
	}

	return (
		<>
			{renderCommonBlock()}
			{resources.map((item, index) => getFormByType(item, index))}
			{renderError()}
			{renderBottom()}
		</>
	);
};

export default connect(props, functions)(FormPanel);
