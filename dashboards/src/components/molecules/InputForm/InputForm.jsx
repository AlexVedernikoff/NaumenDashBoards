// @flow
import cn from 'classnames';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import type {Props, State} from './types';
import React, {Component} from 'react';
import styles from './styles.less';

export class InputForm extends Component<Props, State> {
	static defaultProps = {
		className: ''
	};

	state = {
		value: ''
	};

	componentDidMount () {
		const {value} = this.props;

		this.setState({value: value.toString()});
	}

	handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
		const {value} = e.currentTarget;

		this.setState({value});
	};

	handleClick = () => {
		const {onSubmit} = this.props;
		const {value} = this.state;

		if (value) {
			onSubmit(value);
		}
	};

	stopPropagation = (e: SyntheticMouseEvent<HTMLElement>) => {
		e.stopPropagation();
	};

	render () {
		const {className, onClose} = this.props;
		const {value} = this.state;

		return (
			<div className={cn(styles.container, className)}>
				<input
					autoComplete="off"
					className={styles.input}
					onChange={this.handleChange}
					required
					type="text"
					value={value}
				/>
				<Icon
					className={styles.successIcon}
					name={ICON_NAMES.ACCEPT}
					onClick={this.handleClick}
				/>
				<Icon
					className={styles.cancelIcon}
					name={ICON_NAMES.CANCEL}
					onClick={onClose}
				/>
			</div>
		);
	}
}

export default InputForm;
