// @flow
import {AXIS_FORMAT_TYPE, DEFAULT_AXIS_FORMAT} from 'store/widgets/data/constants';
import Checkbox from 'components/atoms/Checkbox';
import ColorInput from 'components/molecules/ColorInput';
import type {DataLabels} from 'store/widgets/data/types';
import type {DefaultProps, Props} from './types';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import FontFamilySelect from 'WidgetFormPanel/components/FontFamilySelect';
import FontSizeSelect from 'WidgetFormPanel/components/FontSizeSelect';
import FormField from 'components/molecules/FormField';
import type {OnChangeEvent, OnSelectEvent} from 'components/types';
import ParameterFormat from 'components/molecules/ParameterFormatPanel';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import ToggableFormBox from 'components/molecules/ToggableFormBox';

export class DataLabelsBox extends PureComponent<Props> {
	static defaultProps: DefaultProps = {
		name: '',
		showForamt: true
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
		const {disabled: currDisabled, show: currShow} = dataLabels;
		const {disabled: prevDisabled = null, show: prevShow = null} = prevDataLabels ?? {};
		let newValue = value;

		if (currShow !== prevShow && currShow !== value.show) {
			newValue = {...newValue, [DIAGRAM_FIELDS.show]: currShow};
		}

		if (currDisabled !== prevDisabled && currDisabled !== value.disabled) {
			newValue = {...newValue, [DIAGRAM_FIELDS.disabled]: currDisabled};
		}

		if (newValue !== value) {
			onChange(name, newValue);
		}
	};

	handleChange = ({name, value}: OnChangeEvent<any>) => this.change(name, !value);

	handleChangeFormat = (format) => {
		const {name, onChange, value} = this.props;

		onChange(name, {
			...value,
			[DIAGRAM_FIELDS.format]: format
		});
	};

	handleSelect = ({name, value}: OnSelectEvent) => this.change(name, value);

	renderFormat = () => {
		const {showForamt, value} = this.props;

		if (showForamt) {
			const {format = DEFAULT_AXIS_FORMAT[AXIS_FORMAT_TYPE.NUMBER_FORMAT]} = value;

			return (
				<ParameterFormat
					onChange={this.handleChangeFormat}
					value={format}
				/>
			);
		}

		return null;
	};

	renderMessage = () => {
		const {disabled} = this.props.value;

		if (disabled) {
			return (
				<div className={styles.isDisabledLabels}>Метки данных отключены из-за большого количества данных</div>
			);
		}

		return null;
	};

	renderShowShadowInput = () => {
		const {showShadow} = this.props.value;

		return (
			<div className={styles.shadowInput}>
				<Checkbox checked={showShadow} name={DIAGRAM_FIELDS.showShadow} onChange={this.handleChange} value={showShadow} />
				<span className={styles.shadowInputLabel}>Тень</span>
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
				title="Метки данных"
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
