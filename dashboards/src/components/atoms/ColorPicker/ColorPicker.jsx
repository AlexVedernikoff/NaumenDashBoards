// @flow
import {Button} from 'components/atoms';
import type {Color, Props, State} from './types';
import React, {Component} from 'react';
import {SketchPicker} from 'react-color';
import styles from './styles.less';

export class ColorPicker extends Component<Props, State> {
	state = {
		itemColor: '',
		presetColors: [
			'#EA3223',
			'#999999',
			'#2C6FBA',
			'#4EAD5B',
			'#DE5D30',
			'#67369A',
			'#F6C142',
			'#4CAEEA',
			'#A1BA66',
			'#B02318',
			'#536130',
			'#DCA5A2',
			'#928A5B',
			'#9BB3D4',
			'#8C4A1C',
			'#FFFE55'
		]
	};

	componentDidMount () {
		const {currentColor} = this.props;
		this.setState({itemColor: currentColor});
	}

	handleChangeComplete = (): void => {
		const {onClick} = this.props;
		const {itemColor} = this.state;
		onClick(itemColor);
	};

	setColor = (color: Color): void => {
		this.setState({itemColor: color.hex});
	};

	render () {
		const {closePicker} = this.props;
		const {itemColor, presetColors} = this.state;

		return (
			<div className={styles.pickerWrap}>
				<SketchPicker
					color={itemColor}
					onChangeComplete={this.setColor}
					presetColors={presetColors}
				/>
				<div className={styles.pickerActions}>
					<Button type="button" onClick={closePicker}>Отмена</Button>
					<Button type="button" onClick={this.handleChangeComplete}>OK</Button>
				</div>
			</div>
		);
	}
}

export default ColorPicker;
