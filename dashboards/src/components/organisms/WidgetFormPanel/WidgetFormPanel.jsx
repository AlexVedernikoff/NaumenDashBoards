// @flow
import cn from 'classnames';
import {DesignTab, ParamsTab} from './Tabs';
import Footer from './Footer';
import type {Props} from 'containers/WidgetFormPanel/types';
import React, {Component, createContext} from 'react';
import type {State, TabParams} from './types';
import styles from './styles.less';
import {TABS} from './constants';
import {Title} from 'components/atoms';

const {LIST, VARIANTS} = TABS;
const tabs = {
	[VARIANTS.DESIGN]: DesignTab,
	[VARIANTS.PARAMS]: ParamsTab
};

export const FormContext = createContext({});

export class WidgetFormPanel extends Component<Props, State> {
	state = {
		currentTab: VARIANTS.PARAMS
	};

	handleClick = (currentTab: string) => () => this.setState({currentTab});

	renderForm = () => {
		const {handleSubmit} = this.props;

		return (
			<form onSubmit={handleSubmit} className={styles.form}>
				{this.renderHeader()}
				{this.renderTabList()}
				{this.renderTabContent()}
				<Footer />
			</form>
		);
	};

	renderHeader = () => {
		const {values} = this.props;

		return (
			<div className={styles.header}>
				<Title className={styles.title}>{values.name}</Title>
			</div>
		);
	};

	renderTabContent = () => {
		const {currentTab} = this.state;
		const Tab = tabs[currentTab];

		return (
			<div className={styles.tab}>
				<Tab />
			</div>
		);
	};

	renderTabList = () => <ul className={styles.tabList}>{LIST.map(this.renderTabListItem)}</ul>;

	renderTabListItem = (tab: TabParams) => {
		const {currentTab} = this.state;
		const {key, title} = tab;
		const liCN = cn({
			[styles.tabListItem]: true,
			[styles.tabListItemActive]: key === currentTab
		});

		return <li key={key} className={liCN} onClick={this.handleClick(key)}>{title}</li>;
	};

	render () {
		console.log(this.props.errors);
		return (
			<FormContext.Provider value={this.props}>
				{this.renderForm()}
			</FormContext.Provider>
		);
	}
}

export default WidgetFormPanel;
