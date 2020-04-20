// @flow
import {AbsolutePortal, ColorPicker} from 'components/molecules';
import cn from 'classnames';
import type {DivRef} from 'components/types';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import {OutsideClickDetector} from 'components/atoms';
import type {Props, State} from './types';
import React, {createRef, PureComponent} from 'react';
import styles from './styles.less';

export class ColorInput extends PureComponent<Props, State> {
	static defaultProps = {
		className: '',
		portable: true,
		value: '#4F5C70'
	};

	ref: DivRef = createRef();

	state = {
		showPicker: false
	};

	closePicker = () => this.setState({showPicker: false});

	handleChange = (value: string) => {
		const {name, onChange} = this.props;

		this.setState({showPicker: false});
		onChange({name, value});
	};

	handleClick = () => this.setState({showPicker: !this.state.showPicker});

	hidePicker = () => this.setState({showPicker: false});

	renderButton = () => (
		<button className={styles.button}>
			<Icon name={ICON_NAMES.CARET} />
		</button>
	);

	renderInput = () => (
		<div className={styles.input} onClick={this.handleClick} ref={this.ref}>
			{this.renderValue()}
			{this.renderButton()}
		</div>
	);

	renderPicker = () => {
		const {value} = this.props;
		const {showPicker} = this.state;

		if (showPicker) {
			return (
				<div className={styles.picker}>
					<ColorPicker onChange={this.handleChange} onClose={this.closePicker} value={value} />
				</div>
			);
		}

		return null;
	};

	renderPortablePicker = () => {
		const {container} = this.props;
		const {showPicker} = this.state;
		const {current: element} = this.ref;

		if (showPicker && element) {
			return (
				<AbsolutePortal container={container} elem={element}>
					<OutsideClickDetector onClickOutside={this.hidePicker}>
						{this.renderPicker()}
					</OutsideClickDetector>
				</AbsolutePortal>
			);
		}

		return null;
	}

	renderValue = () => {
		const {value: backgroundColor} = this.props;
		return <span className={styles.value} style={{backgroundColor}} />;
	};

	render () {
		const {className, portable} = this.props;
		const picker = portable ? this.renderPortablePicker() : this.renderPicker();

		return (
			<span className={cn(className, styles.container)}>
				{this.renderInput()}
				{picker}
			</span>
		);
	}
}

export default ColorInput;
