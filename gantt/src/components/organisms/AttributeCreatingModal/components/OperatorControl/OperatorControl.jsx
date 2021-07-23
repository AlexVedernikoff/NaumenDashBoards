// @flow
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import Option from './components/Option';
import type {Option as OptionType, Props, State} from './types';
import OutsideClickDetector from 'components/atoms/OutsideClickDetector';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class OperatorControl extends PureComponent<Props, State> {
	state = {
		active: false,
		currentOption: {
			icon: ICON_NAMES.ELLIPSIS,
			value: ''
		}
	};

	static getDerivedStateFromProps (props: Props, state: State) {
		const {options, value} = props;
		const {currentOption} = state;
		const newCurrentOption = options.find(o => o.value === value);

		if (currentOption.value !== value && newCurrentOption) {
			state.currentOption = newCurrentOption;
		}

		return state;
	}

	handleClick = (value: string) => {
		const {index, name, onSelect, type} = this.props;

		onSelect(index, name, value, type);
		this.hideList();
	};

	handleShowList = () => this.setState(state => ({active: !state.active}));

	hideList = () => this.setState({active: false});

	renderList = () => {
		const {options} = this.props;
		const {active} = this.state;

		if (active) {
			return (
				<div className={styles.list}>
					{options.map(this.renderOption)}
				</div>
			);
		}
	};

	renderOption = (option: OptionType) => {
		const {icon, value} = option;

		return <Option icon={icon} onClick={this.handleClick} value={value} />;
	};

	renderValue = () => {
		const {icon} = this.state.currentOption;

		return (
			<div className={styles.value} onClick={this.handleShowList}>
				<Icon name={icon} />
			</div>
		);
	};

	render () {
		return (
			<OutsideClickDetector onClickOutside={this.hideList}>
				<div className={styles.control}>
					{this.renderValue()}
					{this.renderList()}
				</div>
			</OutsideClickDetector>
		);
	}
}

export default OperatorControl;
