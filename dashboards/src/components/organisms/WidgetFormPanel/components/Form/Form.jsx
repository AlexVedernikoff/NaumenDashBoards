// @flow
import cn from 'classnames';
import {DEFAULT_WIDGET_LAYOUT_SIZE, TABS} from './constants';
import type {Node} from 'react';
import type {Props, State, Tab} from './types';
import React, {Component} from 'react';
import styles from './styles.less';
import {WidgetForm} from 'components/templates';

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
		const {onSubmit, updateWidget} = this.props;
		onSubmit(updateWidget);
	};

	setWidgetLayoutSize = () => {
		const {isNew, layoutSize, onChangeLayoutSize} = this.props;
		isNew && onChangeLayoutSize(layoutSize);
	};

	renderParamsTabContent = () => {
		const {
			context,
			isNew,
			layoutMode,
			personalDashboard,
			renderParamsTab,
			user
		} = this.props;

		const content = renderParamsTab({
			context,
			isNew,
			layoutMode,
			personalDashboard,
			user
		});

		return this.renderTabContent(content, TABS.PARAMS);
	};

	renderStyleTabContent = () => {
		const {renderStyleTab, setFieldValue, values} = this.props;
		const content = renderStyleTab({
			setFieldValue,
			values
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
			</WidgetForm>
		);
	}
}

export default Form;
