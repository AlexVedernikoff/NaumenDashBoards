// @flow
import Footer from './Footer';
import ParamsTab from './Tabs/ParamsTab';
import type {Props} from 'containers/WidgetFormPanel/types';
import React, {Component, createContext} from 'react';
import styles from './styles.less';
import {Tabs} from './Tabs';

export const FormContext = createContext({});

export class WidgetFormPanel extends Component<Props> {
	renderHeader = () => {
		const {values} = this.props;

		return (
			<div className={styles.header}>
				<Title className={styles.title}>{values.name}</Title>
			</div>
		);
	};

	renderMain = () => <Tabs />;

	renderFooter = () => (
		<div className={styles.footer}>
			{this.renderError()}
			{this.renderControlButtons()}
		</div>
	);

	renderForm = () => {
		const {handleSubmit} = this.props;

		return (
			<form onSubmit={handleSubmit} className={styles.form}>
				{this.renderHeader()}
				<ParamsTab />
				<Footer />
			</form>
		);
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
