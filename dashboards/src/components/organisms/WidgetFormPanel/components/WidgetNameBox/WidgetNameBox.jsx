// @flow
import Checkbox from 'components/atoms/Checkbox';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import FormBox from 'components/molecules/FormBox';
import FormControl from 'components/molecules/FormControl';
import FormField from 'WidgetFormPanel/components/FormField';
import {getErrorPath} from 'WidgetFormPanel/helpers';
import {MAX_TEXT_LENGTH} from 'components/constants';
import type {OnChangeEvent, OnChangeInputEvent} from 'components/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import TextArea from 'components/atoms/TextArea';

export class WidgetNameBox extends PureComponent<Props> {
	handleBlur = (e: SyntheticInputEvent<HTMLInputElement>) => {
		const {onChange, values} = this.props;
		const {[DIAGRAM_FIELDS.header]: header} = values;

		if (!header[DIAGRAM_FIELDS.name]) {
			onChange(DIAGRAM_FIELDS.header, {
				...header,
				[DIAGRAM_FIELDS.name]: e.target.value.substr(0, MAX_TEXT_LENGTH)
			});
		}
	};

	handleChangeDiagramName = (e: OnChangeInputEvent) => {
		const {onChange, values} = this.props;
		const {name, value} = e;

		onChange(DIAGRAM_FIELDS.header, {
			...values[DIAGRAM_FIELDS.header],
			[name]: value
		});
	};

	handleChangeName = (event: OnChangeEvent<string>) => {
		const {onChange} = this.props;
		const {value} = event;

		onChange(DIAGRAM_FIELDS.templateName, value);
	};

	handleChangeUseName = ({name, value}: OnChangeEvent<boolean>) => {
		const {onChange, values} = this.props;

		onChange(DIAGRAM_FIELDS.header, {
			...values[DIAGRAM_FIELDS.header],
			[name]: !value
		});
	};

	renderDiagramNameField = () => {
		const {header} = this.props.values;

		if (!header.useName) {
			return (
				<FormField path={getErrorPath(DIAGRAM_FIELDS.header, DIAGRAM_FIELDS.template)}>
					<TextArea
						label="Заголовок диаграммы"
						maxLength={MAX_TEXT_LENGTH}
						name={DIAGRAM_FIELDS.template}
						onBlur={this.handleBlur}
						onChange={this.handleChangeDiagramName}
						value={header.template}
					/>
				</FormField>
			);
		}

		return null;
	};

	renderNameField = () => {
		const {values} = this.props;

		return (
			<FormField path={DIAGRAM_FIELDS.templateName} >
				<TextArea
					label="Название виджета"
					name={DIAGRAM_FIELDS.templateName}
					onBlur={this.handleBlur}
					onChange={this.handleChangeName}
					value={values.templateName}
				/>
			</FormField>
		);
	};

	renderUseNameCheckbox = () => {
		const {useName: value} = this.props.values.header;

		return (
			<FormControl className={styles.checkbox} label="Использовать для заголовка диаграммы">
				<Checkbox checked={value} name={DIAGRAM_FIELDS.useName} onChange={this.handleChangeUseName} value={value} />
			</FormControl>
		);
	};

	render () {
		return (
			<FormBox>
				{this.renderNameField()}
				{this.renderUseNameCheckbox()}
				{this.renderDiagramNameField()}
			</FormBox>
		);
	}
}

export default WidgetNameBox;
