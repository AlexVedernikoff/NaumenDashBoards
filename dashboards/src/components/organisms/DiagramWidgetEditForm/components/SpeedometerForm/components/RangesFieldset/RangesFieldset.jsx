// @flow
import Checkbox from 'components/atoms/Checkbox';
import {deepClone} from 'helpers';
import {DEFAULT_SPEEDOMETER_SETTINGS} from 'components/organisms/Speedometer/constants';
import ExtendButton from 'components/atoms/ExtendButton';
import FieldDivider from 'DiagramWidgetEditForm/components/FieldDivider';
import {FIELDS} from 'DiagramWidgetEditForm/constants';
import FormCheckControl from 'components/molecules/FormCheckControl';
import FormField from 'components/molecules/FormField';
import Label from 'components/atoms/Label';
import type {OnChangeInputEvent} from 'components/types';
import type {Props} from './types';
import RadioField from 'components/atoms/RadioField';
import type {Range} from 'store/widgets/data/types';
import RangeField from 'DiagramWidgetEditForm/components/SpeedometerForm/components/RangeField';
import {RANGES_TYPES} from 'store/widgets/data/constants';
import React, {Fragment, PureComponent} from 'react';
import styles from './styles.less';

export class RangesFieldset extends PureComponent<Props> {
	static defaultProps = {
		ranges: deepClone(DEFAULT_SPEEDOMETER_SETTINGS.ranges)
	};

	handleChangeRange = (index: number, range: Range) => {
		const {onChange, ranges} = this.props;

		ranges.data[index] = range;
		onChange(ranges);
	};

	handleChangeToRange = (index: number, value: string) => {
		const {onChange, ranges} = this.props;
		const nextIndex = index + 1;
		ranges.data[index] = {...ranges.data[index], to: value};

		if (ranges.data[nextIndex]) {
			ranges.data[nextIndex] = {...ranges.data[nextIndex], from: String(Number(value) + 1)};
		}

		onChange(ranges);
	};

	handleChangeType = ({name, value}: OnChangeInputEvent) => {
		const {onChange, ranges} = this.props;
		onChange({...ranges, data: [...DEFAULT_SPEEDOMETER_SETTINGS.ranges.data], [name]: value});
	};

	handleChangeUse = ({name, value}: OnChangeInputEvent) => {
		const {onChange, ranges} = this.props;
		onChange({...ranges, [name]: !value});
	};

	handleClickAddButton = () => {
		const {onChange, ranges} = this.props;
		const {data, type} = ranges;
		const lastTo = data[data.length - 1].to;

		if (lastTo && (type !== RANGES_TYPES.PERCENT || Number(lastTo) < 99)) {
			ranges.data.push({
				color: 'white',
				from: String(Number(lastTo)),
				to: ''
			});

			onChange(ranges);
		}
	};

	handleRemoveRange = (index: number) => {
		const {onChange, ranges} = this.props;

		if (ranges.data.length > 1) {
			ranges.data.splice(index, 1);
			onChange(ranges);
		}
	};

	renderAddRangeButton = () => (
		<ExtendButton
			active={true}
			className={styles.addRangeButton}
			onClick={this.handleClickAddButton}
			text="Добавить"
		/>
	);

	renderDataFields = () => {
		const {use} = this.props.ranges;

		if (use) {
			return (
				<Fragment>
					{this.renderTypeFields()}
					{this.renderFieldDivider()}
					{this.renderRangesFields()}
					{this.renderAddRangeButton()}
				</Fragment>
			);
		}
	};

	renderFieldDivider = () => <FieldDivider />;

	renderLabel = (label: string) => <Label className={styles.label}>{label}</Label>;

	renderRangeField = (range: Range, index: number, ranges: Array<Range>) => {
		const {type} = this.props.ranges;
		const removable = ranges.length > 1;

		return (
			<RangeField
				index={index}
				onChange={this.handleChangeRange}
				onChangeToRange={this.handleChangeToRange}
				onRemove={this.handleRemoveRange}
				range={range}
				removable={removable}
				type={type}
			/>
		);
	};

	renderRangesFields = () => (
		<Fragment>
			{this.renderLabel('Диапазоны')}
			{this.props.ranges.data.map(this.renderRangeField)}
		</Fragment>
	);

	renderTypeFields = () => {
		const {ABSOLUTE, PERCENT} = RANGES_TYPES;
		const {type} = this.props.ranges;

		return (
			<Fragment>
				{this.renderLabel('Тип шкалы')}
				<FormField>
					<RadioField
						checked={type === PERCENT}
						label="Проценты"
						name={FIELDS.type}
						onChange={this.handleChangeType}
						value={PERCENT}
					/>
				</FormField>
				<FormField>
					<RadioField
						checked={type === ABSOLUTE}
						label="Абсолютное значение"
						name={FIELDS.type}
						onChange={this.handleChangeType}
						value={ABSOLUTE}
					/>
				</FormField>
			</Fragment>
		);
	};

	renderUseCheckbox = () => {
		const {use} = this.props.ranges;

		return (
			<FormField>
				<FormCheckControl label="Использовать диапазоны">
					<Checkbox checked={use} name={FIELDS.use} onChange={this.handleChangeUse} value={use} />
				</FormCheckControl>
			</FormField>
		);
	};

	render () {
		return (
			<Fragment>
				{this.renderUseCheckbox()}
				{this.renderDataFields()}
			</Fragment>
		);
	}
}

export default RangesFieldset;
