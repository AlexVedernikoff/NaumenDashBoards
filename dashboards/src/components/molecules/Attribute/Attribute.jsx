// @flow
import type {Attribute as AttributeType} from 'store/sources/attributes/types';
import {
	AttributeAggregation,
	AttributeCreatingModal,
	AttributeGroup,
	AttributeSelect,
	ComputedAttributeEditor
} from 'components/molecules';
import {ATTRIBUTE_SETS, ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import type {AttributeValue, Props, RefInputProps, State} from './types';
import type {ComputedAttr, Source} from 'store/widgets/data/types';
import {getDefaultAggregation} from 'components/molecules/AttributeAggregation/helpers';
import {getDefaultSystemGroup, isGroupKey} from 'store/widgets/helpers';
import {getProcessedAttribute} from 'store/sources/attributes/helpers';
import type {Node} from 'react';
import React, {Fragment, PureComponent} from 'react';
import {REF_INPUT_TYPES} from './constants';
import styles from './styles.less';

export class Attribute extends PureComponent<Props, State> {
	static defaultProps = {
		refAttributeData: {
			data: [],
			error: false,
			loading: false
		}
	};

	state = {
		showCreatingModal: false
	};

	applyCallback = (callback?: Function, name: string, value: Object) => {
		if (callback && typeof callback === 'function') {
			// $FlowFixMe
			setTimeout(() => callback(name, value));
		}
	};

	changeRefInputData = (prevValue: AttributeValue | null, value: AttributeValue) => {
		const {onSelectRefInput, refInputProps} = this.props;

		if (refInputProps && (!prevValue || prevValue.type !== value.type)) {
			const {name: refName} = refInputProps;
			const refValue = isGroupKey(refName) ? getDefaultSystemGroup(value) : getDefaultAggregation(value);

			onSelectRefInput(refName, refValue);
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

	getOptions = (source: Source | null) => {
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

		if (value && value.type !== ATTRIBUTE_TYPES.COMPUTED_ATTR && attributeTitle) {
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
		const {name, onRemoveComputedAttribute} = this.props;
		onRemoveComputedAttribute(name, code);
	};

	handleSelect = (parent: AttributeType | null) => (name: string, value: AttributeValue) => {
		const {onSelect, onSelectCallback} = this.props;
		let {value: prevValue} = this.props;

		if (parent && parent.type !== ATTRIBUTE_TYPES.COMPUTED_ATTR) {
			const prevRefValue = parent.ref;
			// $FlowFixMe
			parent.ref = {...value};

			onSelect(name, prevValue);
			prevValue = prevRefValue;
		} else {
			// $FlowFixMe
			onSelect(name, {...value});
		}

		this.changeRefInputData(prevValue, value);
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

			if (!parent && value.type in ATTRIBUTE_SETS.REF) {
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
					onSelect: this.handleSelect(parent)
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

		return value && value.type === ATTRIBUTE_TYPES.COMPUTED_ATTR
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

	renderChildAttribute = (props: Object, parent: AttributeType) => {
		const {data: options, loading} = this.props.refAttributeData;

		return this.renderAttribute({
			...props,
			loading,
			options,
			parent,
			value: parent.ref
		});
	};

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

		if (value && value.type === ATTRIBUTE_TYPES.COMPUTED_ATTR) {
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

		return null;
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
		const {value: attribute} = this.props;
		const {disabled, name, value} = refInputProps;

		if (!attribute || (attribute && attribute.type !== ATTRIBUTE_TYPES.COMPUTED_ATTR)) {
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

		return null;
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
			default:
				return null;
		}
	};

	renderSelect = (props: Object) => {
		const {source} = this.props;
		let note;

		if (source) {
			note = source.label;
		}

		return <AttributeSelect note={note} {...props} />;
	}

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
