// @flow
import cn from 'classnames';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import type {Props, State} from './types';
import React, {Component} from 'react';
import styles from './styles.less';
import withSubscriptions, {SUBSCRIBE_COMMANDS} from 'components/organisms/WidgetForm/HOCs/withSubscriptions/withSubscriptions';

export class InputForm extends Component<Props, State> {
	static defaultProps = {
		className: ''
	};

	state = {
		value: ''
	};

	componentDidMount () {
		const {subscribe, value} = this.props;

		this.setState({value: value.toString()});
		subscribe(SUBSCRIBE_COMMANDS.FORCE_SAVE, this.forceSave);
	}

	componentWillUnmount () {
		const {unsubscribe} = this.props;
		return unsubscribe(SUBSCRIBE_COMMANDS.FORCE_SAVE, this.forceSave);
	}

	forceSave = (): Promise<void> => new Promise(resolve => {
		this.handleClick(resolve);
	});

	handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
		const {value} = e.currentTarget;

		this.setState({value});
	};

	handleClick = (callback?: Function) => {
		const {onSubmit} = this.props;
		const {value} = this.state;

		if (value) {
			onSubmit(value, callback);
		}
	};

	handleSpecialKeysDown = (event: SyntheticKeyboardEvent<HTMLElement>) => {
		const {onClose} = this.props;

		if (event.key === 'Enter') {
			this.handleClick();
		} else if (event.key === 'Escape') {
			onClose();
		}
	};

	stopPropagation = (e: SyntheticMouseEvent<HTMLElement>) => {
		e.stopPropagation();
	};

	render () {
		const {className, forwardedRef, onClose} = this.props;
		const {value} = this.state;

		return (
			<div className={cn(styles.container, className)}>
				<input
					autoComplete="off"
					className={styles.input}
					onChange={this.handleChange}
					onKeyDown={this.handleSpecialKeysDown}
					ref={forwardedRef}
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

export default withSubscriptions(InputForm);
