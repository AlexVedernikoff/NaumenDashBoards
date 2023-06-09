// @flow
import {ATTRIBUTES_HELPERS_CONTEXT} from 'containers/DiagramWidgetForm/HOCs/withAttributesHelpers';
import type {Border} from 'store/widgets/data/types';
import Checkbox from 'components/atoms/LegacyCheckbox';
import {DEFAULT_INDICATOR} from 'store/widgetForms/constants';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import FormField from 'WidgetFormPanel/components/FormField';
import {getErrorPath} from 'WidgetFormPanel/helpers';
import type {Indicator} from 'store/widgetForms/types';
import IndicatorFieldset from 'WidgetFormPanel/components/IndicatorFieldset';
import Label from 'components/atoms/Label';
import memoize from 'memoize-one';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';
import styles from './styles.less';
import T from 'components/atoms/Translation';
import t from 'localization';
import TextInput from 'components/atoms/TextInput';

export class BorderFieldSet extends PureComponent<Props> {
	getEmptyHelpers = memoize(() => ({
		filterAttributeByMainDataSet: (options, dataSetIndex) => options,
		filterAttributesByUsed: (options, dataSetIndex) => options,
		filterBreakdownAttributeByMainDataSet: options => options,
		filterDynamicAttributes: options => options,
		getCommonAttributes: () => []
	}));

	handleChange = (borderName: string) => (name: string, value, callback?: Function) => {
		const {name: propName, onChange, value: borders} = this.props;
		const newData = {...borders, [borderName]: {...borders[borderName], [name]: value}};

		onChange(propName, newData, callback);
	};

	handleChangeIndicator = (borderName: string) => (index: number, indicator: Indicator, callback?: Function) => {
		this.handleChange(borderName)(DIAGRAM_FIELDS.indicator, indicator, callback);
	};

	handleChangeValue = (borderName: string) => ({name, value}) => {
		this.handleChange(borderName)(name, value);
	};

	renderAbsoluteEdit = (name: string, isNumber: boolean, value: number, indicator: ?Indicator) => {
		const content = isNumber ? this.renderValueEdit(name, value) : this.renderIndicatorSelect(name, indicator);

		return (
			<Fragment>
				<Checkbox
					className={styles.isNumber}
					label={t('BorderFieldSet::UseNumericValue')}
					name={DIAGRAM_FIELDS.isNumber}
					onClick={this.handleChange(name)}
					value={isNumber}
				/>
				{content}
			</Fragment>
		);
	};

	renderIndicatorSelect = (name: string, indicator: ?Indicator = DEFAULT_INDICATOR) => {
		const {dataSet} = this.props;

		if (dataSet) {
			const {dataKey, source} = dataSet;

			return (
				<ATTRIBUTES_HELPERS_CONTEXT.Provider value={this.getEmptyHelpers()}>
					<IndicatorFieldset
						className={styles.indicatorSelect}
						dataKey={dataKey}
						onChange={this.handleChangeIndicator(name)}
						source={source}
						value={indicator ?? DEFAULT_INDICATOR}
					/>
				</ATTRIBUTES_HELPERS_CONTEXT.Provider>
			);
		}

		return null;
	};

	renderScaleBorderField = (label: string, name: string, border: Border) => {
		const {indicator, isNumber, value} = border;
		const paths = [
			getErrorPath(DIAGRAM_FIELDS.borders, name),
			getErrorPath(DIAGRAM_FIELDS.borders, name, DIAGRAM_FIELDS.value),
			getErrorPath(DIAGRAM_FIELDS.borders, name, DIAGRAM_FIELDS.indicator)
		];
		let absoluteIndicator = null;

		if (indicator) {
			const {aggregation, attribute, tooltip} = indicator;

			absoluteIndicator = {aggregation, attribute, tooltip};
		}

		return (
			<FormField label={label} paths={paths} small>
				{this.renderAbsoluteEdit(name, isNumber, value, absoluteIndicator)}
			</FormField>
		);
	};

	renderValueEdit = (name: string, value: number) => <TextInput name={DIAGRAM_FIELDS.value} onChange={this.handleChangeValue(name)} value={value} />;

	render () {
		const {max, min} = this.props.value;

		return (
			<Fragment>
				<Label className={styles.scaleBorderField}><T text='BorderFieldSet::ScaleBoundaries' /></Label>
				{this.renderScaleBorderField(t('BorderFieldSet::Minimum'), DIAGRAM_FIELDS.min, min)}
				{this.renderScaleBorderField(t('BorderFieldSet::Maximum'), DIAGRAM_FIELDS.max, max)}
			</Fragment>
		);
	}
}

export default BorderFieldSet;
