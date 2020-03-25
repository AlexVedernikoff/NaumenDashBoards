// @flow
import {Button, Title} from 'components/atoms';
import cn from 'classnames';
import {DesignTab as StyleTab, ParamsTab} from './Tabs';
import type {DivRef} from 'components/types';
import type {Props, State, TabParams} from './types';
import React, {Component, createContext, createRef} from 'react';
import styles from './styles.less';
import {TABS} from './constants';
import {VARIANTS as BUTTON_VARIANTS} from 'components/atoms/Button/constants';

const {LIST, VARIANTS} = TABS;

export const FormContext: Object = createContext({});
export const formRef: DivRef = createRef();

export class WidgetFormPanel extends Component<Props, State> {
	state = {
		currentTab: VARIANTS.PARAMS
	};

	handleClick = (currentTab: string) => () => this.setState({currentTab});

	renderCancelButton = () => {
		const {cancelForm} = this.props;

		return (
			<Button className={styles.cancelButton} onClick={cancelForm} variant={BUTTON_VARIANTS.ADDITIONAL}>
				Отмена
			</Button>
		);
	};

	renderFooter = () => (
		<div className={styles.footer}>
			{this.renderSaveButton()}
			{this.renderCancelButton()}
		</div>
	);

	renderForm = () => {
		const {onSubmit} = this.props;

		return (
			<div className={styles.form} onSubmit={onSubmit} ref={formRef}>
				{this.renderHeader()}
				{this.renderTabList()}
				{this.renderTabContent()}
				{this.renderFooter()}
			</div>
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

	renderSaveButton = () => {
		const {onSubmit, personalDashboard, updating} = this.props;
		const {INFO, SIMPLE} = BUTTON_VARIANTS;
		const variant = personalDashboard ? INFO : SIMPLE;

		return (
			<Button disabled={updating} onClick={onSubmit} variant={variant}>
				Сохранить
			</Button>
		);
	};

	renderTabContent = () => {
		const {currentTab} = this.state;
		const tab = currentTab === VARIANTS.PARAMS ? <ParamsTab /> : <StyleTab />;

		return <div className={styles.tab}>{tab}</div>;
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
