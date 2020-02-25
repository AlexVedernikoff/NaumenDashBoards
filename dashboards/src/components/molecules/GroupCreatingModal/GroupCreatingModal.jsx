// @flow
import {ATTRIBUTE_SETS, ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import {createNewSubGroup, getSystemGroupOptions} from './helpers';
import {CustomGroup, MaterialSelect, Modal} from 'components/molecules';
import type {CustomGroup as CustomGroupType, CustomGroupId} from 'store/customGroups/types';
import {FIELDS, IS_NEW, LOCAL_PREFIX_ID, TYPE_OPTIONS} from './constants';
import {getProcessedValue} from 'store/sources/attributes/helpers';
import {GROUP_WAYS} from 'store/widgets/constants';
import {InfoPanel, MaterialTextInput, RadioButton} from 'components/atoms';
import {isGroupKey} from 'store/widgets/helpers';
import type {Props, State} from './types';
import React, {Component, createContext, Fragment} from 'react';
import schema from './schema';
import {SIZES as MODAL_SIZES} from 'components/molecules/Modal/constants';
import styles from './styles.less';
import uuid from 'tiny-uuid';
import {VARIANTS} from 'components/atoms/InfoPanel/constants';

export const GroupContext = createContext({
	errors: {}
});

export class GroupCreatingModal extends Component<Props, State> {
	state = {
		attributeTitle: '',
		errors: {},
		hasError: false,
		isSubmitting: false,
		selectedCustomGroup: '',
		showSaveInfo: false,
		systemOptions: [],
		systemValue: null,
		way: GROUP_WAYS.SYSTEM
	};

	static getDerivedStateFromError (error: Object) {
		window.top.console.error(error);

		return {
			hasError: true
		};
	}

	componentDidMount () {
		const {attribute, customGroups, value} = this.props;
		const {data, way} = value;
		const attributeTitle = getProcessedValue(attribute, 'title', '');
		const systemOptions = getSystemGroupOptions(attribute);
		const systemValue = systemOptions.find(o => o.value === data) || systemOptions[0] || null;
		const selectedCustomGroup = data in customGroups ? value.data : '';

		this.setState({
			attributeTitle,
			selectedCustomGroup,
			systemOptions,
			systemValue,
			way
		});
	}

	getCustomGroups = () => {
		const {attribute, customGroups} = this.props;
		const {DATE, NUMBER, REF} = ATTRIBUTE_SETS;
		const {metaClass, state} = ATTRIBUTE_TYPES;
		const {type} = attribute;
		const groups: any = Object.values(customGroups);

		if (DATE.includes(type)) {
			return groups.filter(group => DATE.includes(group.type));
		}

		if (REF.includes(type) || NUMBER.includes(type)) {
			return groups.filter(group => group.type === type);
		}

		if (type === state || type === metaClass) {
			return groups.filter(group => group.type === state || group.type === metaClass);
		}

		return [];
	};

	getModalSize = () => this.state.way === GROUP_WAYS.SYSTEM ? 360 : MODAL_SIZES.LARGE;

	getWidgetsUsingSelectedCustomGroup = () => {
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

	handleChangeAttributeTitle = (e: SyntheticInputEvent<HTMLInputElement>) => {
		const {value: attributeTitle} = e.currentTarget;
		this.setState({attributeTitle});
	};

	handleCloseSaveInfo = () => this.setState({showSaveInfo: false});

	handleCreateCustomGroup = () => {
		const {attribute, updateCustomGroup} = this.props;
		const groupId = `${LOCAL_PREFIX_ID}${uuid()}`;
		const {type} = attribute;

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

		if (way === GROUP_WAYS.SYSTEM) {
			this.saveSystemGroup();
		} else if (selectedCustomGroup) {
			const usedInWidgets = this.getWidgetsUsingSelectedCustomGroup();
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

	saveCustomGroup = async () => {
		const {createCustomGroup, customGroups, onSubmit, updateCustomGroup} = this.props;
		const {attributeTitle, selectedCustomGroup, way} = this.state;
		const isValid = await this.validateCustomGroup();

		if (isValid) {
			const group = customGroups[selectedCustomGroup];
			let data = '';

			if (selectedCustomGroup.startsWith(LOCAL_PREFIX_ID)) {
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
		const {attribute, attributesData, customGroups, fetchAttributesData} = this.props;
		const {errors, selectedCustomGroup, way} = this.state;
		const context = {attribute, attributesData, errors, fetchAttributesData};
		const options = this.getCustomGroups();
		const value = customGroups[selectedCustomGroup] || null;

		if (way === GROUP_WAYS.CUSTOM) {
			return (
				<GroupContext.Provider value={context}>
					<div className={styles.customSection}>
						<CustomGroup
							getUsingWidgets={this.getWidgetsUsingSelectedCustomGroup}
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

	renderError = () => (
		<InfoPanel onClose={undefined} text="Ошбика модального окна." />
	);

	renderForm = () => {
		const {hasError} = this.state;

		if (hasError) {
			return this.renderError();
		}

		return (
			<Fragment>
				{this.renderNameField()}
				{this.renderWayField()}
				{this.renderSystemGroup()}
				{this.renderCustomGroup()}
				{this.renderSaveInfo()}
			</Fragment>
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
		const {attribute} = this.props;
		const {systemOptions, systemValue, way} = this.state;

		if (way === GROUP_WAYS.SYSTEM && ATTRIBUTE_SETS.DATE.includes(attribute.type)) {
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
				{this.renderForm()}
			</Modal>
		);
	}
}

export default GroupCreatingModal;
