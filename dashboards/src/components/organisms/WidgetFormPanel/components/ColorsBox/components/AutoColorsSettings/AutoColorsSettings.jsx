// @flow
import AbsolutePortal from 'components/molecules/AbsolutePortal';
import ColorPicker from 'components/molecules/ColorPicker';
import type {DivRef} from 'components/types';
import FormField from 'components/molecules/FormField';
import type {Props, State} from './types';
import React, {createRef, PureComponent} from 'react';
import styles from './styles.less';

export class AutoColorsSettings extends PureComponent<Props, State> {
	ref: DivRef = createRef();

	state = {
		colorIndex: 0,
		showPicker: false
	};

	changeColor = (newColor: string) => {
		const {onChange, value} = this.props;
		const {colorIndex} = this.state;
		const newColors = value.colors.map((color, index) => index === colorIndex ? newColor : color);

		this.setState({showPicker: false});
		onChange({
			...value,
			colors: newColors
		});
	};

	handleClickColor = (index: number) => () => {
		let {colorIndex, showPicker} = this.state;

		if (showPicker && colorIndex === index) {
			showPicker = false;
		} else if (colorIndex !== index) {
			showPicker = true;
		} else {
			showPicker = !showPicker;
		}

		this.setState({
			colorIndex: index,
			showPicker
		});
	};

	hidePicker = () => this.setState({showPicker: false});

	renderColor = (backgroundColor: string, index: number) => (
		<div className={styles.paletteItem} key={index} onClick={this.handleClickColor(index)} style={{backgroundColor}} />
	);

	renderColorPicker = () => {
		const {colors} = this.props.value;
		const {colorIndex, showPicker} = this.state;

		if (showPicker) {
			return (
				<AbsolutePortal elementRef={this.ref} onClickOutside={this.hidePicker}>
					<ColorPicker
						className={styles.picker}
						onChange={this.changeColor}
						onClose={this.hidePicker}
						value={colors[colorIndex]}
					/>
				</AbsolutePortal>
			);
		}
	};

	render () {
		const {colors} = this.props.value;

		return (
			<FormField>
				<div className={styles.paletteContainer} ref={this.ref}>
					{colors.map(this.renderColor)}
					{this.renderColorPicker()}
				</div>
			</FormField>
		);
	}
}

export default AutoColorsSettings;
