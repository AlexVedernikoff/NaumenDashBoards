// @flow
import {BASE_VALIDATION_SUBGROUP_PATH, IS_NEW} from 'components/molecules/GroupCreatingModal/constants';
import {Button, CreationPanel, FieldError, InfoPanel} from 'components/atoms';
import {createNewSubGroup} from 'components/molecules/GroupCreatingModal/helpers';
import type {CustomGroup as CustomGroupType} from 'store/customGroups/types';
import type {InfoPanelProps, Props, State} from './types';
import mainStyles from 'components/molecules/GroupCreatingModal/styles.less';
import {MaterialSelect} from 'components/molecules';
import type {Node} from 'react';
import React, {Component, Fragment} from 'react';
import styles from './styles.less';
import {SubGroup} from 'components/molecules/CustomGroup/components';
import type {SubGroup as SubGroupType} from 'components/molecules/CustomGroup/components/SubGroup/types';
import {VARIANTS as BUTTON_VARIANTS} from 'components/atoms/Button/constants';
import {withGroup} from 'components/molecules/GroupCreatingModal';

export class CustomGroup extends Component<Props, State> {
	state = {
		showLimitInfo: false,
		showRemovalInfo: false,
		showUseInfo: false,
		usedInWidgets: []
	};

	getGroupLabel = (group: CustomGroupType) => group.name;

	getGroupValue = (group: CustomGroupType) => group.id;

	handleChangeGroupName = (groupId: string, name: string) => {
		const {onUpdate, value} = this.props;
		onUpdate({...value, name});
	};

	handleClickCreationButton = () => {
		const {onCreate, options} = this.props;

		if (options.length > 30) {
			return this.setState({showLimitInfo: true});
		}

		onCreate();
	};

	handleClickCreationPanel = () => {
		const {attribute, onUpdate, value} = this.props;

		if (value) {
			const {subGroups} = value;

			onUpdate({
				...value,
				subGroups: [
					...subGroups,
					createNewSubGroup(attribute.type)
				]
			});
		}
	};

	handleClickRemovalButton = () => {
		const {getUsingWidgets} = this.props;
		const usedInWidgets = getUsingWidgets().map(widget => widget.name);

		usedInWidgets.length > 0
			? this.setState({showUseInfo: true, usedInWidgets})
			: this.setState({showRemovalInfo: true});
	};

	handleCloseLimitInfo = () => this.setState({showLimitInfo: false});

	handleCloseRemovalInfo = () => this.setState({showRemovalInfo: false});

	handleCloseUseInfo = () => this.setState({showUseInfo: false, usedInWidgets: []});

	handleConfirmRemovalInfo = () => {
		const {onRemove} = this.props;

		this.setState({showRemovalInfo: false});
		onRemove();
	};

	handleRemoveSubGroup = (index: number) => {
		const {onUpdate, value} = this.props;

		if (value) {
			const {subGroups} = value;

			if (subGroups.length > 1) {
				subGroups.splice(index, 1);

				onUpdate({
					...value,
					subGroups
				});
			}
		}
	};

	handleSelectGroup = (name: string, group: CustomGroupType) => this.props.onSelect(group.id);

	handleUpdateSubGroup = (index: number, subGroup: SubGroupType) => {
		const {onUpdate, value} = this.props;

		this.setState({showRemovalInfo: false});

		if (value) {
			const {subGroups} = value;
			subGroups[index] = subGroup;

			onUpdate({
				...value,
				subGroups: [...subGroups]
			});
		}
	};

	renderCreationPanel = () => {
		const {value} = this.props;

		if (value) {
			return (
				<CreationPanel
					className={styles.creationPanel}
					onClick={this.handleClickCreationPanel}
					text="Добавить группу"
				/>
			);
		}
	};

	renderGroup = () => (
		<Fragment>
			{this.renderSubGroups()}
			{this.renderCreationPanel()}
		</Fragment>
	);

	renderGroupSelect = () => {
		const {options, value} = this.props;
		// $FlowFixMe
		const isEditingLabel = Boolean(value && value[IS_NEW]);

		return (
			<div className={mainStyles.shortField}>
				<MaterialSelect
					getOptionLabel={this.getGroupLabel}
					getOptionValue={this.getGroupValue}
					isEditingLabel={isEditingLabel}
					isSearching={true}
					onChangeLabel={this.handleChangeGroupName}
					onClickCreationButton={this.handleClickCreationButton}
					onSelect={this.handleSelectGroup}
					options={options}
					placeholder="Название группировки"
					showCreationButton={true}
					textCreationButton="Добавить группировку"
					value={value}
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

	renderGroupSelectError = () => <FieldError className={mainStyles.error} text={this.props.errors.name} />;

	renderInfoPanel = (props: InfoPanelProps) => {
		const {onClose, onConfirm, text} = props;

		return (
			<div className={styles.infoPanel}>
				<InfoPanel
					onClose={onClose}
					onConfirm={onConfirm}
					text={text}
				/>
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
		const {value} = this.props;

		if (value) {
			return (
				<div className={mainStyles.field}>
					<Button
						onClick={this.handleClickRemovalButton}
						variant={BUTTON_VARIANTS.SIMPLE}
					>
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

	renderSubGroup = (group: SubGroupType, index: number, groups: Array<SubGroupType>) => {
		const isLast = groups.length === 1;
		const validationPath = `${BASE_VALIDATION_SUBGROUP_PATH}[${index}]`;

		return (
			<SubGroup
				index={index}
				isLast={isLast}
				key={validationPath}
				onRemove={this.handleRemoveSubGroup}
				onUpdate={this.handleUpdateSubGroup}
				subGroup={group}
				validationPath={validationPath}
			/>
		);
	};

	renderSubGroups = (): Array<Node> | null => {
		const {value} = this.props;

		return value ? value.subGroups.map(this.renderSubGroup) : null;
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
		return (
			<Fragment>
				{this.renderRemovalInfo()}
				{this.renderLimitInfo()}
				{this.renderUseInfo()}
				{this.renderTitle()}
				{this.renderGroupSelectContainer()}
				{this.renderGroup()}
			</Fragment>
		);
	}
}

export default withGroup(CustomGroup);
