// @flow
import type {Attribute as AttributeType} from 'store/sources/attributes/types';
import {
	AttributeAggregation,
	AttributeCreatingModal,
	AttributeGroup,
	AttributeSelect,
	ComputedAttributeEditor
} from 'components/molecules';
import type {ComputedAttr} from 'components/molecules/AttributeCreatingModal/types';
import {getDefaultAggregation} from 'components/molecules/AttributeAggregation/helpers';
import {getDefaultSystemGroup, isGroupKey} from 'store/widgets/helpers';
import {getProcessedAttribute} from 'store/sources/attributes/helpers';
import type {Node} from 'react';
import type {Props, RefInputProps, State} from './types';
import React, {Fragment, PureComponent} from 'react';
import {REF_INPUT_TYPES} from './constants';
import type {SourceValue} from 'components/molecules/Source/types';
import styles from './styles.less';
import {TYPES} from 'store/sources/attributes/constants';

export class Attribute extends PureComponent<Props, State> {
	state = {
		showCreatingModal: false
	};

	applyCallback = (callback?: Function, name: string, value: Object) => {
		if (callback && typeof callback === 'function') {
			// $FlowFixMe
			setTimeout(() => callback(name, value));
		}
	};

	getAttributeProps = () => {
		const {
			disabled,
			name,
			onRemove,
			onSelect,
			removable,
			source,
			value,
			withCreate
		} = this.props;
		let {computedAttrs, options = this.getOptions(source)} = this.props;
		let props = {};

		if (withCreate) {
			if (!computedAttrs) {
				computedAttrs = [];
			}

			options = [...computedAttrs, ...options];

			props = {
				...props,
				onClickCreationButton: this.handleClickCreationButton,
				showCreationButton: true
			};
		}

		return {
			...props,
			disabled,
			name,
			onRemove,
			onSelect,
			options,
			removable,
			value
		};
	};

	getOptions = (source: SourceValue | null) => {
		const {getAttributeOptions} = this.props;
		let options = [];

		if (source && typeof source === 'object' && typeof source.value === 'string') {
			options = getAttributeOptions(source.value);
		}

		return options;
	};

	handleChangeGroup = (groupName: string, group: Object, attributeTitle: string) => {
		const {name, onChangeTitle, onSelectRefInput, refInputProps, value} = this.props;
		let onSelectCallback;

		if (refInputProps) {
			onSelectCallback = refInputProps.onSelectCallback;
		}

		if (value && value.type !== TYPES.COMPUTED_ATTR && attributeTitle) {
			const processedAttribute = value && getProcessedAttribute(value);

			if (processedAttribute) {
				processedAttribute.title = attributeTitle;
				onChangeTitle(name, value);
			}
		}

		onSelectRefInput(groupName, group);
		this.applyCallback(onSelectCallback, groupName, group);
	};

	handleChangeTitle = (parent: AttributeType | null) => (name: string, title: string) => {
		const {onChangeTitle, value} = this.props;

		if (value) {
			if (parent && parent.ref) {
				parent.ref.title = title;
			} else {
				value.title = title;
			}

			onChangeTitle(name, value);
		}
	};

	handleClickCreationButton = () => this.setState({showCreatingModal: true});

	handleCloseCreatingModal = () => this.setState({showCreatingModal: false});

	handleRemoveComputedAttribute = (code: string) => {
		const {name, onRemoveAttribute} = this.props;
		onRemoveAttribute(name, code);
	};

	handleSelect = (parent: AttributeType | null) => (name: string, value: AttributeType) => {
		const {onSelect, onSelectCallback, value: prevValue} = this.props;

		if (parent) {
			parent.ref = value;
			onSelect(name, prevValue);
		} else {
			onSelect(name, value);
		}

		this.applyCallback(onSelectCallback, name, value);
	};

	handleSelectWithRef = (parent: AttributeType | null) => (name: string, value: AttributeType) => {
		const {onSelect, onSelectCallback, onSelectRefInput, refInputProps} = this.props;
		let {value: prevValue} = this.props;

		if (parent) {
			const prevRefValue = parent.ref;
			parent.ref = {...value};

			onSelect(name, prevValue);
			prevValue = prevRefValue;
		} else {
			onSelect(name, {...value});
		}

		if (refInputProps && (!prevValue || prevValue.type !== value.type)) {
			const {name: refName} = refInputProps;
			const refValue = isGroupKey(refName) ? getDefaultSystemGroup(value) : getDefaultAggregation(value);

			onSelectRefInput(refName, refValue);
		}

		this.applyCallback(onSelectCallback, name, value);
	};

	handleSubmitCreatingModal = (attribute: ComputedAttr) => {
		const {name, onSaveComputedAttribute} = this.props;

		this.setState({showCreatingModal: false});
		onSaveComputedAttribute(name, attribute);
	};

	saveComputedAttribute = (value: ComputedAttr) => {
		const {name, onSaveComputedAttribute} = this.props;
		onSaveComputedAttribute(name, value);
	};

	showCreatingModal = () => this.setState({showCreatingModal: true});

	renderAggregation = (refInputProps: RefInputProps) => {
		const {onSelectRefInput, value} = this.props;
		const {name, value: refValue} = refInputProps;

		return (
			<AttributeAggregation
				attribute={value}
				name={name}
				onSelect={onSelectRefInput}
				tip="Агрегация"
				value={refValue}
			/>
		);
	};

	renderAttribute = (attributeProps: Object) => {
		const {refInputProps} = this.props;
		const {parent = null, ...selectProps} = attributeProps;
		const {value} = selectProps;
		let props = selectProps;

		if (value) {
			props.onChangeTitle = this.handleChangeTitle(parent);

			if (!parent && TYPES.REF.includes(value.type)) {
				return (
					<Fragment>
						{this.renderParentAttribute(props, parent)}
						{this.renderChildAttribute(attributeProps, value)}
					</Fragment>
				);
			}
		}

		if (refInputProps) {
			return this.renderAttributeWithRef(
				this.renderRefByType(refInputProps),
				this.renderSelect({
					...props,
					onSelect: this.handleSelectWithRef(parent)
				})
			);
		}

		return (
			<div className={styles.selectContainer}>
				{this.renderSelect({...props, onSelect: this.handleSelect(parent)})}
			</div>
		);
	};

	renderAttributeByType = () => {
		const {value} = this.props;
		const props = this.getAttributeProps();

		return value && value.type === TYPES.COMPUTED_ATTR
			? this.renderComputedAttribute(props)
			: this.renderAttribute(props);
	};

	renderAttributeWithRef = (ref: Node, attribute: Node) => (
		<div className={styles.combinedContainer}>
			<div className={styles.combinedRef}>
				{ref}
			</div>
			<div className={styles.combinedAttribute}>
				{attribute}
			</div>
		</div>
	);

	renderChildAttribute = (props: Object, parent: AttributeType) => this.renderAttribute({
		...props,
		options: this.props.getRefAttributeOptions(parent),
		parent,
		value: parent.ref
	});

	renderComputedAttribute = (props: Object) => {
		props = {
			...props,
			onChangeTitle: this.handleChangeTitle(null),
			onSelect: this.handleSelect(null)
		};

		return this.renderAttributeWithRef(
			this.renderComputedAttributeEditor(),
			this.renderSelect(props)
		);
	};

	renderComputedAttributeEditor = () => {
		const {sources, value} = this.props;

		if (value && value.type === TYPES.COMPUTED_ATTR) {
			// $FlowFixMe
			const attribute: ComputedAttr = value;

			return (
				<ComputedAttributeEditor
					onRemove={this.handleRemoveComputedAttribute}
					onSubmit={this.saveComputedAttribute}
					sources={sources}
					value={attribute}
				/>
			);
		}
	};

	renderCreatingModal = () => {
		const {sources} = this.props;
		const {showCreatingModal} = this.state;

		if (showCreatingModal) {
			return (
				<AttributeCreatingModal
					onClose={this.handleCloseCreatingModal}
					onSubmit={this.handleSubmitCreatingModal}
					sources={sources}
				/>
			);
		}
	};

	renderGroup = (refInputProps: RefInputProps) => {
		let {value: attribute} = this.props;
		const {disabled, name, value} = refInputProps;

		if (!attribute || (attribute && attribute.type !== TYPES.COMPUTED_ATTR)) {
			attribute = attribute && getProcessedAttribute(attribute);

			return (
				<AttributeGroup
					attribute={attribute}
					disabled={disabled}
					name={name}
					onChange={this.handleChangeGroup}
					value={value}
				/>
			);
		}
	};

	renderParentAttribute = (props: Object, parent: AttributeType | null) => (
		<div className={styles.parentInput}>
			{this.renderSelect({
				...props,
				onSelect: this.handleSelect(parent)
			})}
		</div>
	);

	renderRefByType = (refInputProps: RefInputProps) => {
		const {type} = refInputProps;
		const {AGGREGATION, GROUP} = REF_INPUT_TYPES;

		switch (type.toUpperCase()) {
			case AGGREGATION:
				return this.renderAggregation(refInputProps);
			case GROUP:
				return this.renderGroup(refInputProps);
		}
	};

	renderSelect = (props: Object) => <AttributeSelect {...props} />;

	render () {
		return (
			<Fragment>
				{this.renderAttributeByType()}
				{this.renderCreatingModal()}
			</Fragment>
		);
	}
}

export default Attribute;
