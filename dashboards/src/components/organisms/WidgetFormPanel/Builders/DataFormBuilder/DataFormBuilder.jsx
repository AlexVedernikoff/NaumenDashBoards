// @flow
import type {AttrSelectProps, GetRefOptions, MixinInputProps} from './types';
import {Divider} from 'components/atoms';
import {COMPUTED_ATTR} from 'components/organisms/WidgetFormPanel/Modals/ComputeAttrCreator/constants';
import type {ComputedAttr} from 'components/organisms/WidgetFormPanel/Modals/ComputeAttrCreator/types';
import {ComputeAttrCreator} from 'components/organisms/WidgetFormPanel/Modals';
import {createOrderName, getNumberFromName} from 'utils/widget';
import {FIELDS, getAggregateOptions, getGroupOptions, styles as mainStyles, TYPES, VALUES} from 'components/organisms/WidgetFormPanel';
import FormBuilder from 'components/organisms/WidgetFormPanel/Builders/FormBuilder';
import {getWidgetIcon} from 'icons/widgets';
import type {Node} from 'react';
import type {OptionType} from 'react-select/src/types';
import {PlusIcon} from 'icons/form';
import type {Props as TreeProps} from 'components/molecules/TreeSelectInput/types';
import React, {Fragment} from 'react';
import type {SelectValue} from 'components/organisms/WidgetFormPanel/types';
import styles from './styles.less';
import TreeSelectInput from 'components/molecules/TreeSelectInput';

export class DataFormBuilder extends FormBuilder {
	state = {
		fieldName: '',
		showModal: false
	};

	// Список полей для удаления при смене источника данных
	sourceRefs = [];

	baseHandleSelectSource = async (name: string, source: SelectValue) => {
		const {attributes, fetchAttributes, setFieldValue, values} = this.props;
		const currentSource = values[name];
		await setFieldValue(name, source);

		if (currentSource && currentSource.value !== source.value) {
			const descriptorName = this.createRefName(name, FIELDS.descriptor);

			setFieldValue(descriptorName, null);
		}

		const classFqn = source.value;

		if (!attributes[classFqn]) {
			fetchAttributes(classFqn);
		}

		this.clearSourceRefFields(name);
	};

	callFilterModal = (sourceFieldName: string) => async () => {
		const {setFieldValue, values} = this.props;
		const descriptorName = this.createRefName(sourceFieldName, FIELDS.descriptor);
		const source = values[sourceFieldName];
		const descriptor = values[descriptorName];

		if (source) {
			const context = descriptor ? JSON.parse(descriptor) : this.createFilterContext(source.value);
			const {serializedContext} = await window.jsApi.commands.filterForm(context);

			setFieldValue(descriptorName, serializedContext);
		}
	};

	clearSourceRefFields = (name: string) => {
		const {setFieldValue} = this.props;
		const number = getNumberFromName(name);
		let fields = this.sourceRefs;

		if (Number.isInteger(number)) {
			const createName = createOrderName(number);
			fields = fields.map(createName);
		}

		fields.forEach(ref => setFieldValue(ref, null));
	};

	combineInputs = (left: Node, right: Node, withDivider: boolean = true) => (
		<Fragment>
			<div className={styles.combineInput}>
				{left && <div className={styles.combineInputLeft}>
					{left}
				</div>}
				<div className={styles.combineInputRight}>
					{right}
				</div>
			</div>
			{withDivider && <Divider />}
		</Fragment>
	);

	createFilterContext = (classFqn: string) => {
		const {context: mainContext} = this.props;

		const context = {
			cases: [],
			clazz: classFqn,
			contentUuid: mainContext.contentCode
		};

		if (classFqn.includes('$')) {
			context.cases = [classFqn];
			context.clazz = classFqn.split('$').shift();
		}

		return context;
	};

	createRefName = (targetName: string, baseRefName: string) => {
		const number = getNumberFromName(targetName);
		return isNaN(number) ? baseRefName : createOrderName(number)(baseRefName);
	};

	getAttributeOptions = (name: string) => {
		const {attributes, fetchAttributes, values} = this.props;
		let sourceName = FIELDS.source;
		let options = [];

		if (name.includes('_')) {
			sourceName = createOrderName(getNumberFromName(name))(sourceName);
		}

		const source = values[sourceName];

		if (source) {
			const currentAttr = attributes[source.value];

			if (!currentAttr) {
				fetchAttributes(source.value);
			} else {
				options = currentAttr.data;
			}
		}

		return options;
	};

	getIconLabel = (option: SelectValue) => {
		const Icon = getWidgetIcon(option.value);

		return (
			<div className={styles.labelWithIcon}>
				{Icon ? <Icon /> : <span>{option.label}</span>}
			</div>
		);
	};

	getLabelWithIcon = (option: SelectValue) => {
		const Icon = getWidgetIcon(option.value);

		return (
			<div className={styles.labelWithIcon}>
				{Icon && <Icon />} <span>{option.label}</span>
			</div>
		);
	};

	handleChangeName = (key: string) => (fieldName: string, name: string) => {
		const {setFieldValue, values} = this.props;
		const value = values[fieldName];
		value[key] = name;

		setFieldValue(fieldName, value);
	};

	handleCreateAttr = (name: string, attr: ComputedAttr) => {
		const {setFieldValue, values} = this.props;
		let computedAttrs = values[FIELDS.computedAttrs];
		computedAttrs = Array.isArray(computedAttrs) ? [attr, ...computedAttrs] : [attr];

		setFieldValue(name, attr);
		setFieldValue(FIELDS.computedAttrs, computedAttrs);
		this.handleShowModal(false)();
	};

	handleSelectSource = this.baseHandleSelectSource;

	handleSelectWithRef = (baseRefName: string, getRefOptions: GetRefOptions) => (name: string, value: OptionType) => {
		const {setFieldValue, values} = this.props;
		const refName = this.createRefName(name, baseRefName);
		const refOptions = getRefOptions(value);
		const refValueCode = values[refName] && values[refName].value;

		setFieldValue(name, value);

		if (!refValueCode || refOptions.find(o => o.value === refValueCode)) {
			let refValue = refOptions[0];

			if (/group/i.test(refName) && TYPES.DATE.includes(value.type)) {
				refValue = refOptions.find(o => o.value === VALUES.DATETIME_GROUP.MONTH);
			}

			setFieldValue(refName, refValue);
		}
	};

	handleShowModal = (showModal: boolean, fieldName?: string = '') => () => this.setState({fieldName, showModal});

	renderAggregateInput = (name: string = FIELDS.aggregation, refName: string) => {
		const {values} = this.props;
		const refValue = values[refName];
		const options = getAggregateOptions(refValue);
		const value = values[name];

		const props = {
			border: false,
			color: 'blue',
			defaultValue: options[0],
			isSearchable: false,
			name,
			options,
			value
		};

		if (!refValue || (refValue && refValue.type !== COMPUTED_ATTR)) {
			return this.renderSelect(props);
		}
	};

	renderAttrSelect = (props: AttrSelectProps) => {
		const {computedAttrs} = this.props.values;
		let {name, options, value, withCreateButton} = props;
		props.attr = true;
		props.withEditIcon = true;

		if (value) {
			props.form = {
				onSubmit: this.handleChangeName('title'),
				value: value.title
			};
		}

		if (!options) {
			options = this.getAttributeOptions(name);
		}

		if (withCreateButton) {
			props.onClickCreateButton = this.handleShowModal(true, name);
			props.createButtonText = 'Создать поле';

			if (Array.isArray(computedAttrs)) {
				options = [...computedAttrs, ...options];
			}
		}

		if (options.length && name.startsWith(FIELDS.breakdown)) {
			const noBreakdown = {
				code: null,
				title: 'Без разбивки'
			};

			options = [noBreakdown, ...options];
		}

		return this.renderSelect({...props, options});
	};

	renderBreakdownInput = (name: string = FIELDS.breakdown) => {
		const {values} = this.props;

		const breakdown: AttrSelectProps = {
			border: false,
			name,
			onSelect: this.handleSelectWithRef(FIELDS.breakdownGroup, getGroupOptions),
			placeholder: 'Разбивка',
			value: values[name]
		};

		return this.renderAttrSelect(breakdown);
	};

	renderBreakdownWithGroup = (breakdownGroup: string, breakdown: string) => this.combineInputs(
		this.renderGroupInput(breakdownGroup, breakdown),
		this.renderBreakdownInput(breakdown)
	);

	renderFilterButton = (source: string) => {
		return (
			<div className={styles.filter}>
				<div onClick={this.callFilterModal(source)} className={styles.container}>
					<PlusIcon />
				</div>
				<div>Фильтр</div>
			</div>
		);
	};

	renderGroupInput = (name: string = FIELDS.group, refName: string = FIELDS.xAxis, mixin: ?MixinInputProps) => {
		const {values} = this.props;
		const ref = values[refName];
		const options = getGroupOptions(ref);
		const group = values[name];
		let isDisabled = false;

		let props = {
			border: false,
			color: 'blue',
			defaultValue: options[0],
			isDisabled,
			isSearchable: false,
			name,
			options,
			value: group
		};

		if (mixin) {
			props = {...props, ...mixin};
		}

		return this.renderSelect(props);
	};

	renderModal = () => {
		const {fieldName, showModal} = this.state;

		if (showModal) {
			return (
				<ComputeAttrCreator
					name={fieldName}
					onClose={this.handleShowModal(false)}
					onSubmit={this.handleCreateAttr}
				/>
			);
		}
	};

	renderSourceInput = (name: string = FIELDS.source) => {
		const {values, sources} = this.props;
		const value = values[name];

		let props: TreeProps = {
			name: name,
			onChange: this.handleSelectSource,
			placeholder: 'Выберите источник',
			tree: sources,
			value
		};

		if (value) {
			props.form = {
				onSubmit: this.handleChangeName('label'),
				value: value.label
			};
		}

		return (
			<Fragment>
				{this.renderTreeSelect(props)}
				{this.renderFilterButton(name)}
			</Fragment>
		);
	};

	renderTreeSelect = (props: TreeProps) => (
		<div className={mainStyles.field}>
			<TreeSelectInput {...props} />
			<span className={mainStyles.error}>
				{this.props.errors[props.name]}
			</span>
		</div>
	);
}

export default DataFormBuilder;
