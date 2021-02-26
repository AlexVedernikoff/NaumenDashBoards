// @flow
import type {DataBuilderProps} from 'DiagramWidgetEditForm/builders/DataFormBuilder/types';
import {DEFAULT_SPEEDOMETER_SETTINGS} from 'components/organisms/Speedometer/constants';
import FieldDivider from 'DiagramWidgetEditForm/components/FieldDivider';
import FieldError from 'components/atoms/FieldError';
import {FIELDS} from 'DiagramWidgetEditForm/constants';
import FormField from 'components/molecules/FormField';
import {getErrorKey} from 'DiagramWidgetEditForm/helpers';
import HorizontalLabel from 'components/atoms/HorizontalLabel';
import Label from 'components/atoms/Label';
import type {Ranges} from 'store/widgets/data/types';
import RangesFieldset from 'DiagramWidgetEditForm/components/SpeedometerForm/components/RangesFieldset';
import {RANGES_TYPES} from 'store/widgets/data/constants';
import React, {Component, Fragment} from 'react';
import styles from './styles.less';
import TextInput from 'components/atoms/TextInput';
import {withDataFormBuilder} from 'DiagramWidgetEditForm/builders';

export class ParamsTab extends Component<DataBuilderProps> {
	handleChangeBorder = ({name, value: inputValue}: Object) => {
		const {setFieldValue, values} = this.props;
		const {borders, ranges = DEFAULT_SPEEDOMETER_SETTINGS.ranges} = values;
		const value = inputValue.replace(',', '.');

		if (!value || /^-?(\d+)?(\.)?(\d{1,4})?$/.test(value)) {
			const {data, type} = ranges;

			if (type === RANGES_TYPES.ABSOLUTE && data.length === 1) {
				const rangeName: string = name === FIELDS.max ? 'to' : 'from';

				this.handleChangeRanges({
					...ranges,
					data: [{
						...ranges.data[0],
						[rangeName]: value
					}]
				});
			}

			setFieldValue(FIELDS.borders, {
				...borders,
				[name]: value
			});
		}
	};

	handleChangeRanges = (ranges: Ranges) => {
		this.props.setFieldValue(FIELDS.ranges, {...ranges});
	};

	renderFieldDivider = () => <FieldDivider />;

	renderIndicatorBoxes = () => {
		const {renderIndicatorBoxes} = this.props;
		const props = {
			children: this.renderSettingsFields(),
			usesBreakdown: false
		};

		return renderIndicatorBoxes(props);
	};

	renderRangesControl = () => {
		const {ranges} = this.props.values;

		return <RangesFieldset onChange={this.handleChangeRanges} ranges={ranges} />;
	};

	renderScaleBorderError = (error: string) => {
		return error ? <FieldError className={styles.scaleBorderField} text={error} /> : null;
	};

	renderScaleBorderField = (name: string, value: string) => {
		const error = this.props.errors[getErrorKey(FIELDS.borders, name)];

		return (
			<Fragment>
				<FormField row small>
					<HorizontalLabel>{name}</HorizontalLabel>
					<TextInput name={name} onChange={this.handleChangeBorder} value={value} />
				</FormField>
				{this.renderScaleBorderError(error)}
			</Fragment>
		);
	};

	renderScaleBorderFields = () => {
		const {borders = {}} = this.props.values;
		const {max, min} = borders;

		return (
			<Fragment>
				{this.renderScaleBorderLabel()}
				{this.renderScaleBorderField('min', min)}
				{this.renderScaleBorderField('max', max)}
			</Fragment>
		);
	};

	renderScaleBorderLabel = () => (
		<Label className={styles.scaleBorderField}>Границы шкал</Label>
	);

	renderSettingsFields = () => (
		<Fragment>
			{this.renderFieldDivider()}
			{this.renderScaleBorderFields()}
			{this.renderFieldDivider()}
			{this.renderRangesControl()}
		</Fragment>
	);

	render () {
		const {renderBaseBoxes, renderDisplayModeSelect, renderNavigationBox, renderSourceBox} = this.props;

		return (
			<Fragment>
				{renderBaseBoxes()}
				{renderSourceBox()}
				{this.renderIndicatorBoxes()}
				{renderDisplayModeSelect()}
				{renderNavigationBox()}
			</Fragment>
		);
	}
}

export default withDataFormBuilder(ParamsTab);
