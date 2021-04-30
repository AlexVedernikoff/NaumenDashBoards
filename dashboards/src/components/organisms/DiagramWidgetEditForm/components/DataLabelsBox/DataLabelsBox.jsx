// @flow
import Checkbox from 'components/atoms/Checkbox';
import {compose} from 'redux';
import {FIELDS} from 'containers/WidgetEditForm/constants';
import FormField from 'components/molecules/FormField';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import ToggableFormBox from 'components/molecules/ToggableFormBox';
import withForm from 'DiagramWidgetEditForm/withForm';
import {withStyleFormBuilder} from 'DiagramWidgetEditForm/builders';

export class DataLabelsBox extends PureComponent<Props> {
	componentDidUpdate (prevProps: Props) {
		const {handleBoolChange, values, widget} = this.props;
		const {widget: prevWidget} = prevProps;

		// SMRMEXT-11965 после изменения dataLabels.show в виджете редакса, сбрасываем его и в форме редактирования
		if (!!widget.dataLabels && !!prevWidget.dataLabels) {
            const {show: curShow} = widget.dataLabels;
			const {show: prevShow} = prevWidget.dataLabels;
			const {show: valueShow} = values.dataLabels;

			if (curShow !== prevShow && curShow !== valueShow) {
                handleBoolChange({name: FIELDS.show, value: valueShow});
			}
		}
	}

	renderShowShadowInput = () => {
		const {data, handleBoolChange} = this.props;
		const {showShadow} = data;

		return (
			<div className={styles.shadowInput}>
				<Checkbox checked={showShadow} name={FIELDS.showShadow} onChange={handleBoolChange} value={showShadow} />
				<span className={styles.shadowInputLabel}>Тень</span>
			</div>
		);
	};

	render () {
		const {data, handleBoolChange, renderColorInput, renderFontFamilySelect, renderFontSizeSelect} = this.props;

		return (
			<ToggableFormBox name={FIELDS.show} onToggle={handleBoolChange} showContent={data.show} title="Метки данных">
				<FormField row>
					{renderFontFamilySelect()}
					{renderFontSizeSelect()}
				</FormField>
				<FormField row={true}>
					{renderColorInput()}
					{this.renderShowShadowInput()}
				</FormField>
			</ToggableFormBox>
		);
	}
}

export default compose(withForm, withStyleFormBuilder)(DataLabelsBox);
