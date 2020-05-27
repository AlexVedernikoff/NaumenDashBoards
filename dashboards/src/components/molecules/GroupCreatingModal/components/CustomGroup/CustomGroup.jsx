// @flow
import {Button, FieldError, InfoPanel} from 'components/atoms';
import {createNewSubGroup} from './helpers';
import type {CustomGroup as CustomGroupType, InfoPanelProps, Props, State, SubGroup} from './types';
import {GROUP_WAYS} from 'store/widgets/constants';
import type {InputRef} from 'src/components/types';
import {isGroupKey} from 'store/widgets/helpers';
import {IS_NEW, LOCAL_PREFIX_ID} from 'components/molecules/GroupCreatingModal/constants';
import mainStyles from 'components/molecules/GroupCreatingModal/styles.less';
import {MaterialSelect} from 'components/molecules/index';
import {MAX_TEXT_LENGTH} from 'WidgetFormPanel/constants';
import React, {Component, createContext, createRef, Fragment} from 'react';
import schema from './schema';
import styles from './styles.less';
import {SubGroupSection} from './components';
import uuid from 'tiny-uuid';
import {VARIANTS as BUTTON_VARIANTS} from 'components/atoms/Button/constants';
import {VARIANTS} from 'components/atoms/InfoPanel/constants';

export const CustomGroupContext: Object = createContext({});

export class CustomGroup extends Component<Props, State> {
	groupNameRef: InputRef = createRef();

	state = {
		errors: {},
		isSubmitting: false,
		selectedGroup: '',
		showLimitInfo: false,
		showRemovalInfo: false,
		showSaveInfo: false,
		showUseInfo: false,
		usedInWidgets: []
	};

	componentDidMount () {
		const {group, map} = this.props;

		if (group.data in map) {
			this.setState({selectedGroup: group.data});
		}
	}

	getGroupLabel = (group: CustomGroupType) => group.name;

	getGroupValue = (group: CustomGroupType) => group.id;

	getSelectedGroup = () => {
		const {map} = this.props;
		const {selectedGroup} = this.state;

		return map[selectedGroup];
	};

	getUsingWidgets = () => {
		const {widgets} = this.props;
		const {selectedGroup} = this.state;
		const usedInWidgets = [];

		widgets.forEach(widget => {
			Object.keys(widget)
				.filter(isGroupKey)
				.every(key => {
					// $FlowFixMe
					const group = widget[key];

					if (group && typeof group === 'object' && group.data === selectedGroup) {
						usedInWidgets.push(widget);
						return false;
					}

					return true;
				});
		});

		return usedInWidgets;
	};

	handleChangeGroupName = (groupId: string, name: string) => {
		const selectedGroup = this.getSelectedGroup();
		selectedGroup && this.update({...selectedGroup, name});
	};

	handleClickCreationButton = () => {
		const {createCondition, groups, type} = this.props;
		const {current: groupNameInput} = this.groupNameRef;
		const id = `${LOCAL_PREFIX_ID}${uuid()}`;

		if (groups.length < 30) {
			const group = {
				id,
				// $FlowFixMe
				[IS_NEW]: true,
				name: '',
				subGroups: [createNewSubGroup(
					createCondition()
				)],
				type
			};

			this.setState({selectedGroup: id});
			this.update(group);
			groupNameInput && setTimeout(() => groupNameInput.focus());
		} else {
			this.setState({showLimitInfo: true});
		}
	};

	handleClickRemovalButton = () => {
		const usedInWidgets = this.getUsingWidgets().map(widget => widget.name);

		usedInWidgets.length > 0
			? this.setState({showUseInfo: true, usedInWidgets})
			: this.setState({showRemovalInfo: true});
	};

	handleCloseLimitInfo = () => this.setState({showLimitInfo: false});

	handleCloseRemovalInfo = () => this.setState({showRemovalInfo: false});

	handleCloseSaveInfo = () => this.setState({showSaveInfo: false});

	handleCloseUseInfo = () => this.setState({showUseInfo: false, usedInWidgets: []});

	handleConfirmRemovalInfo = () => {
		const {onRemove} = this.props;
		const {selectedGroup} = this.state;

		if (selectedGroup) {
			this.setState({selectedGroup: '', showRemovalInfo: false});
			onRemove(selectedGroup);
		}
	};

	handleSelectGroup = (name: string, group: CustomGroupType) => this.setState({
		errors: {},
		isSubmitting: false,
		selectedGroup: group.id
	});

	handleUpdate = (subGroups: Array<SubGroup>) => {
		const selectedGroup = this.getSelectedGroup();

		selectedGroup && this.update({...selectedGroup, subGroups});
	};

	onCreateCallBack = (id: string) => {
		this.setState({selectedGroup: id});
		this.onSubmit(id);
	};

	onSubmit = (data: string) => this.props.onSubmit({data, way: GROUP_WAYS.CUSTOM});

	save = async () => {
		const {onCreate, onUpdate} = this.props;
		const selectedGroup = this.getSelectedGroup();
		const isValid = await this.validate();

		if (selectedGroup && isValid) {
			if (selectedGroup.id.startsWith(LOCAL_PREFIX_ID)) {
				onCreate(selectedGroup, this.onCreateCallBack);
			} else {
				onUpdate(selectedGroup, true);
				this.onSubmit(selectedGroup.id);
			}
		}
	};

	submit = () => {
		const {selectedGroup} = this.state;

		if (selectedGroup) {
			const usedInWidgets = this.getUsingWidgets();

			usedInWidgets.length > 0 ? this.setState({showSaveInfo: true}) : this.save();
		}
	};

	update = async (customGroup: CustomGroupType) => {
		const {onUpdate} = this.props;
		const {isSubmitting} = this.state;

		if (isSubmitting) {
			this.validate(customGroup);
		}

		onUpdate(customGroup);
	};

	validate = async (customGroup?: CustomGroupType) => {
		const {resolveConditionRule} = this.props;
		const selectedGroup = this.getSelectedGroup();
		const currentCustomGroup = customGroup || selectedGroup;
		let errors = {};

		try {
			await schema.validate(currentCustomGroup, {
				abortEarly: false,
				resolveRule: resolveConditionRule
			});
		} catch (e) {
			e.inner.forEach(({message, path}) => {
				errors[path] = message;
			});
		}

		this.setState({errors, isSubmitting: true});

		return Object.keys(errors).length === 0;
	};

	renderGroupSelect = () => {
		const {groups} = this.props;
		const selectedGroup = this.getSelectedGroup();
		// $FlowFixMe
		const isEditingLabel = Boolean(selectedGroup && selectedGroup[IS_NEW]);

		return (
			<div className={mainStyles.shortField}>
				<MaterialSelect
					forwardedLabelInputRef={this.groupNameRef}
					getOptionLabel={this.getGroupLabel}
					getOptionValue={this.getGroupValue}
					isEditingLabel={isEditingLabel}
					isSearching={true}
					maxLabelLength={MAX_TEXT_LENGTH}
					onChangeLabel={this.handleChangeGroupName}
					onClickCreationButton={this.handleClickCreationButton}
					onSelect={this.handleSelectGroup}
					options={groups}
					placeholder="Название группировки"
					showCreationButton={true}
					textCreationButton="Добавить группировку"
					value={selectedGroup}
				/>
			</div>
		);
	};

	renderGroupSelectContainer = () => (
		<Fragment>
			<div className={styles.groupSelectContainer}>
				{this.renderGroupSelect()}
				{this.renderRemovalGroupButton()}
			</div>
			{this.renderGroupSelectError()}
		</Fragment>
	);

	renderGroupSelectError = () => <FieldError className={mainStyles.error} text={this.state.errors.name} />;

	renderInfoPanel = (props: InfoPanelProps) => {
		const {onClose, onConfirm, text} = props;

		return (
			<div className={styles.infoPanel}>
				<InfoPanel onClose={onClose} onConfirm={onConfirm} text={text} />
			</div>
		);
	};

	renderLimitInfo = () => {
		const {showLimitInfo} = this.state;
		const props = {
			onClose: this.handleCloseLimitInfo,
			text: 'Количество созданных на дашборде пользовательских группировок достигло максимума (30 шт)'
		};

		if (showLimitInfo) {
			return this.renderInfoPanel(props);
		}
	};

	renderRemovalGroupButton = () => {
		const {selectedGroup} = this.state;

		if (selectedGroup) {
			return (
				<div className={mainStyles.field}>
					<Button onClick={this.handleClickRemovalButton} variant={BUTTON_VARIANTS.SIMPLE}>
						Удалить
					</Button>
				</div>
			);
		}
	};

	renderRemovalInfo = () => {
		const {showRemovalInfo} = this.state;
		const props = {
			onClose: this.handleCloseRemovalInfo,
			onConfirm: this.handleConfirmRemovalInfo,
			text: 'Группировка будет удалена без возможности восстановления.'
		};

		if (showRemovalInfo) {
			return this.renderInfoPanel(props);
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
					onConfirm={this.submit}
					text={text}
					variant={VARIANTS.WARNING}
				/>
			);
		}
	};

	renderSubGroupSection = () => {
		const {createCondition, operandData, options, renderCondition} = this.props;
		const {errors} = this.state;
		const selectedGroup = this.getSelectedGroup();
		const context = {createCondition, errors, operandData, options, renderCondition};

		if (selectedGroup) {
			return (
				<CustomGroupContext.Provider value={context}>
					<SubGroupSection onUpdate={this.handleUpdate} subGroups={selectedGroup.subGroups} />
				</CustomGroupContext.Provider>
			);
		}
	};

	renderTitle = () => <div className={styles.title}>Настройка пользовательской группировки</div>;

	renderUseInfo = () => {
		const {showUseInfo, usedInWidgets} = this.state;

		if (showUseInfo) {
			const props = {
				onClose: this.handleCloseUseInfo,
				text: `Группировка используется в виджетах: ${usedInWidgets.join(', ')}.`
			};

			return this.renderInfoPanel(props);
		}
	};

	render () {
		const {className, show} = this.props;

		if (show) {
			return (
				<div className={className}>
					{this.renderRemovalInfo()}
					{this.renderLimitInfo()}
					{this.renderUseInfo()}
					{this.renderTitle()}
					{this.renderGroupSelectContainer()}
					{this.renderSubGroupSection()}
				</div>
			);
		}

		return null;
	}
}

export default CustomGroup;
