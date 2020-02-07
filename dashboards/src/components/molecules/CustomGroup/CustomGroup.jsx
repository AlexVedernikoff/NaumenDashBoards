// @flow
import {BASE_VALIDATION_SUBGROUP_PATH, IS_NEW} from 'components/molecules/GroupCreatingModal/constants';
import {Button, CreationPanel, FieldError, InfoPanel} from 'components/atoms';
import {createNewSubGroup} from 'components/molecules/GroupCreatingModal/helpers';
import type {CustomGroup as CustomGroupType, SubGroup} from 'store/customGroups/types';
import {CustomSubGroup, MaterialSelect} from 'components/molecules';
import type {InfoPanelProps, Props, State} from './types';
import mainStyles from 'components/molecules/GroupCreatingModal/styles.less';
import React, {Component, Fragment} from 'react';
import styles from './styles.less';

export class CustomGroup extends Component<Props, State> {
	state = {
		showLimitInfo: false,
		showRemovalInfo: false,
		showUseInfo: false,
		usedInWidgets: []
	};

	getCurrentGroup = () => {
		const {groups, selectedGroup} = this.props;
		return groups[selectedGroup] || null;
	};

	getGroupLabel = (group: CustomGroupType) => group.name;

	getGroupValue = (group: CustomGroupType) => group.id;

	handleChangeGroupName = (groupId: string, name: string) => {
		const {groups, onUpdate} = this.props;
		onUpdate({...groups[groupId], name});
	};

	handleClickCreationButton = () => {
		const {groups, onCreate} = this.props;

		if (Object.keys(groups).length > 30) {
			return this.setState({showLimitInfo: true});
		}

		onCreate();
	};

	handleClickCreationPanel = () => {
		const {onUpdate} = this.props;
		const currentGroup = this.getCurrentGroup();

		if (currentGroup) {
			const {subGroups} = currentGroup;

			onUpdate({
				...currentGroup,
				subGroups: [
					...subGroups,
					createNewSubGroup()
				]
			});
		}
	};

	handleClickRemovalButton = () => {
		const {selectedGroup, widgets} = this.props;
		const usedInWidgets = [];

		widgets.forEach(widget => {
			Object.keys(widget)
				.filter(key => /group/i.test(key))
				.forEach(key => {
					const group = widget[key];

					if (group && typeof group === 'object' && group.data === selectedGroup) {
						usedInWidgets.push(widget.name);
					}
				});
		});

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
		const {onUpdate} = this.props;
		const currentGroup = this.getCurrentGroup();

		if (currentGroup) {
			const {subGroups} = currentGroup;

			if (subGroups.length > 1) {
				subGroups.splice(index, 1);

				onUpdate({
					...currentGroup,
					subGroups
				});
			}
		}
	};

	handleSelectGroup = (name: string, group: CustomGroupType) => this.props.onSelect(group.id);

	handleUpdateSubGroup = (index: number, subGroup: SubGroup) => {
		const {onUpdate} = this.props;
		const currentGroup = this.getCurrentGroup();

		this.setState({showRemovalInfo: false});

		if (currentGroup) {
			const {subGroups} = currentGroup;
			subGroups[index] = subGroup;

			onUpdate({
				...currentGroup,
				subGroups: [...subGroups]
			});
		}
	};

	renderCreationPanel = () => {
		const {selectedGroup} = this.props;

		if (selectedGroup) {
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
		const {groups} = this.props;
		const currentGroup = this.getCurrentGroup();
		// $FlowFixMe
		const options: Array<CustomGroupType> = Object.values(groups);
		// $FlowFixMe
		const isEditingLabel = Boolean(currentGroup && currentGroup[IS_NEW]);

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
					textCreationButton="Добавить группу"
					value={currentGroup}
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
		const {selectedGroup} = this.props;

		if (selectedGroup) {
			return (
				<div className={mainStyles.field}>
					<Button
						onClick={this.handleClickRemovalButton}
						variant="simple"
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

	renderSubGroup = (group: SubGroup, index: number, groups: Array<SubGroup>) => {
		const {errors} = this.props;
		const isLast = groups.length === 1;
		const validationPath = `${BASE_VALIDATION_SUBGROUP_PATH}[${index}]`;

		return (
			<CustomSubGroup
				errors={errors}
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

	renderSubGroups = () => {
		const currentGroup = this.getCurrentGroup();

		if (currentGroup) {
			return currentGroup.subGroups.map(this.renderSubGroup);
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

export default CustomGroup;
