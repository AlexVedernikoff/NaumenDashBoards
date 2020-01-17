// @flow
import type {Attribute as AttributeType} from 'store/sources/attributes/types';
import {AttributeCreatingModal, AttributeRefInput, AttributeSelect} from 'components/molecules';
import type {ComputedAttr} from 'components/molecules/AttributeCreatingModal/types';
import {DATETIME_GROUP} from 'components/molecules/AttributeRefInput/constants';
import {Divider} from 'components/atoms';
import type {Props, State} from './types';
import React, {createRef, Fragment, PureComponent} from 'react';
import type {RenderValueProps} from 'components/molecules/MiniSelect/types';
import type {SourceValue} from 'components/molecules/Source/types';
import styles from './styles.less';
import {TYPES} from 'store/sources/attributes/constants';

export class Attribute extends PureComponent<Props, State> {
	state = {
		showCreatingModal: false,
		showEditingModal: false
	};

	refInput = createRef();

	applyCallback = (name: string, value: AttributeType | null) => {
		const {onSelectCallback} = this.props;

		if (onSelectCallback && typeof onSelectCallback === 'function') {
			// $FlowFixMe
			setTimeout(() => onSelectCallback(name, value));
		}
	};

	getAttributeProps = () => {
		const {
			isDisabled,
			isRemovable,
			name,
			onRemove,
			onSelect,
			options,
			refInputProps,
			value,
			withCreate
		} = this.props;

		return {
			isDisabled,
			isRemovable,
			name,
			onRemove,
			onSelect,
			options,
			refInputProps,
			value,
			withCreate
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

	handleChangeTitle = (parent?: AttributeType) => (name: string, title: string) => {
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

	handleRemoveAttribute = (code: string) => {
		const {name, onRemoveAttribute} = this.props;
		onRemoveAttribute(name, code);
		this.hideModal();
	};

	handleSelect = (parent?: AttributeType) => (name: string, value: AttributeType) => {
		const {onSelect, value: prevValue} = this.props;

		if (parent) {
			parent.ref = value;
			onSelect(name, prevValue);
		} else {
			onSelect(name, value);
		}

		this.applyCallback(name, value);
	};

	handleSelectWithRef = (parent: AttributeType | null) => (name: string, value: AttributeType) => {
		const {onSelect, onSelectRefInput, refInputProps} = this.props;
		let {value: prevValue} = this.props;

		if (parent) {
			const prevRefValue = parent.ref;
			parent.ref = {...value};

			onSelect(name, prevValue);
			prevValue = prevRefValue;
		} else {
			onSelect(name, {...value});
		}

		if (refInputProps && this.refInput.current && (!prevValue || prevValue.type !== value.type)) {
			const {name: refName} = refInputProps;
			const refOptions = this.refInput.current.state.options;
			let refValue = refOptions[0].value;

			if (/group/i.test(refName) && TYPES.DATE.includes(value.type)) {
				refValue = DATETIME_GROUP.MONTH;
			}

			onSelectRefInput(refName, refValue);
		}

		this.applyCallback(name, value);
	};

	handleSubmitModal = (attribute: ComputedAttr) => {
		const {name, onSaveAttribute} = this.props;

		onSaveAttribute(name, attribute);
		this.hideModal();
	};

	hideModal = () => this.setState({
		showEditingModal: false,
		showCreatingModal: false
	});

	mixinAttribute = (props: Object) => {
		const {source, value} = this.props;
		let {options} = props;

		if (!options) {
			options = this.getOptions(source);
		}

		return {
			...props,
			attr: true,
			isEditableLabel: !!value,
			options,
			showBorder: false
		};
	};

	mixinCreate = (props: Object, parent: AttributeType | null) => {
		const {computedAttrs} = this.props;
		let {options} = props;

		if (!parent && Array.isArray(computedAttrs)) {
			options = [...computedAttrs, ...options];
		}

		return {
			...props,
			onClickCreationButton: this.showCreatingModal,
			options,
			showCreationButton: true
		};
	};

	showCreatingModal = () => this.setState({showCreatingModal: true});

	showEditingModal = () => this.setState({showEditingModal: true});

	renderAttribute = (attributeProps: Object) => {
		const {parent, refInputProps, ...selectProps} = attributeProps;
		const {value, withCreate} = selectProps;
		let props = this.mixinAttribute(selectProps);

		if (withCreate) {
			props = this.mixinCreate(props, parent);
		}

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

		const render = refInputProps ? this.renderAttributeInputWithRef : this.renderAttributeInput;
		return render(props, parent);
	};

	renderAttributeInput = (props: Object, parent: AttributeType, withRefInput: boolean = false) => this.renderSelect({
		...props,
		onSelect: withRefInput ? this.handleSelectWithRef(parent) : this.handleSelect(parent)
	});

	renderAttributeInputWithRef = (props: Object, parent: AttributeType) => (
		<div className={styles.combinedInputs}>
			<div className={styles.combinedLeftInput}>
				{this.renderRefInput(props.value)}
			</div>
			<div className={styles.combinedRightInput}>
				{this.renderAttributeInput(props, parent, true)}
			</div>
		</div>
	);

	renderChildAttribute = (props: Object, parent: AttributeType) => this.renderAttribute({
		...props,
		options: this.props.getRefAttributeOptions(parent),
		parent,
		value: parent.ref
	});

	renderComputeEditButton = (props: RenderValueProps) => {
		const {className} = props;

		return (
			<div className={className} onClick={this.showEditingModal}>f(x)</div>
		);
	};

	renderCreatingModal = () => {
		const {sources} = this.props;
		const {showCreatingModal} = this.state;

		if (showCreatingModal) {
			return (
				<AttributeCreatingModal
					onClose={this.hideModal}
					onSubmit={this.handleSubmitModal}
					sources={sources}
				/>
			);
		}
	};

	renderEditingModal = () => {
		const {sources, value} = this.props;
		const {showEditingModal} = this.state;
		// $FlowFixMe
		const attribute: ComputedAttr = value;

		if (showEditingModal && attribute) {
			return (
				<AttributeCreatingModal
					onClose={this.hideModal}
					onRemove={this.handleRemoveAttribute}
					onSubmit={this.handleSubmitModal}
					sources={sources}
					value={attribute}
				/>
			);
		}
	};

	renderParentAttribute = (props: Object, parent: AttributeType) => (
		<div className={styles.parentInput}>
			{this.renderSelect({
				...props,
				onSelect: this.handleSelect(parent)
			})}
		</div>
	);

	renderRefInput = (attribute: AttributeType | null) => {
		const {onSelectRefInput} = this.props;
		let {refInputProps} = this.props;

		if (attribute && attribute.type === TYPES.COMPUTED_ATTR) {
			const renderValue = this.renderComputeEditButton;
			const type = 'compute';
			refInputProps = {...refInputProps, renderValue, type};
		}

		return (
			<AttributeRefInput
				attribute={attribute}
				onSelect={onSelectRefInput}
				ref={this.refInput}
				{...refInputProps}
			/>
		);
	};

	renderSelect = (props: Object) => <AttributeSelect {...props} />;

	render () {
		const props = this.getAttributeProps();

		return (
			<Fragment>
				{this.renderAttribute(props)}
				{this.renderCreatingModal()}
				{this.renderEditingModal()}
			</Fragment>
		);
	}
}

export default Attribute;
