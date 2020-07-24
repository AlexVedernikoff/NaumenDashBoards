// @flow
import type {Attribute, Props, State} from './types';
import {ATTRIBUTE_SETS} from 'store/sources/attributes/constants';
import {createRefKey} from 'store/sources/refAttributes/actions';
import type {DynamicGroupsNode} from 'store/sources/dynamicGroups/types';
import {FormCheckControl, TransparentSelect} from 'components/molecules';
import {List} from 'components/molecules/Select/components';
import type {OnChangeInputEvent, OnChangeLabelEvent, OnSelectEvent, TreeNode} from 'components/types';
import type {Props as SelectProps} from 'components/molecules/TransparentSelect/types';
import type {Props as ListProps} from 'components/molecules/Select/components/List/types';
import React, {Fragment, PureComponent} from 'react';
import styles from './styles.less';
import {Toggle} from 'components/atoms';
import {Tree as TreeList} from 'components/molecules/MaterialTreeSelect/components';
import withForm from 'WidgetFormPanel/withForm';

export class AttributeFieldset extends PureComponent<Props, State> {
	static defaultProps = {
		disabled: false,
		index: 0,
		removable: false,
		showCreationButton: false
	};

	state = {
		showDynamicAttributes: false
	};

	fetchAttributes = (classFqn: string) => () => this.props.fetchAttributes(classFqn);

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
		const {attributes, source} = this.props;
		let data = {
			fetchOptions: source && this.fetchAttributes(source.value)
		};

		if (source) {
			const {[source.value]: sourceData = this.getDefaultMapData()} = attributes;

			if (sourceData) {
				data = {
					...sourceData,
					...data,
					options: this.getSourceOptions(sourceData.options)
				};
			}
		}

		return data;
	};

	handleChangeLabel = (parent: Attribute | null = null) => (event: OnChangeLabelEvent) => {
		const {index, onChangeLabel} = this.props;
		onChangeLabel({...event, parent}, index);
	};

	handleChangeShowDynamicAttributes = ({value}: OnChangeInputEvent) => {
		this.setState({showDynamicAttributes: !value});
	};

	handleLoadDynamicAttributes = (node: DynamicGroupsNode | null) => {
		const {fetchGroupDynamicAttributes, source} = this.props;

		if (node && source) {
			fetchGroupDynamicAttributes(source.value, this.getOptionValue(node.value));
		}
	};

	handleSelect = (parent: Attribute | null = null) => (event: OnSelectEvent) => {
		const {index, onSelect} = this.props;
		onSelect({...event, parent}, index);
	};

	handleSelectDynAttr = (onSelect: Function) => ({value}: DynamicGroupsNode) => onSelect(value);

	isEnabledDynamicNode = (node: TreeNode<Object>) => !!node.parent;

	renderAttributeField = (props: Object, parent: Attribute | null = null) => {
		const {renderRefField} = this.props;
		const {disabled, value} = props;

		if (!parent && value && value.type in ATTRIBUTE_SETS.REF) {
			return (
				<Fragment>
					{this.renderParentAttributeField(props)}
					{this.renderChildAttributeField({...props}, value)}
				</Fragment>
			);
		}

		const select = this.renderSelect(props, parent);

		if (renderRefField) {
			const refProps = {
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

	renderList = (props: ListProps) => {
		const {dynamicGroups} = this.props;
		const {showDynamicAttributes} = this.state;

		if (showDynamicAttributes) {
			const {onSelect, searchValue, value} = props;
			const initialSelected = [this.getOptionValue(value)];

			return (
				<TreeList
					getOptionLabel={this.getOptionLabel}
					getOptionValue={this.getOptionValue}
					initialSelected={initialSelected}
					isEnabledNode={this.isEnabledDynamicNode}
					onLoad={this.handleLoadDynamicAttributes}
					onSelect={this.handleSelectDynAttr(onSelect)}
					options={dynamicGroups}
					searchValue={searchValue}
					value={value}
				/>
			);
		}

		return <List {...props} />;
	};

	renderListContainer = (props: ListProps) => (
		<Fragment>
			{this.renderToggleShowingDynAttr()}
			{this.renderList(props)}
		</Fragment>
	);

	renderParentAttributeField = (props: SelectProps) => (
		<div className={styles.parentInput}>
			{this.renderSelect(props)}
		</div>
	);

	renderSelect = (props: SelectProps, parent: Attribute | null = null) => {
		const {source} = this.props;
		let components;
		let note;

		if (!parent) {
			components = {
				List: this.renderListContainer
			};
		}

		if (source) {
			note = source.label;
		}

		return <TransparentSelect className={styles.select} components={components} note={note} {...props} />;
	};

	renderToggleShowingDynAttr = () => {
		const {showDynamicAttributes} = this.state;

		return (
			<FormCheckControl className={styles.dynamicAttributesShowHandler} label="Динамические атрибуты">
				<Toggle
					checked={showDynamicAttributes}
					onChange={this.handleChangeShowDynamicAttributes}
					value={showDynamicAttributes}
				/>
			</FormCheckControl>
		);
	};

	render () {
		const {
			disabled,
			name,
			onClickCreationButton,
			onRemove,
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
			onRemove,
			onSelect: this.handleSelect(),
			removable,
			showCreationButton,
			value
		});
	}
}

export default withForm(AttributeFieldset);
