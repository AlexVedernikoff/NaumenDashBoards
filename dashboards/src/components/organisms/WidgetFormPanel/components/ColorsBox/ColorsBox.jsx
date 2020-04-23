// @flow
import {AbsolutePortal, ColorPicker, ToggableFormBox} from 'components/molecules';
import {DEFAULT_COLORS} from 'utils/chart/constants';
import type {DivRef} from 'components/types';
import {formRef} from 'WidgetFormPanel';
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
	}

	handleClosePicker = () => this.setState({showPicker: false});

	renderColor = (backgroundColor: string, index: number) => (
		<div className={styles.paletteItem} key={index} onClick={this.handleClickColor(index)} style={{backgroundColor}} />
	);

	renderColorPicker = () => {
		const {data} = this.props;
		const {colorIndex, showPicker} = this.state;
		const {current: element} = this.ref;
		const {current: container} = formRef;

		if (showPicker && element && container) {
			return (
				<AbsolutePortal container={container} elem={element}>
					<div className={styles.picker}>
						<ColorPicker
							onChange={this.changeColor}
							onClose={this.handleClosePicker}
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
			<div className={styles.paletteContainer} ref={this.ref}>
				{data.map(this.renderColor)}
				{this.renderColorPicker()}
			</div>
		);
	};

	render () {
		return (
			<ToggableFormBox title="Цвета диаграммы">
				{this.renderColors()}
			</ToggableFormBox>
		);
	}
}

export default ColorsBox;
