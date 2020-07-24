// @flow
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class SearchSelectInput extends PureComponent<Props, State> {
	static defaultProps = {
		forwardedRef: {
			current: null
		}
	};

	state = {
		value: ''
	};

	componentDidMount () {
		const {value} = this.props;
		const {value: stateValue} = this.state;

		if (value !== stateValue) {
			this.setState({value});
		}
	}

	handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
		const {onChange} = this.props;
		const {value} = e.currentTarget;

		this.setState({value});
		onChange(value);
	};

	handleClick = (e: SyntheticInputEvent<HTMLInputElement>) => e.stopPropagation();

	renderIcon = () => <Icon className={styles.icon} name={ICON_NAMES.SEARCH} />;

	renderInput = () => {
		const {forwardedRef} = this.props;
		const {value} = this.state;

		return (
			<input
				className={styles.input}
				onChange={this.handleChange}
				onClick={this.handleClick}
				placeholder="Поиск"
				ref={forwardedRef}
				value={value}
			/>
		);
	};

	render () {
		return (
			<div className={styles.container}>
				{this.renderIcon()}
				{this.renderInput()}
			</div>
		);
	}
}

export default SearchSelectInput;
