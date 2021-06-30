// @flow
import Checkbox from 'components/atoms/Checkbox';
import {DIAGRAM_FIELDS} from 'components/organisms/WidgetFormPanel/constants';
import ExtendButton from 'components/atoms/ExtendButton';
import FieldDivider from 'components/organisms/SpeedometerWidgetForm/components/FieldDivider';
import FormControl from 'components/molecules/FormControl';
import FormField from 'components/molecules/FormField';
import Label from 'components/atoms/Label';
import type {OnChangeEvent} from 'components/types';
import type {Props} from './types';
import RadioField from 'components/atoms/RadioField';
import type {Range, RangesType} from 'store/widgets/data/types';
import RangeField from 'components/organisms/SpeedometerWidgetForm/components/RangeField';
import {RANGES_TYPES} from 'store/widgets/data/constants';
import React, {Fragment, PureComponent} from 'react';
import styles from './styles.less';

export class RangesFieldset extends PureComponent<Props> {
	handleChangeRange = (index: number, newRange: Range) => {
		const {name, onChange, value} = this.props;
		const newData = value.data.map((range, i) => i === index ? newRange : range);

		onChange(name, {...value, data: newData});
	};

	handleChangeToRange = (index: number, to: string) => {
		const {name, onChange, value} = this.props;
		const newData = value.data.map((range, i) => {
			let newRange = range;

			if (i === index) {
				newRange = {...newRange, to};
			}

			if (i === index + 1) {
				newRange = {...newRange, from: String(Number(to) + 1)};
			}

			return newRange;
		});

		onChange(name, {...value, data: newData});
	};

	handleChangeType = ({value: type}: OnChangeEvent<RangesType>) => {
		const {name, onChange, value} = this.props;

		onChange(name, {...value, type});
	};

	handleChangeUse = ({value: use}: OnChangeEvent<boolean>) => {
		const {name, onChange, value} = this.props;

		onChange(name, {...value, use: !use});
	};

	handleClickAddButton = () => {
		const {name, onChange, value} = this.props;
		const {data, type} = value;
		const lastTo = data[data.length - 1].to;

		if (lastTo && (type !== RANGES_TYPES.PERCENT || Number(lastTo) < 99)) {
			const newRange = {
				color: 'white',
				from: String(Number(lastTo)),
				to: ''
			};

			onChange(name, {
				...value,
				data: [...value.data, newRange]
			});
		}
	};

	handleRemoveRange = (index: number) => {
		const {name, onChange, value} = this.props;

		if (value.data.length > 1) {
			onChange(name, {
				...value,
				data: value.data.filter((r, i) => i !== index)
			});
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
		const {use} = this.props.value;

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
		const {type} = this.props.value;
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
			{this.props.value.data.map(this.renderRangeField)}
		</Fragment>
	);

	renderTypeFields = () => {
		const {ABSOLUTE, PERCENT} = RANGES_TYPES;
		const {type} = this.props.value;

		return (
			<Fragment>
				{this.renderLabel('Тип шкалы')}
				<FormField>
					<RadioField
						checked={type === PERCENT}
						label="Проценты"
						name={DIAGRAM_FIELDS.type}
						onChange={this.handleChangeType}
						value={PERCENT}
					/>
				</FormField>
				<FormField>
					<RadioField
						checked={type === ABSOLUTE}
						label="Абсолютное значение"
						name={DIAGRAM_FIELDS.type}
						onChange={this.handleChangeType}
						value={ABSOLUTE}
					/>
				</FormField>
			</Fragment>
		);
	};

	renderUseCheckbox = () => {
		const {use} = this.props.value;

		return (
			<FormField>
				<FormControl label="Использовать диапазоны">
					<Checkbox checked={use} name={DIAGRAM_FIELDS.use} onChange={this.handleChangeUse} value={use} />
				</FormControl>
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
