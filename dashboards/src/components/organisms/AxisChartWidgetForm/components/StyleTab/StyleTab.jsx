// @flow
import AxisSettingsBox from 'components/organisms/AxisChartWidgetForm/components/AxisSettingsBox';
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
import type {Props} from './types';
import React, {Component} from 'react';
import SortingBox from 'WidgetFormPanel/components/SortingBox';
import styles from './styles.less';
import TextInput from 'components/atoms/TextInput';
import {WIDGET_TYPES} from 'store/widgets/data/constants';
import withWidget from 'WidgetFormPanel/HOCs/withWidget';

export class StyleTab extends Component<Props> {
	handleChangeAxisName = (index: number) => ({name, value}: OnChangeEvent<string>) => {
		const {onChange, values} = this.props;
		const newData = values.data.map((dataSet, i) => i === index ? {...dataSet, [name]: value} : dataSet);

		onChange(DIAGRAM_FIELDS.data, newData);
	};

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

	render () {
		const {onChange, values, widget} = this.props;
		const {
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
				<AxisSettingsBox name={DIAGRAM_FIELDS.parameter} onChange={onChange} title="Параметр" value={parameter}>
					{this.renderAxisNameField(index, DIAGRAM_FIELDS.xAxisName, xAxisName)}
				</AxisSettingsBox>
				<AxisSettingsBox name={DIAGRAM_FIELDS.indicator} onChange={onChange} title="Показатель" value={indicator}>
					{this.renderAxisNameField(index, DIAGRAM_FIELDS.yAxisName, yAxisName)}
				</AxisSettingsBox>
				<SortingBox
					name={DIAGRAM_FIELDS.sorting}
					onChange={onChange}
					options={getSortingOptions(!this.hasCustomGroup())}
					value={sorting}
				/>
				<DataLabelsBox name={DIAGRAM_FIELDS.dataLabels} onChange={onChange} value={dataLabels} widget={widget} />
				{this.renderColorsBox()}
			</div>
		);
	}
}

export default withWidget(StyleTab);