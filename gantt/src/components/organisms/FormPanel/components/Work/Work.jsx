// @flow
import 'rc-menu/assets/index.css';
import {Button, Checkbox, ConfirmModal, Container, Datepicker, FormControl, Icon, Select, TreeSelect} from 'naumen-common-components';
import cn from 'classnames';
import CollapsableFormBox from 'components/molecules/CollapsableFormBox';
import {createFilterContext, getFilterContext} from 'src/store/helpers';
import DropdownMenu from 'components/atoms/DropdownMenu';
import {ItemTypes, TableColumnNames} from '../../FormPanel';
import type {Props} from './types';
import React, {useState} from 'react';
import styles from './styles.less';

const Work = (props: Props) => {
	const {level, onChange, value: work} = props;
	const [valueAttribute, setValueAttribute] = useState({});
	const [showModal, setShowModal] = useState(false);
	const [showMenu, setShowMenu] = useState(false);

	const changeSource = (source) => onChange({...work, 'source': {descriptor: null, value: source}});

	const handleRemoveSource = () => changeSource(null);

	const handleSelectSource = ({value: node}) => changeSource(node.value);

	const handleAddNewBlock = (target) => {
		const {handleAddNewBlock} = props;

		setShowMenu(!showMenu);

		if (target) {
			handleAddNewBlock(target);
		}
	};

	const handleCheckboxChange = () => {
		onChange({...work, 'level': getUpdatedLevel(work.level, work.nested), 'nested': !work.nested});
	};

	const handleOpenFilterForm = async (): Promise<string | null> => {
		try {
			const {value: classFqn} = work.source.value;
			const context = work.source.value ? getFilterContext(work.source.value, classFqn) : createFilterContext(classFqn);
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
				onSelect={handleSelectSource}
				options={options}
				removable={true}
				value={work.source.value}
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
				label='Вложенная работа'
			>
				<Checkbox checked={work.nested} name='Checkbox' onChange={handleCheckboxChange} value={work.nested} />
			</FormControl>
		);
	};

	const renderBondWithWork = () => {
		// пока заглушка work.communicationWorkAttribute
		return (
			<Select className={cn(styles.margin, styles.width)} onSelect={() => console.log(1)} options={ItemTypes} placeholder='Связь с вышестоящей работой' value={null} />
		);
	};

	const renderBondWithResource = () => {
		// пока заглушка work.communicationResourceAttribute
		return (
			<Select className={cn(styles.margin, styles.width)} onSelect={() => console.log(1)} options={ItemTypes} placeholder='Атрибут связи с ресурсом' value={null} />
		);
	};

	const renderStartDate = () => {
		const onSelect = (value) => {
			console.log(value);
		};

		return (
			<Datepicker className={styles.margin} onSelect={(value) => onSelect(value)} placeholder='Атрибут начала работ' value={null} />
		);
	};

	const renderEndDate = () => {
		const onSelect = (value) => {
			console.log(value);
		};

		return (
			<Datepicker className={styles.margin} onSelect={(value) => onSelect(value)} placeholder='Атрибут окончания работ' value={null} />
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
			<CollapsableFormBox handleAddNewBlock={() => handleAddNewBlock()} title='Работа'>
				<Container className={styles.container}>
					{renderTreeSelect()}
					{renderFilter()}
					{renderBondWithResource()}
					{renderAttributesButton()}
					{renderNestedCheckbox()}
					{work.nested && renderBondWithWork()}
					{renderStartDate()}
					{renderEndDate()}
				</Container>
			</CollapsableFormBox>
			{showModal && <ConfirmModal header='Атрибуты для таблицы' onClose={() => setShowModal(!showModal)} onSubmit={() => setShowModal(!showModal)} text={getContentModal()} />}
		</div>
	);
};

export default Work;
