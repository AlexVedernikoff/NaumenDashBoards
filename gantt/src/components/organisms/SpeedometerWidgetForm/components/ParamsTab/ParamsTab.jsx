// @flow
import BorderFieldSet from 'components/organisms/SpeedometerWidgetForm/components/BorderFieldSet';
import type {Borders, Ranges} from 'store/widgets/data/types';
import {createSpeedometerDataSet} from 'store/widgetForms/speedometerForm/helpers';
import type {DataSet} from 'store/widgetForms/speedometerForm/types';
import {DEFAULT_SPEEDOMETER_SETTINGS} from 'components/organisms/Speedometer/constants';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import DisplayModeSelectBox from 'containers/DisplayModeSelectBox/DisplayModeSelectBox';
import FieldDivider from 'components/organisms/SpeedometerWidgetForm/components/FieldDivider';
import FormBox from 'components/molecules/FormBox';
import type {FormBoxProps} from 'WidgetFormPanel/components/IndicatorsBox/types';
import type {Indicator} from 'store/widgetForms/types';
import IndicatorsBox from 'WidgetFormPanel/components/IndicatorsBox';
import memoize from 'memoize-one';
import NavigationBox from 'containers/NavigationBox/NavigationBox';
import type {Props} from './types';
import RangesFieldset from 'components/organisms/SpeedometerWidgetForm/components/RangesFieldset';
import {RANGES_TYPES} from 'store/widgets/data/constants';
import React, {createContext, Fragment, PureComponent} from 'react';
import SourceBox from 'WidgetFormPanel/components/SourceBox';
import SourceFieldset from 'containers/SourceFieldset';
import uuid from 'tiny-uuid';
import WidgetNameBox from 'WidgetFormPanel/components/WidgetNameBox';
import WidgetSelectBox from 'WidgetFormPanel/components/WidgetSelectBox';

const BORDERS_CONTEXT = createContext<Borders>(DEFAULT_SPEEDOMETER_SETTINGS.borders);
const RANGES_CONTEXT = createContext<Ranges>(DEFAULT_SPEEDOMETER_SETTINGS.ranges);

export class ParamsTab extends PureComponent<Props> {
	getIndicatorsBoxComponents = memoize(() => ({
		FormBox: this.renderIndicatorsFormBox
	}));

	handleAddDataSet = () => {
		const {onChange, values} = this.props;

		onChange(DIAGRAM_FIELDS.data, [...values.data, createSpeedometerDataSet(uuid())]);
	};

	handleChangeBorders = (name: string, value: Borders) => {
		const {onChange, values} = this.props;
		const {ranges} = values;
		const {data, type} = ranges;

		if (type === RANGES_TYPES.ABSOLUTE && data.length === 1) {
			const {max, min} = value;

			onChange(DIAGRAM_FIELDS.ranges, {
				...ranges,
				data: [{
					...ranges.data[0],
					from: min,
					to: max
				}]
			});
		}

		onChange(name, value);
	};

	handleChangeDataSet = (index: number, newDataSet: DataSet) => {
		const {onChange, values} = this.props;
		const newData = values.data.map((dataSet, i) => i === index ? newDataSet : dataSet);

		onChange(DIAGRAM_FIELDS.data, newData);
	};

	handleChangeIndicators = (index: number, indicators: Array<Indicator>) => {
		const {onChange, values} = this.props;
		const newData = values.data.map((dataSet, i) => i === index ? {...dataSet, indicators} : dataSet);

		onChange(DIAGRAM_FIELDS.data, newData);
	};

	handleRemoveDataSet = (index: number) => {
		const {onChange, values} = this.props;
		const {data} = values;

		data.length > 1 && onChange(DIAGRAM_FIELDS.data, data.filter((dataSet, i) => i !== index));
	};

	renderIndicatorsBox = ({dataKey, indicators, source}: DataSet, index: number) => {
		const {borders, ranges} = this.props.values;

		return (
			<BORDERS_CONTEXT.Provider value={borders}>
				<RANGES_CONTEXT.Provider value={ranges}>
					<IndicatorsBox
						components={this.getIndicatorsBoxComponents()}
						dataKey={dataKey}
						index={index}
						key={dataKey}
						onChange={this.handleChangeIndicators}
						source={source}
						value={indicators}
					/>
				</RANGES_CONTEXT.Provider>
			</BORDERS_CONTEXT.Provider>
		);
	};

	renderIndicatorsFormBox = ({children, ...props}: FormBoxProps) => {
		const {onChange} = this.props;

		return (
			<FormBox {...props}>
				{children}
				<FieldDivider />
				<BORDERS_CONTEXT.Consumer>
					{value => <BorderFieldSet name={DIAGRAM_FIELDS.borders} onChange={this.handleChangeBorders} value={value} />}
				</BORDERS_CONTEXT.Consumer>
				<FieldDivider />
				<RANGES_CONTEXT.Consumer>
					{value => <RangesFieldset name={DIAGRAM_FIELDS.ranges} onChange={onChange} value={value} />}
				</RANGES_CONTEXT.Consumer>
			</FormBox>
		);
	};

	renderSourceFieldset = (dataSet: DataSet, index: number, data: Array<DataSet>) => (
		<SourceFieldset
			index={index}
			onChange={this.handleChangeDataSet}
			onRemove={this.handleRemoveDataSet}
			removable={data.length > 1}
			value={dataSet}
		/>
	);

	render () {
		const {onChange, values} = this.props;
		const {data, displayMode, navigation} = values;

		return (
			<Fragment>
				<WidgetNameBox onChange={onChange} values={values} />
				<WidgetSelectBox />
				<SourceBox onAdd={this.handleAddDataSet}>{data.map(this.renderSourceFieldset)}</SourceBox>
				{data.filter(dataSet => !dataSet.sourceForCompute).map(this.renderIndicatorsBox)}
				<DisplayModeSelectBox name={DIAGRAM_FIELDS.displayMode} onChange={onChange} value={displayMode} />
				<NavigationBox name={DIAGRAM_FIELDS.navigation} onChange={onChange} value={navigation} />
			</Fragment>
		);
	}
}

export default ParamsTab;
