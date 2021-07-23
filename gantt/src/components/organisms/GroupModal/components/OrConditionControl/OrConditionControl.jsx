// @flow
import Button from 'src/components/atoms/Button';
import cn from 'classnames';
import errorStyles from 'GroupModal/components/FieldError/styles.less';
import FieldError from 'GroupModal/components/FieldError';
import {FIELDS} from 'GroupModal/constants';
import IconButton from 'src/components/atoms/IconButton';
import {ICON_NAMES} from 'src/components/atoms/Icon';
import MaterialSelect from 'src/components/molecules/MaterialSelect';
import type {OnSelectEvent} from 'src/components/types';
import type {OrCondition as OrConditionType} from 'GroupModal/types';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import {VARIANTS as BUTTON_VARIANTS} from 'src/components/atoms/Button/constants';
import withComponents from 'GroupModal/HOCs/withComponents';
import withOrConditionOptions from 'GroupModal/HOCs/withOrConditionOptions';

export class OrConditionControl extends PureComponent<Props, State> {
	state = {
		value: this.getValue(this.props)
	};

	getValue (props: Props) {
		const {options, value} = props;

		return options.find(o => o.value === value.type) || options[0];
	}

	componentDidMount () {
		this.setDefaultType();
	}

	componentDidUpdate () {
		if (this.props.value.type !== this.state.value.value) {
			this.setState({
				value: this.getValue(this.props)
			});
		}

		this.setDefaultType();
	}

	handleChange = (condition: OrConditionType) => {
		const {index, onUpdate} = this.props;

		onUpdate(index, condition);
	};

	handleClickRemoveButton = () => {
		const {index, onRemove} = this.props;

		onRemove(index);
	};

	handleSelectOperandType = ({value}: OnSelectEvent) => {
		const {index, onUpdate} = this.props;
		const {value: type} = value;

		onUpdate(index, {
			type
		});
	};

	setDefaultType = () => {
		const {index, onUpdate, options, value} = this.props;

		if (!value.type && options.length > 0) {
			onUpdate(index, {
				type: options[0].value
			});
		}
	};

	renderCondition = () => {
		const {components, validationPath, value} = this.props;
		const {OrCondition} = components;
		const path = `${validationPath}.${FIELDS.data}`;

		return (
			<div className={styles.orCondition}>
				<OrCondition onChange={this.handleChange} value={value} />
				<FieldError className={cn(errorStyles.error, styles.error)} path={path} />
			</div>
		);
	};

	renderOrOperator = () => {
		const {disabled, onCreate} = this.props;

		return (
			<div className={styles.orOperator}>
				<Button disabled={disabled} onClick={onCreate} variant={BUTTON_VARIANTS.SIMPLE}>
					ИЛИ
				</Button>
			</div>
		);
	};

	renderRemoveButton = () => {
		const {isLast} = this.props;
		const containerCN = cn({
			[styles.removeButtonContainer]: true,
			[styles.hiddenRemoveButtonContainer]: isLast
		});

		return (
			<div className={containerCN}>
				<IconButton icon={ICON_NAMES.REMOVE} onClick={this.handleClickRemoveButton} />
			</div>
		);
	};

	renderSelect = () => {
		const {options} = this.props;
		const {value} = this.state;

		return (
			<div className={styles.select}>
				<MaterialSelect onSelect={this.handleSelectOperandType} options={options} value={value} />
			</div>
		);
	};

	render () {
		return (
			<div className={styles.container}>
				{this.renderSelect()}
				{this.renderCondition()}
				{this.renderOrOperator()}
				{this.renderRemoveButton()}
			</div>
		);
	}
}

export default withOrConditionOptions(withComponents(OrConditionControl));
