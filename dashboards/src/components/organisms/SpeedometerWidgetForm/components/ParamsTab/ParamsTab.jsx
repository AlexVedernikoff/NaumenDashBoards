// @flow
import BorderFieldSet from 'components/organisms/SpeedometerWidgetForm/components/BorderFieldSet';
import type {Borders, Ranges} from 'store/widgets/data/types';
import {createSpeedometerDataSet} from 'store/widgetForms/speedometerForm/helpers';
import type {DataSet} from 'store/widgetForms/speedometerForm/types';
import {DEFAULT_SPEEDOMETER_SETTINGS} from 'store/widgetForms/speedometerForm/constants';
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
import React, {createContext, Fragment, PureComponent} from 'react';
import SourceBox from 'WidgetFormPanel/components/SourceBox';
import SourceFieldset from 'containers/SourceFieldset';
import uuid from 'tiny-uuid';
import WidgetNameBox from 'WidgetFormPanel/components/WidgetNameBox';
import WidgetSelectBox from 'WidgetFormPanel/components/WidgetSelectBox';

const BORDERS_CONTEXT = createContext<Borders>(DEFAULT_SPEEDOMETER_SETTINGS.borders);
const RANGES_CONTEXT = createContext<Ranges>(DEFAULT_SPEEDOMETER_SETTINGS.ranges);
const DATASET_CONTEXT = createContext<?DataSet>(null);

BORDERS_CONTEXT.displayName = 'BORDERS_CONTEXT';
RANGES_CONTEXT.displayName = 'RANGES_CONTEXT';
DATASET_CONTEXT.displayName = 'DATASET_CONTEXT';

export class ParamsTab extends PureComponent<Props> {
	getIndicatorsBoxComponents = memoize(() => ({
		FormBox: this.renderIndicatorsFormBox
	}));

	handleAddDataSet = () => {
		const {onChange, values} = this.props;

		onChange(DIAGRAM_FIELDS.data, [...values.data, createSpeedometerDataSet(uuid())]);
	};

	handleChangeBorders = (name: string, value: Borders) => {
		const {onChange} = this.props;
		return onChange(DIAGRAM_FIELDS.borders, value);
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

	handleChangeRanges = (name: string, ranges: Ranges) => {
		const {onChange} = this.props;
		return onChange(DIAGRAM_FIELDS.ranges, ranges);
	};

	handleRemoveDataSet = (index: number) => {
		const {onChange, values} = this.props;
		const {data} = values;

		if (data.length > 1) {
			onChange(DIAGRAM_FIELDS.data, data.filter((dataSet, i) => i !== index));
		}
	};

	renderBorderFieldSet = (borders: Borders) => (
		<DATASET_CONTEXT.Consumer>
			{this.renderBorderFieldSetWithDataSet(borders)}
		</DATASET_CONTEXT.Consumer>
	);

	renderBorderFieldSetWithDataSet = (borders: Borders) => (dataSet: ?DataSet) => (
		<BorderFieldSet
			dataSet={dataSet}
			name={DIAGRAM_FIELDS.borders}
			onChange={this.handleChangeBorders}
			value={borders}
		/>
	);

	renderIndicatorsBox = () => {
		const {values} = this.props;
		const {borders, data, ranges} = values;
		const index = data.findIndex(ds => !ds.sourceForCompute);

		if (index >= 0) {
			const dataSet = data[index];
			const {dataKey, indicators, source} = dataSet;

			return (
				<BORDERS_CONTEXT.Provider key={dataKey} value={borders}>
					<RANGES_CONTEXT.Provider value={ranges}>
						<DATASET_CONTEXT.Provider value={dataSet}>
							<IndicatorsBox
								components={this.getIndicatorsBoxComponents()}
								dataKey={dataKey}
								index={index}
								key={dataKey}
								onChange={this.handleChangeIndicators}
								source={source}
								value={indicators}
							/>
						</DATASET_CONTEXT.Provider>
					</RANGES_CONTEXT.Provider>
				</BORDERS_CONTEXT.Provider>
			);
		}

		return null;
	};

	renderIndicatorsFormBox = ({children, ...props}: FormBoxProps) => (
		<FormBox {...props}>
			{children}
			<FieldDivider />
			<BORDERS_CONTEXT.Consumer>
				{this.renderBorderFieldSet}
			</BORDERS_CONTEXT.Consumer>
			<FieldDivider />
			<RANGES_CONTEXT.Consumer>
				{this.renderRangesFieldset}
			</RANGES_CONTEXT.Consumer>
		</FormBox>
	);

	renderRangesFieldset = (ranges: Ranges) => <RangesFieldset name={DIAGRAM_FIELDS.ranges} onChange={this.handleChangeRanges} value={ranges} />;

	renderSourceFieldset = (dataSet: DataSet, index: number, data: Array<DataSet>) => (
		<SourceFieldset
			index={index}
			key={`sourceFieldset_${index}`}
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
				{this.renderIndicatorsBox()}
				<DisplayModeSelectBox name={DIAGRAM_FIELDS.displayMode} onChange={onChange} value={displayMode} />
				<NavigationBox name={DIAGRAM_FIELDS.navigation} onChange={onChange} value={navigation} />
			</Fragment>
		);
	}
}

export default ParamsTab;
