// @flow
import {AxisChart, CircleChart, ComboChart, Summary, Table} from './WidgetFields';
import {CHART_VARIANTS} from 'utils/chart';
import type {Props} from 'containers/WidgetFormPanel/types';
import React, {Component} from 'react';
import {WIDGET_VARIANTS} from 'utils/widget';
import withForm from 'components/organisms/WidgetFormPanel/withForm';

export class ParamsTab extends Component<Props> {
	resolve = (type: string) => {
		const {COMBO, DONUT, PIE} = CHART_VARIANTS;
		const {SUMMARY, TABLE} = WIDGET_VARIANTS;

		switch (type) {
			case COMBO:
				return ComboChart;
			case DONUT:
			case PIE:
				return CircleChart;
			case SUMMARY:
				return Summary;
			case TABLE:
				return Table;
			default:
				return AxisChart;
		}
	};

	render () {
		const {type} = this.props.values;
		const Fields = this.resolve(type);

		return <Fields key={type} />;
	}
}

export default withForm(ParamsTab);
