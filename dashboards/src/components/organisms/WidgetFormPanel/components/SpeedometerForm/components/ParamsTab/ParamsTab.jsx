// @flow
import type {DataBuilderProps} from 'WidgetFormPanel/builders/DataFormBuilder/types';
import {FieldDivider} from 'WidgetFormPanel/components';
import {FieldError, HorizontalLabel, Label, TextInput} from 'components/atoms';
import {FIELDS} from 'WidgetFormPanel';
import {FormField} from 'components/molecules';
import type {Ranges} from 'store/widgets/data/types';
import {RangesFieldset} from 'WidgetFormPanel/components/SpeedometerForm/components';
import React, {Component, Fragment} from 'react';
import styles from './styles.less';
import {withDataFormBuilder} from 'WidgetFormPanel/builders';

export class ParamsTab extends Component<DataBuilderProps> {
	sourceRefFields = [FIELDS.indicator];

	handleChangeBorder = ({name, value}: Object) => {
		const {setFieldValue, values} = this.props;
		setFieldValue(FIELDS.borders, {
			...values[FIELDS.borders],
			[name]: value
		});
	};

	handleChangeRanges = (ranges: Ranges) => {
		this.props.setFieldValue(FIELDS.ranges, {...ranges});
	};

	renderFieldDivider = () => <FieldDivider />;

	renderIndicatorBoxes = () => {
		const {renderIndicatorBoxes} = this.props;
		const props = {
			children: this.renderSettingsFields(),
			useBreakdown: false
		};

		return renderIndicatorBoxes(props);
	};

	renderRangesControl = () => {
		const {ranges} = this.props.values;
		return <RangesFieldset onChange={this.handleChangeRanges} ranges={ranges} />;
	};

	renderScaleBorderError = () => {
		const {errors} = this.props;
		const error = errors[FIELDS.borders];

		return error ? <FieldError className={styles.scaleBorderField} text={error} /> : null;
	};

	renderScaleBorderField = (name: string, value: string) => (
		<FormField row small>
			<HorizontalLabel>{name}</HorizontalLabel>
			<TextInput
				name={name}
				onChange={this.handleChangeBorder}
				onlyNumber={true}
				value={value}
			/>
		</FormField>
	);

	renderScaleBorderFields = () => {
		const {borders = {}} = this.props.values;
		const {max, min} = borders;

		return (
			<Fragment>
				{this.renderScaleBorderLabel()}
				{this.renderScaleBorderField('min', min)}
				{this.renderScaleBorderField('max', max)}
				{this.renderScaleBorderError()}
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

	renderSourceBox = () => {
		const {renderSourceBox} = this.props;
		const {indicator} = FIELDS;
		const sourceRefFields = {
			indicator
		};

		return renderSourceBox(sourceRefFields);
	};

	render () {
		const {renderBaseBoxes, renderDisplayModeSelect} = this.props;

		return (
			<Fragment>
				{renderBaseBoxes()}
				{this.renderSourceBox()}
				{this.renderIndicatorBoxes()}
				{renderDisplayModeSelect()}
			</Fragment>
		);
	}
}

export default withDataFormBuilder(ParamsTab);
