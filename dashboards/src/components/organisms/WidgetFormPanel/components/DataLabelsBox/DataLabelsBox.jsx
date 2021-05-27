// @flow
import Checkbox from 'components/atoms/Checkbox';
import ColorInput from 'components/molecules/ColorInput';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import FontFamilySelect from 'WidgetFormPanel/components/FontFamilySelect';
import FontSizeSelect from 'WidgetFormPanel/components/FontSizeSelect';
import FormField from 'components/molecules/FormField';
import type {OnChangeEvent, OnSelectEvent} from 'components/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import ToggableFormBox from 'components/molecules/ToggableFormBox';

export class DataLabelsBox extends PureComponent<Props> {
	componentDidUpdate (prevProps: Props) {
		const {value, widget} = this.props;
		// $FlowFixMe[prop-missing]
		const {dataLabels} = widget;
		// $FlowFixMe[prop-missing]
		const {dataLabels: prevDataLabels} = prevProps.widget;

		// SMRMEXT-11965 после изменения dataLabels.show в виджете редакса, сбрасываем его и в форме редактирования
		if (dataLabels && prevDataLabels) {
			const {disabled: currDisabled, show: currShow} = dataLabels;
			const {disabled: prevDisabled, show: prevShow} = prevDataLabels;

			if (currShow !== prevShow && currShow !== value.show) {
				this.change('show', currShow);
			}

			if (currDisabled !== prevDisabled && currDisabled !== value.disabled) {
				this.change('disabled', currDisabled);
			}
		}
	}

	componentDidMount () {
		const {value, widget} = this.props;
		// $FlowFixMe[prop-missing]
		const {dataLabels} = widget;

		if (dataLabels) {
			if (value.show !== dataLabels.show) {
				this.change('show', dataLabels.show);
			}

			if (value.disabled !== dataLabels.disabled) {
				this.change('disabled', dataLabels.disabled);
			}
		}
	}

	change = (key: string, value: any) => {
		const {name, onChange, value: settings} = this.props;

		onChange(name, {
			...settings,
			[key]: value
		});
	};

	handleChange = ({name, value}: OnChangeEvent<any>) => this.change(name, !value);

	handleSelect = ({name, value}: OnSelectEvent) => this.change(name, value);

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
			</ToggableFormBox>
		);
	}
}

export default DataLabelsBox;
