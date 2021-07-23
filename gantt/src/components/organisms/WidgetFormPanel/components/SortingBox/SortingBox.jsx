// @flow
import CheckIconButtonGroup from 'components/molecules/CheckIconButtonGroup';
import cn from 'classnames';
import CollapsableFormBox from 'components/molecules/CollapsableFormBox';
import Container from 'components/atoms/Container';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import type {OnChangeInputEvent} from 'components/types';
import type {Props, SortingValueOption, State} from './types';
import RadioField from 'components/atoms/RadioField';
import React, {PureComponent} from 'react';
import {SORTING_OPTIONS, SORTING_TYPE_OPTIONS} from './constants';
import styles from './styles.less';

export class SortingBox extends PureComponent<Props, State> {
	static defaultProps = {
		components: {
			Container
		},
		options: SORTING_OPTIONS
	};

	handleChange = ({name: valueName, value}: OnChangeInputEvent) => {
		const {name, onChange, value: settings} = this.props;

		onChange(name, {
			...settings,
			[valueName]: value
		});
	};

	renderSortingButtons = () => {
		const {type} = this.props.value;

		return (
			<CheckIconButtonGroup
				name={DIAGRAM_FIELDS.type}
				onChange={this.handleChange}
				options={SORTING_TYPE_OPTIONS}
				value={type}
			/>
		);
	};

	renderValueField = (option: SortingValueOption, index: number) => {
		const {value: currentValue} = this.props.value;
		const {disabled, label, value} = option;
		const CN = cn({
			[styles.valueField]: true,
			[styles.disabledValueField]: disabled
		});

		return (
			<div className={CN} key={index}>
				<RadioField
					checked={currentValue === value}
					label={label}
					name={DIAGRAM_FIELDS.value}
					onChange={this.handleChange}
					value={value}
				/>
			</div>
		);
	};

	renderValueFields = () => {
		const {options} = this.props;

		return (
			<div className={styles.typeFieldset}>
				{options.map(this.renderValueField)}
			</div>
		);
	};

	render () {
		const {Container} = this.props.components;

		return (
			<CollapsableFormBox title="Сортировка">
				<Container className={styles.container}>
					{this.renderValueFields()}
					{this.renderSortingButtons()}
				</Container>
			</CollapsableFormBox>
		);
	}
}

export default SortingBox;
