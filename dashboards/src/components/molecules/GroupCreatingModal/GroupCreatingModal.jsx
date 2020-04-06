// @flow
import {CustomGroup, SystemGroup} from './components';
import type {CustomGroupRef, Props, State, SystemGroupRef} from './types';
import {DEFAULT_SYSTEM_GROUP, GROUP_WAYS} from 'store/widgets/constants';
import {FIELDS, TYPE_OPTIONS} from './constants';
import {getProcessedValue} from 'store/sources/attributes/helpers';
import type {Group} from 'store/widgets/data/types';
import {MaterialTextInput, RadioButton} from 'components/atoms';
import {Modal} from 'components/molecules';
import React, {Component, createRef} from 'react';
import {SIZES as MODAL_SIZES} from 'components/molecules/Modal/constants';
import styles from './styles.less';

export class GroupCreatingModal extends Component<Props, State> {
	static defaultProps = {
		attrSystemProps: {
			defaultValue: DEFAULT_SYSTEM_GROUP.OVERLAP,
			options: []
		}
	};

	state = {
		attributeTitle: '',
		way: GROUP_WAYS.SYSTEM
	};

	customGroupRef: CustomGroupRef = createRef();
	systemGroupRef: SystemGroupRef = createRef();

	componentDidMount () {
		const {attribute, group} = this.props;
		const {way} = group;
		const attributeTitle = getProcessedValue(attribute, 'title', '');

		this.setState({
			attributeTitle,
			way
		});
	}

	componentDidCatch () {
		this.props.onClose();
	}

	getModalSize = () => this.state.way === GROUP_WAYS.SYSTEM ? 360 : MODAL_SIZES.LARGE;

	handleChangeAttributeTitle = (e: SyntheticInputEvent<HTMLInputElement>) => {
		const {value: attributeTitle} = e.currentTarget;
		this.setState({attributeTitle});
	};

	handleChangeWay = ({value}: Object) => this.setState({way: value});

	handleSubmit = () => {
		const {current: group} = this.state.way === GROUP_WAYS.SYSTEM ? this.systemGroupRef : this.customGroupRef;

		if (group) {
			group.submit();
		}
	};

	handleSubmitGroup = (group: Group) => {
		const {onSubmit} = this.props;
		const {attributeTitle} = this.state;

		onSubmit(group, attributeTitle);
	};

	renderCustomGroup = () => {
		const {attrCustomProps, createCustomGroup, customGroups, deleteCustomGroup, group, updateCustomGroup, widgets} = this.props;
		const {way} = this.state;
		const show = way === GROUP_WAYS.CUSTOM;

		return (
			<CustomGroup
				{...attrCustomProps}
				className={styles.customSection}
				group={group}
				map={customGroups}
				onCreate={createCustomGroup}
				onRemove={deleteCustomGroup}
				onSubmit={this.handleSubmitGroup}
				onUpdate={updateCustomGroup}
				ref={this.customGroupRef}
				show={show}
				widgets={widgets}
			/>
		);
	};

	renderNameField = () => {
		const {attributeTitle} = this.state;

		return (
			<div className={styles.attributeNameField}>
				<MaterialTextInput
					name={FIELDS.attributeTitle}
					onChange={this.handleChangeAttributeTitle}
					placeholder="Название поля"
					value={attributeTitle}
				/>
			</div>
		);
	};

	renderSystemGroup = () => {
		const {attrSystemProps, group} = this.props;
		const {way} = this.state;
		const show = way === GROUP_WAYS.SYSTEM;

		return (
			<SystemGroup
				{...attrSystemProps}
				className={styles.shortField}
				group={group}
				onSubmit={this.handleSubmitGroup}
				ref={this.systemGroupRef}
				show={show}
			/>
		);
	};

	renderWayField = () => (
		<div className={styles.field}>
			<div>Тип группировки</div>
			{TYPE_OPTIONS.map(this.renderWayInput)}
		</div>
	);

	renderWayInput = (option: Object) => {
		const {way} = this.state;
		const {label, value} = option;
		const checked = way === value;

		return (
			<div className={styles.radioButton} key={value}>
				<RadioButton
					checked={checked}
					label={label}
					onChange={this.handleChangeWay}
					value={value}
				/>
			</div>
		);
	};

	render () {
		const {onClose} = this.props;

		return (
			<Modal header="Настройка группировки" onClose={onClose} onSubmit={this.handleSubmit} size={this.getModalSize()}>
				{this.renderNameField()}
				{this.renderWayField()}
				{this.renderSystemGroup()}
				{this.renderCustomGroup()}
			</Modal>
		);
	}
}

export default GroupCreatingModal;
