// @flow
import type {Attribute as AttributeType} from 'store/sources/attributes/types';
import {AttributeCreatingModal, AttributeRefInput, Select} from 'components/molecules';
import type {ComputedAttr} from 'components/molecules/AttributeCreatingModal/types';
import {DATETIME_GROUP, TYPES as INPUT_TYPES} from 'components/molecules/AttributeRefInput/constants';
import {Divider, FieldError} from 'components/atoms';
import type {OptionType} from 'react-select/src/types';
import type {Props, State} from './types';
import React, {createRef, Fragment, PureComponent} from 'react';
import type {SourceValue} from 'components/molecules/Source/types';
import styles from './styles.less';
import {TYPES} from 'store/sources/attributes/constants';

export class Attribute extends PureComponent<Props, State> {
	state = {
		showCreatingModal: false
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
			refInput,
			showBorder,
			value,
			withCreate,
			withDivider
		} = this.props;

		return {
			isDisabled,
			isRemovable,
			name,
			onRemove,
			onSelect,
			options,
			refInput,
			showBorder,
			value,
			withCreate,
			withDivider
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

	handleSelect = (parent?: AttributeType) => (name: string, value: OptionType) => {
		const {onSelect, value: prevValue} = this.props;

		if (parent) {
			parent.ref = value;
			onSelect(name, prevValue);
		} else {
			onSelect(name, value);
		}

		this.applyCallback(name, value);
	};

	handleSelectWithRef = (parent: AttributeType | null) => (name: string, value: OptionType) => {
		const {onSelect, onSelectRefInput, refInput} = this.props;
		let {value: prevValue} = this.props;

		if (parent) {
			const prevRefValue = parent.ref;
			parent.ref = {...value};

			onSelect(name, prevValue);
			prevValue = prevRefValue;
		} else {
			onSelect(name, {...value});
		}

		if (refInput && this.refInput.current && (!prevValue || prevValue.type !== value.type)) {
			const {name: refName} = refInput;
			const refOptions = this.refInput.current.state.options;
			let refValue = refOptions[0].value;

			if (/group/i.test(refName) && TYPES.DATE.includes(value.type)) {
				refValue = DATETIME_GROUP.MONTH;
			}

			onSelectRefInput(refName, refValue);
		}

		this.applyCallback(name, value);
	};

	handleSubmitModalForm = (attribute: ComputedAttr) => {
		const {name, onCreateAttribute} = this.props;

		onCreateAttribute(name, attribute);
		this.hideCreatingModal();
	};

	hideCreatingModal = () => this.setState({showCreatingModal: false});

	mixinAttribute = (props: Object) => {
		const {source, value} = this.props;
		let {options} = props;

		if (!options) {
			options = this.getOptions(source);
		}

		return {
			...props,
			attr: true,
			isEditableLabel: value && value.type !== TYPES.COMPUTED_ATTR,
			options,
			showBorder: false
		};
	};

	mixinCreate = (props: Object) => {
		const {computedAttrs} = this.props;
		let {options} = props;

		if (Array.isArray(computedAttrs)) {
			options = [...computedAttrs, ...options];
		}

		return {
			...props,
			createButtonText: 'Создать поле',
			onClickCreateButton: this.showCreatingModal,
			options
		};
	};

	mixinForm = (props: Object, value: AttributeType, parent?: AttributeType) => {
		const form = {
			onSubmit: this.handleChangeTitle(parent),
			value: value.title
		};

		return {...props, form};
	};

	shouldRenderRefInput = () => {
		const {refInput, value} = this.props;

		if (refInput) {
			const {type} = refInput;

			return type === INPUT_TYPES.GROUP || !value || value.type !== TYPES.COMPUTED_ATTR;
		}
	};

	showCreatingModal = () => this.setState({showCreatingModal: true});

	renderAttribute = (attributeProps: Object) => {
		const {parent, refInput, ...selectProps} = attributeProps;
		const {value, withCreate} = selectProps;
		let props = this.mixinAttribute(selectProps);

		if (withCreate) {
			props = this.mixinCreate(props);
		}

		if (value) {
			props = this.mixinForm(props, value, parent);

			if (TYPES.REF.includes(value.type)) {
				return (
					<Fragment>
						{this.renderParentAttribute(props, parent)}
						{this.renderChildAttribute(attributeProps, value)}
					</Fragment>
				);
			}
		}

		return refInput && this.shouldRenderRefInput()
			? this.renderAttributeInputWithRef(props, parent)
			: this.renderAttributeInput(props, parent);
	};

	renderAttributeInput = (props: Object, parent: AttributeType, withRefInput: boolean = false) => {
		const {withDivider, ...selectProps} = props;

		return this.renderSelect({
			...selectProps,
			onSelect: withRefInput ? this.handleSelectWithRef(parent) : this.handleSelect(parent),
			withDivider
		});
	};

	renderAttributeInputWithRef = (props: Object, parent: AttributeType) => {
		const {withDivider, ...selectProps} = props;

		return (
			<Fragment>
				<div className={styles.combinedInputs}>
					<div className={styles.combinedLeftInput}>
						{this.renderRefInput(selectProps.value)}
					</div>
					<div className={styles.combinedRightInput}>
						{this.renderAttributeInput(selectProps, parent, true)}
					</div>
				</div>
				{withDivider && this.renderFieldDivider()}
			</Fragment>
		);
	};

	renderChildAttribute = (props: Object, parent: AttributeType) => this.renderAttribute({
		...props,
		options: this.props.getRefAttributeOptions(parent),
		parent,
		value: parent.ref
	});

	renderCreatingModal = () => {
		const {sources} = this.props;
		const {showCreatingModal} = this.state;

		if (showCreatingModal) {
			return (
				<AttributeCreatingModal
					getAttributeOptions={this.getOptions}
					onClose={this.hideCreatingModal}
					onSubmit={this.handleSubmitModalForm}
					sources={sources}
				/>
			);
		}
	};

	renderFieldDivider = () => <Divider variant="field" />;

	renderParentAttribute = (props: Object, parent: AttributeType) => (
		<div className={styles.parentInput}>
			{this.renderSelect({
				...props,
				hideError: true,
				onSelect: this.handleSelect(parent),
				withDivider: false
			})}
		</div>
	);

	renderRefInput = (attribute: AttributeType | null) => {
		const {onSelectRefInput, refInput} = this.props;

		if (refInput) {
			return <AttributeRefInput attribute={attribute} onSelect={onSelectRefInput} ref={this.refInput} {...refInput} />;
		}
	};

	renderSelect = (props: Object) => {
		const {error} = this.props;
		const {hideError, withDivider, ...selectProps} = props;

		return (
			<div key={props.name}>
				<Select {...selectProps} />
				{!hideError && <FieldError text={error} />}
				{withDivider && this.renderFieldDivider()}
			</div>
		);
	};

	render () {
		const props = this.getAttributeProps();

		return (
			<Fragment>
				{this.renderAttribute(props)}
				{this.renderCreatingModal()}
			</Fragment>
		);
	}
}

export default Attribute;
