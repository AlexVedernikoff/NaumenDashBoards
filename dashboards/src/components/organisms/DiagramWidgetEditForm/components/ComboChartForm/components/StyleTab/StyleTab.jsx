// @flow
import {ColorsBox, DataLabelsBox, HeaderBox, LegendBox, SortingBox} from 'DiagramWidgetEditForm/components';
import {Container} from 'components/atoms';
import type {DataSet} from 'containers/DiagramWidgetEditForm/types';
import {DEFAULT_AXIS_SORTING_SETTINGS, SORTING_VALUES} from 'store/widgets/data/constants';
import {DEFAULT_CHART_SETTINGS} from 'utils/chart/constants';
import {extend} from 'src/helpers';
import {FIELDS} from 'containers/WidgetEditForm/constants';
import {getLegendSettings} from 'utils/chart/helpers';
import {getProcessedValue} from 'store/sources/attributes/helpers';
import {getSortingOptions} from 'DiagramWidgetEditForm/helpers';
import {IndicatorSettingsBox} from 'DiagramWidgetEditForm/components/ComboChartForm/components';
import type {OnSelectEvent} from 'components/types';
import {ParameterBox} from 'DiagramWidgetEditForm/components/AxisChartForm/components';
import type {Props as ContainerProps} from 'components/atoms/Container/types';
import React, {Component, Fragment} from 'react';
import {Select} from 'components/molecules';
import type {SortingValue} from 'store/widgets/data/types';
import type {StyleTabProps} from 'DiagramWidgetEditForm/types';
import styles from './styles.less';

export class StyleTab extends Component<StyleTabProps> {
	getData = (defaultData: Object, data?: Object) => {
		return data && typeof data === 'object' ? {...defaultData, ...data} : defaultData;
	};

	getSortingIndicatorLabel = (value: SortingValue) => (dataSet: DataSet) => {
		const {source, xAxis, yAxis} = dataSet;
		const attribute = value === SORTING_VALUES.INDICATOR ? yAxis : xAxis;
		let label = getProcessedValue(attribute, 'title');

		if (label && source) {
			label = `${label} (${source.label})`;
		}

		return label;
	};

	getSortingIndicatorValue = (dataSet: DataSet) => dataSet.dataKey;

	handleChange = (name: string, data: Object) => {
		const {setFieldValue} = this.props;
		setFieldValue(name, data);
	};

	handleChangeDataSetValue = (index: number, name: string, value: string) => {
		this.props.setDataFieldValue(index, name, value);
	};

	handleSelectSortingIndicator = ({value}: OnSelectEvent) => {
		const {setFieldValue, values} = this.props;
		const {sorting = DEFAULT_AXIS_SORTING_SETTINGS} = values;

		setFieldValue(FIELDS.sorting, {
			...sorting,
			dataKey: value.dataKey
		});
	};

	renderSortingContainer = (props: ContainerProps) => {
		const {children, className} = props;

		return (
			<Fragment>
				<Container className={className} >
					{children}
				</Container>
				{this.renderSortingIndicators()}
			</Fragment>
		);
	};

	renderSortingIndicators = () => {
		const {data, sorting = DEFAULT_AXIS_SORTING_SETTINGS} = this.props.values;
		const {dataKey: sortingDataKey = '', value: sortingValue} = sorting;

		if (sortingValue !== SORTING_VALUES.DEFAULT) {
			const dataSet = data.find(({dataKey}) => dataKey === sortingDataKey) || data[0];
			const options = data.filter(({sourceForCompute}) => !sourceForCompute);

			return (
				<div className={styles.sortingIndicatorField}>
					<Select
						getOptionLabel={this.getSortingIndicatorLabel(sortingValue)}
						getOptionValue={this.getSortingIndicatorValue}
						onSelect={this.handleSelectSortingIndicator}
						options={options}
						value={dataSet}
					/>
				</div>
			);
		}
	};

	render () {
		const {values} = this.props;
		const {
			colors,
			dataLabels = DEFAULT_CHART_SETTINGS.dataLabels,
			header,
			indicator = DEFAULT_CHART_SETTINGS.yAxis,
			legend = getLegendSettings(values),
			parameter = DEFAULT_CHART_SETTINGS.xAxis,
			sorting = DEFAULT_AXIS_SORTING_SETTINGS
		} = values;

		return (
			<div className={styles.container}>
				<HeaderBox data={header} name={FIELDS.header} onChange={this.handleChange} />
				<LegendBox data={legend} name={FIELDS.legend} onChange={this.handleChange} />
				<ParameterBox data={parameter} name={FIELDS.parameter} onChange={this.handleChange} />
				<IndicatorSettingsBox
					data={extend(DEFAULT_CHART_SETTINGS.yAxis, indicator)}
					name={FIELDS.indicator}
					onChange={this.handleChange}
					onChangeDataSetValue={this.handleChangeDataSetValue}
					values={values}
				/>
				<SortingBox
					components={{
						Container: this.renderSortingContainer
					}}
					data={sorting}
					name={FIELDS.sorting}
					onChange={this.handleChange}
					options={getSortingOptions(values)}
				/>
				<DataLabelsBox data={dataLabels} name={FIELDS.dataLabels} onChange={this.handleChange} />
				<ColorsBox data={colors} name={FIELDS.colors} onChange={this.handleChange} />
			</div>
		);
	}
}

export default StyleTab;
