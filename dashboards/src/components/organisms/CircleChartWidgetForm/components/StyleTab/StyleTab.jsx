// @flow
import BreakdownFormat from 'WidgetFormPanel/components/BreakdownFormat';
import ColorsBox from 'containers/ColorsBox';
import DataLabelsBox from 'WidgetFormPanel/components/DataLabelsBox';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import HeaderBox from 'WidgetFormPanel/components/HeaderBox';
import LegendBox from 'WidgetFormPanel/components/LegendBox';
import type {Props} from './types';
import React, {Component} from 'react';
import SortingBox from 'containers/SortingBox/CircleChartSortingBox';
import styles from './styles.less';
import withWidget from 'WidgetFormPanel/HOCs/withWidget';

export class StyleTab extends Component<Props> {
	handleChangeData = data => this.props.onChange(DIAGRAM_FIELDS.data, data);

	renderColorsBox = () => {
		const {onChange, values, widget} = this.props;
		const {colorsSettings} = values;

		return (
			<ColorsBox
				disabledCustomSettings={false}
				name={DIAGRAM_FIELDS.colorsSettings}
				onChange={onChange}
				value={colorsSettings}
				values={values}
				widget={widget}
			/>
		);
	};

	render () {
		const {onChange, values, widget} = this.props;
		const {breakdownFormat, data, dataLabels, header, legend, sorting} = values;

		return (
			<div className={styles.container}>
				<HeaderBox name={DIAGRAM_FIELDS.header} onChange={onChange} value={header} />
				<LegendBox name={DIAGRAM_FIELDS.legend} onChange={onChange} value={legend} />
				<BreakdownFormat breakdown={breakdownFormat} data={data} onChange={onChange} />
				<SortingBox
					name={DIAGRAM_FIELDS.sorting}
					onChange={onChange}
					value={sorting}
				/>
				<DataLabelsBox
					data={data}
					name={DIAGRAM_FIELDS.dataLabels}
					onChange={onChange}
					onChangeData={this.handleChangeData}
					value={dataLabels}
					widget={widget}
				/>
				{this.renderColorsBox()}
			</div>
		);
	}
}

export default withWidget(StyleTab);
