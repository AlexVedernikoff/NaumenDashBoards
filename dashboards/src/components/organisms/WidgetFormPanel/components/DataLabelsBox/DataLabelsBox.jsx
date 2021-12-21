// @flow
import {AXIS_FORMAT_TYPE, DEFAULT_AXIS_FORMAT} from 'store/widgets/data/constants';
import Checkbox from 'components/atoms/Checkbox';
import ColorInput from 'components/molecules/ColorInput';
import type {DataLabels} from 'store/widgets/data/types';
import deepEqual from 'fast-deep-equal';
import type {DefaultProps, Props} from './types';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import FontFamilySelect from 'WidgetFormPanel/components/FontFamilySelect';
import FontSizeSelect from 'WidgetFormPanel/components/FontSizeSelect';
import FormField from 'components/molecules/FormField';
import type {OnChangeEvent, OnSelectEvent} from 'components/types';
import ParameterFormat from 'components/molecules/ParameterFormatPanel';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import T from 'components/atoms/Translation';
import t from 'localization';
import ToggableFormBox from 'components/molecules/ToggableFormBox';

export class DataLabelsBox extends PureComponent<Props> {
	static defaultProps: DefaultProps = {
		name: '',
		showFormat: true
	};

	componentDidUpdate (prevProps: Props) {
		const {widget} = this.props;
		// $FlowFixMe[prop-missing]
		const {dataLabels} = widget;
		// $FlowFixMe[prop-missing]
		const {dataLabels: prevDataLabels} = prevProps.widget;

		// SMRMEXT-11965 после изменения dataLabels.show в виджете редакса, сбрасываем его и в форме редактирования
		if (dataLabels) {
			this.checkWidgetChanged(dataLabels, prevDataLabels);
		}
	}

	componentDidMount () {
		const {widget} = this.props;
		// $FlowFixMe[prop-missing]
		const {dataLabels} = widget;

		if (dataLabels) {
			this.checkWidgetChanged(dataLabels);
		}
	}

	change = (key: string, value: any) => {
		const {name, onChange, value: settings} = this.props;

		onChange(name, {
			...settings,
			[key]: value
		});
	};

	checkWidgetChanged = (dataLabels: DataLabels, prevDataLabels?: DataLabels) => {
		const {name, onChange, value} = this.props;

		if (!deepEqual(dataLabels, prevDataLabels) && !deepEqual(dataLabels, value)) {
			onChange(name, {...value, ...dataLabels});
		}
	};

	handleChange = ({name, value}: OnChangeEvent<any>) => this.change(name, !value);

	handleChangeFormat = format => {
		const {name, onChange, value} = this.props;

		onChange(name, {
			...value,
			[DIAGRAM_FIELDS.format]: format
		});
	};

	handleSelect = ({name, value}: OnSelectEvent) => this.change(name, value);

	renderFormat = () => {
		const {showFormat, value} = this.props;

		if (showFormat) {
			const {computedFormat, format} = value;
			const dataLabelFormat = format ?? computedFormat ?? DEFAULT_AXIS_FORMAT[AXIS_FORMAT_TYPE.NUMBER_FORMAT];

			return (
				<ParameterFormat
					onChange={this.handleChangeFormat}
					value={dataLabelFormat}
				/>
			);
		}

		return null;
	};

	renderMessage = () => {
		const {disabled} = this.props.value;

		if (disabled) {
			return (
				<div className={styles.isDisabledLabels}><T text="DataLabelsBox::DataLabelsDisabled" /></div>
			);
		}

		return null;
	};

	renderShowShadowInput = () => {
		const {showShadow} = this.props.value;

		return (
			<div className={styles.shadowInput}>
				<Checkbox checked={showShadow} name={DIAGRAM_FIELDS.showShadow} onChange={this.handleChange} value={showShadow} />
				<span className={styles.shadowInputLabel}><T text="DataLabelsBox::Shadow" /></span>
			</div>
		);
	};

	render () {
		const {disabled, fontColor, fontFamily, fontSize, show} = this.props.value;

		return (
			<ToggableFormBox
				disabled={disabled}
				message={this.renderMessage()}
				name={DIAGRAM_FIELDS.show}
				onToggle={this.handleChange}
				showContent={show}
				title={t('DataLabelsBox::DataLabels')}
			>
				<FormField row>
					<FontFamilySelect name={DIAGRAM_FIELDS.fontFamily} onSelect={this.handleSelect} value={fontFamily} />
					<FontSizeSelect name={DIAGRAM_FIELDS.fontSize} onSelect={this.handleSelect} value={fontSize} />
				</FormField>
				<FormField row={true}>
					<ColorInput name={DIAGRAM_FIELDS.fontColor} onChange={this.handleSelect} portable={true} value={fontColor} />
					{this.renderShowShadowInput()}
				</FormField>
				{this.renderFormat()}
			</ToggableFormBox>
		);
	}
}

export default DataLabelsBox;
