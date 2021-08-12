// @flow
import 'rc-menu/assets/index.css';
import {Button, Checkbox, ConfirmModal, Container, FormControl, Icon, Select, TreeSelect} from 'naumen-common-components';
import cn from 'classnames';
import CollapsableFormBox from 'components/molecules/CollapsableFormBox';
import {createFilterContext, getFilterContext} from 'src/store/helpers';
import DropdownMenu from 'components/atoms/DropdownMenu';
import {ItemTypes, TableColumnNames} from '../../FormPanel';
import type {Props} from './types';
import React, {useState} from 'react';
import styles from './styles.less';

const Resource = (props: Props) => {
	const {level, onChange, value: resource} = props;
	const [valueAttribute, setValueAttribute] = useState({});
	const [showModal, setShowModal] = useState(false);
	const [showMenu, setShowMenu] = useState(false);

	const changeSource = (source) => onChange({...resource, 'source': {descriptor: null, value: source}});

	const handleRemoveSource = () => changeSource(null);

	const handleSelect = ({value: node}) => changeSource(node.value);

	const handleAddNewBlock = (target) => {
		const {handleAddNewBlock} = props;

		setShowMenu(!showMenu);

		if (target) {
			handleAddNewBlock(target);
		}
	};

	// чекбокс отвечает за вложенность, если он выбран, глубина (вложенность) должна повыситься, если снять - уменьшиться
	const handleCheckboxChange = () => {
		onChange({...resource, 'level': getUpdatedLevel(resource.level, resource.nested), 'nested': !resource.nested});
	};

	const handleOpenFilterForm = async (): Promise<string | null> => {
		try {
			const {value: classFqn} = resource.source.value;
			const context = resource.source.value ? getFilterContext(resource.source.value, classFqn) : createFilterContext(classFqn);
			const {serializedContext} = await window.jsApi.commands.filterForm(context);

			return serializedContext;
		} catch (e) {
			console.error('Ошибка окна фильтрации: ', e);
		}
	};

	const renderFilter = () => {
		const active = false;
		const iconName = active ? 'FILLED_FILTER' : 'FILTER';

		return (
			<div className={styles.filterButton} onClick={() => handleOpenFilterForm()}>
				<Icon name={iconName} />
				<span className={styles.desc}>Фильтрация</span>
			</div>
		);
	};

	const renderTreeSelect = () => {
		const {options} = props;

		return (
			<TreeSelect
				className={styles.sourceTreeSelect}
				onRemove={handleRemoveSource}
				onSelect={handleSelect}
				options={options}
				removable={true}
				value={resource.source.value}
			/>
		);
	};

	const renderAttributesButton = () => {
		return (
			<Button
				className={styles.button}
				onClick={() => setShowModal(!showModal)}
				variant='ADDITIONAL'
			>
				Атрибуты для таблицы
			</Button>
		);
	};

	const renderNestedCheckbox = () => {
		return (
			<FormControl
				className={styles.margin}
				label='Вложенный ресурс'
			>
				<Checkbox checked={resource.nested} name='Checkbox' onChange={handleCheckboxChange} value={resource.nested} />
			</FormControl>
		);
	};

	const renderBondWithResource = () => {
		// пока заглушка resource.communicationResourceAttribute
		return (
			<Select className={cn(styles.margin, styles.width)} onSelect={() => console.log(1)} options={ItemTypes} placeholder='Атрибут связи с ресурсом' value={null} />
		);
	};

	const getContentModal = () => (
		// пока заглушка
		<ul className={styles.list}>
			{TableColumnNames.map((item) => (
				<li className={styles.item} key={item}>
					<span>{item}</span>
					<Select className={styles.width} notice={false} onSelect={() => setValueAttribute(item)} options={ItemTypes} placeholder='Выберите элемент' value={valueAttribute} />
				</li>
			))}
		</ul>
	);

	const getUpdatedLevel = (oldLevel, isNested) => oldLevel + (1 - 2 * isNested);

	const paddingLeftForChildren = {paddingLeft: `${level * 36}px`};

	return (
		<div className={styles.border} style={paddingLeftForChildren}>
			{showMenu && <DropdownMenu items={ItemTypes} onSelect={(item) => handleAddNewBlock(item)} onToggle={handleAddNewBlock} />}
			<CollapsableFormBox handleAddNewBlock={() => handleAddNewBlock()} title='Ресурс'>
				<Container className={styles.container}>
					{renderTreeSelect()}
					{renderFilter()}
					{renderAttributesButton()}
					{renderNestedCheckbox()}
					{resource.nested && renderBondWithResource()}
				</Container>
			</CollapsableFormBox>
			{showModal && <ConfirmModal header='Атрибуты для таблицы' onClose={() => setShowModal(!showModal)} onSubmit={() => setShowModal(!showModal)} text={getContentModal()} />}
		</div>
	);
};

export default Resource;
