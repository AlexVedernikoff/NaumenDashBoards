// @flow
import {Button, CreationPanel, InfoPanel} from 'components/atoms';
import {createNewSubGroup} from 'components/molecules/GroupCreatingModal/helpers';
import type {CustomGroup as CustomGroupType, SubGroup} from 'store/customGroups/types';
import {CustomSubGroup, MaterialSelect} from 'components/molecules';
import type {InfoPanelProps, Props, State} from './types';
import {IS_NEW} from 'components/molecules/GroupCreatingModal/GroupCreatingModal';
import mainStyles from 'components/molecules/GroupCreatingModal/styles.less';
import React, {Component, Fragment} from 'react';
import styles from './styles.less';
import uuid from 'tiny-uuid';

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

	handleClickCreationPanel = () => {
		const {onUpdate} = this.props;
		const currentGroup = this.getCurrentGroup();

		if (currentGroup) {
			const subGroupId = uuid();
			const {last, map} = currentGroup.subGroups;

			onUpdate({
				...currentGroup,
				subGroups: {
					...currentGroup.subGroups,
					last: subGroupId,
					map: {
						...map,
						[last]: {...map[last], next: subGroupId},
						[subGroupId]: createNewSubGroup(subGroupId)
					}
				}
			});
		}
	};

	handleClickCreationButton = () => {
		const {groups, onCreate} = this.props;

		if (Object.keys(groups).length > 30) {
			return this.setState({showLimitInfo: true});
		}

		onCreate();
	};

	handleCloseLimitInfo = () => this.setState({showLimitInfo: false});

	handleCloseUsedInWidgetsInfo = () => this.setState({showUseInfo: true, usedInWidgets: []});

	handleCloseRemovalInfo = () => this.setState({showRemovalInfo: false});

	handleClickRemoveButton = () => {
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

	handleChangeGroupName = (groupId: string, name: string) => {
		const {groups, onUpdate} = this.props;
		onUpdate({...groups[groupId], name});
	};

	handleConfirmRemovalInfo = () => {
		const {onRemove} = this.props;

		this.setState({showRemovalInfo: false});
		onRemove();
	};

	handleRemoveSubGroup = (subGroup: SubGroup, prev: string) => {
		const {onUpdate} = this.props;
		const {id, next} = subGroup;
		const currentGroup = this.getCurrentGroup();

		if (currentGroup) {
			let {first, last, map} = currentGroup.subGroups;

			if (first === id) {
				first = next;
			} else {
				map[prev] = {...map[prev], next};
			}

			if (last === id) {
				last = prev;
			}

			delete map[id];
			onUpdate({
				...currentGroup,
				subGroups: {
					first,
					last,
					map: {...map}
				}
			});
		}
	};

	handleSelectGroup = (name: string, group: CustomGroupType) => this.props.onSelect(group.id);

	handleUpdateSubGroup = (subGroup: SubGroup) => {
		const {onUpdate} = this.props;
		const currentGroup = this.getCurrentGroup();

		if (currentGroup) {
			onUpdate({
				...currentGroup,
				subGroups: {
					...currentGroup.subGroups,
					map: {
						...currentGroup.subGroups.map,
						[subGroup.id]: subGroup
					}
				}
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

	renderInfoPanel = (props: InfoPanelProps) => {
		const {onClose, onConfirm, text} = props;

		return (
			<InfoPanel
				className={styles.infoPanel}
				onClose={onClose}
				onConfirm={onConfirm}
				text={text}
			/>
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

	renderRemovalInfo = () => {
		const {showRemovalInfo} = this.state;
		const props = {
			onClose: this.handleCloseRemovalInfo,
			onConfirm: this.handleConfirmRemovalInfo,
			text: 'Группировка будет удаленна без возможности восстановления.'
		};

		if (showRemovalInfo) {
			return this.renderInfoPanel(props);
		}
	};

	renderSubGroup = (group: SubGroup, prevGroupId: string, isLast: boolean) => (
		<CustomSubGroup
			data={group}
			isLast={isLast}
			onRemove={this.handleRemoveSubGroup}
			onUpdate={this.handleUpdateSubGroup}
			prev={prevGroupId}
		/>
	);

	renderSubGroups = () => {
		const currentGroup = this.getCurrentGroup();

		if (currentGroup) {
			const {subGroups} = currentGroup;
			const {first, map} = subGroups;
			const isLast = Object.keys(map).length === 1;
			const groups = [];
			let group = map[first];
			let prev = '';

			while (group) {
				groups.push(this.renderSubGroup(group, prev, isLast));
				prev = group.id;
				group = map[group.next];
			}

			return groups;
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
		// $FlowFixMe
		const options: Array<CustomGroupType> = Object.values(groups);
		const currentGroup = this.getCurrentGroup();
		// $FlowFixMe
		const isEditingLabel = Boolean(currentGroup && currentGroup[IS_NEW]);

		return (
			<div className={mainStyles.shortField}>
				<MaterialSelect
					isEditingLabel={isEditingLabel}
					isSearching={true}
					getOptionLabel={this.getGroupLabel}
					getOptionValue={this.getGroupValue}
					options={options}
					onChangeLabel={this.handleChangeGroupName}
					onSelect={this.handleSelectGroup}
					placeholder="Название группировки"
					onClickCreationButton={this.handleClickCreationButton}
					showCreationButton={true}
					textCreationButton="Добавить группу"
					value={currentGroup}
				/>
			</div>
		);
	};

	renderGroupSelectField = () => (
		<div className={styles.groupSelectField}>
			{this.renderGroupSelect()}
			{this.renderRemoveGroupButton()}
		</div>
	);

	renderRemoveGroupButton = () => {
		const {selectedGroup} = this.props;

		if (selectedGroup) {
			return (
				<div className={mainStyles.field}>
					<Button
						onClick={this.handleClickRemoveButton}
						variant="simple"
					>
						Удалить
					</Button>
				</div>
			);
		}
	};

	renderTitle = () => <div className={styles.title}>Настройка пользовательской группировки</div>;

	renderUseInfo = () => {
		const {showUseInfo, usedInWidgets} = this.state;

		if (showUseInfo) {
			const props = {
				onClose: this.handleCloseUsedInWidgetsInfo,
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
				{this.renderGroupSelectField()}
				{this.renderGroup()}
			</Fragment>
		);
	}
}

export default CustomGroup;
