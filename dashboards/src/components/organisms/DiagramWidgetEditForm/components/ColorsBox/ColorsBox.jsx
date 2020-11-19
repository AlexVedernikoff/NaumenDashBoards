// @flow
import {AbsolutePortal, CollapsableFormBox, ColorPicker, FormField} from 'components/molecules';
import {DEFAULT_COLORS} from 'utils/chart/constants';
import type {DivRef} from 'components/types';
import type {Props, State} from './types';
import React, {createRef, PureComponent} from 'react';
import styles from './styles.less';

export class ColorsBox extends PureComponent<Props, State> {
	static defaultProps = {
		data: DEFAULT_COLORS
	};

	ref: DivRef = createRef();

	state = {
		colorIndex: 0,
		showPicker: false
	};

	changeColor = (color: string) => {
		const {data, name, onChange} = this.props;
		const {colorIndex} = this.state;
		data[colorIndex] = color;

		this.setState({showPicker: false});
		onChange(name, data);
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
		const {data} = this.props;
		const {colorIndex, showPicker} = this.state;

		if (showPicker) {
			return (
				<AbsolutePortal elementRef={this.ref} onClickOutside={this.hidePicker}>
					<div className={styles.picker}>
						<ColorPicker
							onChange={this.changeColor}
							onClose={this.hidePicker}
							value={data[colorIndex]}
						/>
					</div>
				</AbsolutePortal>
			);
		}
	};

	renderColors = () => {
		const {data} = this.props;

		return (
			<FormField>
				<div className={styles.paletteContainer} ref={this.ref}>
					{data.map(this.renderColor)}
					{this.renderColorPicker()}
				</div>
			</FormField>
		);
	};

	render () {
		return (
			<CollapsableFormBox title="Цвета диаграммы">
				{this.renderColors()}
			</CollapsableFormBox>
		);
	}
}

export default ColorsBox;
