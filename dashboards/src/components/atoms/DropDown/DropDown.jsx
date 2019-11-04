// @flow
import type {Item, Props} from './types';
import React, {Component} from 'react';
import styles from './styles.less';

export class DropDown extends Component<Props> {
	static defaultProps = {
		icon: null,
		list: [],
		title: ''
	};

	selectMenu = (event: SyntheticEvent<HTMLButtonElement>) => {
		const key = String(event.currentTarget.dataset.key);
		this.props.onClick(key);
	};

	renderButton = () => {
		const {icon, title} = this.props;

		return (
			<button className={styles.dropdownButton}>
				{icon || title}
			</button>
		);
	};

	renderContent = () => {
		const {list} = this.props;

		return (
			<div className={styles.dropdownContent}>
				{list.map(this.renderContentItem)}
			</div>
		);
	};

	renderContentItem = (item: Item) => (
		<button data-key={item.key} key={item.key} onClick={this.selectMenu}>
			{item.text}
		</button>
	);

	render () {
		return (
			<div className={styles.dropdown}>
				{this.renderButton()}
				{this.renderContent()}
			</div>
		);
	}
}

export default DropDown;
