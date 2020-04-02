// @flow
import {BASE_VALIDATION_PATH} from './constants';
import {createNewSubGroup} from 'CustomGroup/helpers';
import {CreationPanel} from 'components/atoms';
import type {Node} from 'react';
import type {Props} from './types';
import React, {Component, Fragment} from 'react';
import styles from './styles.less';
import type {SubGroup as SubGroupType} from 'CustomGroup/types';
import {SubGroup} from 'CustomGroup/components';
import withCustomGroup from 'CustomGroup/withCustomGroup';

export class SubGroupSection extends Component<Props> {
	handleClickCreationPanel = () => {
		const {createCondition, onUpdate, subGroups} = this.props;

		onUpdate([
			...subGroups,
			createNewSubGroup(
				createCondition()
			)
		]);
	};

	handleRemoveSubGroup = (index: number) => {
		const {onUpdate, subGroups} = this.props;

		if (subGroups.length > 1) {
			subGroups.splice(index, 1);

			onUpdate(subGroups);
		}
	};

	handleUpdateSubGroup = (index: number, subGroup: SubGroupType) => {
		const {onUpdate, subGroups} = this.props;
		subGroups[index] = subGroup;

		onUpdate([...subGroups]);
	};

	renderCreationPanel = () => (
		<CreationPanel
			className={styles.creationPanel}
			onClick={this.handleClickCreationPanel}
			text="Добавить группу"
		/>
	);

	renderSubGroup = (group: SubGroupType, index: number, groups: Array<SubGroupType>) => {
		const isLast = groups.length === 1;
		const validationPath = `${BASE_VALIDATION_PATH}[${index}]`;

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

	renderSubGroups = (): Array<Node> => this.props.subGroups.map(this.renderSubGroup);

	render () {
		return (
			<Fragment>
				{this.renderSubGroups()}
				{this.renderCreationPanel()}
			</Fragment>
		);
	}
}

export default withCustomGroup(SubGroupSection);
