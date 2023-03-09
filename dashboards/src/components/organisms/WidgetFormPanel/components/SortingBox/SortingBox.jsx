// @flow
import CheckIconButtonGroup from 'components/molecules/CheckIconButtonGroup';
import CollapsableFormBox from 'components/molecules/CollapsableFormBox';
import Container from 'components/atoms/Container';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import type {OnChangeInputEvent} from 'components/types';
import type {Props, SortingValueOption, State} from './types';
import RadioField from 'components/atoms/RadioField';
import React, {PureComponent} from 'react';
import {SORTING_OPTIONS, SORTING_TYPE_OPTIONS} from './constants';
import styles from './styles.less';
import t, {translateObjectsArray} from 'localization';

export class SortingBox extends PureComponent<Props, State> {
	static defaultProps = {
		components: {
			Container
		}
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
		const options = translateObjectsArray('title', SORTING_TYPE_OPTIONS);

		return (
			<CheckIconButtonGroup
				name={DIAGRAM_FIELDS.type}
				onChange={this.handleChange}
				options={options}
				value={type}
			/>
		);
	};

	renderValueField = (option: SortingValueOption, index: number) => {
		const {value: currentValue} = this.props.value;
		const {disabled, disabledMessage, label, value} = option;

		return (
			<div className={styles.valueField} key={index}>
				<RadioField
					checked={currentValue === value}
					disabled={!!disabled}
					disabledMessage={disabledMessage}
					label={t(label)}
					name={DIAGRAM_FIELDS.value}
					onChange={this.handleChange}
					value={value}
				/>
			</div>
		);
	};

	renderValueFields = () => {
		const {options = SORTING_OPTIONS} = this.props;

		return (
			<div className={styles.typeFieldset}>
				{options.map(this.renderValueField)}
			</div>
		);
	};

	render () {
		const {Container} = this.props.components;

		return (
			<CollapsableFormBox title={t('SortingBox::Title')}>
				<Container className={styles.container}>
					{this.renderValueFields()}
					{this.renderSortingButtons()}
				</Container>
			</CollapsableFormBox>
		);
	}
}

export default SortingBox;
