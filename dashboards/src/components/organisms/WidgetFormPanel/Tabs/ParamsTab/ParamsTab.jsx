// @flow
import {AxisChart, CircleChart, ComboChart, Summary, Table} from './WidgetFields';
import type {Props} from 'components/organisms/WidgetFormPanel/types';
import React, {Component} from 'react';
import {WIDGET_TYPES} from 'store/widgets/data/constants';
import withForm from 'components/organisms/WidgetFormPanel/withForm';

export class ParamsTab extends Component<Props> {
	resolve = (type: string) => {
		const {COMBO, DONUT, PIE, SUMMARY, TABLE} = WIDGET_TYPES;

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
