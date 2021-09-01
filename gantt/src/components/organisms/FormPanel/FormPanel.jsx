// @flow
import {Button, Checkbox, ConfirmModal, FormControl, IconButton, Select, TextInput} from 'naumen-common-components';
import cn from 'classnames';
import type {Column, ResourceSetting} from 'src/store/App/types';
import {CommonSettings} from 'store/App/types';
import {connect} from 'react-redux';
import {deepClone} from 'src/helpers';
import {defaultColumn} from 'src/store/App/constants';
import {defaultResourceSetting} from 'store/App/constants';
import {functions, props} from './selectors';
import {getNeighbor, getParent, getUpdatedLevel} from './utils';
import type {Props} from './types';
import React, {useState} from 'react';
import Resource from './components/Resource';
import {ScaleNames} from './consts';
import styles from './styles.less';
import {v4 as uuidv4} from 'uuid';
import Work from './components/Work';

const FormPanel = (props: Props) => {
	const {resources, settings} = props;
	const {columnSettings} = settings;
	const [showModal, setShowModal] = useState(false);
	const [columnSettingsModal, setColumnSettingsModal] = useState([]);

	const handleAddNewBlock = (index: number, value: string) => {
		const {setResourceSettings} = props;
		const newLevel = (value === 'WORK' && resources[index].type !== 'WORK') ? resources[index].level + 1 : resources[index].level;
		const newParent = (value === 'WORK' && resources[index].type !== 'WORK') ? resources[index].id : resources[index].parent;

		setResourceSettings([...resources.slice(0, index + 1), { ...defaultResourceSetting, id: uuidv4(), level: newLevel, parent: newParent, type: value }, ...resources.slice(index + 1)]);
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
		handleUpdateCommonSettings('columnSettings', columnSettingsModal);
		setShowModal(!showModal);
		setColumnSettingsModal([]);
	};

	const handleCancelColumnSettings = () => {
		setShowModal(!showModal);
		setColumnSettingsModal([]);
	};

	const handleSave = () => {
		const {diagramKey, saveSettings, settings} = props;
		saveSettings({commonSettings: settings, diagramKey: diagramKey, resourceAndWorkSettings: resources});
	};

	const handleCancel = () => {
		const {cancelSettings} = props;
		cancelSettings();
	};

	const handleOpenColumnSettingsModal = () => {
		setColumnSettingsModal(deepClone(columnSettings));
		setShowModal(!showModal);
	};

	const renderCommonBlock = () => {
		const {settings} = props;

		return (
			<div className={cn(styles.border, styles.field)}>
				<h3 className={styles.contentTitle}>Общий блок</h3>
				<Select onSelect={handleScaleChange} options={ScaleNames} placeholder='Масштаб по умолчанию' value={ScaleNames.find((item) => item.value === settings.scale)} />
				<FormControl className={styles.margin} label='Свернуть работы по умолчанию'>
					<Checkbox checked={settings.rollUp} name='Checkbox' onChange={handleCheckboxChange} value={settings.rollUp} />
				</FormControl>
				<Button className={styles.button} onClick={handleOpenColumnSettingsModal} variant='ADDITIONAL'>
					Настройки столбцов таблицы
				</Button>
				{showModal && <ConfirmModal header={getHeaderModal()} notice={false} onClose={handleCancelColumnSettings} onSubmit={handleSaveColumnSettings} text={getContentModal()} />}
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

	const getHeaderModal = () => {
		return (
			<div className={styles.header}>
				<span>Настройки столбцов таблицы</span>
				<IconButton active={true} icon='PLUS' onClick={handleAddNewColumn} variant='GRAY' />
			</div>
		);
	};

	const getContentModal = () => {
		return (
			<ul className={styles.list}>
				{columnSettingsModal.map((item, index) => (
					<li className={styles.item} key={item.code}>
						<Checkbox checked={item.show} name={item.code} onChange={() => handleColumnShowChange(index)} value={item.show} />
						<TextInput className={styles.input} maxLength={30} name={item.code} onChange={(target) => handleColumnNameChange(target, index)} onlyNumber={false} placeholder='Введите название столбца' value={item.title} />
						<IconButton icon='BASKET' onClick={() => handleDeleteColumn(index)} />
					</li>
				))}
			</ul>
		);
	};

	const getFormByType = (item: ResourceSetting, index: number) => {
		const {settings, sources} = props;
		const {columnSettings} = settings;
		const FormByType = item.type === 'WORK' ? Work : Resource;

		return (
			<FormByType
				columns={columnSettings}
				handleAddNewBlock={(value) => handleAddNewBlock(index, value)}
				handleDeleteBlock={() => handleDeleteBlock(index)}
				handleUpdateChildrenLevel={(isNested) => handleUpdateChildrenLevel(index, isNested)}
				index={index}
				key={item.source.value ? item.source.value.value + index : index}
				level={item.level}
				onChange={(value) => handleUpdateResourceSettings(value, index)}
				options={sources}
				value={item}
			/>
		);
	};

	return (
		<>
			{renderCommonBlock()}
			{resources.map((item, index) => getFormByType(item, index))}
			{renderBottom()}
		</>
	);
};

export default connect(props, functions)(FormPanel);
