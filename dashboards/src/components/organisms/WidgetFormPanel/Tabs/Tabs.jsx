// @flow
import type {Node} from 'react';
import type {State, TabParams} from './types';
import DesignTab from './DesignTab';
import ParamsTab from './ParamsTab';
import React, {Component} from 'react';
import styles from './styles.less';

const params = 'params';
const design = 'design';

const tabList = [
	{
		title: 'Параметры',
		key: params
	},
	{
		title: 'Стиль',
		key: design
	}
];

export class Tabs extends Component<{}, State> {
	state = {
		currentTab: params
	};

	getTab = (key: string) => {
		const tabs = {
			[params]: ParamsTab,
			[design]: DesignTab
		};

		return tabs[key];
	};

	toggleTab = (currentTab: string): void => {
		this.setState({currentTab});
	};

	renderTabHead = (tab: TabParams) => {
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
		const Tab = this.getTab(currentTab);
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
