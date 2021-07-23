// @flow
import Button, {VARIANTS as BUTTON_VARIANTS} from 'src/components/atoms/Button';
import cn from 'classnames';
import {createNewOrCondition} from 'GroupModal/helpers';
import OrCondition from 'GroupModal/components/OrConditionControl';
import type {OrCondition as OrConditionType} from 'GroupModal/types';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';
import styles from './styles.less';

export class AndCondition extends PureComponent<Props> {
	handleCreateOrCondition = () => {
		const {index, onUpdate, value} = this.props;

		onUpdate(index, [
			...value,
			createNewOrCondition()
		], true);
	};

	handleRemoveOrCondition = (orConditionIndex: number) => {
		const {index, onRemove, onUpdate, value} = this.props;

		if (value.length === 1) {
			onRemove(index);
		} else {
			onUpdate(index, value.filter((c, i) => i !== orConditionIndex));
		}
	};

	handleUpdateOrCondition = (orConditionIndex: number, newOrCondition: OrConditionType) => {
		const {index, onUpdate, value} = this.props;

		onUpdate(index, value.map((c, i) => i === orConditionIndex ? newOrCondition : c));
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
					disabled={!hasLastPosition}
					index={index}
					isLast={isLast}
					onCreate={this.handleCreateOrCondition}
					onRemove={this.handleRemoveOrCondition}
					onUpdate={this.handleUpdateOrCondition}
					validationPath={validationPath}
					value={condition}
				/>
			</div>
		);
	};

	renderOrConditions = () => {
		const {value} = this.props;

		return (
			<div className={styles.orConditionsContainer}>
				{value.map(this.renderOrCondition)}
			</div>
		);
	};

	render () {
		return (
			<Fragment>
				{this.renderOrConditions()}
				{this.renderAndCondition()}
			</Fragment>
		);
	}
}

export default AndCondition;
