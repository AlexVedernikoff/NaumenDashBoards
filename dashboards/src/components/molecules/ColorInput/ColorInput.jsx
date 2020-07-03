// @flow
import {AbsolutePortal, ColorPicker} from 'components/molecules';
import cn from 'classnames';
import {Input} from './components';
import type {Props, State} from './types';
import React, {createRef, PureComponent} from 'react';
import type {Ref} from 'components/types';
import styles from './styles.less';

export class ColorInput extends PureComponent<Props, State> {
	static defaultProps = {
		className: '',
		components: {},
		name: '',
		portable: true,
		value: '#4F5C70'
	};

	ref: Ref<'div'> = createRef();

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

	renderInput = () => {
		const {components, value} = this.props;
		const {Input: CustomInput} = components;
		const props = {
			onClick: this.handleClick,
			forwardedRef: this.ref,
			value
		};
		const Component = CustomInput || Input;

		return <Component {...props} />;
	};

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
		const {showPicker} = this.state;

		if (showPicker) {
			return (
				<AbsolutePortal elementRef={this.ref} onClickOutside={this.hidePicker}>
					{this.renderPicker()}
				</AbsolutePortal>
			);
		}

		return null;
	};

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
