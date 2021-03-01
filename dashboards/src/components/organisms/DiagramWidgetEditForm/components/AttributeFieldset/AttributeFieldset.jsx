// @flow
import type {Attribute, Props, RefProps, State} from './types';
import {ATTRIBUTE_SETS} from 'store/sources/attributes/constants';
import {createRefKey} from 'store/sources/refAttributes/actions';
import type {DynamicGroupsNode} from 'store/sources/dynamicGroups/types';
import FormCheckControl from 'components/molecules/FormCheckControl';
import {getParentClassFqn} from 'DiagramWidgetEditForm/helpers';
import {List} from 'components/molecules/Select/components';
import type {OnChangeEvent, OnChangeLabelEvent, OnSelectEvent, TreeNode} from 'components/types';
import type {Props as SelectProps} from 'components/molecules/TransparentSelect/types';
import type {Props as ListProps} from 'components/molecules/Select/components/List/types';
import React, {Fragment, PureComponent} from 'react';
import styles from './styles.less';
import Toggle from 'components/atoms/Toggle';
import TransparentSelect from 'components/molecules/TransparentSelect';
import {Tree as TreeList} from 'components/molecules/MaterialTreeSelect/components';
import withForm from 'DiagramWidgetEditForm/withForm';

export class AttributeFieldset extends PureComponent<Props, State> {
	static defaultProps = {
		disabled: false,
		index: 0,
		name: '',
		removable: false,
		showCreationButton: false
	};

	state = {
		showDynamicAttributes: false,
		showDynamicAttributesError: false
	};

	componentDidMount () {
		this.setRefTitleAttribute();
	}

	componentDidUpdate () {
		this.setRefTitleAttribute();
	}

	fetchAttributes = (classFqn: string, parentClassFqn?: string | null) => () => this.props.fetchAttributes(classFqn, parentClassFqn);

	fetchRefAttributes = (parent: Attribute) => () => this.props.fetchRefAttributes(parent);

	getAttributeOptions = (attributes: Array<Attribute>) => {
		const {getAttributeOptions, index} = this.props;

		return getAttributeOptions ? getAttributeOptions(attributes, index) : attributes;
	};

	getAttributeSelectProps = (parent: Attribute): $Shape<SelectProps> => {
		const {refAttributes} = this.props;
		const key = createRefKey(parent);
		const {[key]: data = this.getDefaultMapData()} = refAttributes;

		return {
			...data,
			fetchOptions: this.fetchRefAttributes(parent),
			options: this.getAttributeOptions(data.options)
		};
	};

	getDefaultMapData = () => ({
		error: false,
		loading: false,
		options: [],
		uploaded: false
	});

	getOptionLabel = (attribute: Attribute | null) => attribute ? attribute.title : '';

	getOptionValue = (attribute: Attribute | null) => attribute ? attribute.code : '';

	getSourceOptions = (attributes: Array<Attribute>) => {
		const {getSourceOptions, index} = this.props;

		return getSourceOptions ? getSourceOptions(attributes, index) : attributes;
	};

	getSourceSelectProps = () => {
		const {attributes, dataSet, dataSetIndex, values} = this.props;
		const {value: sourceValue} = dataSet.source;
		const parentClassFqn = getParentClassFqn(values, dataSetIndex);
		const fetchOptions = sourceValue ? this.fetchAttributes(sourceValue.value, parentClassFqn) : null;
		let props = {
			fetchOptions
		};

		if (sourceValue) {
			const {[sourceValue.value]: sourceData = this.getDefaultMapData()} = attributes;

			if (sourceData) {
				props = {
					...sourceData,
					...props,
					options: this.getSourceOptions(sourceData.options)
				};
			}
		}

		return props;
	};

	getTitleAttribute = (attributes: Array<Attribute>) => {
		return attributes.find(attribute => attribute.code === 'title') || null;
	};

	handleChangeLabel = (parent: Attribute | null = null) => (event: OnChangeLabelEvent) => {
		const {index, onChangeLabel, value} = this.props;
		const {label: title} = event;
		let newValue = value;

		if (parent) {
			newValue = {
				...parent,
				ref: {
					...parent.ref,
					title
				}
			};
		} else {
			newValue = {
				...newValue,
				title
			};
		}

		onChangeLabel({...event, value: newValue}, index);
	};

	handleChangeShowDynamicAttributes = ({value: show}: OnChangeEvent<boolean>) => {
		const {dataSet, dynamicGroups, fetchDynamicAttributeGroups} = this.props;
		const {dataKey, source} = dataSet;
		const {descriptor} = source;

		if (descriptor || show) {
			if (!show && !dynamicGroups[dataKey]) {
				fetchDynamicAttributeGroups(dataKey, descriptor);
			}

			this.setState({showDynamicAttributes: !show});
		} else {
			this.setState({showDynamicAttributesError: true});
		}
	};

	handleLoadDynamicAttributes = (node: DynamicGroupsNode | null) => {
		const {dataSet, fetchDynamicAttributes} = this.props;

		if (node) {
			fetchDynamicAttributes(dataSet.dataKey, this.getOptionValue(node.value));
		}
	};

	handleRemove = () => {
		const {index, onRemove} = this.props;

		onRemove && onRemove(index);
	};

	handleSelect = (parent: Attribute | null = null) => (event: OnSelectEvent) => {
		const {index, onSelect} = this.props;
		let {value} = event;

		if (parent) {
			value = {
				...parent,
				ref: value
			};
		}

		onSelect({...event, value}, index);
	};

	handleSelectDynAttr = (onSelect: Function) => ({value}: DynamicGroupsNode) => onSelect(value);

	isEnabledDynamicNode = (node: TreeNode<Object>) => !!node.parent;

	setRefTitleAttribute = () => {
		const {fetchRefAttributes, index, name, onSelect, refAttributes, value} = this.props;
		let newValue = value;

		if (value && !value.ref && value.type in ATTRIBUTE_SETS.REFERENCE) {
			const refAttributesData = refAttributes[createRefKey(value)];

			if (refAttributesData && !refAttributesData.loading) {
				newValue = {
					...value,
					ref: this.getTitleAttribute(refAttributesData.options)
				};

				onSelect({name, value: newValue}, index);
			} else if (!refAttributesData || !refAttributesData.loading) {
				fetchRefAttributes(value);
			}
		}
	};

	renderAttributeField = (props: Object, parent: Attribute | null = null) => {
		const {renderRefField} = this.props;
		const {disabled, value} = props;

		if (!parent && value && value.type in ATTRIBUTE_SETS.REFERENCE) {
			return (
				<Fragment>
					{this.renderParentAttributeField(props)}
					{this.renderChildAttributeField({...props}, value)}
				</Fragment>
			);
		}

		const select = this.renderSelect(props, parent);

		if (renderRefField) {
			const refProps: RefProps = {
				disabled,
				parent,
				value
			};

			return (
				<div className={styles.combinedContainer}>
					<div className={styles.combinedRef}>
						{renderRefField(refProps)}
					</div>
					<div className={styles.combinedAttribute}>
						{select}
					</div>
				</div>
			);
		}

		return (
			<div className={styles.container}>
				{select}
			</div>
		);
	};

	renderChildAttributeField = (props: SelectProps, parent: Attribute | null = null) => {
		if (parent) {
			return this.renderAttributeField({
				...props,
				...this.getAttributeSelectProps(parent),
				onChangeLabel: this.handleChangeLabel(parent),
				onSelect: this.handleSelect(parent),
				value: parent.ref
			}, parent);
		}

		return null;
	};

	renderDynamicAttributeList = (props: ListProps) => {
		const {dataSet, dynamicGroups} = this.props;
		const {showDynamicAttributes} = this.state;

		if (dataSet.descriptor && showDynamicAttributes) {
			const {onSelect, searchValue, value} = props;
			const initialSelected = [this.getOptionValue(value)];
			const {[dataSet.dataKey]: sourceData = {
				data: {},
				loading: true
			}} = dynamicGroups;
			const {data, loading} = sourceData;

			return (
				<TreeList
					getOptionLabel={this.getOptionLabel}
					getOptionValue={this.getOptionValue}
					initialSelected={initialSelected}
					isEnabledNode={this.isEnabledDynamicNode}
					loading={loading}
					onLoad={this.handleLoadDynamicAttributes}
					onSelect={this.handleSelectDynAttr(onSelect)}
					options={data}
					searchValue={searchValue}
					value={value}
				/>
			);
		}

		return null;
	};

	renderDynamicAttributesError = () => {
		const {descriptor} = this.props.dataSet;
		const {showDynamicAttributesError} = this.state;

		if (!descriptor && showDynamicAttributesError) {
			return (
				<div className={styles.dynamicError}>
					Для отображения списка, установите, пожалуйста, параметры фильтрации
				</div>
			);
		}
	};

	renderList = (props: ListProps) => <List {...props} />;

	renderListContainer = (props: ListProps) => (
		<Fragment>
			{this.renderToggleShowingDynAttr()}
			{this.renderDynamicAttributeList(props)}
			{this.renderList(props)}
		</Fragment>
	);

	renderParentAttributeField = (props: SelectProps) => (
		<div className={styles.parentInput}>
			{this.renderSelect(props)}
		</div>
	);

	renderSelect = (props: SelectProps, parent: Attribute | null = null) => {
		const {value: sourceValue} = this.props.dataSet.source;
		const note = sourceValue ? sourceValue.label : '';
		let components;

		if (!parent) {
			components = {
				List: this.renderListContainer
			};
		}

		return <TransparentSelect className={styles.select} components={components} note={note} {...props} />;
	};

	renderToggleShowingDynAttr = () => {
		const {dataSet, sources} = this.props;
		const {showDynamicAttributes} = this.state;
		const {value: sourceValue} = dataSet.source;
		const hasDynamic = sourceValue && sources[sourceValue.value] && sources[sourceValue.value].value.hasDynamic;

		if (hasDynamic) {
			return (
				<Fragment>
					<FormCheckControl className={styles.dynamicAttributesShowHandler} label="Динамические атрибуты">
						<Toggle
							checked={showDynamicAttributes}
							onChange={this.handleChangeShowDynamicAttributes}
							value={showDynamicAttributes}
						/>
					</FormCheckControl>
					{this.renderDynamicAttributesError()}
				</Fragment>
			);
		}

		return null;
	};

	render () {
		const {
			disabled,
			name,
			onClickCreationButton,
			removable,
			showCreationButton,
			value
		} = this.props;

		return this.renderAttributeField({
			...this.getSourceSelectProps(),
			async: true,
			disabled,
			getOptionLabel: this.getOptionLabel,
			getOptionValue: this.getOptionValue,
			name,
			onChangeLabel: this.handleChangeLabel(),
			onClickCreationButton,
			onRemove: this.handleRemove,
			onSelect: this.handleSelect(),
			removable,
			showCreationButton,
			value
		});
	}
}

export default withForm(AttributeFieldset);
