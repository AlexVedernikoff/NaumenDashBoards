// @flow
import Button, {VARIANTS} from 'components/atoms/Button';
import cn from 'classnames';
import type {Color, Props, State} from './types';
import {DEFAULT_CHART_COLORS} from 'store/widgets/data/constants';
import React, {Component} from 'react';
import {SketchPicker} from 'react-color';
import styles from './styles.less';
import T from 'components/atoms/Translation';

export class ColorPicker extends Component<Props, State> {
	static defaultProps = {
		className: '',
		forwardedRef: null
	};

	state = {
		currentColor: '',
		itemColor: '',
		presetColors: DEFAULT_CHART_COLORS
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
					<Button onClick={this.handleChangeComplete} type="button">
						<T text="ColorPicker::Apply" />
					</Button>
					<Button className={styles.cancelButton} onClick={onClose} type="button" variant={VARIANTS.ADDITIONAL}>
						<T text="ColorPicker::Cancel" />
					</Button>
				</div>
			</div>
		);
	}
}

export default ColorPicker;
