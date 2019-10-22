// @flow
import type {AttrSelectProps, GetRefOptions, InputProps, SelectValue} from 'components/organisms/WidgetFormPanel/types';
import {Button, Divider} from 'components/atoms';
import type {ComputedAttr} from 'components/organisms/WidgetFormPanel/Modals/ComputeAttrCreator/types';
import ComputeAttrCreator from 'components/organisms/WidgetFormPanel/Modals/ComputeAttrCreator';
import {createOrderName, getNumberFromName} from 'utils/widget';
import {ErrorMessage} from 'formik';
import {FIELDS, styles} from 'components/organisms/WidgetFormPanel';
import FormBuilder from './FormBuilder';
import {getAggregateOptions} from 'utils/aggregate';
import {getGroupOptions, OVERLAP} from 'utils/group';
import {getWidgetIcon} from 'icons/widgets';
import type {Node} from 'react';
import type {OptionType} from 'react-select/src/types';
import type {Props as TreeProps} from 'components/molecules/TreeSelectInput/types';
import React, {Fragment} from 'react';
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

		if (!refValue || !refOptions.filter(o => o.value === refValue.value).length) {
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

	renderTreeSelect = (props: TreeProps) => {
		const {name} = props;

		return (
			<div className={styles.field}>
				<TreeSelectInput {...props} />
				<span className={styles.error}>
					<ErrorMessage name={name} />
				</span>
			</div>
		);
	};

	renderAttrSelect = (props: AttrSelectProps) => {
		const {computedAttrs} = this.props;
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

			if (Array.isArray(computedAttrs)) {
				options = [...computedAttrs, ...options];
			}
		}

		if (options.length && name === FIELDS.breakdown) {
			const noBreakdown = {
				...options[0],
				code: null,
				title: 'Без разбивки',
				type: ''
			};

			options = [noBreakdown, ...options];
		}

		return this.renderSelect({...props, options});
	};

	renderFilterButton = (source: string) => {
		return (
			<Button onClick={this.callFilterModal(source)} className="mt-1">
				Добавить фильтр
			</Button>
		);
	};

	renderSourceInput = (name: string = FIELDS.source, mixin: ?InputProps) => {
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
			isSearchable: false,
			name,
			options,
			placeholder: 'Агрегация',
			size: 'small',
			value: aggregation
		};

		return this.renderSelect(props);
	};

	renderGroupInput = (name: string = FIELDS.group, xAxisName: string = FIELDS.xAxis, mixin: ?InputProps) => {
		const {values} = this.props;
		const xAxis = values[xAxisName];
		const options = getGroupOptions(xAxis);
		const group = values[name];
		let isDisabled = false;

		if (group && group.value === OVERLAP) {
			isDisabled = true;
		}

		let props = {
			isDisabled,
			isSearchable: false,
			name,
			options,
			placeholder: 'Группировка',
			size: 'small',
			value: group
		};

		if (mixin) {
			props = {...props, ...mixin};
		}

		return this.renderSelect(props);
	};
}

export default DataFormBuilder;
