// @flow
import ColorsBox from 'containers/ColorsBox';
import DataLabelsBox from 'WidgetFormPanel/components/DataLabelsBox';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import {getSortingOptions} from 'WidgetFormPanel/helpers';
import {GROUP_WAYS} from 'store/widgets/constants';
import HeaderBox from 'WidgetFormPanel/components/HeaderBox';
import LegendBox from 'WidgetFormPanel/components/LegendBox';
import type {Props} from './types';
import React, {Component} from 'react';
import SortingBox from 'WidgetFormPanel/components/SortingBox';
import {SORTING_VALUES} from 'store/widgets/data/constants';
import styles from './styles.less';
import withWidget from 'WidgetFormPanel/HOCs/withWidget';

export class StyleTab extends Component<Props> {
	getSortingOptions = () => {
		return getSortingOptions(!this.hasCustomGroup()).filter(option => option.value !== SORTING_VALUES.PARAMETER);
	};

	hasCustomGroup = () => !!this.props.values.data.find(({breakdown}) => breakdown[0].group.way === GROUP_WAYS.CUSTOM);

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
		const {dataLabels, header, legend, sorting} = values;

		return (
			<div className={styles.container}>
				<HeaderBox name={DIAGRAM_FIELDS.header} onChange={onChange} value={header} />
				<LegendBox name={DIAGRAM_FIELDS.legend} onChange={onChange} value={legend} />
				<SortingBox
					name={DIAGRAM_FIELDS.sorting}
					onChange={onChange}
					options={this.getSortingOptions()}
					value={sorting}
				/>
				<DataLabelsBox name={DIAGRAM_FIELDS.dataLabels} onChange={onChange} value={dataLabels} widget={widget} />
				{this.renderColorsBox()}
			</div>
		);
	}
}

export default withWidget(StyleTab);
