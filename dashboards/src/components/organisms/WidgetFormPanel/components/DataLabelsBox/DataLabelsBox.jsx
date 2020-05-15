// @flow
import {Checkbox} from 'components/atoms';
import {DisableableBox, FormControl, FormField, ToggableFormBox} from 'components/molecules';
import {FIELDS} from 'WidgetFormPanel/constants';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import {withStyleFormBuilder} from 'WidgetFormPanel/builders';

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
			<ToggableFormBox title="Метки данных">
				<DisableableBox handleChange={handleBoolChange} label="Показывать на диаграмме" name={FIELDS.show} value={data.show}>
					<FormField>
						<FormControl label="Шрифт" row>
							{renderFontFamilySelect()}
							{renderFontSizeSelect()}
						</FormControl>
					</FormField>
					<FormField row={true}>
						{renderColorInput()}
						{this.renderShowShadowInput()}
					</FormField>
				</DisableableBox>
			</ToggableFormBox>
		);
	}
}

export default withStyleFormBuilder(DataLabelsBox);
