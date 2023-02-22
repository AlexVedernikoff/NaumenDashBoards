// @flow
import AxisSettingsBox from 'components/organisms/AxisChartWidgetForm/components/AxisSettingsBox';
import BreakdownFormat from 'WidgetFormPanel/components/BreakdownFormat';
import ColorsBox from 'containers/ColorsBox';
import DataLabelsBox from 'WidgetFormPanel/components/DataLabelsBox';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import FormField from 'components/molecules/FormField';
import {getMainDataSetIndex} from 'store/widgets/data/helpers';
import {getSortingOptions} from 'WidgetFormPanel/helpers';
import {GROUP_WAYS} from 'store/widgets/constants';
import {hasBreakdown} from 'store/widgets/helpers';
import HeaderBox from 'WidgetFormPanel/components/HeaderBox';
import LegendBox from 'WidgetFormPanel/components/LegendBox';
import {MAX_TEXT_LENGTH} from 'components/constants';
import type {OnChangeEvent} from 'components/types';
import ParameterFormat from 'WidgetFormPanel/components/ParameterFormat';
import type {Props} from './types';
import React, {Component} from 'react';
import SortingBox from 'WidgetFormPanel/components/SortingBox';
import styles from './styles.less';
import t from 'localization';
import TextInput from 'components/atoms/TextInput';
import {WIDGET_TYPES} from 'store/widgets/data/constants';
import withWidget from 'WidgetFormPanel/HOCs/withWidget';

export class StyleTab extends Component<Props> {
	handleChangeAxisName = (index: number) => ({name, value}: OnChangeEvent<string>) => {
		const {onChange, values} = this.props;
		const newData = values.data.map((dataSet, i) => i === index ? {...dataSet, [name]: value} : dataSet);

		onChange(DIAGRAM_FIELDS.data, newData);
	};

	handleChangeData = data => this.props.onChange(DIAGRAM_FIELDS.data, data);

	hasCustomGroup = () => {
		const {values} = this.props;
		const {CUSTOM} = GROUP_WAYS;

		return !!values.data.find(({breakdown, parameters}) =>
			parameters[0].group.way === CUSTOM || (breakdown && breakdown[0].group.way === CUSTOM)
		);
	};

	renderAxisNameField = (index: number, name: string, value: string) => (
		<FormField small>
			<TextInput maxLength={MAX_TEXT_LENGTH} name={name} onChange={this.handleChangeAxisName(index)} value={value} />
		</FormField>
	);

	renderColorsBox = () => {
		const {onChange, values, widget} = this.props;
		const {colorsSettings} = values;
		const disabledCustomSettings = widget.type === WIDGET_TYPES.LINE && !hasBreakdown(widget);

		return (
			<ColorsBox
				disabledCustomSettings={disabledCustomSettings}
				name={DIAGRAM_FIELDS.colorsSettings}
				onChange={onChange}
				value={colorsSettings}
				values={values}
				widget={widget}
			/>
		);
	};

	renderParameterFormat = () => {
		const {onChange, values} = this.props;
		const {data, parameter} = values;

		return <ParameterFormat data={data} onChange={onChange} parameter={parameter} />;
	};

	render () {
		const {onChange, values, widget} = this.props;
		const {
			breakdownFormat,
			data,
			dataLabels,
			header,
			indicator,
			legend,
			parameter,
			sorting
		} = values;
		const index = getMainDataSetIndex(data);
		const {xAxisName, yAxisName} = data[index];

		return (
			<div className={styles.container}>
				<HeaderBox name={DIAGRAM_FIELDS.header} onChange={onChange} value={header} />
				<LegendBox name={DIAGRAM_FIELDS.legend} onChange={onChange} value={legend} />
				<AxisSettingsBox
					name={DIAGRAM_FIELDS.parameter}
					onChange={onChange}
					renderAxisFormat={this.renderParameterFormat}
					renderNameField={() => this.renderAxisNameField(index, DIAGRAM_FIELDS.xAxisName, xAxisName)}
					title={t('AxisChartStyleTab::Parameter')}
					value={parameter}
				/>
				<AxisSettingsBox
					name={DIAGRAM_FIELDS.indicator}
					onChange={onChange}
					renderNameField={() => this.renderAxisNameField(index, DIAGRAM_FIELDS.yAxisName, yAxisName)}
					title={t('AxisChartStyleTab::Indicator')}
					value={indicator}
				/>
				<BreakdownFormat breakdown={breakdownFormat} data={data} onChange={onChange} />
				<SortingBox
					name={DIAGRAM_FIELDS.sorting}
					onChange={onChange}
					options={getSortingOptions(!this.hasCustomGroup())}
					value={sorting}
				/>
				<DataLabelsBox
					data={data}
					name={DIAGRAM_FIELDS.dataLabels}
					onChange={onChange}
					onChangeData = {this.handleChangeData}
					showFormat='single'
					value={dataLabels}
					widget={widget}
				/>
				{this.renderColorsBox()}
			</div>
		);
	}
}

export default withWidget(StyleTab);
