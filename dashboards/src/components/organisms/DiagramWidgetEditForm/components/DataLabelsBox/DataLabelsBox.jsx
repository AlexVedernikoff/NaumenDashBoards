// @flow
import {Checkbox} from 'components/atoms';
import {FIELDS} from 'containers/WidgetEditForm/constants';
import {FormField, ToggableFormBox} from 'components/molecules';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import {withStyleFormBuilder} from 'DiagramWidgetEditForm/builders';

export class DataLabelsBox extends PureComponent<Props> {
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
				<FormField label="Шрифт" row>
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

export default withStyleFormBuilder(DataLabelsBox);
