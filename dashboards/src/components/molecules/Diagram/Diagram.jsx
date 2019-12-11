// @flow
import {Chart, Summary, Table} from 'components/molecules';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';
import styles from './styles.less';
import {WIDGET_VARIANTS} from 'utils/widget';

export class Diagram extends PureComponent<Props> {
	renderContent = () => {
		const {diagram, widget} = this.props;
		const {SUMMARY, TABLE} = WIDGET_VARIANTS;

		if (diagram && diagram.data && !diagram.error) {
			const types = {[SUMMARY]: Summary, [TABLE]: Table};
			const DiagramByType = types[widget.type] || Chart;

			return (
				<Fragment>
					{this.renderName()}
					<div className={styles.diagram}>
						<DiagramByType data={diagram.data} widget={widget} />
					</div>
				</Fragment>
			);
		}

		return this.renderError();
	};

	renderDiagram = () => {
		const {diagram} = this.props;

		return (
			<div className={styles.container}>
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
		return this.renderDiagram();
	}
}

export default Diagram;
