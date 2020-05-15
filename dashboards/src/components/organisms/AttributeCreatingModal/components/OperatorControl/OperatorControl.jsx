// @flow
import {MeetBallIcon} from 'icons/controls';
import {Option} from './components';
import type {Option as OptionType, Props, State} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class OperatorControl extends PureComponent<Props, State> {
	state = {
		active: false,
		currentOption: {
			icon: MeetBallIcon,
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
		const {icon: Icon} = this.state.currentOption;

		return (
			<div className={styles.value} onClick={this.handleShowList}>
				<Icon />
			</div>
		);
	};

	render () {
		return (
			<div className={styles.control} onBlur={this.hideList} tabIndex={0}>
				{this.renderValue()}
				{this.renderList()}
			</div>
		);
	}
}

export default OperatorControl;
