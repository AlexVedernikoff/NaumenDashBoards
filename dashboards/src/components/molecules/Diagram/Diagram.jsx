// @flow
import {Chart, Summary, Table} from 'components/molecules';
import type {Props} from './types';
import React, {Fragment, Component} from 'react';
import styles from './styles.less';
import {WIDGET_VARIANTS} from 'utils/widget';

export class Diagram extends Component<Props> {
	shouldComponentUpdate (nextProps: Props) {
		const {buildData: {updateDate: nextUpdateDate, loading: nextLoading}} = nextProps;
		const {buildData: {updateDate: prevUpdateDate, loading: prevLoading}} = this.props;

		return nextUpdateDate !== prevUpdateDate || nextLoading !== prevLoading;
	}

	renderContent = () => {
		const {buildData, widget} = this.props;
		const {SUMMARY, TABLE} = WIDGET_VARIANTS;

		if (buildData.data && !buildData.error) {
			const types = {[SUMMARY]: Summary, [TABLE]: Table};
			const DiagramByType = types[widget.type] || Chart;

			return (
				<Fragment>
					{this.renderName()}
					<div className={styles.diagram}>
						<DiagramByType buildData={buildData.data} widget={widget} />
					</div>
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
