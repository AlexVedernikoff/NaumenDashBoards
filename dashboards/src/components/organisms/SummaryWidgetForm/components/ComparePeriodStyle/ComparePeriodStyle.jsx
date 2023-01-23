// @flow
import CollapsableFormBox from 'components/molecules/CollapsableFormBox';
import ColorInput from 'components/molecules/ColorInput';
import {DEFAULT_COMPARE_PERIOD} from 'store/widgets/data/constants';
import {DIAGRAM_FIELDS} from 'components/organisms/WidgetFormPanel/constants';
import FormField from 'components/molecules/FormField';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import type {InputValue, OnChangeInputEvent} from 'components/types';
import NumberInput from 'components/atoms/NumberInput';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import t from 'localization';

export class ComparePeriodStyle extends PureComponent<Props> {
	static defaultProps = {
		value: DEFAULT_COMPARE_PERIOD
	};

	handleChange = (key: string, value: InputValue) => {
		const {name, onChange, value: comparePeriod} = this.props;
		const {format = DEFAULT_COMPARE_PERIOD.format} = comparePeriod;

		onChange(name, {
			...comparePeriod,
			format: {
				...format,
				[key]: value
			}
		});
	};

	handleChangeColorInput = ({name, value}: OnChangeInputEvent) => {
		this.handleChange(name, value);
	};

	handleChangeSymbolCount = ({value}: OnChangeInputEvent) => {
		this.handleChange(DIAGRAM_FIELDS.symbolCount, value ?? 0);
	};;

	render () {
		const {value: {show, allow, format = DEFAULT_COMPARE_PERIOD.format}} = this.props;

		if (show && allow) {
			const {down, symbolCount = 0, up} = format;
			return (
				<CollapsableFormBox title={t('ComparePeriodStyle::CompareWithPeriod')}>
					<FormField row>
						<Icon name={ICON_NAMES.ARROW_FULL_DOWN} />
						<ColorInput name={DIAGRAM_FIELDS.down} onChange={this.handleChangeColorInput} portable={true} value={down} />
						<Icon name={ICON_NAMES.ARROW_FULL_UP} />
						<ColorInput name={DIAGRAM_FIELDS.up} onChange={this.handleChangeColorInput} portable={true} value={up} />
					</FormField>
					<FormField label={t('ComparePeriodStyle::NumberSymbolsAfterComma')} small>
						<NumberInput max={5} min={0} onChange={this.handleChangeSymbolCount} value={symbolCount} />
					</FormField>
				</CollapsableFormBox>
			);
		}

		return null;
	}
}

export default ComparePeriodStyle;
