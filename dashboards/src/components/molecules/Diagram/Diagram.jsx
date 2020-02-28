// @flow
import {Chart, Summary, Table} from 'components/molecules';
import type {Props} from './types';
import React, {Component, Fragment} from 'react';
import styles from './styles.less';
import {WIDGET_VARIANTS} from 'utils/widget';

export class Diagram extends Component<Props> {
	shouldComponentUpdate (nextProps: Props) {
		const {buildData: {loading: nextLoading, updateDate: nextUpdateDate}} = nextProps;
		const {buildData: {loading: prevLoading, updateDate: prevUpdateDate}} = this.props;

		return nextUpdateDate !== prevUpdateDate || nextLoading !== prevLoading;
	}

	resolveDiagram = (type: string) => {
		const {SUMMARY, TABLE} = WIDGET_VARIANTS;

		switch (type) {
			case SUMMARY:
				return Summary;
			case TABLE:
				return Table;
			default:
				return Chart;
		}
	};

	renderContent = () => {
		const {buildData} = this.props;
		const {data, error} = buildData;

		if (data && !error) {
			return (
				<Fragment>
					{this.renderName()}
					{this.renderDiagramByType()}
				</Fragment>
			);
		}

		return this.renderError();
	};

	renderDiagram = () => {
		const {buildData} = this.props;

		return (
			<div className={styles.container}>
				{buildData.loading ? this.renderLoading() : this.renderContent()}
			</div>
		);
	};

	renderDiagramByType = () => {
		const {buildData, onUpdate, widget} = this.props;
		const {showName, type} = widget;
		const className = showName ? styles.diagramWithName : styles.diagram;
		const Diagram = this.resolveDiagram(type);

		return (
			<div className={className}>
				<Diagram buildData={buildData.data} onUpdate={onUpdate} widget={widget} />
			</div>
		);
	};

	renderError = () => <p>Ошибка загрузки данных. Измените параметры построения.</p>;

	renderLoading = () => <p>Загрузка...</p>;

	renderName = () => {
		const {widget} = this.props;
		const {diagramName, showName} = widget;

		if (showName) {
			return (
				<div className={styles.name}>
					{diagramName}
				</div>
			);
		}
	};

	render () {
		return this.renderDiagram();
	}
}

export default Diagram;
