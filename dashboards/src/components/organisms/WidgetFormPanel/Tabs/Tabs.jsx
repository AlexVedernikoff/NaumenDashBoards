// @flow
import cn from 'classnames';
import DesignTab from './DesignTab';
import type {Node} from 'react';
import ParamsTab from './ParamsTab';
import React, {Component} from 'react';
import type {State, TabParams} from './types';
import styles from './styles.less';

const params = 'params';
const design = 'design';
const tabs = {
	[params]: ParamsTab,
	[design]: DesignTab
};
const tabList = [
	{
		key: params,
		title: 'Параметры'
	},
	{
		key: design,
		title: 'Стиль'
	}
];

export class Tabs extends Component<{}, State> {
	state = {
		currentTab: params
	};

	getTabContent = (key: string) => {
		return tabs[key];
	};

	handleClick = (tab: string) => (event: Event) => {
		this.toggleTab(tab);
	};

	toggleTab = (currentTab: string): void => {
		this.setState({currentTab});
	};

	renderTabContent = (): Node => {
		const {currentTab} = this.state;
		const Tab = this.getTabContent(currentTab);
		return <Tab />;
	};

	renderTab = (tab: TabParams) => {
		const {currentTab} = this.state;
		const {key, title} = tab;
		const liCN = cn({
			[styles.listItem]: true,
			[styles.listItemActive]: key === currentTab
		});

		return <li key={key} className={liCN} onClick={this.handleClick(key)}>{title}</li>;
	};

	renderTabs = (): Node => {
		const items = tabList.map(this.renderTab);
		return items.length ? <ul className={styles.list}>{items}</ul> : null;
	};

	render () {
		return (
			<div className={styles.formWrap}>
				{this.renderTabs()}
				{this.renderTabContent()}
			</div>
		);
	}
}

export default Tabs;
