// @flow
import type {ChartColorSettings} from 'store/widgets/data/types';
import ColorField from 'DiagramWidgetEditForm/components/ColorsBox/components/ColorField';
import type {OnChangeEvent} from 'components/types';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';

export class CustomBreakdownColorsSettings extends PureComponent<Props, State> {
	handleChangeColor = ({name, value: color}: OnChangeEvent<string>) => {
		const {onChange, value} = this.props;
		const index = Number(name);

		onChange({
			...value,
			colors: value.colors.map((colorSettings, i) => i === index ? {...colorSettings, color} : colorSettings)
		});
	};

	renderField = (colorSettings: ChartColorSettings, index: number) => {
		const {color, text} = colorSettings;
		const key = `${text}-${index}`;

		return (
			<ColorField
				key={key}
				label={text}
				name={index.toString()}
				onChange={this.handleChangeColor}
				value={color}
			/>
		);
	};

	render (): React$Node {
		return this.props.value.colors.map(this.renderField);
	}
}

export default CustomBreakdownColorsSettings;
