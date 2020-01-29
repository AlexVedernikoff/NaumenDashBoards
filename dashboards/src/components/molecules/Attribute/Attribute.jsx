// @flow
import type {Attribute as AttributeType} from 'store/sources/attributes/types';
import {AttributeCreatingModal, AttributeSelect, MiniSelect} from 'components/molecules';
import {CalendarIcon, NumberIcon, TextIcon} from 'icons/form';
import type {ComputedAttr} from 'components/molecules/AttributeCreatingModal/types';
import {DATETIME_GROUP} from 'components/molecules/AttributeRefInput/constants';
import {getAggregateOptions, getGroupOptions} from './helpers';
import GroupCreatingModal from 'containers/GroupCreatingModal';
import {GROUP_TYPES} from 'components/molecules/GroupCreatingModal/constants';
import type {Props, RefButtonProps, RefInputProps, State} from './types';
import React, {Fragment, PureComponent} from 'react';
import {REF_INPUT_TYPES} from './constants';
import type {SourceValue} from 'components/molecules/Source/types';
import styles from './styles.less';
import {Tip} from 'components/atoms';
import {TYPES} from 'store/sources/attributes/constants';

export class Attribute extends PureComponent<Props, State> {
	state = {
		showAggregationCreatingModal: false,
		showAggregationEditingModal: false,
		showGroupModal: false
	};

	applyCallback = (name: string, value: AttributeType | null) => {
		const {onSelectCallback} = this.props;

		if (onSelectCallback && typeof onSelectCallback === 'function') {
			// $FlowFixMe
			setTimeout(() => onSelectCallback(name, value));
		}
	};

	createDefaultGroup = (data: string) => ({
		data,
		type: GROUP_TYPES.SYSTEM
	});

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
		this.hideAggregationModal();
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

		if (refInputProps && (!prevValue || prevValue.type !== value.type)) {
			const {name: refName} = refInputProps;
			const refOptions = [];
			let refValue = refOptions[0].value;

			if (/group/i.test(refName)) {
				const group = TYPES.DATE.includes(value.type) ? DATETIME_GROUP.MONTH : refValue;
				refValue = this.createDefaultGroup(group);
			}

			onSelectRefInput(refName, refValue);
		}

		this.applyCallback(name, value);
	};

	handleSubmitGroup = (group: Object, attributeTitle: string) => {
		const {name, onChangeTitle, onSelectRefInput, refInputProps, value} = this.props;

		if (value && attributeTitle) {
			let necessaryValue = value;

			while (necessaryValue.ref) {
				necessaryValue = necessaryValue.ref;
			}

			if (necessaryValue) {
				// $FlowFixMe
				necessaryValue.title = attributeTitle;
				onChangeTitle(name, value);
			}
		}

		if (refInputProps) {
			onSelectRefInput(refInputProps.name, group);
		}

		this.hideGroupModal();
	};

	handleSubmitModal = (attribute: ComputedAttr) => {
		const {name, onSaveAttribute} = this.props;

		onSaveAttribute(name, attribute);
		this.hideAggregationModal();
	};

	hideAggregationModal = () => this.setState({
		showAggregationCreatingModal: false,
		showAggregationEditingModal: false
	});

	hideGroupModal = () => this.setState({showGroupModal: false});

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

	resolveGroupIcon = () => {
		const {value} = this.props;
		const type = value ? value.type : '';

		if (TYPES.INTEGER.includes(type)) {
			return <NumberIcon />;
		}

		if (TYPES.DATE.includes(type)) {
			return <CalendarIcon />;
		}

		return <TextIcon />;
	};

	resolveRefInput = () => {
		const {refInputProps} = this.props;

		if (refInputProps && typeof refInputProps === 'object') {
			const {type} = refInputProps;
			const {AGGREGATION, GROUP} = REF_INPUT_TYPES;

			switch (type.toUpperCase()) {
				case AGGREGATION:
					return this.renderAggregation(refInputProps);
				case GROUP:
					return this.renderGroup();
			}
		}
	};

	showCreatingModal = () => this.setState({showAggregationCreatingModal: true});

	showEditingModal = () => this.setState({showAggregationEditingModal: true});

	showGroupModal = () => {
		const {value} = this.props;

		if (value) {
			this.setState({showGroupModal: true});
		}
	};

	renderAggregation = (refInputProps: RefInputProps) => {
		const {onSelectRefInput, value} = this.props;
		const {name, value: refValue} = refInputProps;

		if (value && value.type === TYPES.COMPUTED_ATTR) {
			return this.renderComputedAggregation();
		}

		const options = getAggregateOptions(value);

		return (
			<MiniSelect
				onSelect={onSelectRefInput}
				name={name}
				options={options}
				tip="Агрегация"
				value={refValue}
			/>
		);
	};

	renderAttribute = (attributeProps: Object) => {
		const {source} = this.props;
		const {parent, refInputProps, ...selectProps} = attributeProps;
		const {options, value, withCreate} = selectProps;
		let props = selectProps;

		if (!options) {
			props.options = this.getOptions(source);
		}

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
				{this.resolveRefInput()}
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

	renderComputedAggregation = () => {
		const props = {
			content: 'f(x)',
			onClick: this.showEditingModal,
			tip: 'Редактировать поле'
		};

		return (
			<Fragment>
				{this.renderRefButton(props)}
				{this.renderEditingModal()}
			</Fragment>
		);
	};

	renderCreatingModal = () => {
		const {sources} = this.props;
		const {showAggregationCreatingModal} = this.state;

		if (showAggregationCreatingModal) {
			return (
				<AttributeCreatingModal
					onClose={this.hideAggregationModal}
					onSubmit={this.handleSubmitModal}
					sources={sources}
				/>
			);
		}
	};

	renderEditingModal = () => {
		const {sources, value} = this.props;
		const {showAggregationEditingModal} = this.state;
		// $FlowFixMe
		const attribute: ComputedAttr = value;

		if (showAggregationEditingModal && attribute) {
			return (
				<AttributeCreatingModal
					onClose={this.hideAggregationModal}
					onRemove={this.handleRemoveAttribute}
					onSubmit={this.handleSubmitModal}
					sources={sources}
					value={attribute}
				/>
			);
		}
	};

	renderGroup = () => {
		const props = {
			content: this.resolveGroupIcon(),
			onClick: this.showGroupModal,
			tip: 'Группировка'
		};

		return (
			<Fragment>
				{this.renderRefButton(props)}
				{this.renderGroupCreatingModal()}
			</Fragment>
		);
	};

	renderGroupCreatingModal = () => {
		const {refInputProps, value} = this.props;
		const {showGroupModal} = this.state;

		if (refInputProps) {
			const systemOptions = getGroupOptions(value);
			let {value: group} = refInputProps;

			if (typeof group === 'string') {
				group = this.createDefaultGroup(group);
			}

			if (showGroupModal) {
				return (
					<GroupCreatingModal
						attribute={value}
						onClose={this.hideGroupModal}
						onSubmit={this.handleSubmitGroup}
						systemOptions={systemOptions}
						value={group}
					/>
				);
			}
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

	renderRefButton = (props: RefButtonProps) => {
		const {content, onClick, tip} = props;

		return (
			<Tip text={tip}>
				<div className={styles.refButton} onClick={onClick}>
					{content}
				</div>
			</Tip>
		);
	};

	renderSelect = (props: Object) => <AttributeSelect {...props} />;

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
