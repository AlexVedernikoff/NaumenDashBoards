// @flow
import type {Node} from 'react';
import type {State, TabParams} from './types';
import DesignTab from './DesignTab';
import ParamsTab from './ParamsTab';
import React, {Component} from 'react';
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
		currentTab: 0
	};

	toggleTab = (tab: number): void => {
		this.setState({
			currentTab: tab
		});
	};

	renderTabHead = (tab: TabParams): Node => {
		const {currentTab} = this.state;

		return <li
			key={tab.key}
			className={`${styles.listItem} ${currentTab === tab.key ? styles.listItemActive : ''}`}
			onClick={() => this.toggleTab(tab.key)}>
			{tab.title}
		</li>;
	};

	renderTabsHead = (): Node[] => {
		return tabList.map(this.renderTabHead);
	};

	renderFormTabs = (): Node => {
		const {currentTab} = this.state;
		const Tab = tabList[currentTab].component;

		return <Tab />;
	};

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
