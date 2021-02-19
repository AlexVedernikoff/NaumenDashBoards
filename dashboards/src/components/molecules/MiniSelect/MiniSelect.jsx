// @flow
import cn from 'classnames';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import type {Node} from 'react';
import type {Option, Props, State} from './types';
import OutsideClickDetector from 'components/atoms/OutsideClickDetector';
import React, {Fragment, PureComponent} from 'react';
import styles from './styles.less';

export class MiniSelect extends PureComponent<Props, State> {
	static defaultProps = {
		isDisabled: false,
		showCaret: true,
		value: ''
	};

	state = {
		active: false,
		currentOption: {
			label: '[Не выбрано]',
			value: ''
		}
	};

	static getDerivedStateFromProps (props: Props, state: State) {
		const {options, value} = props;
		const {currentOption} = state;

		if (currentOption.value !== value) {
			state.currentOption = options.find(o => o.value === value) || options[0];
		}

		return state;
	}

	handleClick = (e: SyntheticMouseEvent<HTMLDivElement>) => {
		const {name, onSelect} = this.props;

		onSelect(name, e.currentTarget.dataset.value);
		this.hideList();
	};

	handleShowList = () => this.setState(state => ({active: !state.active}));

	hideList = () => this.setState({active: false});

	isNotCurrent = (option: Option) => option.value !== this.state.currentOption.value;

	renderCaret = () => this.props.showCaret && <Icon name={ICON_NAMES.CHEVRON} />;

	renderLabel = (label: string) => {
		const {renderLabel} = this.props;

		if (renderLabel && typeof renderLabel === 'function') {
			return renderLabel(label);
		}

		return <div className={styles.label}>{label}</div>;
	};

	renderList = () => {
		const {active} = this.state;

		if (active) {
			return (
				<div className={styles.list}>
					{this.renderValue()}
					{this.renderOptions()}
				</div>
			);
		}
	};

	renderOption = (option: Option) => {
		const {label, value} = option;

		return (
			<div className={styles.option} data-value={value} key={value} onClick={this.handleClick}>
				{this.renderLabel(label)}
			</div>
		);
	};

	renderOptions = (): Array<Node> => this.props.options.filter(this.isNotCurrent).map(this.renderOption);

	renderSelect = () => {
		const {isDisabled} = this.props;
		const CNSelect = [styles.select];

		if (isDisabled) {
			CNSelect.push(styles.disabled);
		}

		return (
			<OutsideClickDetector onClickOutside={this.hideList}>
				<div className={cn(CNSelect)}>
					{this.renderValue()}
					{this.renderList()}
				</div>
			</OutsideClickDetector>
		);
	};

	renderValue = () => {
		const {renderValue, tip} = this.props;
		const {active} = this.state;
		const className = styles.valueContainer;
		const children = this.renderValueContent();
		let props = {
			className,
			onClick: this.handleShowList
		};

		if (renderValue) {
			props = {
				...props,
				active,
				children
			};

			return renderValue(props);
		}

		return (
			<div {...props} title={tip}>
				{children}
			</div>
		);
	};

	renderValueContent = () => {
		const {currentOption} = this.state;

		return (
			<Fragment>
				{this.renderLabel(currentOption.label)}
				{this.renderCaret()}
			</Fragment>
		);
	};

	render () {
		return this.renderSelect();
	}
}

export default MiniSelect;
