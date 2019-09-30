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
	CheckBoxProps,
	SelectProps,
	SelectValue,
	TextAreaProps,
	TreeSelectProps
} from './types';
import {CHART_SELECTS} from 'utils/chart';
import DataSourceInput from 'containers/DataSourceInput';
import {getActualAggregate, getAggregateOptions, typeOfExtendedAggregate} from 'utils/aggregate';
import {getGroupOptions, typeOfExtendedGroups} from 'utils/group';
import {ErrorMessage} from 'formik';
import type {OptionType} from 'react-select/src/types';
import type {Props} from 'containers/WidgetFormPanel/types';
import React, {Component, Fragment} from 'react';
import styles from './styles.less';

export class WidgetFormPanel extends Component<Props> {
	handleResetTextArea = (name: string) => this.props.setFieldValue(name, '');

	handleSelect = (value: OptionType, name: string) => this.props.setFieldValue(name, value);

	handleSelectXAxis = (value: OptionType) => {
		const {setFieldValue} = this.props;

		setFieldValue('xAxis', value);

		if (!typeOfExtendedGroups(value)) {
			setFieldValue('group', null);
		}
	};

	handleSelectYAxis = (value: OptionType) => {
		const {setFieldValue, values} = this.props;

		setFieldValue('yAxis', value);

		if (!typeOfExtendedAggregate(value)) {
			setFieldValue('aggregate', getActualAggregate(value, values.group));
		}
	};

	handleSelectSource = (source: SelectValue) => {
		const {attributes, fetchAttributes, setFieldValue} = this.props;

		setFieldValue('source', source);
		['xAxis', 'yAxis', 'aggregate', 'group'].forEach(k => setFieldValue(k, null));

		if (!attributes[source.value]) {
			fetchAttributes(source.value);
		}
	};

	renderAttrSelect = (props: AttrSelectProps) => {
		const {isLoading, label, name, onChange, options, placeholder, value} = props;

		return (
			<div className={styles.multiselectContainer}>
				<AttrSelect
					isLoading={isLoading}
					label={label}
					name={name}
					onChange={onChange}
					options={options}
					placeholder={placeholder}
					value={value}
				/>
				<ErrorMessage name={name}/>
			</div>
		);
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

	renderControlButtons = () => {
		const {cancelForm} = this.props;

		return (
			<Fragment>
				<div className={styles.buttonContainer}>
					<Button type="submit">Применить</Button>
				</div>
				<div className={styles.buttonContainer}>
					<Button outline variant='bare' onClick={cancelForm}>Отмена</Button>
				</div>
			</Fragment>
		);
	};

	renderDropDown = (axisesVisibility, axisesLabelsVisibility, axisesMeaningsVisibility) => (
		<div className={styles.dropdownMenuContainer}>
			<DropDownMenu name="Редактировать легенду">
				<div className={styles.checkboxContainerLeft}>
					{this.renderCheckBox(axisesVisibility)}
					<Divider className={styles.dividerLeft}/>
				</div>
				<div className={styles.checkboxContainerLeft}>
					{this.renderCheckBox(axisesLabelsVisibility)}
					<Divider className={styles.dividerLeft}/>
				</div>
				<div className={styles.checkboxContainerLeft}>
					{this.renderCheckBox(axisesMeaningsVisibility)}
					<Divider className={styles.dividerLeft}/>
				</div>
			</DropDownMenu>
		</div>
	);

	renderFooter = () => (
		<div className={styles.footer}>
			{this.renderControlButtons()}
		</div>
	);

	renderForm = () => {
		const {
			attributes,
			isLoadingAttr,
			handleSubmit,
			values
		} = this.props;

		const attrOptions = (values.source && attributes[values.source.value]) || [];

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

		const axisesVisibility: CheckBoxProps = {
			label: 'Выводить название осей',
			name: 'areAxisesNamesShown',
			value: values.areAxisesNamesShown
		};

		const axisesLabelsVisibility: CheckBoxProps = {
			label: 'Выводить подписи осей',
			name: 'areAxisesLabelsShown',
			value: values.areAxisesLabelsShown
		};

		const axisesMeaningsVisibility: CheckBoxProps = {
			label: 'Выводить подписи значений',
			name: 'areAxisesMeaningsShown',
			value: values.areAxisesMeaningsShown
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
			label: 'Источник',
			name: 'desc',
			value: values.source
		};

		const chart: SelectProps = {
			name: 'chart',
			options: CHART_SELECTS,
			placeholder: 'Список диаграмм',
			value: values.chart
		};

		const xAxis: AttrSelectProps = {
			isLoading: isLoadingAttr,
			label: 'Ось X',
			name: 'xAxis',
			onChange: this.handleSelectXAxis,
			options: attrOptions,
			placeholder: 'Ось X',
			value: values.xAxis
		};

		const group: SelectProps = {
			name: 'chart',
			options: getGroupOptions(values.xAxis),
			placeholder: 'Группировка',
			value: values.group
		};

		const yAxis: AttrSelectProps = {
			isLoading: isLoadingAttr,
			label: 'Ось Y',
			name: 'yAxis',
			onChange: this.handleSelectYAxis,
			options: attrOptions,
			placeholder: 'Ось T',
			value: values.yAxis
		};

		const aggregate: SelectProps = {
			name: 'aggregate',
			options: getAggregateOptions(values.yAxis),
			placeholder: 'Агрегация',
			value: values.aggregate
		};

		return (
			<form onSubmit={handleSubmit} className={styles.form}>
				{this.renderHeader('Новый виджет')}
				{this.renderMain(
					aggregate,
					axisesLabelsVisibility,
					axisesMeaningsVisibility,
					axisesVisibility,
					chart,
					desc,
					group,
					legendPosition,
					legendVisibility,
					name,
					nameVisibility,
					source,
					values,
					xAxis,
					yAxis
				)}
				{this.renderFooter()}
			</form>
		);
	};

	renderHeader = (name) => (
		<div className={styles.header}>
			<Title className={styles.title}>{name}</Title>
		</div>
	);

	renderMain = (
		aggregate,
		axisesLabelsVisibility,
		axisesMeaningsVisibility,
		axisesVisibility,
		chart,
		desc,
		group,
		legendPosition,
		legendVisibility,
		name,
		nameVisibility,
		source,
		values,
		xAxis,
		yAxis
	) => (
		<section className={styles.main}>
			{this.renderTextArea(name)}
			{this.renderTextArea(desc)}
			<Divider />
			{this.renderCheckBox(nameVisibility)}
			<Divider />
			{this.renderCheckBox(legendVisibility)}
			{this.renderSelect(legendPosition)}
			{this.renderDropDown(axisesVisibility, axisesLabelsVisibility, axisesMeaningsVisibility)}
			{this.renderTreeSelect(source)}
			{this.renderSelect(chart)}
			{this.renderAttrSelect(xAxis)}
			{typeOfExtendedGroups(values.xAxis) && this.renderSelect(group)}
			{this.renderAttrSelect(yAxis)}
			{this.renderSelect(aggregate)}
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

	renderSelect = (props: SelectProps) => {
		const {label, name, options, placeholder, value} = props;

		return (
			<div className={styles.multiselectContainer}>
				<MultiSelect
					label={label}
					name={name}
					onChange={this.handleSelect}
					options={options}
					placeholder={placeholder}
					value={value}
				/>
				<ErrorMessage name={name}/>
			</div>
		);
	};

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

	renderTextWithIcon = name => <TextWithIcon name={name} />;

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

	render () {
		return this.renderForm();
	}
}

export default WidgetFormPanel;
