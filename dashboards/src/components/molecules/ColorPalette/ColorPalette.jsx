// @flow
import {ColorPicker} from 'components/molecules';
import type {Props, State} from './types';
import React, {Component} from 'react';
import styles from './styles.less';

export class ColorPalette extends Component<Props, State> {
	state = {
		colorIndex: 0,
		currentColor: '',
		showPalette: false
	};

	changeColor = (itemColor: string) => {
		const {colorIndex} = this.state;
		const {onChange} = this.props;

		this.setState({showPalette: false});
		onChange(colorIndex, itemColor);
	};

	closePicker = () => this.setState({showPalette: false});

	openColorPicker = (color: string, index: number) => () => this.setState({
		colorIndex: index,
		currentColor: color,
		showPalette: true
	});

	renderColor = (backgroundColor: string, index: number) => (
		<div
			className={styles.paletteItem}
			key={index}
			onClick={this.openColorPicker(backgroundColor, index)}
			style={{backgroundColor}}
		/>
	);

	renderColorPalette = () => {
		const {colors} = this.props;

		return (
			<div className={styles.paletteContainer}>
				{colors.map(this.renderColor)}
				{this.renderColorPicker()}
			</div>
		);
	};

	renderColorPicker = () => {
		const {currentColor, showPalette} = this.state;

		if (showPalette) {
			return (
				<div className={styles.palettePicker}>
					<ColorPicker onChange={this.changeColor} onClose={this.closePicker} value={currentColor} />
				</div>
			);
		}
	};

	render () {
		return this.renderColorPalette();
	}
}

export default ColorPalette;
