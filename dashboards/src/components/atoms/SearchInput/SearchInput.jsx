// @flow
import cn from 'classnames';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class SearchInput extends PureComponent<Props, State> {
	static defaultProps = {
		className: '',
		forwardedRef: {
			current: null
		},
		value: ''
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

	handleClickRemoveIcon = () => {
		this.setState({value: ''});
		this.props.onChange('');
	};

	renderInput = () => {
		const {forwardedRef, onFocus} = this.props;
		const {value} = this.state;

		return (
			<input
				className={styles.input}
				onChange={this.handleChange}
				onClick={this.handleClick}
				onFocus={onFocus}
				placeholder="Поиск"
				ref={forwardedRef}
				value={value}
			/>
		);
	};

	renderInputContainer = () => (
		<div className={styles.inputContainer}>
			{this.renderInput()}
			{this.renderRemoveIcon()}
		</div>
	);

	renderRemoveIcon = () => (
		<div className={styles.removeIconContainer}>
			<Icon name={ICON_NAMES.REMOVE} onClick={this.handleClickRemoveIcon} />
		</div>
	);

	renderSearchIcon = () => <Icon className={styles.searchIcon} name={ICON_NAMES.SEARCH} />;

	render () {
		const {className} = this.props;

		return (
			<div className={cn(styles.container, className)}>
				{this.renderSearchIcon()}
				{this.renderInputContainer()}
			</div>
		);
	}
}

export default SearchInput;
