// @flow
import Button, {VARIANTS} from 'components/atoms/Button';
import cn from 'classnames';
import type {Color, Props, State} from './types';
import React, {Component} from 'react';
import {SketchPicker} from 'react-color';
import styles from './styles.less';

export class ColorPicker extends Component<Props, State> {
	static defaultProps = {
		className: '',
		forwardedRef: null
	};

	state = {
		currentColor: '',
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

	static getDerivedStateFromProps (props: Props, state: State) {
		const {value} = props;

		if (value !== state.currentColor) {
			state.itemColor = value;
			state.currentColor = value;

			return state;
		}

		return null;
	}

	handleChangeComplete = (): void => {
		const {onChange} = this.props;
		const {itemColor} = this.state;
		onChange(itemColor);
	};

	setColor = (color: Color) => this.setState(() => ({itemColor: color.hex}));

	render () {
		const {className, forwardedRef, onClose, style} = this.props;
		const {itemColor, presetColors} = this.state;

		return (
			<div className={cn(styles.container, className)} ref={forwardedRef} style={style}>
				<div className={styles.pickerContainer}>
					<SketchPicker
						className={styles.picker}
						color={itemColor}
						onChangeComplete={this.setColor}
						presetColors={presetColors}
					/>
				</div>
				<div className={styles.buttonsContainer}>
					<Button onClick={this.handleChangeComplete} type="button">Применить</Button>
					<Button className={styles.cancelButton} onClick={onClose} type="button" variant={VARIANTS.ADDITIONAL}>Отмена</Button>
				</div>
			</div>
		);
	}
}

export default ColorPicker;
