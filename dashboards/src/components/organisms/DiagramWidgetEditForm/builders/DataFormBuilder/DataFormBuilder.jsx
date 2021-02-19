// @flow
import {Checkbox, FieldError, TextArea, Toggle} from 'components/atoms';
import type {CheckboxProps, IndicatorBoxProps, Props, TextAreaProps} from './types';
import type {DataSet} from 'containers/DiagramWidgetEditForm/types';
import {DISPLAY_MODE_OPTIONS} from 'store/widgets/constants';
import {FIELDS} from 'containers/WidgetEditForm/constants';
import {FormBox, FormCheckControl, OuterSelect, Select} from 'components/molecules';
import {FormField, IndicatorDataBox, NavigationBox, ParameterDataBox} from 'DiagramWidgetEditForm/components';
import {MAX_TEXT_LENGTH} from 'components/constants';
import type {OnChangeInputEvent, OnSelectEvent} from 'components/types';
import React, {Component, Fragment} from 'react';
import styles from './styles.less';
import {USER_ROLES} from 'store/context/constants';
import {WIDGET_OPTIONS} from './constants';
import withForm from 'DiagramWidgetEditForm/withForm';
import withSource from './withSource';

export class DataFormBuilder extends Component<Props> {
	handleBlurName = (e: SyntheticInputEvent<HTMLInputElement>) => {
		const {setFieldValue, values} = this.props;
		const {[FIELDS.header]: header} = values;

		if (!header[FIELDS.name]) {
			setFieldValue(FIELDS.header, {
				...header,
				[FIELDS.name]: e.target.value.substr(0, MAX_TEXT_LENGTH)
			});
		}
	};

	handleChange = (e: OnChangeInputEvent) => {
		const {setFieldValue} = this.props;
		const {name, value} = e;

		setFieldValue(name, value);
	};

	handleChangeDiagramName = (e: OnChangeInputEvent) => {
		const {setFieldValue, values} = this.props;
		const {value} = e;

		setFieldValue(FIELDS.header, {
			...values[FIELDS.header],
			[FIELDS.template]: value
		});
	};

	handleChangeDisplayMode = ({value}: OnSelectEvent) => {
		const {setFieldValue} = this.props;
		const {value: modeValue} = value;

		setFieldValue(FIELDS.displayMode, modeValue);
	};

	handleChangeUseName = ({name, value}: OnChangeInputEvent) => {
		const {setFieldValue, values} = this.props;

		setFieldValue(FIELDS.header, {
			...values[FIELDS.header],
			[name]: !value
		});
	};

	handleToggleShowEmptyData = (event: OnChangeInputEvent) => {
		const {setFieldValue} = this.props;
		const {name, value} = event;
		setFieldValue(name, !value);
	};

	renderBaseBoxes = () => {
		const {values} = this.props;
		const {useName} = values.header;
		const nameProps = {
			handleBlur: this.handleBlurName,
			handleChange: this.handleChange,
			label: 'Название виджета',
			name: FIELDS.templateName,
			value: values[FIELDS.templateName]
		};

		const useNameCheckbox = {
			label: 'Использовать для заголовка диаграммы',
			name: FIELDS.useName,
			onChange: this.handleChangeUseName,
			value: useName
		};

		return (
			<Fragment>
				<FormBox>
					{this.renderTextArea(nameProps)}
					{this.renderCheckbox(useNameCheckbox)}
					{this.renderDiagramNameTextArea()}
				</FormBox>
				<FormBox>
					{this.renderWidgetSelect()}
				</FormBox>
			</Fragment>
		);
	};

	renderCheckbox = (props: CheckboxProps) => {
		const {label, name, onChange, value} = props;

		return (
			<FormCheckControl className={styles.checkbox} label={label}>
				<Checkbox checked={value} name={name} onChange={onChange} value={value} />
			</FormCheckControl>
		);
	};

	renderDiagramNameTextArea = () => {
		const {values} = this.props;
		const {template: templateName, useName} = values.header;
		const {header, template} = FIELDS;

		if (!useName) {
			const diagramNameProps = {
				errorPath: `${header}.${template}`,
				handleChange: this.handleChangeDiagramName,
				label: 'Заголовок диаграммы',
				maxLength: MAX_TEXT_LENGTH,
				name: template,
				value: templateName
			};

			return this.renderTextArea(diagramNameProps);
		}

		return null;
	};

	renderDisplayModeSelect = () => {
		const {personalDashboard, user} = this.props;
		const {displayMode} = this.props.values;
		const value = DISPLAY_MODE_OPTIONS.find(item => item.value === displayMode) || DISPLAY_MODE_OPTIONS[0];

		if (user.role !== USER_ROLES.REGULAR && !personalDashboard) {
			return (
				<FormBox title="Область отображения">
					<FormField>
						<Select
							onSelect={this.handleChangeDisplayMode}
							options={DISPLAY_MODE_OPTIONS}
							placeholder="Отображение виджета в мобильной версии"
							value={value}
						/>
					</FormField>
				</FormBox>
			);
		}

		return null;
	};

	renderIndicatorBox = (props: IndicatorBoxProps) => (dataSet: DataSet, index: number) => {
		if (!dataSet[FIELDS.sourceForCompute]) {
			return <IndicatorDataBox dataSet={dataSet} index={index} {...props} />;
		}

		return null;
	};

	renderIndicatorBoxes = (props: IndicatorBoxProps = {}): Array<React$Node> => {
		const {values} = this.props;
		return values.data.map(this.renderIndicatorBox(props));
	};

	renderNavigationBox = () => {
		const {dashboards, fetchDashboards, personalDashboard, setFieldValue, user, values} = this.props;

		if (user.role !== USER_ROLES.REGULAR && !personalDashboard) {
			return (
				<NavigationBox
					dashboards={dashboards}
					fetchDashboards={fetchDashboards}
					onChange={setFieldValue}
					settings={values.navigation}
				/>
			);
		}
	};

	renderParameterBox = () => {
		const {errors, setDataFieldValue, setFieldValue, values} = this.props;

		return (
			<ParameterDataBox
				errors={errors}
				setDataFieldValue={setDataFieldValue}
				setFieldValue={setFieldValue}
				values={values}
			/>
		);
	};

	renderShowEmptyDataCheckbox = () => {
		const {showEmptyData} = this.props.values;

		return (
			<FormField>
				<FormCheckControl label="Показывать нулевые значения" reverse>
					<Toggle
						checked={showEmptyData}
						name={FIELDS.showEmptyData}
						onChange={this.handleToggleShowEmptyData}
						value={showEmptyData}
					/>
				</FormCheckControl>
			</FormField>
		);
	};

	renderSourceBox = () => {
		const {errors, renderAddSourceInput, renderSourceFieldset, values} = this.props;

		return (
			<FormBox rightControl={renderAddSourceInput()} title="Источник">
				{values.data.map(renderSourceFieldset())}
				<FieldError className={styles.errorField} text={errors[FIELDS.sources]} />
			</FormBox>
		);
	};

	renderTextArea = (props: TextAreaProps) => {
		const {errors} = this.props;
		const {className, errorPath, handleBlur, handleChange, label, maxLength, name, placeholder, value} = props;
		const error = errors[errorPath || name];

		return (
			<FormField className={className} error={error}>
				<TextArea
					label={label}
					maxLength={maxLength}
					name={name}
					onBlur={handleBlur}
					onChange={handleChange}
					placeholder={placeholder}
					value={value}
				/>
			</FormField>
		);
	};

	renderWidgetSelect = () => {
		const {setFieldValue, values} = this.props;

		return (
			<FormField label="Тип диаграммы">
				<OuterSelect
					name={FIELDS.type}
					onSelect={setFieldValue}
					options={WIDGET_OPTIONS}
					value={values[FIELDS.type]}
				/>
			</FormField>
		);
	};

	render () {
		const {render, ...props} = this.props;

		return render({
			...props,
			renderBaseBoxes: this.renderBaseBoxes,
			renderDisplayModeSelect: this.renderDisplayModeSelect,
			renderIndicatorBoxes: this.renderIndicatorBoxes,
			renderNavigationBox: this.renderNavigationBox,
			renderParameterBox: this.renderParameterBox,
			renderShowEmptyDataCheckbox: this.renderShowEmptyDataCheckbox,
			renderSourceBox: this.renderSourceBox
		});
	}
}

export default withForm(withSource(DataFormBuilder));
