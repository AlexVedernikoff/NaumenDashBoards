// @flow
import 'rc-menu/assets/index.css';
import type {Attribute} from 'store/attributes/types';
import {Button, Checkbox, Container, FormControl, Icon, Select, TreeSelect} from 'naumen-common-components';
import cn from 'classnames';
import CollapsableFormBox from 'components/molecules/CollapsableFormBox';
import {Column, SourceItem} from 'src/store/App/types';
import {connect} from 'react-redux';
import {copyWithExclusion, getAdditionalFields, getPaddingLeftForChildren, getParentClassFqn, replaceElementInArray} from 'components/organisms/FormPanel/utils';
import {createFilterContext, getFilterContext} from 'src/store/helpers';
import {deepClone} from 'helpers';
import {defaultAttributeSetting, ITEM_TYPES_FOR_ALL} from 'src/store/App/constants';
import DropdownMenu from 'components/atoms/DropdownMenu';
import Form from 'src/components/atoms/Form';
import {functions, props} from './selectors';
import Modal from 'src/components/atoms/Modal';
import {openFilterForm} from 'utils/api/context';
import type {Props} from './types';
import React, {useEffect, useState} from 'react';
import ResourceIcon from 'icons/ResourceIcon';
import styles from './styles.less';

const Resource = (props: Props) => {
	const {columns, hasMainResource, index, level, onChange, value: resource} = props;
	const [attributeSettingsModal, setAttributeSettingsModal] = useState([]);
	const [valueAttributes, setValueAttributes] = useState({});
	const [loading, setLoading] = useState({});
	const [showModal, setShowModal] = useState(false);
	const [showModalRemoving, setShowModalRemoving] = useState(false);
	const [showMenu, setShowMenu] = useState(false);
	const [top, setTop] = useState(null);

	useEffect(() => {
		const panel = document.getElementById('panel')?.getBoundingClientRect();
		const button = document.getElementById('resourcesSettingsButton' + index)?.getBoundingClientRect();

		const maxTop = panel.top + panel.height - 320;
		const top = button.top < maxTop ? button.top : maxTop;

		setTop(top);
	}, [showModal]);

	const changeSource = (source: SourceItem) => {
		const value = {
			...resource,
			attributeSettings: [defaultAttributeSetting],
			communicationResourceAttribute: null,
			communicationWorkAttribute: null,
			source: {descriptor: '', value: source}
		};

		setValueAttributes({});
		setLoading({});
		onChange(value, true);
	};

	const handleRemoveSource = () => changeSource(null);

	const handleSourceSelect = ({value: node}) => changeSource(node.value);

	const handleAttributeSelect = (target: Attribute, code: string) => {
		const indexSelectedAttr = attributeSettingsModal.findIndex(attr => attr.code === code);

		if (!target) {
			return setAttributeSettingsModal([...attributeSettingsModal.slice(0, indexSelectedAttr), ...attributeSettingsModal.slice(indexSelectedAttr + 1)]);
		}

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
			...resource,
			communicationResourceAttribute: copyWithExclusion(target.value, ['label', 'value'])
		});
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

		handleUpdateChildrenLevel(!resource.nested);
	};

	const handleOpenFilterForm = async () => {
		try {
			const {value: classFqn} = resource?.source?.value;
			const descriptor = resource?.source?.descriptor;
			const context = descriptor ? getFilterContext(descriptor, classFqn) : createFilterContext(classFqn);
			const {serializedContext} = await openFilterForm(context);

			onChange({...resource, source: {...resource.source, descriptor: serializedContext}});
		} catch (e) {
			console.error('Ошибка окна фильтрации: ', e);
		}
	};

	const renderFilter = () => {
		const active = JSON.parse(resource?.source?.descriptor || '{}').filters?.length > 0;
		const iconName = active ? 'FILLED_FILTER' : 'FILTER';

		return (
			<button className={cn(styles.button, styles.width)} disabled={!resource?.source?.value}>
				<div className={styles.bigButton} onClick={handleOpenFilterForm}> </div>
				<Icon height={14} name={iconName} />
				<span className={styles.desc}>Фильтрация</span>
			</button>
		);
	};

	const renderTreeSelect = () => {
		const {options} = props;

		return (
			<div className={styles.select}>
				<span className={styles.label}>Ресурс</span>
				<TreeSelect
					className={styles.sourceTreeSelect}
					onRemove={handleRemoveSource}
					onSelect={handleSourceSelect}
					options={options}
					removable={true}
					value={resource.source.value}
				/>
			</div>
		);
	};

	const handleAttributesButton = () => {
		const {fetchAttributes} = props;

		setAttributeSettingsModal(deepClone(resource.attributeSettings));

		if (resource.source.value?.value) {
			setLoading({attributes: true});
			fetchAttributes(resource.source.value.value, null, attributes => {
				setValueAttributes({...valueAttributes, attributes: attributes});
				setLoading({attributes: false});
			});
		}

		setShowModal(!showModal);
	};

	const renderAttributesButton = () => {
		return (
			<div className={styles.width} id={`resourcesSettingsButton${index}`}>
				<Button
					className={styles.button}
					disabled={!resource.source.value?.value}
					variant='ADDITIONAL'
				>
					<div className={styles.bigButton} onClick={handleAttributesButton}> </div>
					Атрибуты для таблицы
				</Button>
			</div>
		);
	};

	const renderNestedCheckbox = () => {
		return (
			<div onClick={handleCheckboxChange}>
				<FormControl className={cn(styles.checkbox)} label='Вложенный ресурс' small={true}>
					<Checkbox checked={resource.nested} name="Checkbox" value={resource.nested} />
				</FormControl>
			</div>
		);
	};

	const getOptionsForBondWithResource = () => {
		const {fetchAttributes} = props;

		if (resource.source.value?.value) {
			setLoading({bondWithResource: true});
			fetchAttributes(resource.source.value.value, getParentClassFqn(resource.parent), attributes => {
				setValueAttributes({...valueAttributes, bondWithResource: attributes});
				setLoading({bondWithResource: false});
			});
		}
	};

	const renderBondWithResource = () => {
		const newValueAttributes: Array<Attribute> = valueAttributes?.bondWithResource && valueAttributes.bondWithResource.map(item => item && getAdditionalFields(item, item.title, item.code));
		const resourceAttribute = resource?.communicationResourceAttribute;
		const currentValue: null | Attribute = resourceAttribute ? getAdditionalFields(resourceAttribute, resourceAttribute.title, resourceAttribute.code) : null;

		return (
			<div className={styles.select}>
				<span className={styles.label}>Связь с вышестоящим ресурсом</span>
				<Select className={cn(styles.margin, styles.selectIcon, styles.width)}
					fetchOptions={getOptionsForBondWithResource}
					icon={'CHEVRON'}
					isSearching={true}
					loading={loading?.bondWithResource}
					onSelect={handleAttributeBondWithResource}
					options={newValueAttributes}
					placeholder='Связь с вышестоящим ресурсом'
					value={currentValue}
				/>
			</div>
		);
	};

	const getAttribute = (codeColumn: string): null | Array<Attribute> => {
		const attributeSetting = attributeSettingsModal.find(item => codeColumn === item.code);
		const attribute = attributeSetting?.attribute;

		if (attribute?.code && !attribute.title && valueAttributes?.attributes) {
			const defaultAttribute = valueAttributes.attributes.find(item => attribute.code === item.code);
			return defaultAttribute ? getAdditionalFields(defaultAttribute, defaultAttribute.title, defaultAttribute.code) : null;
		}

		return attribute ? getAdditionalFields(attribute, attribute.title, attribute.code) : null;
	};

	const renderColumn = (column: Column, index, options: Array<Attribute>) => {
		const opts = index === 0 && options && options.filter(option => option.type === 'string');

		return (
			<li className={styles.item} key={column.code}>
				<span className={styles.title}>{column.title}</span>
				<Select className={cn(styles.selectIcon, styles.selectWidth, styles.width)}
					editable={Boolean(index)}
					icon={'CHEVRON'}
					isSearching={true}
					loading={loading?.attributes}
					onChangeLabel={() => handleAttributeSelect(null, column.code)}
					onSelect={(value) => handleAttributeSelect(value, column.code)}
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
				<ResourceIcon />
				<span>{resource?.source?.value?.label || 'Ресурс'}</span>
			</div>
		);
	};

	const handleCancelModal = () => {
		setShowModal(!showModal);
		setAttributeSettingsModal([]);
	};

	const handleSaveModal = () => {
		onChange({...resource, attributeSettings: attributeSettingsModal});
		setShowModal(!showModal);
		setAttributeSettingsModal([]);
	};

	const renderDropdownMenu = () => {
		if (showMenu) {
			return <DropdownMenu items={ITEM_TYPES_FOR_ALL} onSelect={item => handleAddNewBlock(item)} onToggle={() => handleAddNewBlock()} />;
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
					При удалении ресурса также удалятся и все вложенные в него ресурсы и работы
				</Modal>
			);
		}

		return null;
	};

	const renderCollapsableFormBox = () => (
		<CollapsableFormBox handleAddNewBlock={() => handleAddNewBlock()} handleDeleteBlock={(resource.level || hasMainResource) && (() => setShowModalRemoving(true))} title={getHeaderForm()}>
			<Container className={styles.container}>
				{renderTreeSelect()}
				{renderFilter()}
				{renderAttributesButton()}
				{!!index && renderNestedCheckbox()}
				{resource.nested && renderBondWithResource()}
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

export default connect(props, functions)(Resource);
