// @flow
import {addElement, replaceElement} from 'helpers';
import ColorField from 'WidgetFormPanel/components/ColorsBox/components/ColorField';
import {equalLabels, getBreakdownColors} from 'utils/recharts/helpers';
import {getSeparatedLabel} from 'store/widgets/buildData/helpers';
import type {OnChangeEvent} from 'components/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';

export class CustomBreakdownColorsSettings extends PureComponent<Props> {
	componentDidMount () {
		const {labels, value} = this.props;

		if (value.colors.length !== labels.length) {
			this.setColors();
		}
	}

	componentDidUpdate (prevProps: Props) {
		const {labels: prevLabels} = prevProps;
		const {labels, value} = this.props;

		if (prevLabels !== labels || value.colors.length !== labels.length) {
			this.setColors();
		}
	}

	handleChangeColor = ({name, value: color}: OnChangeEvent<string>) => {
		const {labels, onChange, value} = this.props;
		const {colors} = value;
		const label = labels[Number(name)];
		const colorSettingsIndex = colors.findIndex(({key}) => equalLabels(key, label));
		const newColors = colorSettingsIndex === -1
			? addElement(colors, {color, key: label})
			: replaceElement(colors, colorSettingsIndex, {...colors[colorSettingsIndex], color});

		onChange({
			...value,
			colors: newColors
		});
	};

	setColors = () => {
		const {defaultColors, labels, onChange, value} = this.props;
		const colors = getBreakdownColors(value, labels, defaultColors);

		onChange({
			...value,
			colors: labels.map((key, index) => ({color: colors[index], key}))
		});
	};

	renderField = (label: string, index: number) => {
		const {colors, defaultColor} = this.props.value;
		const value = colors[index]?.color || defaultColor;
		const key = `${label}-${index}`;

		return (
			<ColorField
				key={key}
				label={getSeparatedLabel(label)}
				name={index.toString()}
				onChange={this.handleChangeColor}
				value={value}
			/>
		);
	};

	render (): React$Node {
		return this.props.labels.map(this.renderField);
	}
}

export default CustomBreakdownColorsSettings;
