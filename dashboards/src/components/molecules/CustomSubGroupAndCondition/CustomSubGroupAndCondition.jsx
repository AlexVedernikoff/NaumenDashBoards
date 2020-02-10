// @flow
import {Button} from 'components/atoms';
import cn from 'classnames';
import {createNewOrCondition} from 'components/molecules/GroupCreatingModal/helpers';
import {CustomSubGroupOrCondition} from 'components/molecules';
import type {OrCondition} from 'store/customGroups/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import {VARIANTS as BUTTON_VARIANTS} from 'components/atoms/Button/constants';
import {withGroup} from 'components/molecules/GroupCreatingModal';

export class CustomSubGroupAndCondition extends PureComponent<Props> {
	handleCreateOrCondition = () => {
		const {condition, index, onUpdate, type} = this.props;

		onUpdate(index, [
			...condition,
			createNewOrCondition(type)
		]);
	};

	handleRemoveOrCondition = (index: number) => {
		const {condition, index: andConditionIndex, onRemove, onUpdate} = this.props;
		condition.splice(index, 1);

		condition.length === 0 ? onRemove(andConditionIndex) : onUpdate(andConditionIndex, [...condition]);
	};

	handleUpdateOrCondition = (index: number, orCondition: OrCondition) => {
		const {condition, index: AndConditionIndex, onUpdate} = this.props;
		condition[index] = orCondition;

		onUpdate(AndConditionIndex, [...condition]);
	};

	renderAndCondition = () => {
		const {disabled, onCreate} = this.props;
		const andOperatorCN = cn({
			[styles.andOperator]: true,
			[styles.disabledAndOperator]: disabled
		});

		return (
			<div className={andOperatorCN}>
				<Button disabled={disabled} onClick={onCreate} variant={BUTTON_VARIANTS.SIMPLE}>
					И
				</Button>
			</div>
		);
	};

	renderOrCondition = (condition: OrCondition, index: number, conditions: Array<OrCondition>) => {
		const {isLast: isLastAndCondition, validationPath: currentPath} = this.props;
		const hasLastPosition = conditions.length - 1 === index;
		const isLast = isLastAndCondition && conditions.length === 1;
		const validationPath = `${currentPath}[${index}]`;

		return (
			<div className={styles.orCondition} key={validationPath}>
				<CustomSubGroupOrCondition
					condition={condition}
					disabled={!hasLastPosition}
					index={index}
					isLast={isLast}
					onCreate={this.handleCreateOrCondition}
					onRemove={this.handleRemoveOrCondition}
					onUpdate={this.handleUpdateOrCondition}
					validationPath={validationPath}
				/>
			</div>
		);
	};

	renderOrConditions = () => {
		const {condition} = this.props;

		return (
			<div className={styles.orConditionsContainer}>
				{condition.map(this.renderOrCondition)}
			</div>
		);
	};

	render () {
		return (
			<div>
				{this.renderOrConditions()}
				{this.renderAndCondition()}
			</div>
		);
	}
}

export default withGroup(CustomSubGroupAndCondition);
