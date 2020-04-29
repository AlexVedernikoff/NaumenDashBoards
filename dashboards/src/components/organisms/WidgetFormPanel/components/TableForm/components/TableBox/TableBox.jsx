// @flow
import {Checkbox} from 'components/atoms';
import {EMPTY_DATA_OPTIONS} from './constants';
import {FIELDS} from 'WidgetFormPanel/constants';
import {FormCheckControl, FormControl, FormField, SimpleSelect, ToggableFormBox} from 'components/molecules';
import type {OnChangeEvent, Props} from './types';
import type {OnChangeInputEvent} from 'components/types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import {withStyleFormBuilder} from 'WidgetFormPanel/builders';

export class TableBox extends PureComponent<Props> {
	handleBoolChange = (fieldName: string) => (event: OnChangeInputEvent) => {
		const {name, value} = event;
		this.handleChange(fieldName)({name, value: !value});
	}

	handleChange = (fieldName: string) => (event: OnChangeEvent) => {
		const {data, name, onChange} = this.props;
		const {name: key, value} = event;

		onChange(name, {
			...data,
			[fieldName]: {
				...data[fieldName],
				[key]: value
			}
		});
	}

	handleConditionChange = (fieldName: string) => (event: OnChangeInputEvent) => {
		const {data} = this.props;
		let {name, value} = event;

		if (data[fieldName][name] === value) {
			value = '';
		}

		this.handleChange(fieldName)({name, value});
	}

	renderFieldDivider = () => <div className={styles.fieldDivider}><hr /></div>

	renderHeader = (name: string, label: string) => {
		const {data, renderColorInput, renderFontStyleButtons} = this.props;
		const {fontColor, fontStyle} = data[name];

		return (
			<FormField label={label} row>
				{renderFontStyleButtons({
					onChange: this.handleConditionChange(name),
					value: fontStyle
				})}
				{renderColorInput({
					onChange: this.handleChange(name),
					value: fontColor
				})}
			</FormField>
		);
	};

	renderTableBody = () => {
		const {data, renderTextAlignButtons, renderTextHandlerButtons} = this.props;
		const {defaultValue, showRowNum, textAlign, textHandler} = data.body;
		const name = FIELDS.body;

		return (
			<FormField label="Тело таблицы">
				<FormField>
					<FormCheckControl label="Отображать номер строки">
						<Checkbox
							checked={showRowNum}
							name={FIELDS.showRowNum}
							onChange={this.handleBoolChange(name)}
							value={showRowNum}
						/>
					</FormCheckControl>
				</FormField>
				<FormField>
					<FormControl label="Перенос слов">
						{renderTextHandlerButtons({
							onChange: this.handleChange(name),
							value: textHandler
						})}
					</FormControl>
				</FormField>
				<FormField>
					<FormControl label="Отсутсвуют данные">
						<SimpleSelect
							name={FIELDS.defaultValue}
							onSelect={this.handleChange(name)}
							options={EMPTY_DATA_OPTIONS}
							value={defaultValue}
						/>
					</FormControl>
				</FormField>
				<FormField>
					<FormControl label="Выравнивание данных в таблице">
						{renderTextAlignButtons({
							onChange: this.handleChange(name),
							value: textAlign
						})}
					</FormControl>
				</FormField>
			</FormField>
		);
	}

	render () {
		return (
			<ToggableFormBox title="Таблица">
				{this.renderHeader(FIELDS.columnHeader, 'Заголовок столбца')}
				{this.renderFieldDivider()}
				{this.renderHeader(FIELDS.rowHeader, 'Заголовок строки')}
				{this.renderFieldDivider()}
				{this.renderTableBody()}
			</ToggableFormBox>
		);
	}
}

export default withStyleFormBuilder(TableBox);
