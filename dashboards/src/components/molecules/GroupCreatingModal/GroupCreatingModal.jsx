// @flow
import {createNewSubGroup} from './helpers';
import {CustomGroup, MaterialSelect, Modal} from 'components/molecules';
import type {CustomGroup as CustomGroupType, CustomGroupId} from 'store/customGroups/types';
import {CUSTOM_GROUP_TYPES} from 'store/customGroups/constants';
import {FIELDS, IS_NEW, TYPE_OPTIONS} from './constants';
import {getProcessedAttribute} from 'store/sources/attributes/helpers';
import {GROUP_TYPES} from 'store/widgets/constants';
import {InfoPanel, MaterialTextInput, RadioButton} from 'components/atoms';
import {isGroupKey} from 'store/widgets/helpers';
import type {Props, State} from './types';
import React, {Component} from 'react';
import schema from './schema';
import styles from './styles.less';
import {TYPES} from 'store/sources/attributes/constants';
import {VARIANTS} from 'components/atoms/InfoPanel/constants';

export class GroupCreatingModal extends Component<Props, State> {
	state = {
		attributeTitle: '',
		customGroupType: CUSTOM_GROUP_TYPES.DATETIME,
		errors: {},
		isSubmitting: false,
		selectedCustomGroup: '',
		showSaveInfo: false,
		systemValue: null,
		type: GROUP_TYPES.SYSTEM
	};

	componentDidMount () {
		const {attribute, customGroups, systemOptions, value} = this.props;
		const {data, type} = value;
		const {title: attributeTitle} = getProcessedAttribute(attribute);
		const customGroupType = this.resolveCustomGroupType();
		const systemValue = systemOptions.find(o => o.value === data) || systemOptions[0];
		const selectedCustomGroup = data in customGroups ? value.data : '';

		this.setState({
			attributeTitle,
			customGroupType,
			selectedCustomGroup,
			systemValue,
			type
		});
	}

	getModalSize = () => this.state.type === GROUP_TYPES.SYSTEM ? 'small' : 'large';

	getWidgetsUsingSelectedCutomGroup = () => {
		const {widgets} = this.props;
		const {selectedCustomGroup} = this.state;
		const usedInWidgets = [];

		widgets.forEach(widget => {
			Object.keys(widget)
				.filter(isGroupKey)
				.every(key => {
					const group = widget[key];

					if (group && typeof group === 'object' && group.data === selectedCustomGroup) {
						usedInWidgets.push(widget);
						return false;
					}

					return true;
				});
		});

		return usedInWidgets;
	};

	handleChange = (name: string, value: string) => this.setState({[name]: value});

	handleCloseSaveInfo = () => this.setState({showSaveInfo: false});

	handleCreateCustomGroup = () => {
		const {updateCustomGroup} = this.props;
		const {customGroupType: type} = this.state;
		const groupId = Symbol('id');

		this.setState({selectedCustomGroup: groupId});
		updateCustomGroup({
			id: groupId,
			// $FlowFixMe
			[IS_NEW]: true,
			name: '',
			subGroups: [createNewSubGroup()],
			type
		});
	};

	handleRemoveCustomGroup = () => {
		const {deleteCustomGroup} = this.props;
		const {selectedCustomGroup} = this.state;

		this.setState({selectedCustomGroup: ''});
		deleteCustomGroup(selectedCustomGroup);
	};

	handleSelect = (name: string, value: Object) => this.setState({[name]: value});

	handleSelectCustomGroup = (selectedCustomGroup: CustomGroupId) => this.setState({
		errors: {},
		isSubmitting: false,
		selectedCustomGroup
	});

	handleSubmit = () => {
		const {selectedCustomGroup, type} = this.state;
		// $FlowFixMe
		if (type === GROUP_TYPES.SYSTEM) {
			this.saveSystemGroup();
		} else if (selectedCustomGroup) {
			const usedInWidgets = this.getWidgetsUsingSelectedCutomGroup();
			usedInWidgets.length > 0 ? this.setState({showSaveInfo: true}) : this.saveCustomGroup();
		}
	};

	handleUpdateCustomGroup = async (customGroup: CustomGroupType) => {
		const {updateCustomGroup} = this.props;
		const {isSubmitting} = this.state;

		if (isSubmitting) {
			this.validateCustomGroup(customGroup);
		}

		updateCustomGroup(customGroup);
	};

	resolveCustomGroupType = () => {
		const {attribute} = this.props;
		const {DATETIME} = CUSTOM_GROUP_TYPES;
		const {type} = getProcessedAttribute(attribute);

		if (TYPES.DATE.includes(type)) {
			return DATETIME;
		}
	};

	saveCustomGroup = async () => {
		const {createCustomGroup, customGroups, onSubmit, updateCustomGroup} = this.props;
		const {attributeTitle, selectedCustomGroup, type} = this.state;
		const isValid = await this.validateCustomGroup();

		if (isValid) {
			const group = customGroups[selectedCustomGroup];
			let data = '';
			// $FlowFixMe
			if (typeof selectedCustomGroup === 'symbol') {
				data = await createCustomGroup(group);
			} else {
				data = group.id;
				updateCustomGroup(group, true);
			}

			onSubmit({data: data.toString(), type}, attributeTitle);
		}
	};

	saveSystemGroup = () => {
		const {onSubmit} = this.props;
		const {attributeTitle, systemValue, type} = this.state;
		const data = systemValue ? systemValue.value : '';
		const group = {
			data,
			type
		};

		onSubmit(group, attributeTitle);
	};

	validateCustomGroup = async (customGroup?: CustomGroupType) => {
		const {customGroups} = this.props;
		const {selectedCustomGroup} = this.state;
		const currentCustomGroup = customGroup || customGroups[selectedCustomGroup];
		let errors = {};

		try {
			await schema.validate(currentCustomGroup, {
				abortEarly: false
			});
		} catch (e) {
			e.inner.forEach(({message, path}) => {
				errors[path] = message;
			});
		}

		this.setState({errors, isSubmitting: true});

		return Object.keys(errors).length === 0;
	};

	renderCustomFields = () => {
		const {customGroups} = this.props;
		const {customGroupType, errors, selectedCustomGroup, type} = this.state;

		if (type === GROUP_TYPES.CUSTOM && customGroupType === CUSTOM_GROUP_TYPES.DATETIME) {
			return (
				<div className={styles.customSection}>
					<CustomGroup
						errors={errors}
						getUsingWidgets={this.getWidgetsUsingSelectedCutomGroup}
						groups={customGroups}
						onCreate={this.handleCreateCustomGroup}
						onRemove={this.handleRemoveCustomGroup}
						onSelect={this.handleSelectCustomGroup}
						onUpdate={this.handleUpdateCustomGroup}
						selectedGroup={selectedCustomGroup}
						type={customGroupType}
					/>
				</div>
			);
		}
	};

	renderNameField = () => {
		const {attributeTitle} = this.state;

		return (
			<div className={styles.attributeNameField}>
				<MaterialTextInput
					name={FIELDS.attributeTitle}
					onChange={this.handleChange}
					placeholder="Название поля"
					value={attributeTitle}
				/>
			</div>
		);
	};

	renderSaveInfo = () => {
		const {showSaveInfo} = this.state;

		if (showSaveInfo) {
			const text = 'Изменения применятся к этой группировке во всех виджетах.';

			return (
				<InfoPanel
					className={styles.infoPanel}
					onClose={this.handleCloseSaveInfo}
					onConfirm={this.saveCustomGroup}
					text={text}
					variant={VARIANTS.WARNING}
				/>
			);
		}
	};

	renderSystemFields = () => {
		const {systemOptions} = this.props;
		const {systemValue, type} = this.state;

		if (type === GROUP_TYPES.SYSTEM) {
			return (
				<div className={styles.shortField}>
					<MaterialSelect
						name={FIELDS.systemValue}
						onSelect={this.handleSelect}
						options={systemOptions}
						placeholder="Форматирование"
						value={systemValue}
					/>
				</div>
			);
		}
	};

	renderTypeField = () => (
		<div className={styles.field}>
			<div className={styles.fieldLabel}>Тип группировки</div>
			{TYPE_OPTIONS.map(this.renderTypeInput)}
		</div>
	);

	renderTypeInput = (option: Object) => {
		const {type} = this.state;
		const {label, value} = option;
		const checked = type === value;

		return (
			<div className={styles.radioButton} key={value}>
				<RadioButton
					checked={checked}
					label={label}
					name={FIELDS.type}
					onChange={this.handleChange}
					value={value}
				/>
			</div>
		);
	};

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
