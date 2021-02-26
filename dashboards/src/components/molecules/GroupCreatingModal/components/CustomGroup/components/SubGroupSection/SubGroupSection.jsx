// @flow
import {BASE_VALIDATION_PATH} from './constants';
import Button from 'components/atoms/Button';
import {createNewSubGroup} from 'CustomGroup/helpers';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import type {Node} from 'react';
import type {Props} from './types';
import React, {Component, Fragment} from 'react';
import styles from './styles.less';
import type {SubGroup as SubGroupType} from 'CustomGroup/types';
import SubGroup from 'CustomGroup/components/SubGroup';
import {VARIANTS as BUTTON_VARIANTS} from 'components/atoms/Button/constants';
import withCustomGroup from 'CustomGroup/withCustomGroup';

export class SubGroupSection extends Component<Props> {
	handleClickCreateButton = () => {
		const {createCondition, onUpdate, subGroups} = this.props;

		onUpdate([
			...subGroups,
			createNewSubGroup(
				createCondition()
			)
		], true);
	};

	handleRemoveSubGroup = (index: number) => {
		const {onUpdate, subGroups} = this.props;

		if (subGroups.length > 1) {
			subGroups.splice(index, 1);

			onUpdate(subGroups);
		}
	};

	handleUpdateSubGroup = (index: number, subGroup: SubGroupType, isNewCondition: boolean = false) => {
		const {onUpdate, subGroups} = this.props;

		subGroups[index] = subGroup;

		onUpdate([...subGroups], isNewCondition);
	};

	renderCreateButton = () => (
		<Button className={styles.createButton} onClick={this.handleClickCreateButton} variant={BUTTON_VARIANTS.GRAY}>
			<Icon name={ICON_NAMES.PLUS} />
			Добавить группу
		</Button>
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
				{this.renderCreateButton()}
			</Fragment>
		);
	}
}

export default withCustomGroup(SubGroupSection);
