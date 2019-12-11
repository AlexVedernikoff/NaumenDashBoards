// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {AttrProps, GetRefOptions, OnSelectCallback, SelectMixin} from './types';
import {CHART_VARIANTS} from 'utils/chart';
import type {ComputedAttr} from 'components/organisms/WidgetFormPanel/Modals/ComputeAttrCreator/types';
import {ComputeAttrCreator} from 'components/organisms/WidgetFormPanel/Modals';
import {createOrderName, getNumberFromName, WIDGET_VARIANTS} from 'utils/widget';
import {createRefKey} from 'store/sources/refAttributes/actions';
import {FIELDS, getAggregateOptions, getGroupOptions, styles as mainStyles, TYPES, VALUES} from 'components/organisms/WidgetFormPanel';
import FormBuilder from 'components/organisms/WidgetFormPanel/Builders/FormBuilder';
import type {OptionType} from 'react-select/src/types';
import type {Props as TreeProps, TreeSelectValue} from 'components/molecules/TreeSelectInput/types';
import React, {Fragment} from 'react';

export class DataFormBuilder extends FormBuilder {
	state = {
		fieldName: '',
		showModal: false
	};

	// Список полей для удаления при смене источника данных
	sourceRefs = [];

	applyCallback = (callback?: OnSelectCallback, ...params: Array<any>) => {
		if (callback && typeof callback === 'function') {
			// $FlowFixMe
			setTimeout(() => callback(params));
		}
	};
	/**
	 * Функция вызова окна фильтрации
	 * @param {string} descriptorName - название поля дескриптора
	 * @param {string} sourceName - название поля источника
	 * @returns {void | Promise<void>}
	 */
	callFilterModal = (descriptorName: string, sourceName: string) => async () => {
		const {setFieldValue, values} = this.props;
		const source = values[sourceName];
		const descriptor = values[descriptorName];

		if (source) {
			const context = descriptor ? JSON.parse(descriptor) : this.createFilterContext(source.value);

			try {
				const {serializedContext} = await window.jsApi.commands.filterForm(context);
				setFieldValue(descriptorName, serializedContext);
			} catch (e) {
				console.error('Ошибка окна фильтрации: ', e);
			}
		}
	};

	/**
	 * Функция очищает зависимые от источника поля
	 * @param {string} name - название поля источника
	 */
	clearSourceRefFields = (name: string) => {
		const {setFieldValue} = this.props;
		const number = getNumberFromName(name);
		let fields = this.sourceRefs;

		if (Number.isInteger(number)) {
			const createName = createOrderName(number);
			fields = fields.map(createName);
		}

		fields.forEach(ref => setFieldValue(ref, null));
	};

	/**
	 * Функция создает базавый контекст для вызова окна фильтрации
	 * @param {string} classFqn - код источника данных
	 * @returns {object}
	 */
	createFilterContext = (classFqn: string) => {
		const {context: mainContext} = this.props;

		const context: Object = {
			contentUuid: mainContext.contentCode
		};

		if (classFqn.includes('$')) {
			context.cases = [classFqn];
		} else {
			context.clazz = classFqn;
		}

		return context;
	};

	/**
	 * Функция создает название зависимого поля
	 * @param {string} targetName - название главного поля
	 * @param {string} baseRefName - базовое название зависимого поля
	 * @returns {string}
	 */
	createRefName = (targetName: string, baseRefName: string) => {
		const number = getNumberFromName(targetName);
		return isNaN(number) ? baseRefName : createOrderName(number)(baseRefName);
	};

	/**
	 * Функция возвращает список атрибутов источника данных
	 * @param {string} name - название поля исчтоника данных
	 * @returns {Array<Attribute>}
	 */
	getAttributeOptions = (name: string) => {
		const {attributes, fetchAttributes, values} = this.props;
		let sourceName = FIELDS.source;
		let options = [];

		if (name.includes('_')) {
			sourceName = createOrderName(getNumberFromName(name))(sourceName);
		}

		const source = values[sourceName];

		if (source) {
			const currentAttr = attributes[source.value];

			if (!currentAttr) {
				fetchAttributes(source.value);
			} else {
				options = currentAttr.data;
			}
		}

		return options;
	};

	/**
	 * Функция возвращает список атрибутов ссылочного атрибута
	 * @param {Attribute} attr - ссылочный атрибут
	 * @returns {Array<Attribute>}
	 */
	getRefAttributeOptions = (attr: Attribute) => {
		const {refAttributes, fetchRefAttributes} = this.props;
		const key = createRefKey(attr);
		let options = [];

		const currentAttributes = refAttributes[key];

		if (!currentAttributes) {
			fetchRefAttributes(attr);
		} else {
			options = currentAttributes.data;
		}

		return options;
	};

	handleChangeLabel = (key: string) => (fieldName: string, name: string) => {
		const {setFieldValue, values} = this.props;
		const value = values[fieldName];
		value[key] = name;

		setFieldValue(fieldName, value);
	};

	handleClickExtendBreakdown = (withBreakdownName: string) => () => this.props.setFieldValue(withBreakdownName, true);

	handleCreateAttr = (name: string, attr: ComputedAttr) => {
		const {setFieldValue, values} = this.props;
		let computedAttrs = values[FIELDS.computedAttrs];
		computedAttrs = Array.isArray(computedAttrs) ? [attr, ...computedAttrs] : [attr];

		setFieldValue(name, attr);
		setFieldValue(FIELDS.computedAttrs, computedAttrs);
		this.handleShowModal(false)();
	};

	handleRemoveBreakdown = (breakdownName: string) => {
		const {setFieldValue} = this.props;
		const withBreakdownName = this.createRefName(breakdownName, FIELDS.withBreakdown);

		setFieldValue(breakdownName, null);
		setFieldValue(withBreakdownName, false);
	};

	handleSelectAttr = (parent?: Attribute, callback?: OnSelectCallback) => (name: string, value: OptionType) => {
		const {setFieldValue, values} = this.props;

		if (parent) {
			parent.ref = value;
			setFieldValue(name, values[name]);
		} else {
			setFieldValue(name, value);
		}

		this.applyCallback(callback);
	};

	handleSelectSource = (callback?: OnSelectCallback) => async (name: string, source: TreeSelectValue | null) => {
		const {attributes, fetchAttributes, setFieldValue, values} = this.props;
		const currentSource = values[name];

		if (source) {
			await setFieldValue(name, {...source});

			if (currentSource && currentSource.value !== source.value) {
				const descriptorName = this.createRefName(name, FIELDS.descriptor);

				setFieldValue(descriptorName, null);
			}

			const classFqn = source.value;

			if (!attributes[classFqn]) {
				fetchAttributes(classFqn);
			}
		} else {
			await setFieldValue(name, null);
		}

		this.clearSourceRefFields(name);
		this.applyCallback(callback, name);
	};

	handleSelectWithRef = (refName: string, getRefOptions: GetRefOptions) => (parent: Attribute | null, callback?: OnSelectCallback) => (name: string, value: OptionType) => {
		const {setFieldValue, values} = this.props;
		const refOptions = getRefOptions(value);
		let prevValue = values[name];

		if (parent) {
			const prevRefValue = parent.ref;
			parent.ref = {...value};

			setFieldValue(name, prevValue);
			prevValue = prevRefValue;
		} else {
			setFieldValue(name, {...value});
		}

		if (!prevValue || prevValue.type !== value.type) {
			let refValue = refOptions[0].value;

			if (/group/i.test(refName) && TYPES.DATE.includes(value.type)) {
				refValue = VALUES.DATETIME_GROUP.MONTH;
			}

			setFieldValue(refName, refValue);
		}

		this.applyCallback(callback);
	};

	handleShowModal = (showModal: boolean, fieldName: string = '') => () => this.setState({fieldName, showModal});

	isRequiredBreakdown = () => {
		const {type} = this.props.values;
		const {BAR_STACKED, COLUMN_STACKED, DONUT, PIE} = CHART_VARIANTS;
		const {TABLE} = WIDGET_VARIANTS;

		return [BAR_STACKED, COLUMN_STACKED, DONUT, PIE, TABLE].includes(type);
	};

	renderAggregation = (name: string, refName: string) => {
		const {values} = this.props;
		const refValue = values[refName];
		const options = getAggregateOptions(refValue);
		const value = values[name];

		const props = {
			name,
			options,
			tip: 'Агрегация',
			value
		};

		if (!refValue || (refValue && refValue.type !== TYPES.COMPUTED_ATTR)) {
			return this.renderMiniSelect(props);
		}
	};

	renderAttribute = (props: AttrProps) => {
		const {computedAttrs} = this.props.values;
		// $FlowFixMe
		const {onSelectCallback, parent, refInput, withCreate, withDivider, ...selectProps} = props;
		const {name, value} = selectProps;
		let {onSelect, options} = selectProps;

		const attrSelectProps = {
			...selectProps,
			attr: true,
			showBorder: false,
			isEditableLabel: true
		};

		if (!options) {
			options = this.getAttributeOptions(name);
		}

		if (value) {
			attrSelectProps.form = {
				onSubmit: this.handleChangeLabel('title'),
				value: value.title
			};

			if (TYPES.REF.includes(value.type)) {
				const currentOnSelect = !parent && onSelect ? onSelect : this.handleSelectAttr;

				const currentProps = {
					...attrSelectProps,
					hideError: true,
					onSelect: currentOnSelect(parent, onSelectCallback),
					options
				};

				const refProps = {
					...props,
					options: this.getRefAttributeOptions(value),
					parent: value,
					value: value.ref
				};

				return (
					<Fragment>
						<div className={mainStyles.field}>
							{this.renderSelect(currentProps)}
						</div>
						{this.renderAttribute(refProps)}
					</Fragment>
				);
			}
		}

		if (withCreate) {
			attrSelectProps.onClickCreateButton = this.handleShowModal(true, name);
			attrSelectProps.createButtonText = 'Создать поле';

			if (Array.isArray(computedAttrs)) {
				options = [...computedAttrs, ...options];
			}
		}

		onSelect = onSelect ? onSelect(parent, onSelectCallback) : this.handleSelectAttr(parent, onSelectCallback);
		const attrInput = this.renderSelect({...attrSelectProps, onSelect, options, withCreate});

		if (refInput) {
			return this.renderCombinedInputs(refInput, attrInput, withDivider);
		}

		return (
			<div className={mainStyles.field}>
				{attrInput}
				{withDivider && this.renderFieldDivider()}
			</div>
		);
	};

	renderBreakdown = (name: string = FIELDS.breakdown, breakdownGroupName: string = FIELDS.breakdownGroup) => {
		const {values} = this.props;

		const props = {
			isRemoving: !this.isRequiredBreakdown(),
			name,
			onRemove: this.handleRemoveBreakdown,
			onSelect: this.handleSelectWithRef(breakdownGroupName, getGroupOptions),
			refInput: this.renderGroup(breakdownGroupName, name),
			value: values[name],
			withDivider: false
		};

		return this.renderAttribute(props);
	};

	renderBreakdownExtendButton = (withBreakdown: string) => {
		const {values} = this.props;
		const breakdownName = this.createRefName(withBreakdown, FIELDS.breakdown);

		const props = {
			onClick: this.handleClickExtendBreakdown(withBreakdown),
			text: 'Разбивка',
			active: values[withBreakdown] || values[breakdownName] || this.isRequiredBreakdown()
		};

		return this.renderExtendButton(props);
	};

	renderBreakdownWithExtend = (withBreakdown: string = FIELDS.withBreakdown, breakdown: string = FIELDS.breakdown, breakdownGroup: string = FIELDS.breakdownGroup) => {
		const {values} = this.props;
		const showBreakdown = values[withBreakdown] || values[breakdown] || this.isRequiredBreakdown();

		return (
			<Fragment>
				{this.renderBreakdownExtendButton(withBreakdown)}
				{showBreakdown && this.renderBreakdown(breakdown, breakdownGroup)}
			</Fragment>
		);
	};

	renderGroup = (name: string, refName: string, mixin: ?SelectMixin) => {
		const {values} = this.props;
		const refValue = values[refName];
		const options = getGroupOptions(refValue);
		const group = values[name];
		let isDisabled = false;

		let props = {
			isDisabled,
			name,
			options,
			tip: 'Группировка',
			value: group
		};

		if (mixin) {
			props = {...props, ...mixin};
		}

		return this.renderMiniSelect(props);
	};

	renderIndicator = (name: string = FIELDS.indicator, aggregationName: string = FIELDS.aggregation, mixin?: SelectMixin) => {
		const {values} = this.props;

		let props = {
			name,
			onSelect: this.handleSelectWithRef(aggregationName, getAggregateOptions),
			refInput: this.renderAggregation(aggregationName, name),
			value: values[name]
		};

		if (mixin) {
			props = {...props, ...mixin};
		}

		return this.renderAttribute(props);
	};

	renderModal = () => {
		const {fieldName, showModal} = this.state;

		if (showModal) {
			return (
				<ComputeAttrCreator
					name={fieldName}
					onClose={this.handleShowModal(false)}
					onSubmit={this.handleCreateAttr}
				/>
			);
		}
	};

	renderSource = (name: string = FIELDS.source, callback?: OnSelectCallback) => {
		const {values, sources} = this.props;
		const value = values[name];
		const descriptorName = this.createRefName(name, FIELDS.descriptor);

		let props: TreeProps = {
			name: name,
			onChange: this.handleSelectSource(callback),
			placeholder: 'Выберите значение',
			tree: sources,
			value
		};

		const filterProps = {
			active: values[descriptorName],
			onClick: this.callFilterModal(descriptorName, name),
			text: 'Фильтр'
		};

		if (value) {
			props.form = {
				onSubmit: this.handleChangeLabel('label'),
				value: value.label
			};
		}

		return (
			<Fragment>
				{this.renderTreeSelect(props)}
				{this.renderExtendButton(filterProps)}
			</Fragment>
		);
	};
}

export default DataFormBuilder;
