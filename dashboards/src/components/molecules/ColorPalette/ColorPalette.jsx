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

	renderColor = (color: string, index: number) => (
		<div
			className={styles.itemPalette}
			key={index}
			onClick={this.openColorPicker(color, index)}
			style={{background: color}}
		/>
	);

	renderColorPalette = () => {
		const {colors} = this.props;

		return (
			<div className={styles.colorPaletteWrap}>
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
					<ColorPicker onClick={this.changeColor} closePicker={this.closePicker} currentColor={currentColor}/>
				</div>
			);
		}
	};

	render () {
		return this.renderColorPalette();
	}
}

export default ColorPalette;
