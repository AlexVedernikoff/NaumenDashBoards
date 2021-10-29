// @flow
import 'rc-menu/assets/index.css';
import type {Attribute} from 'store/attributes/types';
import {Button, Checkbox, Container, FormControl, Icon, Select, TreeSelect} from 'naumen-common-components';
import cn from 'classnames';
import CollapsableFormBox from 'components/molecules/CollapsableFormBox';
import {Column, SourceItem} from 'src/store/App/types';
import {connect} from 'react-redux';
import {copyWithExclusion, getAdditionalFields, getPaddingLeftForChildren, getParentClassFqn, getPrevItem, replaceElementInArray} from 'components/organisms/FormPanel/utils';
import {createFilterContext, getFilterContext} from 'src/store/helpers';
import {deepClone} from 'helpers';
import {defaultAttributeSetting, ITEM_TYPES_FOR_WORK} from 'src/store/App/constants';
import DropdownMenu from 'components/atoms/DropdownMenu';
import Form from 'src/components/atoms/Form';
import {functions, props} from './selectors';
import Modal from 'src/components/atoms/Modal';
import {openFilterForm} from 'utils/api/context';
import type {Props} from './types';
import React, {useEffect, useState} from 'react';
import styles from './styles.less';
import WorkIcon from 'icons/WorkIcon';

const Work = (props: Props) => {
	const {columns, index, level, onChange, value: work} = props;
	const [attributeSettingsModal, setAttributeSettingsModal] = useState([]);
	const [valueAttributes, setValueAttributes] = useState({});
	const [loading, setLoading] = useState({});
	const [showModal, setShowModal] = useState(false);
	const [showModalRemoving, setShowModalRemoving] = useState(false);
	const [showMenu, setShowMenu] = useState(false);
	const [top, setTop] = useState(null);
	const mayBeNested = getPrevItem(index)?.type === 'WORK';

	useEffect(() => {
		setTop(document.getElementById('workSettingsButton' + index)?.getBoundingClientRect().top);
	}, [showModal]);

	const changeSource = (source: SourceItem) => {
		setValueAttributes({});
		setLoading({});
		onChange({
			...work,
			attributeSettings: [defaultAttributeSetting],
			communicationResourceAttribute: null,
			communicationWorkAttribute: null,
			endWorkAttribute: null,
			source: {descriptor: '', value: source},
			startWorkAttribute: null
		});
	};

	const handleRemoveSource = () => changeSource(null);

	const handleSelectSource = ({value: node}) => changeSource(node.value);

	const handleAttributeSelect = (target: Attribute, code: string) => {
		const indexSelectedAttr = attributeSettingsModal.findIndex(attr => attr.code === code);

		if (indexSelectedAttr === -1) {
			const newAttribute = {
				...defaultAttributeSetting,
				attribute: copyWithExclusion(target.value, ['label', 'value']),
				code
			};

			setAttributeSettingsModal([...attributeSettingsModal, newAttribute]);
		} else {
			const newAttribute = {
				...attributeSettingsModal[indexSelectedAttr],
				attribute: copyWithExclusion(target.value, ['label', 'value'])
			};

			setAttributeSettingsModal(replaceElementInArray(attributeSettingsModal, newAttribute, indexSelectedAttr));
		}
	};

	const handleAttributeBondWithResource = (target: Attribute) => {
		onChange({
			...work,
			communicationResourceAttribute: copyWithExclusion(target.value, ['label', 'value'])
		});
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
		setShowModalRemoving(false);

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
		const active = JSON.parse(work?.source?.descriptor || '{}').filters?.length > 0;
		const iconName = active ? 'FILLED_FILTER' : 'FILTER';

		return (
			<button className={styles.button} disabled={!work?.source?.value} onClick={handleOpenFilterForm}>
				<Icon height={14} name={iconName} />
				<span className={styles.desc}>Фильтрация</span>
			</button>
		);
	};

	const renderTreeSelect = () => {
		const {options} = props;

		return (
			<div className={styles.select}>
				<span className={styles.label}>Работа</span>
				<TreeSelect
					className={styles.sourceTreeSelect}
					onRemove={handleRemoveSource}
					onSelect={handleSelectSource}
					options={options}
					removable={true}
					value={work.source.value}
				/>
			</div>
		);
	};

	const handleAttributesButton = () => {
		const {fetchAttributes} = props;

		setAttributeSettingsModal(deepClone(work.attributeSettings));

		if (work.source.value?.value) {
			setLoading({attributes: true});
			fetchAttributes(work.source.value.value, null, attributes => {
				setValueAttributes({...valueAttributes, attributes: attributes});
				setLoading({attributes: false});
			});
		}

		setShowModal(!showModal);
	};

	const renderAttributesButton = () => {
		return (
			<div className={styles.width} id={`workSettingsButton${index}`}>
				<Button
					className={styles.button}
					disabled={!work.source.value?.value}
					onClick={handleAttributesButton}
					variant='ADDITIONAL'
				>
					Атрибуты для таблицы
				</Button>
			</div>
		);
	};

	const renderNestedCheckbox = () => {
		return (
			<FormControl className={cn(styles.checkbox)} label='Вложенная работа' small={true}>
				<Checkbox checked={work.nested} name='Checkbox' onChange={handleCheckboxChange} value={work.nested} />
			</FormControl>
		);
	};

	const getOptionsForBondWithResource = () => {
		const {fetchAttributes} = props;

		if (work.source.value?.value) {
			setLoading({bondWithResource: true});
			fetchAttributes(work.source.value.value, getParentClassFqn(work.parent), attributes => {
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
			<div className={styles.select}>
				<span className={styles.label}>Атрибут связи с ресурсом</span>
				<Select className={cn(styles.margin, styles.selectIcon, styles.width)}
					fetchOptions={getOptionsForBondWithResource}
					icon={'CHEVRON'}
					isSearching={true}
					loading={loading?.bondWithResource}
					onSelect={handleAttributeBondWithResource}
					options={newValueAttributes}
					placeholder='Атрибут связи с ресурсом'
					value={currentValue}
				/>
			</div>
		);
	};

	const getOptionsForBondWithWork = () => {
		const {fetchAttributes} = props;

		if (work.source.value?.value) {
			setLoading({bondWithWork: true});
			fetchAttributes(work.source.value.value, getParentClassFqn(work.parent), attributes => {
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
			<div className={styles.select}>
				<span className={styles.label}>Связь с вышестоящей работой</span>
				<Select className={cn(styles.margin, styles.selectIcon, styles.width)}
					fetchOptions={getOptionsForBondWithWork}
					icon={'CHEVRON'}
					isSearching={true}
					loading={loading?.bondWithWork}
					onSelect={handleAttributeBondWithWork}
					options={newValueAttributes}
					placeholder='Связь с вышестоящей работой'
					value={currentValue}
				/>
			</div>
		);
	};

	const getAttribute = (codeColumn: string): null | Attribute => {
		const attributeSetting = attributeSettingsModal.find(item => codeColumn === item.code);
		const attribute = attributeSetting?.attribute;

		if (attribute?.code && !attribute.title && valueAttributes?.attributes) {
			const defaultAttribute = valueAttributes.attributes.find(item => attribute.code === item.code);
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
			fetchAttributesByTypes(work.source.value.value, ['date', 'dateTime'], attributes => {
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
			<div className={styles.select}>
				<span className={styles.label}>{label}</span>
				<Select className={cn(styles.margin, styles.selectIcon, styles.width)}
					fetchOptions={getOptionsForDate}
					icon={'CHEVRON'}
					isSearching={true}
					loading={loading?.date}
					onSelect={value => handleChangeDate(value, target)}
					options={newValueAttributes}
					placeholder={label}
					value={currentValue}
				/>
			</div>
		);
	};

	const renderColumn = (column: Column, index, options: Array<Attribute>) => {
		const opts = index === 0 && options && options.filter(option => option.type === 'string');

		return (
			<li className={styles.item} key={column.code}>
				<span className={styles.title}>{column.title}</span>
				<Select className={cn(styles.selectIcon, styles.width)}
					editable={Boolean(index)}
					icon={'CHEVRON'}
					isSearching={true}
					loading={loading?.attributes}
					onChangeLabel={(value) => handleAttributeSelect(value, column.code)}
					onSelect={value => handleAttributeSelect(value, column.code)}
					options={opts || options}
					placeholder='Выберите элемент'
					value={getAttribute(column.code)}
				/>
			</li>
		);
	};

	const getContentForm = () => {
		const newValueAttributes: Array<Attribute> = valueAttributes?.attributes && valueAttributes.attributes.map(item => item && getAdditionalFields(item, item.title, item.code));

		return (
			<ul className={styles.list}>
				{columns.map((column, index) => renderColumn(column, index, newValueAttributes))}
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

	const renderDropdownMenu = () => {
		if (showMenu) {
			return <DropdownMenu items={ITEM_TYPES_FOR_WORK} onSelect={item => handleAddNewBlock(item)} onToggle={() => handleAddNewBlock()} />;
		}

		return null;
	};

	const renderForm = () => {
		if (showModal) {
			return (
				<Form
					className={styles.height}
					onClose={handleCancelModal}
					onSubmit={handleSaveModal}
					top={top}
				>
					{columns && getContentForm()}
				</Form>
			);
		}

		return null;
	};

	const renderRemovingModal = () => {
		if (showModalRemoving) {
			return (
				<Modal
					notice={true}
					onClose={() => setShowModalRemoving(false)}
					onSubmit={handleDeleteBlock}
					submitText="Удалить"
				>
					При удалении работы также удалятся и все вложенные в нее работы
				</Modal>
			);
		}

		return null;
	};

	const renderCollapsableFormBox = () => (
		<CollapsableFormBox handleAddNewBlock={() => handleAddNewBlock()} handleDeleteBlock={() => setShowModalRemoving(true)} title={getHeaderForm()}>
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
	);

	return (
		<div className={styles.border} style={getPaddingLeftForChildren(level)}>
			{renderDropdownMenu()}
			{renderCollapsableFormBox()}
			{renderForm()}
			{renderRemovingModal()}
		</div>
	);
};

export default connect(props, functions)(Work);
