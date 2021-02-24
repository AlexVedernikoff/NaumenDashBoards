// @flow
import AbsolutePortal from 'components/molecules/AbsolutePortal';
import cn from 'classnames';
import ColorPicker from 'components/molecules/ColorPicker';
import type {Components, Props, State} from './types';
import React, {createRef, PureComponent} from 'react';
import type {Ref} from 'components/types';
import styles from './styles.less';
import Value from './components/Value';

export class ColorInput extends PureComponent<Props, State> {
	static defaultProps = {
		className: '',
		components: {},
		name: '',
		portable: true,
		value: '#4F5C70'
	};
	components: Components = this.getExtendedComponents(this.props.components);
	ref: Ref<'div'> = createRef();

	state = {
		showPicker: false
	};

	getExtendedComponents (components: $Shape<Components>) {
		return {
			Value,
			...components
		};
	}

	closePicker = () => this.setState({showPicker: false});

	handleChange = (value: string) => {
		const {name, onChange} = this.props;

		this.setState({showPicker: false});
		onChange({name, value});
	};

	handleClick = () => this.setState({showPicker: !this.state.showPicker});

	hidePicker = () => this.setState({showPicker: false});

	renderPicker = () => {
		const {value} = this.props;
		const {showPicker} = this.state;

		if (showPicker) {
			return (
				<ColorPicker className={styles.picker} onChange={this.handleChange} onClose={this.closePicker} value={value} />
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
		const {value} = this.props;
		const {Value} = this.components;

		return <Value forwardedRef={this.ref} onClick={this.handleClick} value={value} />;
	};

	render () {
		const {className, portable} = this.props;
		const picker = portable ? this.renderPortablePicker() : this.renderPicker();

		return (
			<span className={cn(className, styles.container)}>
				{this.renderValue()}
				{picker}
			</span>
		);
	}
}

export default ColorInput;
