// @flow
import Button from 'components/atoms/Button';
import cn from 'classnames';
import OrCondition from 'CustomGroup/components/OrCondition';
import type {OrCondition as OrConditionType} from 'CustomGroup/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import {VARIANTS as BUTTON_VARIANTS} from 'components/atoms/Button/constants';
import withCustomGroup from 'CustomGroup/withCustomGroup';

export class AndCondition extends PureComponent<Props> {
	handleCreateOrCondition = () => {
		const {condition, createCondition, index, onUpdate} = this.props;

		onUpdate(index, [
			...condition,
			createCondition()
		], true);
	};

	handleRemoveOrCondition = (index: number) => {
		const {condition, index: andConditionIndex, onRemove, onUpdate} = this.props;

		condition.splice(index, 1);

		condition.length === 0 ? onRemove(andConditionIndex) : onUpdate(andConditionIndex, [...condition]);
	};

	handleUpdateOrCondition = (index: number, orCondition: OrConditionType) => {
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

	renderOrCondition = (condition: OrConditionType, index: number, conditions: Array<OrConditionType>) => {
		const {isLast: isLastAndCondition, validationPath: currentPath} = this.props;
		const hasLastPosition = conditions.length - 1 === index;
		const isLast = isLastAndCondition && conditions.length === 1;
		const validationPath = `${currentPath}[${index}]`;

		return (
			<div className={styles.orCondition} key={validationPath}>
				<OrCondition
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

export default withCustomGroup(AndCondition);
