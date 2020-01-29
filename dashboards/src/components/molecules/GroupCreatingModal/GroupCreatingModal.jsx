// @flow
import {createNewSubGroup} from './helpers';
import {CustomGroup, MaterialSelect, Modal} from 'components/molecules';
import {CUSTOM_GROUP_TYPES} from 'store/customGroups/constants';
import {GROUP_TYPES, TYPE_OPTIONS} from './constants';
import {InfoPanel, MaterialTextInput, RadioButton} from 'components/atoms';
import type {Props, State} from './types';
import React, {Component} from 'react';
import styles from './styles.less';
import {TYPES} from 'store/sources/attributes/constants';
import uuid from 'tiny-uuid';

export const IS_NEW = Symbol('new');

export class GroupCreatingModal extends Component<Props, State> {
	state = {
		attributeTitle: '',
		customGroupType: CUSTOM_GROUP_TYPES.DATETIME,
		selectedCustomGroup: '',
		showSaveInfo: false,
		systemValue: {},
		type: GROUP_TYPES.SYSTEM
	};

	componentDidMount () {
		const {attribute, customGroups, systemOptions, value} = this.props;
		const {data, type} = value;
		const attributeTitle = attribute.title;
		const customGroupType = this.resolveCustomGroupType();
		const systemValue = systemOptions.find(o => o.value === data);
		const selectedCustomGroup = data in customGroups ? value.data : '';

		this.setState({
			attributeTitle,
			customGroupType,
			selectedCustomGroup,
			systemValue,
			type
		});
	}

	getModalSize = () => {
		const {type} = this.state;
		return type === GROUP_TYPES.SYSTEM ? 'small' : 'large';
	};

	handleChange = (name: string, value: string) => this.setState({[name]: value});

	handleCloseSaveInfo = () => this.setState({showSaveInfo: false});

	handleCreateCustomGroup = () => {
		const {saveCustomGroup} = this.props;
		const {customGroupType: type} = this.state;
		const groupId = uuid();
		const subGroupId = uuid();

		this.setState({selectedCustomGroup: groupId});
		saveCustomGroup({
			id: groupId,
			name: '',
			subGroups: {
				first: subGroupId,
				last: subGroupId,
				map: {
					[subGroupId]: createNewSubGroup(subGroupId)
				}
			},
			type,
			// $FlowFixMe
			[IS_NEW]: true
		});
	};

	handleRemoveCustomGroup = () => {
		const {removeCustomGroup} = this.props;
		const {selectedCustomGroup} = this.state;

		this.setState({selectedCustomGroup: ''});
		removeCustomGroup(selectedCustomGroup);
	};

	handleSelect = (name: string, value: Object) => this.setState({[name]: value});

	handleSelectCustomGroup = (selectedCustomGroup: string) => this.setState({selectedCustomGroup});

	handleSubmit = () => {
		const {customGroups} = this.props;
		const {selectedCustomGroup, type} = this.state;
		// $FlowFixMe
		if (type === GROUP_TYPES.SYSTEM || customGroups[selectedCustomGroup][IS_NEW]) {
			this.save();
		} else if (selectedCustomGroup) {
			this.setState({showSaveInfo: true});
		}
	};

	save = () => {
		const {customGroups, onSubmit, saveCustomGroup} = this.props;
		const {attributeTitle, selectedCustomGroup, systemValue, type} = this.state;

		if (type === GROUP_TYPES.CUSTOM) {
			saveCustomGroup(customGroups[selectedCustomGroup]);

			onSubmit({data: selectedCustomGroup, type}, attributeTitle);
		} else {
			const data = systemValue ? systemValue.value : '';

			onSubmit({data, type}, attributeTitle);
		}
	};

	resolveCustomGroupType = () => {
		const {type} = this.props.attribute;
		const {DATETIME} = CUSTOM_GROUP_TYPES;

		if (TYPES.DATE.includes(type)) {
			return DATETIME;
		}
	};

	renderCustomFields = () => {
		const {customGroups, saveCustomGroup, widgets} = this.props;
		const {customGroupType, selectedCustomGroup, type} = this.state;

		if (type === GROUP_TYPES.CUSTOM && customGroupType === CUSTOM_GROUP_TYPES.DATETIME) {
			return (
				<div className={styles.customSection}>
					<CustomGroup
						groups={customGroups}
						onCreate={this.handleCreateCustomGroup}
						onRemove={this.handleRemoveCustomGroup}
						onSelect={this.handleSelectCustomGroup}
						onUpdate={saveCustomGroup}
						selectedGroup={selectedCustomGroup}
						type={customGroupType}
						widgets={widgets}
					/>
				</div>
			);
		}
	};

	renderSaveInfo = () => {
		const {showSaveInfo} = this.state;

		if (showSaveInfo) {
			const text = 'Изменения применятся к этой группировке во всех виджетах.';

			return (
				<InfoPanel
					className={styles.infoPanel}
					onClose={this.handleCloseSaveInfo}
					onConfirm={this.save}
					text={text}
					variant="warning"
				/>
			);
		}
	};

	renderNameField = () => {
		const {attributeTitle} = this.state;

		return (
			<div className={styles.attributeNameField}>
				<MaterialTextInput
					name="attributeTitle"
					onChange={this.handleChange}
					placeholder="Название поля"
					value={attributeTitle}
				/>
			</div>
		);
	};

	renderSystemFields = () => {
		const {systemOptions} = this.props;
		const {systemValue, type} = this.state;

		if (type === GROUP_TYPES.SYSTEM) {
			return (
				<div className={styles.shortField}>
					<MaterialSelect
						name="systemValue"
						onSelect={this.handleSelect}
						options={systemOptions}
						placeholder="Форматирование"
						value={systemValue}
					/>
				</div>
			);
		}
	};

	renderWayInput = (option: Object) => {
		const {type} = this.state;
		const {label, value} = option;
		const checked = type === value;

		return (
			<div className={styles.radioButton} key={value}>
				<RadioButton
					checked={checked}
					label={label}
					name="type"
					onChange={this.handleChange}
					value={value}
				/>
			</div>
		);
	};

	renderTypeField = () => (
		<div className={styles.field}>
			<div className={styles.fieldLabel}>Тип группировки</div>
			{TYPE_OPTIONS.map(this.renderWayInput)}
		</div>
	);

	render () {
		const {onClose} = this.props;

		return (
			<Modal header="Настройка группировки" onClose={onClose} onSubmit={this.handleSubmit} size={this.getModalSize()}>
				<div className={styles.form}>
					{this.renderNameField()}
					{this.renderTypeField()}
					{this.renderSystemFields()}
					{this.renderCustomFields()}
					{this.renderSaveInfo()}
				</div>
			</Modal>
		);
	}
}

export default GroupCreatingModal;
