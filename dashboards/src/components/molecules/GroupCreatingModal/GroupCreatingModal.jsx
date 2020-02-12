// @flow
import {ATTRIBUTE_SETS} from 'store/sources/attributes/constants';
import {createNewSubGroup, getSystemGroupOptions} from './helpers';
import {CustomGroup, MaterialSelect, Modal} from 'components/molecules';
import type {CustomGroup as CustomGroupType, CustomGroupId} from 'store/customGroups/types';
import {FIELDS, IS_NEW, TYPE_OPTIONS} from './constants';
import {getProcessedAttribute} from 'store/sources/attributes/helpers';
import {GROUP_TYPES, GROUP_WAYS} from 'store/widgets/constants';
import {InfoPanel, MaterialTextInput, RadioButton} from 'components/atoms';
import {isGroupKey} from 'store/widgets/helpers';
import type {Props, State} from './types';
import React, {Component, createContext} from 'react';
import schema from './schema';
import styles from './styles.less';
import {VARIANTS} from 'components/atoms/InfoPanel/constants';

export const GroupContext = createContext({
	errors: {},
	type: GROUP_TYPES.DATETIME
});

export class GroupCreatingModal extends Component<Props, State> {
	state = {
		attributeTitle: '',
		errors: {},
		isSubmitting: false,
		selectedCustomGroup: '',
		showSaveInfo: false,
		systemOptions: [],
		systemValue: null,
		type: GROUP_TYPES.DATETIME,
		way: GROUP_WAYS.SYSTEM
	};

	componentDidMount () {
		const {attribute, customGroups, value} = this.props;
		const {data, way} = value;
		const {title: attributeTitle} = getProcessedAttribute(attribute);
		const systemOptions = getSystemGroupOptions(attribute);
		const systemValue = systemOptions.find(o => o.value === data) || systemOptions[0] || null;
		const selectedCustomGroup = data in customGroups ? value.data : '';
		const type = this.resolveGroupType();

		this.setState({
			attributeTitle,
			selectedCustomGroup,
			systemOptions,
			systemValue,
			type,
			way
		});
	}

	getModalSize = () => this.state.way === GROUP_WAYS.SYSTEM ? 'small' : 'large';

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
		const {type} = this.state;
		const groupId = Symbol('id');

		this.setState({selectedCustomGroup: groupId});
		updateCustomGroup({
			id: groupId,
			// $FlowFixMe
			[IS_NEW]: true,
			name: '',
			subGroups: [createNewSubGroup(type)],
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
		const {selectedCustomGroup, way} = this.state;
		// $FlowFixMe
		if (way === GROUP_WAYS.SYSTEM) {
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

	resolveGroupType = () => {
		const {attribute} = this.props;
		const {DATETIME, INTEGER} = GROUP_TYPES;
		const {DATE, NUMBER} = ATTRIBUTE_SETS;
		const {type} = getProcessedAttribute(attribute);

		if (DATE.includes(type)) {
			return DATETIME;
		}

		if (NUMBER.includes(type)) {
			return INTEGER;
		}
	};

	saveCustomGroup = async () => {
		const {createCustomGroup, customGroups, onSubmit, updateCustomGroup} = this.props;
		const {attributeTitle, selectedCustomGroup, way} = this.state;
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

			onSubmit({data: data.toString(), way}, attributeTitle);
		}
	};

	saveSystemGroup = () => {
		const {onSubmit} = this.props;
		const {attributeTitle, systemValue, way} = this.state;
		const data = systemValue ? systemValue.value : '';
		const group = {
			data,
			way
		};

		onSubmit(group, attributeTitle);
	};

	validateCustomGroup = async (customGroup?: CustomGroupType) => {
		const {attribute, customGroups} = this.props;
		const {selectedCustomGroup} = this.state;
		const currentCustomGroup = customGroup || customGroups[selectedCustomGroup];
		let errors = {};

		try {
			await schema.validate(currentCustomGroup, {
				abortEarly: false,
				attribute
			});
		} catch (e) {
			e.inner.forEach(({message, path}) => {
				errors[path] = message;
			});
		}

		this.setState({errors, isSubmitting: true});

		return Object.keys(errors).length === 0;
	};

	renderCustomGroup = () => {
		const {attribute, customGroups} = this.props;
		const {errors, selectedCustomGroup, type, way} = this.state;
		const context = {attribute, errors, type};
		// $FlowFixMe
		const options = Object.values(customGroups).filter(group => group.type === type);
		const value = customGroups[selectedCustomGroup] || null;

		if (way === GROUP_WAYS.CUSTOM) {
			return (
				<GroupContext.Provider value={context}>
					<div className={styles.customSection}>
						<CustomGroup
							getUsingWidgets={this.getWidgetsUsingSelectedCutomGroup}
							onCreate={this.handleCreateCustomGroup}
							onRemove={this.handleRemoveCustomGroup}
							onSelect={this.handleSelectCustomGroup}
							onUpdate={this.handleUpdateCustomGroup}
							options={options}
							value={value}
						/>
					</div>
				</GroupContext.Provider>
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

	renderSystemGroup = () => {
		const {systemOptions, systemValue, type, way} = this.state;
		const {DATETIME} = GROUP_TYPES;

		if (way === GROUP_WAYS.SYSTEM && type === DATETIME) {
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

	renderWayField = () => (
		<div className={styles.field}>
			<div className={styles.fieldLabel}>Тип группировки</div>
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
					name={FIELDS.way}
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
					{this.renderWayField()}
					{this.renderSystemGroup()}
					{this.renderCustomGroup()}
					{this.renderSaveInfo()}
				</div>
			</Modal>
		);
	}
}

export default GroupCreatingModal;
