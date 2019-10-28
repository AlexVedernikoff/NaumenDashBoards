// @flow
import type {AttrSelectProps, GetRefOptions, MixinInputProps} from './types';
import {Divider} from 'components/atoms';
import {COMPUTED_ATTR} from 'components/organisms/WidgetFormPanel/Modals/ComputeAttrCreator/constants';
import type {ComputedAttr} from 'components/organisms/WidgetFormPanel/Modals/ComputeAttrCreator/types';
import {ComputeAttrCreator} from 'components/organisms/WidgetFormPanel/Modals';
import {createOrderName, getNumberFromName} from 'utils/widget';
import {FIELDS, getAggregateOptions, getGroupOptions, styles as mainStyles} from 'components/organisms/WidgetFormPanel';
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
		showModal: false
	};

	combineInputs = (Left: Node, Right: Node, withDivider: boolean = true) => (
		<Fragment>
			<div className={styles.combineInput}>
				<div className={styles.combineInputLeft}>
					{Left}
				</div>
				<div className={styles.combineInputRight}>
					{Right}
				</div>
			</div>
			{withDivider && <Divider />}
		</Fragment>
	);

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

			if (!currentAttr || (currentAttr.data.length === 0 && !currentAttr.loading && !currentAttr.error)) {
				fetchAttributes(source);
			} else {
				options = currentAttr.data;
			}
		}

		return options;
	};

	handleSelectAxis = (baseRefName: string, getRefOptions: GetRefOptions) => (name: string, value: OptionType) => {
		const {setFieldValue, values} = this.props;
		const refName = this.createRefName(name, baseRefName);
		const refValue = values[refName];
		const refOptions = getRefOptions(value);

		setFieldValue(name, value);

		if (!refValue || !refOptions.find(o => o.value === refValue.value)) {
			setFieldValue(refName, refOptions[0]);
		}
	};

	baseHandleSelectSource = async (name: string, source: SelectValue) => {
		const {attributes, fetchAttributes, setFieldValue, values} = this.props;
		const currentSource = values[name];
		await setFieldValue(name, source);

		if (currentSource && currentSource.value !== source.value) {
			const descriptorName = this.createRefName(name, FIELDS.descriptor);

			setFieldValue(descriptorName, null);
		}

		if (!attributes[source.value]) {
			fetchAttributes(source);
		}
	};

	handleShowModal = (showModal: boolean) => () => this.setState({showModal});

	handleCreateAttr = (attr: ComputedAttr) => {
		const {setFieldValue, values} = this.props;
		let computedAttrs = values[FIELDS.computedAttrs];
		computedAttrs = Array.isArray(computedAttrs) ? [attr, ...computedAttrs] : [attr];

		setFieldValue(FIELDS.computedAttrs, computedAttrs);
		this.handleShowModal(false)();
	};

	handleChangeAttrName = (name: string, value: string) => {
		const {setFieldValue, values} = this.props;
		const attr = values[name];
		attr.title = value;

		setFieldValue(name, attr);
	};

	handleChangeSourceName = (name: string, value: string) => {
		const {setFieldValue, values} = this.props;
		const source = values[name];
		source.label = value;

		setFieldValue(name, source);
	};

	handleSelectSource = this.baseHandleSelectSource;

	createFilterContext = (sourceName: string) => {
		const {context: mainContext} = this.props;

		const context = {
			cases: [],
			clazz: sourceName,
			contentUuid: mainContext.contentCode
		};

		if (sourceName.includes('$')) {
			const parts = sourceName.split('$');
			context.cases = [sourceName];
			context.clazz = parts.shift();
		}

		return context;
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

	renderModal = () => {
		const {showModal} = this.state;

		if (showModal) {
			return <ComputeAttrCreator onSubmit={this.handleCreateAttr} onClose={this.handleShowModal(false)} />;
		}
	};

	renderTreeSelect = (props: TreeProps) => (
		<div className={mainStyles.field}>
			<TreeSelectInput {...props} />
			<span className={mainStyles.error}>
				{this.props.errors[props.name]}
			</span>
		</div>
	);

	renderAttrSelect = (props: AttrSelectProps) => {
		const {computedAttrs} = this.props.values;
		let {name, options, value, withCreateButton} = props;
		props.attr = true;
		props.withEditIcon = true;

		if (value) {
			props.form = {
				onSubmit: this.handleChangeAttrName,
				value: value.title
			};
		}

		if (!options) {
			options = this.getAttributeOptions(name);
		}

		if (withCreateButton) {
			props.onClickCreateButton = this.handleShowModal(true);
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

	renderFilterButton = (source: string) => {
		return (
			<div className={styles.filterIcon}>
				<PlusIcon onClick={this.callFilterModal(source)}/>
				<span>Фильтр</span>
			</div>
		);
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
				onSubmit: this.handleChangeSourceName,
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

	renderBreakdownInput = (name: string = FIELDS.breakdown) => {
		const {values} = this.props;

		const breakdown: AttrSelectProps = {
			border: false,
			name: name,
			placeholder: 'Разбивка',
			value: values[name]
		};

		return this.renderAttrSelect(breakdown);
	};

	renderAggregateInput = (name: string = FIELDS.aggregation, refName: string) => {
		const {values} = this.props;
		const refValue = values[refName];
		const options = getAggregateOptions(refValue);
		const aggregation = values[name];

		const props = {
			border: false,
			color: 'blue',
			defaultValue: options[0],
			isSearchable: false,
			name,
			options,
			value: aggregation
		};

		if (!refValue || (refValue && refValue.type !== COMPUTED_ATTR)) {
			return this.renderSelect(props);
		}
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

	renderBreakdownWithGroup = (breakdownGroup: string, breakdown: string) => this.combineInputs(
		this.renderGroupInput(breakdownGroup, breakdown),
		this.renderBreakdownInput(breakdown)
	);
}

export default DataFormBuilder;
