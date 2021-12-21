// @flow
import {BASE_VALIDATION_PATH} from './constants';
import Button, {VARIANTS as BUTTON_VARIANTS} from 'src/components/atoms/Button';
import {createNewSubGroup} from 'GroupModal/helpers';
import Icon, {ICON_NAMES} from 'src/components/atoms/Icon';
import type {Node} from 'react';
import type {Props} from './types';
import React, {Component, Fragment} from 'react';
import styles from './styles.less';
import type {SubGroup as SubGroupType} from 'GroupModal/types';
import SubGroup from 'GroupModal/components/SubGroup';
import T from 'components/atoms/Translation';

export class SubGroupSection extends Component<Props> {
	handleClickCreateButton = () => {
		const {onUpdate, subGroups} = this.props;

		onUpdate([
			...subGroups,
			createNewSubGroup()
		], true);
	};

	handleRemoveSubGroup = (index: number) => {
		const {onUpdate, subGroups} = this.props;

		if (subGroups.length > 1) {
			onUpdate(subGroups.filter((s, i) => i !== index));
		}
	};

	handleUpdateSubGroup = (index: number, newSubGroup: SubGroupType, isNewCondition: boolean = false) => {
		const {onUpdate, subGroups} = this.props;

		onUpdate(subGroups.map((subGroup, i) => i === index ? newSubGroup : subGroup), isNewCondition);
	};

	renderCreateButton = () => (
		<Button className={styles.createButton} onClick={this.handleClickCreateButton} variant={BUTTON_VARIANTS.GRAY}>
			<Icon name={ICON_NAMES.PLUS} />
			<T text="SubGroupSection::AddGroup" />
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

export default SubGroupSection;
