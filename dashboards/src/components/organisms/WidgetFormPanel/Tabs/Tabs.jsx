// @flow
import type {Node} from 'react';
import type {State, TabParams} from './types';
import cn from 'classnames';
import DesignTab from './DesignTab';
import ParamsTab from './ParamsTab';
import React, {Component} from 'react';
import styles from './styles.less';

const params = 'params';
const design = 'design';

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

	getTab = (key: string) => {
		const tabs = {
			[params]: ParamsTab,
			[design]: DesignTab
		};

		return tabs[key];
	};

	handleClick = (tab: string) => (event: Event) => {
		this.toggleTab(tab);
	};

	toggleTab = (currentTab: string): void => {
		this.setState({currentTab});
	};

	renderFormTabs = (): Node => {
		const {currentTab} = this.state;
		const Tab = this.getTab(currentTab);
		return <Tab />;
	};

	renderTabHead = (tab: TabParams) => {
		const {currentTab} = this.state;
		const {key, title} = tab;
		const liCN = cn({
			[styles.listItem]: true,
			[styles.listItemActive]: key === currentTab
		});

		return (<li key={key} className={liCN} onClick={this.handleClick(key)}>{title}</li>);
	};

	renderTabsHead = (): Node => {
		return (
			<ul className={styles.listWrap}>
				{tabList.map(this.renderTabHead)}
			</ul>
		);
	};

	render () {
		return (
			<div className={styles.formWrap}>
				{this.renderTabsHead()}
				{this.renderFormTabs()}
			</div>
		);
	}
}

export default Tabs;
