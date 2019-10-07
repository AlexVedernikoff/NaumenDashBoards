// @flow
import type {State} from './types';
import type {Node} from 'react';
import React, {Component, createElement} from 'react';
import DesignTab from './DesignTab';
import ParamsTab from './ParamsTab';
import styles from './styles.less';

const tabList = [
	{
		title: 'Параметры',
		component: ParamsTab,
		key: 0
	},
	{
		title: 'Стиль',
		component: DesignTab,
		key: 1
	}
];

export class Tabs extends Component<{}, State> {
	state = {
		curerntTab: 0
	}

	toggleTab = (tab: number): void => {
		this.setState({
			curerntTab: tab
		});
	}

	renderTabsHead = (): Node[] => {
		const {curerntTab} = this.state;
		return tabList.map((tab) => {
				return <li
									key={tab.key}
									className={`${styles.listItem} ${curerntTab === tab.key ? styles.listItemActive : ''}`}
									onClick={() => this.toggleTab(tab.key)}>
									{tab.title}
								</li>;
			}
		);
	}

	renderFormTabs = (): Node => {
		const {curerntTab} = this.state;
		return createElement(tabList[curerntTab].component);
	}

	render () {
		return (
			<div className={styles.formWrap}>
				<ul className={styles.listWrap}>{this.renderTabsHead()}</ul>
				{this.renderFormTabs()}
			</div>
		);
	}
}

export default Tabs;
