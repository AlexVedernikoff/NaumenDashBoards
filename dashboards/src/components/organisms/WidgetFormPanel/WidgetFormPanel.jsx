// @flow
import cn from 'classnames';
import {DesignTab, ParamsTab} from './Tabs';
import Footer from './Footer';
import type {Props} from 'containers/WidgetFormPanel/types';
import React, {Component, createContext, createRef} from 'react';
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
export const formRef = createRef();

export class WidgetFormPanel extends Component<Props, State> {
	state = {
		currentTab: VARIANTS.PARAMS
	};

	handleClick = (currentTab: string) => () => this.setState({currentTab});

	renderForm = () => {
		const {handleSubmit} = this.props;

		return (
			<form className={styles.form} onSubmit={handleSubmit} ref={formRef}>
				{this.renderHeader()}
				{this.renderTabList()}
				{this.renderTabContent()}
				<Footer />
			</form>
		);
	};

	renderHeader = () => {
		const {values} = this.props;
		const name = values.name || 'Новый виджет';

		return (
			<div className={styles.header}>
				<Title className={styles.title}>{name}</Title>
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

		return <li className={liCN} key={key} onClick={this.handleClick(key)}>{title}</li>;
	};

	render () {
		return (
			<FormContext.Provider value={this.props}>
				{this.renderForm()}
			</FormContext.Provider>
		);
	}
}

export default WidgetFormPanel;
