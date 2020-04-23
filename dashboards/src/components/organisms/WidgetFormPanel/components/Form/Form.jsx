// @flow
import {Button} from 'components/atoms';
import cn from 'classnames';
import type {Node} from 'react';
import type {Props, State, Tab} from './types';
import React, {Component, Fragment} from 'react';
import styles from './styles.less';
import {TABS} from './constants';
import {VARIANTS as BUTTON_VARIANTS} from 'components/atoms/Button/constants';

export class Form extends Component<Props, State> {
	state = {
		tab: TABS.PARAMS
	};

	componentDidMount () {
		const {schema, setSchema} = this.props;
		setSchema(schema);
	}

	handleClick = (tab: Tab) => () => this.setState({tab});

	handleClickSaveButton = () => {
		const {onSubmit, updateWidget} = this.props;
		onSubmit(updateWidget);
	};

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

	renderParamsTabContent = () => {
		const {
			attributes,
			context,
			errors,
			fetchAttributes,
			fetchRefAttributes,
			isNew,
			refAttributes,
			renderParamsTab,
			setDataFieldValue,
			setDataFieldValues,
			setFieldValue,
			sources,
			values
		} = this.props;
		const content = renderParamsTab({
			attributes,
			context,
			errors,
			fetchAttributes,
			fetchRefAttributes,
			isNew,
			refAttributes,
			setDataFieldValue,
			setDataFieldValues,
			setFieldValue,
			sources,
			values
		});

		return this.renderTabContent(content, TABS.PARAMS);
	}

	renderSaveButton = () => {
		const {personalDashboard, updating} = this.props;
		const {INFO, SIMPLE} = BUTTON_VARIANTS;
		const variant = personalDashboard ? INFO : SIMPLE;

		return (
			<Button disabled={updating} onClick={this.handleClickSaveButton} variant={variant}>
				Сохранить
			</Button>
		);
	};

	renderStyleTabContent = () => {
		const {renderStyleTab, setFieldValue, values} = this.props;
		const content = renderStyleTab({
			setFieldValue,
			values
		});

		return this.renderTabContent(content, TABS.STYLE);
	}

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
	}

	renderTabs = () => (
		<ul className={styles.tabs}>
			{this.renderTab('Параметры', TABS.PARAMS)}
			{this.renderTab('Стиль', TABS.STYLE)}
		</ul>
	);

	renderTitle = () => {
		const {values} = this.props;
		const name = values.name || 'Новый виджет';

		return (
			<div className={styles.titleContainer}>
				<div className={styles.title}>{name}</div>
			</div>
		);
	};

	render () {
		return (
			<Fragment>
				{this.renderTitle()}
				{this.renderTabs()}
				{this.renderParamsTabContent()}
				{this.renderStyleTabContent()}
				{this.renderFooter()}
			</Fragment>
		);
	}
}

export default Form;
