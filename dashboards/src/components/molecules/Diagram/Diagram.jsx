// @flow
import {Chart, Summary, Table} from 'components/molecules';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import {WIDGET_VARIANTS} from 'utils/widget';

export class Diagram extends PureComponent<Props> {
	renderDiagram = () => {
		const {diagram, widget} = this.props;
		const {data, loading} = diagram;
		const {SUMMARY, TABLE} = WIDGET_VARIANTS;

		if (loading) {
			return <p>Загрузка...</p>;
		}

		const types = {[SUMMARY]: Summary, [TABLE]: Table};
		const DiagramByType = types[widget.type.value] || Chart;

		return <DiagramByType data={data} widget={widget} />;
	};

	renderError = () => <p>Ошибка загрузки данных. Измените параметры построения.</p>;

	render () {
		const {data} = this.props.diagram;

		if (data) {
			return this.renderDiagram();
		}

		return this.renderError();
	}
}

export default Diagram;
