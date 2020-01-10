// @flow
import {MeetBallIcon} from 'icons/controls';
import type {Option, Props, State} from './types';
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

	handleClick = (e: SyntheticMouseEvent<HTMLDivElement>) => {
		const {name, onSelect} = this.props;

		onSelect(name, e.currentTarget.dataset.value);
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

	renderOption = (option: Option) => {
		const {icon: Icon, value} = option;

		return (
			<div className={styles.option} key={value}>
				<Icon data-value={value} onClick={this.handleClick}/>
			</div>
		);
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
