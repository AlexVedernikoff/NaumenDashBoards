// @flow
import cn from 'classnames';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import type {Props, State} from './types';
import React, {createRef, PureComponent} from 'react';
import type {Ref} from 'components/types';
import styles from './styles.less';

export class SearchInput extends PureComponent<Props, State> {
	static defaultProps = {
		className: '',
		focusOnMount: false,
		value: ''
	};

	inputRef: Ref<'input'>;

	state = {
		value: ''
	};

	// eslint-disable-next-line react/no-deprecated
	componentWillMount () {
		this.inputRef = this.props.forwardedRef ?? createRef();
	}

	componentDidMount () {
		const {focusOnMount, value} = this.props;
		const {value: stateValue} = this.state;
		const input = this.inputRef?.current;

		if (value !== stateValue) {
			this.setState({value});
		}

		focusOnMount && input && input.focus();
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
		this.inputRef?.current && this.inputRef.current.focus();
	};

	renderInput = () => {
		const {onFocus} = this.props;
		const {value} = this.state;

		return (
			<input
				className={styles.input}
				onChange={this.handleChange}
				onClick={this.handleClick}
				onFocus={onFocus}
				placeholder="Поиск"
				ref={this.inputRef}
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

	renderRemoveIcon = () => {
		const {value} = this.state;

		if (value && value.length) {
			return (
				<div className={styles.removeIconContainer}>
					<Icon name={ICON_NAMES.REMOVE} onClick={this.handleClickRemoveIcon} />
				</div>
			);
		}

		return null;
	};

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
