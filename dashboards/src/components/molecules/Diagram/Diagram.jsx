// @flow
import {Chart, Summary, Table} from 'components/molecules';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import {WIDGET_VARIANTS} from 'utils/widget';

export class Diagram extends PureComponent<Props> {
	renderContent = () => {
		const {widget, diagram} = this.props;
		const {SUMMARY, TABLE} = WIDGET_VARIANTS;

		const types = {[SUMMARY]: Summary, [TABLE]: Table};
		const DiagramByType = types[widget.type.value] || Chart;

		return (
			<div className={styles.diagram}>
				<DiagramByType data={diagram.data} widget={widget} />
			</div>
		);
	};

	renderDiagram = () => {
		const {diagram} = this.props;

		return (
			<div className={styles.container}>
				{this.renderName()}
				{diagram.loading ? this.renderLoading() : this.renderContent()}
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
		const {data, loading} = this.props.diagram;

		if (loading || data) {
			return this.renderDiagram();
		}

		return this.renderError();
	}
}

export default Diagram;
