// @flow
import ColorField from 'DiagramWidgetEditForm/components/ColorsBox/components/ColorField';
import {equalLabels, getBreakdownColors} from 'utils/chart/helpers';
import {getSeparatedLabel} from 'store/widgets/buildData/helpers';
import type {OnChangeEvent} from 'components/types';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import {SEPARATOR} from 'store/widgets/buildData/constants';

export class CustomBreakdownColorsSettings extends PureComponent<Props, State> {
	state = {
		colors: []
	};

	componentDidMount () {
		this.setColors();
	}

	componentDidUpdate (prevProps: Props) {
		const {labels: prevLabels, value: prevValue} = prevProps;
		const {labels, value} = this.props;

		if (prevLabels !== labels || prevValue.colors !== value.colors) {
			this.setColors();
		}
	}

	handleChangeColor = ({name, value: color}: OnChangeEvent<string>) => {
		const {labels, onChange, value} = this.props;
		const {colors} = value;
		const label = labels[Number(name)];
		const colorSettingsIndex = colors.findIndex(({key}) => equalLabels(key, label));
		const newColors = colorSettingsIndex !== -1
			? colors.map((colorSettings, i) => i === colorSettingsIndex ? {...colorSettings, color} : colorSettings)
			: [...colors, {color, key: label}];

		onChange({
			...value,
			colors: newColors
		});
	};

	setColors = () => {
		const {defaultColors, labels, value} = this.props;

		this.setState({
			colors: getBreakdownColors(value, labels, defaultColors)
		});
	};

	renderField = (label: string, index: number) => {
		const {colors} = this.state;
		const key = `${label}-${index}`;

		return (
			<ColorField
				key={key}
				label={getSeparatedLabel(label, SEPARATOR)}
				name={index.toString()}
				onChange={this.handleChangeColor}
				value={colors[index]}
			/>
		);
	};

	render (): React$Node {
		return this.props.labels.map(this.renderField);
	}
}

export default CustomBreakdownColorsSettings;
