// @flow
import {Button, FieldError, InfoPanel, Text} from 'components/atoms';
import {createNewSubGroup} from './helpers';
import type {CustomGroup as CustomGroupType, InfoPanelProps, Props, State, SubGroup} from './types';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import {FormField} from 'components/molecules/GroupCreatingModal/components';
import {GROUP_WAYS} from 'store/widgets/constants';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import type {InputRef} from 'src/components/types';
import {LOCAL_PREFIX_ID} from 'components/molecules/GroupCreatingModal/constants';
import mainStyles from 'components/molecules/GroupCreatingModal/styles.less';
import {MAX_TEXT_LENGTH} from 'WidgetFormPanel/constants';
import type {OnChangeInputEvent, OnSelectEvent} from 'components/types';
import React, {Component, createContext, createRef, Fragment} from 'react';
import schema from './schema';
import {Select} from 'components/molecules';
import styles from './styles.less';
import {SubGroupSection} from './components';
import {TEXT_TYPES} from 'components/atoms/Text/constants';
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
		const {group, map, setSubmit} = this.props;

		if (group.data in map) {
			this.setState({selectedGroup: group.data});
		}

		setSubmit(this.submit);
	}

	getGroupLabel = (group: CustomGroupType) => group.name;

	getGroupValue = (group: CustomGroupType) => group.id;

	getSelectedGroup = () => {
		const {map} = this.props;
		const {selectedGroup} = this.state;

		return map[selectedGroup];
	};

	getUsingWidgets = (): Array<string> => {
		const {widgets} = this.props;
		return widgets.filter(this.isUsingCurrentGroup).map(widget => widget.name);
	};

	handleChangeGroupName = (event: OnChangeInputEvent) => {
		const selectedGroup = this.getSelectedGroup();
		selectedGroup && this.update({...selectedGroup, name: String(event.value)});
	};

	handleClickCreationButton = () => {
		const {createCondition, groups, type} = this.props;
		const {current: groupNameInput} = this.groupNameRef;
		const id = `${LOCAL_PREFIX_ID}${uuid()}`;

		if (groups.length < 30) {
			const group = {
				id,
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
		const usedInWidgets = this.getUsingWidgets();

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

	handleSelectGroup = ({value}: OnSelectEvent) => this.setState({
		errors: {},
		isSubmitting: false,
		selectedGroup: this.getGroupValue(value)
	});

	handleUpdate = (subGroups: Array<SubGroup>) => {
		const selectedGroup = this.getSelectedGroup();

		selectedGroup && this.update({...selectedGroup, subGroups});
	};

	isUsingCurrentGroup = (widget: Object) => !!widget.data.find(set => {
		const {breakdown, breakdownGroup, group} = FIELDS;
		const usesInGroup = this.testFieldAtUsingGroup(set[group]) || this.testFieldAtUsingGroup(set[breakdownGroup]);
		let usesInComputedBreakdown = false;

		if (Array.isArray(set[breakdown])) {
			usesInComputedBreakdown = set[breakdown].findIndex(breakdownSet => this.testFieldAtUsingGroup(breakdownSet[group])) !== -1;
		}

		return usesInComputedBreakdown || usesInGroup;
	});

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

	testFieldAtUsingGroup = (group: any) => {
		const {selectedGroup} = this.state;
		return group && typeof group === 'object' && group.data === selectedGroup;
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

	renderDivider = () => <div className={styles.divider} />;

	renderGroupSelect = () => {
		const {groups} = this.props;
		const selectedGroup = this.getSelectedGroup();
		const editable = !!selectedGroup;

		return (
			<Select
				className={styles.groupSelect}
				editable={editable}
				forwardedLabelInputRef={this.groupNameRef}
				getOptionLabel={this.getGroupLabel}
				getOptionValue={this.getGroupValue}
				maxLabelLength={MAX_TEXT_LENGTH}
				onChangeLabel={this.handleChangeGroupName}
				onClickCreationButton={this.handleClickCreationButton}
				onSelect={this.handleSelectGroup}
				options={groups}
				showCreationButton={true}
				textCreationButton="Добавить группировку"
				value={selectedGroup}
			/>
		);
	};

	renderGroupSelectError = () => <FieldError className={mainStyles.error} text={this.state.errors.name} />;

	renderGroupSelectField = () => (
		<Fragment>
			<FormField className={styles.groupSelectField} label="Название группировки">
				<div className={styles.groupSelectContainer}>
					{this.renderGroupSelect()}
					{this.renderInfoIcon()}
					{this.renderRemovalGroupButton()}
				</div>
			</FormField>
			{this.renderGroupSelectError()}
		</Fragment>
	);

	renderInfoIcon = () => (
		<div title="Название для сохранения группировки">
			<Icon className={mainStyles.infoIcon} name={ICON_NAMES.INFO} />
		</div>
	);

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
				<Button onClick={this.handleClickRemovalButton} variant={BUTTON_VARIANTS.SIMPLE}>
					Удалить
				</Button>
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
					onConfirm={this.save}
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

	renderTitle = () => <Text className={styles.title} type={TEXT_TYPES.TITLE}>Настройка пользовательской группировки</Text>;

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
		const {show} = this.props;

		if (show) {
			return (
				<Fragment>
					{this.renderDivider()}
					{this.renderSaveInfo()}
					{this.renderRemovalInfo()}
					{this.renderLimitInfo()}
					{this.renderUseInfo()}
					{this.renderTitle()}
					{this.renderGroupSelectField()}
					{this.renderSubGroupSection()}
				</Fragment>
			);
		}

		return null;
	}
}

export default CustomGroup;
