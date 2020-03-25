// @flow
import {Chart, Summary, Table} from 'components/molecules';
import type {Props} from './types';
import React, {Component, Fragment} from 'react';
import styles from './styles.less';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

export class Diagram extends Component<Props> {
	shouldComponentUpdate (nextProps: Props) {
		const {buildData: {loading: nextLoading, updateDate: nextUpdateDate}} = nextProps;
		const {buildData: {loading: prevLoading, updateDate: prevUpdateDate}} = this.props;

		return nextUpdateDate !== prevUpdateDate || nextLoading !== prevLoading;
	}

	resolveDiagram = () => {
		const {buildData, onUpdate, widget} = this.props;
		const {data} = buildData;
		const {BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, COMBO, DONUT, LINE, PIE, SUMMARY, TABLE} = WIDGET_TYPES;

		switch (widget.type) {
			case BAR:
			case BAR_STACKED:
			case COLUMN:
			case COLUMN_STACKED:
			case COMBO:
			case DONUT:
			case LINE:
			case PIE:
				return <Chart data={data} widget={widget} />;
			case SUMMARY:
				return <Summary data={data} widget={widget} />;
			case TABLE:
				return <Table data={data} onUpdate={onUpdate} widget={widget} />;
		}
	};

	renderContent = () => {
		const {buildData} = this.props;
		const {data, error, loading} = buildData;

		if (data && !loading && !error) {
			return (
				<Fragment>
					{this.renderName()}
					{this.renderDiagram()}
				</Fragment>
			);
		}
	};

	renderDiagram = () => {
		const {showName} = this.props.widget;
		const className = showName ? styles.diagramWithName : styles.diagram;

		return (
			<div className={className}>
				{this.resolveDiagram()}
			</div>
		);
	};

	renderError = () => {
		const {error} = this.props.buildData;

		if (error) {
			return <p>Ошибка загрузки данных. Измените параметры построения.</p>;
		}
	};

	renderLoading = () => {
		const {loading} = this.props.buildData;

		if (loading) {
			return <p>Загрузка...</p>;
		}
	};

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
		return (
			<div className={styles.container}>
				{this.renderLoading()}
				{this.renderError()}
				{this.renderContent()}
			</div>
		);
	}
}

export default Diagram;
