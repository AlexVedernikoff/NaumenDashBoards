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
import type {Range, RangesTypes} from 'store/widgets/data/types';
import RangeField from 'components/organisms/SpeedometerWidgetForm/components/RangeField';
import RangesTypeFieldset from 'components/organisms/SpeedometerWidgetForm/components/RangesTypeFieldset';
import {RANGES_TYPES} from 'store/widgets/data/constants';
import React, {Fragment, PureComponent} from 'react';
import styles from './styles.less';

export class RangesFieldset extends PureComponent<Props> {
	handleChangeRange = (index: number, newRange: Range) => {
		const {name, onChange, value: ranges} = this.props;
		const newData = ranges.data.map((range, i) => i === index ? newRange : range);

		onChange(name, {...ranges, data: newData});
	};

	handleChangeType = (typeName: string, type: RangesTypes) => {
		const {name, onChange, value: ranges} = this.props;

		onChange(name, {...ranges, type: type});
	};

	handleChangeUse = ({value: use}: OnChangeEvent<boolean>) => {
		const {name, onChange, value: ranges} = this.props;

		onChange(name, {...ranges, use: !use});
	};

	handleClickAddButton = () => {
		const {name, onChange, value: ranges} = this.props;
		const {data, type} = ranges;
		const lastTo = data[data.length - 1].to;

		if (lastTo && (type !== RANGES_TYPES.PERCENT || Number(lastTo) < 99)) {
			const newRange = {
				color: 'white',
				from: String(Number(lastTo)),
				to: ''
			};

			onChange(name, {...ranges, data: [...data, newRange]});
		}
	};

	handleRemoveRange = (index: number) => {
		const {name, onChange, value: ranges} = this.props;
		const {data} = ranges;

		if (data.length > 1) {
			onChange(name, {
				...ranges,
				data: data.filter((r, i) => i !== index)
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
					{this.renderRangesTypeFieldset()}
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
				key={index}
				onChange={this.handleChangeRange}
				onRemove={this.handleRemoveRange}
				range={range}
				removable={removable}
				type={type}
			/>
		);
	};

	renderRangesFields = () => {
		const {data} = this.props.value;
		return (
			<Fragment>
				{this.renderLabel('Диапазоны')}
				{data.map(this.renderRangeField)}
			</Fragment>
		);
	};

	renderRangesTypeFieldset = () => <RangesTypeFieldset name={DIAGRAM_FIELDS.type} onChange={this.handleChangeType} value={this.props.value.type} />;

	renderUseCheckbox = () => {
		const {use} = this.props.value;

		return (
			<FormField small>
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
