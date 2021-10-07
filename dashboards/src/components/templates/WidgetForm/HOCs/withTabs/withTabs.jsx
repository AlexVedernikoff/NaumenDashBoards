// @flow
import type {ChildrenFN, Props, State, Tab} from './types';
import cn from 'classnames';
import type {Props as ComponentProps} from 'components/templates/WidgetForm/types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export const withTabs = (WidgetForm: React$ComponentType<ComponentProps>): React$ComponentType<Props> => {
	return class TabbedWidgetForm extends PureComponent<Props, State> {
		state = {
			activeTab: this.props.tabs[0].key
		};

		handleClick = (activeTab: string) => () => this.setState({activeTab});

		renderTab = (tab: Tab) => {
			const {activeTab} = this.state;
			const {key, title} = tab;
			const liCN = cn({
				[styles.tab]: true,
				[styles.activeTab]: key === activeTab
			});

			return <li className={liCN} key={key} onClick={this.handleClick(key)}>{title}</li>;
		};

		renderTabContent = (children: ChildrenFN) => {
			const {activeTab} = this.state;

			return (
				<div className={styles.tabContent}>
					{children(activeTab)}
				</div>
			);
		};

		renderTabs = (tabs: Array<Tab>) => (
			<ul className={styles.tabs}>
				{tabs.map(this.renderTab)}
			</ul>
		);

		render () {
			const {children, tabs, ...rest} = this.props;

			return (
				<WidgetForm {...rest}>
					{this.renderTabs(tabs)}
					{this.renderTabContent(children)}
				</WidgetForm>
			);
		}
	};
};

export default withTabs;
