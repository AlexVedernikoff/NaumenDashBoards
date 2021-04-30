// @flow
import cn from 'classnames';
import {DEFAULT_WIDGET_LAYOUT_SIZE} from 'store/dashboard/layouts/constants';
import type {Node} from 'react';
import type {Props, State, Tab} from './types';
import React, {Component} from 'react';
import styles from './styles.less';
import {TABS} from './constants';
import WidgetForm from 'components/templates/WidgetForm';

export class Form extends Component<Props, State> {
	static defaultProps = {
		layoutSize: DEFAULT_WIDGET_LAYOUT_SIZE
	};

	state = {
		tab: TABS.PARAMS
	};

	componentDidMount () {
		const {schema, setSchema} = this.props;

		setSchema(schema);
		this.setWidgetLayoutSize();
	}

	handleClick = (tab: Tab) => () => this.setState({tab});

	handleSubmit = () => {
		const {onSubmit, onSubmitCallback, updateWidget} = this.props;

		onSubmit(updateWidget, onSubmitCallback);
	};

	setWidgetLayoutSize = () => {
		const {isNew, layoutSize, onChangeLayoutSize} = this.props;

		isNew && onChangeLayoutSize(layoutSize);
	};

	renderOptionsTabContent = () => {
		const {
			fetchAttributes,
			renderOptionsTab,
			setDataFieldValue,
			setFieldValue,
			values
		} = this.props;

		const content = renderOptionsTab({
			fetchAttributes,
			setDataFieldValue,
			setFieldValue,
			values
		});

		return this.renderTabContent(content, TABS.OPTIONS);
	};

	renderParamsTabContent = () => {
		const {
			context,
			dashboards,
			fetchDashboards,
			isNew,
			layoutMode,
			personalDashboard,
			renderParamsTab,
			user
		} = this.props;

		const content = renderParamsTab({
			context,
			dashboards,
			fetchDashboards,
			isNew,
			layoutMode,
			personalDashboard,
			user
		});

		return this.renderTabContent(content, TABS.PARAMS);
	};

	renderStyleTabContent = () => {
		const {renderStyleTab, setDataFieldValue, setFieldValue, values, widget} = this.props;
		const content = renderStyleTab({
			setDataFieldValue,
			setFieldValue,
			values,
			widget
		});

		return this.renderTabContent(content, TABS.STYLE);
	};

	renderTab = (title: string, key: Tab) => {
		const {tab} = this.state;
		const liCN = cn({
			[styles.tab]: true,
			[styles.activeTab]: key === tab
		});

		return <li className={liCN} onClick={this.handleClick(key)}>{title}</li>;
	};

	renderTabContent = (content: Node, key: Tab) => {
		const {tab} = this.state;
		const tabCN = cn({
			[styles.tabContent]: true,
			[styles.showTabContent]: tab === key
		});

		return (
			<div className={tabCN}>
				{content}
			</div>
		);
	};

	renderTabs = () => (
		<ul className={styles.tabs}>
			{this.renderTab('Параметры', TABS.PARAMS)}
			{this.renderTab('Стиль', TABS.STYLE)}
			{this.renderTab('Опции', TABS.OPTIONS)}
		</ul>
	);

	render () {
		const {cancelForm, forwardedRef, saving, widget} = this.props;

		return (
			<WidgetForm
				forwardedRef={forwardedRef}
				onCancel={cancelForm}
				onSubmit={this.handleSubmit}
				title={widget.name}
				updating={saving.loading}
			>
				{this.renderTabs()}
				{this.renderParamsTabContent()}
				{this.renderStyleTabContent()}
				{this.renderOptionsTabContent()}
			</WidgetForm>
		);
	}
}

export default Form;
