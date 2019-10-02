// @flow
import {
	AttrSelect,
	Button,
	CheckBox,
	Divider,
	DropDownMenu,
	MultiSelect,
	TextArea,
	TextWithIcon,
	Title
} from 'components/atoms';
import type {
	AttrSelectProps,
	ButtonProps,
	CheckBoxProps,
	SelectProps,
	SelectValue,
	State,
	TextAreaProps,
	TreeSelectProps
} from './types';
import {CHART_SELECTS, typeOfCircleCharts} from 'utils/chart';
import DataSourceInput from 'containers/DataSourceInput';
import {getActualAggregate, getAggregateOptions, typeOfExtendedAggregate} from 'utils/aggregate';
import {getGroupOptions, typeOfExtendedGroups} from 'utils/group';
import {ErrorMessage} from 'formik';
import type {OptionType} from 'react-select/src/types';
import type {Props} from 'containers/WidgetFormPanel/types';
import React, {Component, Fragment} from 'react';
import styles from './styles.less';

export class WidgetFormPanel extends Component<Props, State> {
	state = {
		attributes: []
	};

	static getDerivedStateFromProps (props: Props, state: State) {
		const {attributes, fetchAttributes, values} = props;
		const {source} = values;
		let currentAttr = [];

		if (source && !attributes[source.value]) {
			fetchAttributes(source.value);
		}

		if (source && attributes[source.value]) {
			currentAttr = attributes[source.value];
		}

		state.attributes = currentAttr;
		return state;
	}

	handleResetTextArea = (name: string) => this.props.setFieldValue(name, '');

	handleSelect = (name: string, value: OptionType) => this.props.setFieldValue(name, value);

	handleSelectXAxis = (name: string, value: OptionType) => {
		const {setFieldValue} = this.props;

		setFieldValue(name, value);

		if (!typeOfExtendedGroups(value)) {
			setFieldValue('group', null);
		}
	};

	handleSelectYAxis = (name: string, value: OptionType) => {
		const {setFieldValue, values} = this.props;

		setFieldValue(name, value);

		if (!typeOfExtendedAggregate(value)) {
			setFieldValue('aggregate', getActualAggregate(value, values.group));
		}
	};

	handleSelectSource = async (source: SelectValue) => {
		const {attributes, fetchAttributes, setFieldValue} = this.props;

		await setFieldValue('source', source);

		if (!attributes[source.value]) {
			fetchAttributes(source.value);
		}
	};

	handleSubmit = async (asDefault: boolean) => {
		const {setFieldValue, submitForm} = this.props;

		await setFieldValue('asDefault', asDefault);
		submitForm();
	};

	handleSave = () => {
		this.handleSubmit(false);
	};

	handleSaveAsDefault = () => {
		this.handleSubmit(true);
	};

	renderCheckBox = (props: CheckBoxProps) => {
		const {handleChange} = this.props;
		const {label, name, value} = props;

		return (
			<div className={styles.checkboxContainer}>
				<CheckBox
					handleClick={handleChange}
					label={label}
					name={name}
					value={value}
				/>
			</div>
		);
	};

	renderLegendField = (checkBox: CheckBoxProps) => (
		<div className={styles.checkboxContainerLeft}>
			{this.renderCheckBox(checkBox)}
			<Divider className={styles.dividerLeft}/>
		</div>
	);

	renderTreeSelect = (props: TreeSelectProps) => {
		const {name, value} = props;

		return (
			<div className={styles.sourceContainer}>
				<DataSourceInput
					onChange={this.handleSelectSource}
					value={value}
				/>
				<ErrorMessage name={name}/>
			</div>
		);
	};

	renderSelect = (props: SelectProps) => {
		const {label, name, onChange, options, placeholder, value} = props;

		return (
			<div className={styles.multiselectContainer}>
				<MultiSelect
					label={label}
					name={name}
					onChange={onChange || this.handleSelect}
					options={options}
					placeholder={placeholder}
					value={value}
				/>
				<ErrorMessage name={name}/>
			</div>
		);
	};

	renderAttrSelect = (props: AttrSelectProps) => {
		const {isLoadingAttr} = this.props;
		const {attributes} = this.state;
		const {label, name, onChange, placeholder, value} = props;

		return (
			<div className={styles.multiselectContainer}>
				<AttrSelect
					isLoading={isLoadingAttr}
					label={label}
					name={name}
					onChange={onChange || this.handleSelect}
					options={attributes}
					placeholder={placeholder}
					value={value}
				/>
				<ErrorMessage name={name}/>
			</div>
		);
	};

	renderButton = (props: ButtonProps) => {
		const {block, disabled, onClick, text, variant} = props;

		return (
			<div className={styles.buttonContainer}>
				<Button className="mt-1" disabled={disabled} block={block} onClick={onClick} variant={variant}>
					{text}
				</Button>
			</div>
		);
	};

	renderTextWithIcon = (name: string) => <TextWithIcon name={name}/>;

	renderTextArea = (props: TextAreaProps) => {
		const {handleBlur, handleChange} = this.props;
		const {label, name, placeholder, value} = props;

		return (
			<div className={styles.textareaContainer}>
				<TextArea
					label={label}
					name={name}
					onBlur={handleBlur}
					onChange={handleChange}
					onReset={this.handleResetTextArea}
					placeholder={placeholder}
					value={value}
				/>
				<ErrorMessage name={name}/>
			</div>
		);
	};

	renderVisibilityLegend = () => {
		const {values} = this.props;

		const fields = [
			{
				label: 'Выводить название осей',
				name: 'areAxisesNamesShown',
				value: values.areAxisesNamesShown
			},
			{
				label: 'Выводить подписи осей',
				name: 'areAxisesLabelsShown',
				value: values.areAxisesLabelsShown
			},
			{
				label: 'Выводить подписи значений',
				name: 'areAxisesMeaningsShown',
				value: values.areAxisesMeaningsShown
			}
		];

		return (
			<div className={styles.dropdownMenuContainer}>
				<DropDownMenu name="Редактировать легенду">
					{fields.map(this.renderLegendField)}
				</DropDownMenu>
			</div>
		);
	};

	renderAxisInputs = () => {
		const {values} = this.props;

		const xAxis: AttrSelectProps = {
			label: 'Ось X',
			name: 'xAxis',
			onChange: this.handleSelectXAxis,
			placeholder: 'Ось X',
			value: values.xAxis
		};

		const group: SelectProps = {
			label: 'Группировка',
			name: 'group',
			options: getGroupOptions(values.xAxis),
			placeholder: 'Группировка',
			value: values.group
		};

		const yAxis: AttrSelectProps = {
			label: 'Ось Y',
			name: 'yAxis',
			onChange: this.handleSelectYAxis,
			placeholder: 'Ось Y',
			value: values.yAxis
		};

		const aggregate: SelectProps = {
			label: 'Агрегация',
			name: 'aggregate',
			options: getAggregateOptions(values.yAxis),
			placeholder: 'Агрегация',
			value: values.aggregate
		};

		return (
			<Fragment>
				{this.renderAttrSelect(xAxis)}
				{typeOfExtendedGroups(values.xAxis) && this.renderSelect(group)}
				{this.renderAttrSelect(yAxis)}
				{this.renderSelect(aggregate)}
			</Fragment>
		);
	};

	renderControlButtons = () => {
		const {cancelForm, saveLoading} = this.props;

		const saveAsDefault: ButtonProps = {
			block: true,
			disabled: saveLoading,
			onClick: this.handleSaveAsDefault,
			text: 'Сохранить по умолчанию'
		};

		const save: ButtonProps = {
			block: true,
			disabled: saveLoading,
			onClick: this.handleSave,
			text: 'Сохранить'
		};

		const cancel: ButtonProps = {
			block: true,
			onClick: cancelForm,
			text: 'Отмена',
			variant: 'bare'
		};

		return (
			<Fragment>
				{this.renderButton(saveAsDefault)}
				{this.renderButton(save)}
				{this.renderButton(cancel)}
			</Fragment>
		);
	};

	renderError = () => {
		const {saveError} = this.props;

		if (saveError) {
			return <div className="mt-1">Ошибка сохранения</div>;
		}
	};

	renderHeader = () => {
		const {values} = this.props;

		return (
			<div className={styles.header}>
				<Title className={styles.title}>{values.name}</Title>
			</div>
		);
	};

	renderMain = () => {
		const {values} = this.props;

		const name: TextAreaProps = {
			label: 'Название виджета',
			name: 'name',
			placeholder: 'Постарайтесь уместить название в две строчки текста',
			value: values.name
		};

		const nameVisibility: CheckBoxProps = {
			label: 'Название виджета',
			name: 'isNameShown',
			value: values.isNameShown
		};

		const desc: TextAreaProps = {
			label: 'Описание',
			name: 'desc',
			value: values.desc
		};

		const legendVisibility: CheckBoxProps = {
			label: 'Выводить легенду',
			name: 'isLegendShown',
			value: values.isLegendShown
		};

		const legendPosition: SelectProps = {
			label: 'Положение легенды',
			name: 'legendPosition',
			options: [
				{value: 'right', label: 'Справа'},
				{value: 'left', label: 'Слева'},
				{value: 'top', label: 'Вверху'},
				{value: 'bottom', label: 'Внизу'}
			],
			placeholder: '',
			value: values.legendPosition
		};

		const source: TreeSelectProps = {
			name: 'source',
			label: 'Источник',
			value: values.source
		};

		const chart: SelectProps = {
			label: 'Список диаграмм',
			name: 'chart',
			onChange: this.handleSelect,
			options: CHART_SELECTS,
			placeholder: 'Список диаграмм',
			value: values.chart
		};

		const breakdown: AttrSelectProps = {
			label: 'Разбивка',
			name: 'breakdown',
			placeholder: 'Разбивка',
			value: values.breakdown
		};

		return (
			<section className={styles.main}>
				{this.renderTextArea(name)}
				{this.renderTextArea(desc)}
				<Divider />
				{this.renderCheckBox(nameVisibility)}
				<Divider />
				{this.renderCheckBox(legendVisibility)}
				{this.renderSelect(legendPosition)}
				{this.renderVisibilityLegend()}
				{this.renderTreeSelect(source)}
				{this.renderSelect(chart)}
				{!typeOfCircleCharts(values.chart) && this.renderAxisInputs()}
				{this.renderAttrSelect(breakdown)}
				<div className={styles.featuresContainer}>
					<Divider />
					{this.renderTextWithIcon('Фильтрация')}
					<Divider />
					{this.renderTextWithIcon('Показатель')}
					<Divider />
					{this.renderTextWithIcon('Параметр')}
				</div>
			</section>
		);
	};

	renderFooter = () => (
		<div className={styles.footer}>
			{this.renderError()}
			{this.renderControlButtons()}
		</div>
	);

	renderForm = () => {
		const {handleSubmit} = this.props;

		return (
			<form onSubmit={handleSubmit} className={styles.form}>
				{this.renderHeader()}
				{this.renderMain()}
				{this.renderFooter()}
			</form>
		);
	};

	render () {
		return this.renderForm();
	}
}

export default WidgetFormPanel;
