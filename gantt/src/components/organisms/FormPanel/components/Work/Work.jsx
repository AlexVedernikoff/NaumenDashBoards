// @flow
import 'rc-menu/assets/index.css';
import type {Attribute} from 'store/attributes/types';
import {Button, Checkbox, ConfirmModal, Container, FormControl, Icon, Select, TreeSelect} from 'naumen-common-components';
import cn from 'classnames';
import CollapsableFormBox from 'components/molecules/CollapsableFormBox';
import {Column, SourceItem} from 'src/store/App/types';
import {connect} from 'react-redux';
import {copyWithExclusion, getAdditionalFields, getPaddingLeftForChildren, getParentClassFqn, getPrevItem} from 'components/organisms/FormPanel/utils';
import {createFilterContext, getFilterContext} from 'src/store/helpers';
import {deepClone} from 'helpers';
import {defaultAttributeSetting, ITEM_TYPES_FOR_WORK} from 'src/store/App/constants';
import DropdownMenu from 'components/atoms/DropdownMenu';
import {functions, props} from './selectors';
import {openFilterForm} from 'utils/api/context';
import type {Props} from './types';
import React, {useState} from 'react';
import styles from './styles.less';
import WorkIcon from 'icons/WorkIcon';

const Work = (props: Props) => {
	const {columns, index, level, onChange, value: work} = props;
	const [attributeSettingsModal, setAttributeSettingsModal] = useState([]);
	const [valueAttributes, setValueAttributes] = useState({});
	const [loading, setLoading] = useState({});
	const [showModal, setShowModal] = useState(false);
	const [showMenu, setShowMenu] = useState(false);
	const mayBeNested = getPrevItem(index)?.type === 'WORK';

	const changeSource = (source: SourceItem) => {
		setValueAttributes({});
		setLoading({});
		onChange({...work, attributeSettings: [defaultAttributeSetting], communicationResourceAttribute: null, communicationWorkAttribute: null, source: {descriptor: '', value: source}});
	};

	const handleRemoveSource = () => changeSource(null);

	const handleSelectSource = ({value: node}) => changeSource(node.value);

	const handleAttributeSelect = (target: Attribute, code: string) => {
		const selectedAttr = attributeSettingsModal.find(attr => attr.code === code);

		if (!selectedAttr) {
			setAttributeSettingsModal([...attributeSettingsModal, { ...defaultAttributeSetting, attribute: copyWithExclusion(target.value, ['label', 'value']), code: code }]);
		} else {
			setAttributeSettingsModal([...attributeSettingsModal, {...selectedAttr, attribute: copyWithExclusion(target.value, ['label', 'value'])}]);
		}
	};

	const handleAttributeBondWithResource = (target: Attribute) => {
		onChange({...work, communicationResourceAttribute: copyWithExclusion(target.value, ['label', 'value'])});
	};

	const handleAttributeBondWithWork = (target: Attribute) => {
		onChange({...work, communicationWorkAttribute: copyWithExclusion(target.value, ['label', 'value'])});
	};

	const handleAddNewBlock = (target: string) => {
		const {handleAddNewBlock} = props;

		setShowMenu(!showMenu);

		if (target) {
			handleAddNewBlock(target);
		}
	};

	const handleDeleteBlock = () => {
		const {handleDeleteBlock} = props;
		return handleDeleteBlock();
	};

	const handleCheckboxChange = () => {
		const {handleUpdateChildrenLevel} = props;
		handleUpdateChildrenLevel(!work.nested);
	};

	const handleOpenFilterForm = async () => {
		try {
			const {value: classFqn} = work?.source?.value;
			const descriptor = work?.source?.descriptor;
			const context = descriptor ? getFilterContext(descriptor, classFqn) : createFilterContext(classFqn);
			const {serializedContext} = await openFilterForm(context);

			onChange({...work, source: {...work.source, descriptor: serializedContext}});
		} catch (e) {
			console.error('Ошибка окна фильтрации: ', e);
		}
	};

	const renderFilter = () => {
		const active = work?.source?.descriptor;
		const iconName = active ? 'FILLED_FILTER' : 'FILTER';

		return (
			<button className={styles.filterButton} disabled={!work?.source?.value} onClick={handleOpenFilterForm}>
				<Icon name={iconName} />
				<span className={styles.desc}>Фильтрация</span>
			</button>
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

	const handleAttributesButton = () => {
		const {fetchAttributes} = props;

		setAttributeSettingsModal(deepClone(work.attributeSettings));

		if (work.source.value?.value) {
			setLoading({attributes: true});
			fetchAttributes(work.source.value.value, null, (attributes) => {
				setValueAttributes({...valueAttributes, attributes: attributes});
				setLoading({attributes: false});
			});
		}

		setShowModal(!showModal);
	};

	const renderAttributesButton = () => {
		return (
			<Button
				className={styles.button}
				disabled={!work.source.value?.value}
				onClick={handleAttributesButton}
				variant='ADDITIONAL'
			>
				Атрибуты для таблицы
			</Button>
		);
	};

	const renderNestedCheckbox = () => {
		return (
			<FormControl className={styles.margin} label='Вложенная работа'>
				<Checkbox checked={work.nested} name='Checkbox' onChange={handleCheckboxChange} value={work.nested} />
			</FormControl>
		);
	};

	const getOptionsForBondWithResource = () => {
		const {fetchAttributes} = props;

		if (work.source.value?.value) {
			setLoading({bondWithResource: true});
			fetchAttributes(work.source.value.value, getParentClassFqn(work.parent), (attributes) => {
				setValueAttributes({...valueAttributes, bondWithResource: attributes});
				setLoading({bondWithResource: false});
			});
		}
	};

	const renderBondWithResource = () => {
		const newValueAttributes: Array<Attribute> = valueAttributes?.bondWithResource && valueAttributes.bondWithResource.map(item => item && getAdditionalFields(item, item.title, item.code));
		const workAttribute = work?.communicationResourceAttribute;
		const currentValue: Attribute = workAttribute ? getAdditionalFields(workAttribute, workAttribute.title, workAttribute.code) : null;

		return (
			<Select className={cn(styles.margin, styles.width)}
				fetchOptions={getOptionsForBondWithResource}
				isSearching={true}
				loading={loading?.bondWithResource}
				onSelect={handleAttributeBondWithResource}
				options={newValueAttributes}
				placeholder='Атрибут связи с ресурсом'
				value={currentValue}
			/>
		);
	};

	const getOptionsForBondWithWork = () => {
		const {fetchAttributes} = props;

		if (work.source.value?.value) {
			setLoading({bondWithWork: true});
			fetchAttributes(work.source.value.value, getParentClassFqn(work.parent), (attributes) => {
				setValueAttributes({...valueAttributes, bondWithWork: attributes});
				setLoading({bondWithWork: false});
			});
		}
	};

	const renderBondWithWork = () => {
		const newValueAttributes: Array<Attribute> = valueAttributes?.bondWithWork && valueAttributes.bondWithWork.map(item => item && getAdditionalFields(item, item.title, item.code));
		const workAttribute = work?.communicationWorkAttribute;
		const currentValue: Attribute = workAttribute ? getAdditionalFields(workAttribute, workAttribute.title, workAttribute.code) : null;

		return (
			<Select className={cn(styles.margin, styles.width)}
				fetchOptions={getOptionsForBondWithWork}
				isSearching={true}
				loading={loading?.bondWithWork}
				onSelect={handleAttributeBondWithWork}
				options={newValueAttributes}
				placeholder='Связь с вышестоящей работой'
				value={currentValue}
			/>
		);
	};

	const getAttribute = (codeColumn: string): null | Attribute => {
		const attributeSetting = attributeSettingsModal.find((item) => codeColumn === item.code);
		const attribute = attributeSetting?.attribute;

		if (attribute?.code && !attribute.title && valueAttributes?.attributes) {
			const defaultAttribute = valueAttributes.attributes.find((item) => attribute.code === item.code);
			return defaultAttribute ? getAdditionalFields(defaultAttribute, defaultAttribute.title, defaultAttribute.code) : null;
		}

		return attribute ? getAdditionalFields(attribute, attribute.title, attribute.code) : null;
	};

	const handleChangeDate = (value: Attribute, target: string) => {
		switch (target) {
			case 'start':
				onChange({...work, startWorkAttribute: copyWithExclusion(value.value, ['label', 'value'])});
				break;
			case 'end':
				onChange({...work, endWorkAttribute: copyWithExclusion(value.value, ['label', 'value'])});
				break;
		}
	};

	const getOptionsForDate = () => {
		const {fetchAttributesByTypes} = props;

		if (work.source.value?.value) {
			setLoading({date: true});
			fetchAttributesByTypes(work.source.value.value, ['date', 'dateTime'], (attributes) => {
				setValueAttributes({...valueAttributes, date: attributes});
				setLoading({date: false});
			});
		}
	};

	const renderDate = (date: Attribute, target: string) => {
		const newValueAttributes: Array<Attribute> = valueAttributes?.date && valueAttributes.date.map(item => item && getAdditionalFields(item, item.title, item.code));
		const label = target === 'start' ? 'Атрибут начала работ' : 'Атрибут окончания работ';
		const attribute = target === 'start' ? work?.startWorkAttribute : work?.endWorkAttribute;
		const currentValue: Attribute = attribute ? getAdditionalFields(attribute, attribute.title, attribute.code) : null;

		return (
			<Select className={cn(styles.margin, styles.width)}
				fetchOptions={getOptionsForDate}
				isSearching={true}
				loading={loading?.date}
				onSelect={(value) => handleChangeDate(value, target)}
				options={newValueAttributes}
				placeholder={label}
				value={currentValue}
			/>
		);
	};

	const renderColumn = (column: Column, options: Array<Attribute>) => {
		return (
			<li className={styles.item} key={column.code}>
				<span className={styles.title}>{column.title}</span>
				<Select className={styles.width}
					isSearching={true}
					loading={loading?.attributes}
					onSelect={(value) => handleAttributeSelect(value, column.code)}
					options={options}
					placeholder='Выберите элемент'
					value={getAttribute(column.code)}
				/>
			</li>
		);
	};

	const getContentModal = () => {
		const newValueAttributes: Array<Attribute> = valueAttributes?.attributes && valueAttributes.attributes.map(item => item && getAdditionalFields(item, item.title, item.code));

		return (
			<ul className={styles.list}>
				{columns.map((column) => renderColumn(column, newValueAttributes))}
			</ul>
		);
	};

	const getHeaderForm = () => {
		return (
			<div className={styles.header}>
				<WorkIcon />
				<span>{work?.source?.value?.label || 'Работа'}</span>
			</div>
		);
	};

	const handleCancelModal = () => {
		setShowModal(!showModal);
		setAttributeSettingsModal([]);
	};

	const handleSaveModal = () => {
		onChange({...work, attributeSettings: attributeSettingsModal});
		setShowModal(!showModal);
		setAttributeSettingsModal([]);
	};

	return (
		<div className={styles.border} style={getPaddingLeftForChildren(level)}>
			{showMenu && <DropdownMenu items={ITEM_TYPES_FOR_WORK} onSelect={(item) => handleAddNewBlock(item)} onToggle={() => handleAddNewBlock()} />}
			<CollapsableFormBox handleAddNewBlock={() => handleAddNewBlock()} handleDeleteBlock={handleDeleteBlock} title={getHeaderForm()}>
				<Container className={styles.container}>
					{renderTreeSelect()}
					{renderFilter()}
					{renderBondWithResource()}
					{renderAttributesButton()}
					{mayBeNested && renderNestedCheckbox()}
					{work.nested && renderBondWithWork()}
					{renderDate(work?.startWorkAttribute?.date, 'start')}
					{renderDate(work?.endWorkAttribute?.date, 'end')}
				</Container>
			</CollapsableFormBox>
			{showModal && <ConfirmModal header='Атрибуты для таблицы' notice={false} onClose={handleCancelModal} onSubmit={handleSaveModal} text={getContentModal()} />}
		</div>
	);
};

export default connect(props, functions)(Work);
