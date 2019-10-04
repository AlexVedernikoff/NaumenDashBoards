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
		component: ParamsTab
	},
	{
		title: 'Стиль',
		component: DesignTab
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
		return tabList.map((tab, index) => {
				return <li key={`tab-${index}`} onClick={() => this.toggleTab(index)}>{tab.title}</li>;
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
