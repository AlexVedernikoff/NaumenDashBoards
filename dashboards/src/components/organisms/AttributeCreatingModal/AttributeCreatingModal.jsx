// @flow
import {ATTRIBUTE_TYPES} from 'store/sources/attributes/constants';
import Button from 'components/atoms/Button';
import ConstantControl from './components/ConstantControl';
import type {Control, ControlType, Props, State} from './types';
import {CONTROL_TYPES, MATH_OPERATORS, OPERATORS, TEMPLATE_NAME, TEMPLATES} from './constants';
import {getAggregationLabel} from 'WidgetFormPanel/components/AttributeAggregationField/helpers';
import {getMapValues, isObject} from 'helpers';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import InfoPanel from 'components/atoms/InfoPanel';
import Modal from 'components/molecules/Modal';
import OperatorControl from './components/OperatorControl';
import React, {createRef, PureComponent} from 'react';
import type {Ref} from 'components/types';
import {SIZES as MODAL_SIZES} from 'components/molecules/Modal/constants';
import SourceControl from './components/SourceControl';
import styles from './styles.less';
import t from 'localization';
import T from 'components/atoms/Translation';
import uuid from 'tiny-uuid';
import {VARIANTS as BUTTON_VARIANTS} from 'components/atoms/Button/constants';

export class AttributeCreatingModal extends PureComponent<Props, State> {
	constantsInputs: Array<Ref<typeof ConstantControl>> = [];

	static defaultProps = {
		value: null
	};

	state = {
		controls: [],
		info: '',
		showFormulaError: false,
		showLegacyFormatInfo: false,
		showRemoveInfo: false,
		templates: [TEMPLATES.OPERATOR_TEMPLATE, TEMPLATES.SOURCE_TEMPLATE],
		title: ''
	};

	componentDidMount () {
		const {value} = this.props;

		if (value) {
			const {state: JSONState, title} = value;
			let valueProps = {title};

			if (JSONState) {
				let {controls, first} = JSON.parse(JSONState);

				if (isObject(controls) && first) {
					const arrControls = [];
					let key = first;

					while (controls[key]) {
						arrControls.push(controls[key]);
						key = controls[key].next;
					}

					controls = arrControls;
				}

				valueProps = {...valueProps, controls};
			} else {
				this.setState({showLegacyFormatInfo: true});
			}

			this.setState(valueProps);
		}
	}

	changeControlType = (index: number) => {
		const {controls} = this.state;
		const control = controls[index];

		controls[index] = {
			...control,
			type: control.type === CONTROL_TYPES.SOURCE ? CONTROL_TYPES.CONSTANT : CONTROL_TYPES.SOURCE
		};

		this.setState({controls: [...controls]});
	};

	changeTemplateType = () => {
		const {templates} = this.state;
		const {CONSTANT_TEMPLATE, SOURCE_TEMPLATE} = TEMPLATES;

		templates[1] = templates[1].type === CONTROL_TYPES.SOURCE ? CONSTANT_TEMPLATE : SOURCE_TEMPLATE;
		this.setState({templates: [...templates]});
	};

	checkAndSaveAttribute = () => {
		const {controls} = this.state;
		const lastControl = controls[controls.length - 1];

		if (lastControl) {
			const {type, value} = lastControl;

			if (type !== CONTROL_TYPES.OPERATOR || !getMapValues(MATH_OPERATORS).includes(value)) {
				this.saveAttribute();
				return;
			}
		}

		this.setState({showFormulaError: true});
	};

	createNewControl = (value: any, type: ControlType) => {
		const {controls, templates} = this.state;
		const control: Control = {name: uuid(), type, value};

		templates[1] = TEMPLATES.SOURCE_TEMPLATE;

		this.setState({
			controls: [...controls, control],
			templates
		});
	};

	handleChangeName = (e: SyntheticInputEvent<HTMLInputElement>) => {
		const {value: title} = e.currentTarget;

		this.setState({title});
	};

	handleChangeType = (index: number, name: string) => {
		name === TEMPLATE_NAME ? this.changeTemplateType() : this.changeControlType(index);
	};

	handleClickClearIcon = () => this.setState({title: ''});

	handleClickConfirmRemoveButton = () => {
		const {onRemove, value} = this.props;

		if (onRemove && value) {
			onRemove(value);
		}
	};

	handleClickRemoveIcon = () => {
		const {controls} = this.state;

		controls.pop();
		this.setState({controls: [...controls]});
	};

	handleClickSaveButton = () => {
		this.constantsInputs.forEach(({current}) => current && current.forceSuccess());

		this.setState({}, () => { // хак ожидания обновления стейта, который возможно будет изменен через forceSuccess
			this.checkAndSaveAttribute();
		});
	};

	handleSelect = (index: number, name: string, value: any, type: ControlType) => {
		const {controls} = this.state;

		if (name === TEMPLATE_NAME) {
			return this.createNewControl(value, type);
		}

		controls[index] = {
			...controls[index],
			value
		};

		this.setState({controls: [...controls]});
	};

	hideFormulaError = () => this.setState({showFormulaError: false});

	hideLegacyFormatInfo = () => this.setState({showLegacyFormatInfo: false});

	hideRemoveInfo = () => this.setState({showRemoveInfo: false});

	resolveControlRender = (control: Control, index: number) => {
		const {CONSTANT, OPERATOR, SOURCE} = CONTROL_TYPES;
		const {type} = control;

		switch (type) {
			case CONSTANT:
				return this.renderConstantControl(control, index);
			case OPERATOR:
				return this.renderOperatorControl(control, index);
			case SOURCE:
				return this.renderSourceControl(control, index);
		}
	};

	saveAttribute = () => {
		const {onSubmit, value} = this.props;
		const {controls, title: customTitle} = this.state;
		const {SOURCE} = CONTROL_TYPES;
		const code = value ? value.code : uuid();
		const computeData = {};
		const state = JSON.stringify({controls});
		let stringForCompute = '';
		let title = '';

		controls.forEach(control => {
			const {name, type, value} = control;

			if (value) {
				if (type === SOURCE) {
					const {aggregation, attribute: attr, dataKey, source} = value;

					title = `${title} ${source.label} - ${attr.title} (${getAggregationLabel(aggregation)})`;

					computeData[name] = {
						aggregation,
						attr,
						dataKey
					};
				} else {
					title = `${title} ${value}`;
				}

				stringForCompute = type === SOURCE ? `${stringForCompute}{${name}}` : `${stringForCompute}${value}`;
			}
		});

		onSubmit({
			code,
			computeData,
			state,
			stringForCompute,
			title: customTitle || title,
			type: ATTRIBUTE_TYPES.COMPUTED_ATTR
		});
	};

	showRemovalInfo = () => this.setState({showRemoveInfo: true});

	renderConstantControl = (control: Control, index: number) => {
		let {name, value} = control;
		const ref = createRef();

		if (value && typeof value === 'object') {
			value = '';
		}

		this.constantsInputs.push(ref);

		return (
			<ConstantControl
				index={index}
				name={name}
				onCancel={this.handleChangeType}
				onSubmit={this.handleSelect}
				ref={ref}
				type={CONTROL_TYPES.CONSTANT}
				value={value}
			/>
		);
	};

	renderControlByType = (control: Control, index: number) => (
		<div className={styles.controlContainer} key={index}>
			{this.resolveControlRender(control, index)}
			{this.renderRemoveButton(control, index)}
		</div>
	);

	renderControls = () => {
		const {controls, templates} = this.state;

		return (
			<div className={styles.controlsContainer}>
				{controls.map(this.renderControlByType)}
				{templates.map(this.renderControlByType)}
			</div>
		);
	};

	renderFieldName = () => {
		const {title} = this.state;

		return (
			<div className={styles.nameContainer}>
				<div className={styles.nameLabel}><T text="AttributeCreatingModal::FieldName" /></div>
				<Icon className={styles.nameClearIcon} name={ICON_NAMES.REMOVE} onClick={this.handleClickClearIcon} />
				<input
					className={styles.nameInput}
					onChange={this.handleChangeName}
					value={title}
				/>
			</div>
		);
	};

	renderFooter = () => {
		const {onClose} = this.props;
		const {showFormulaError} = this.state;

		return (
			<div className={styles.footer}>
				<Button className={styles.saveButton} disabled={showFormulaError} onClick={this.handleClickSaveButton}>
					<T text="AttributeCreatingModal::Save" />
				</Button>
				<Button onClick={onClose} variant={BUTTON_VARIANTS.ADDITIONAL}>
					<T text="AttributeCreatingModal::Cancel" />
				</Button>
				{this.renderFooterRemoveButton()}
			</div>
		);
	};

	renderFooterRemoveButton = () => {
		const {value} = this.props;

		if (value) {
			return (
				<Button
					className={styles.footerRemoveButton}
					onClick={this.showRemovalInfo}
					variant={BUTTON_VARIANTS.SIMPLE}>
					<T text="AttributeCreatingModal::Delete" />
				</Button>
			);
		}
	};

	renderFormulaError = () => {
		const {showFormulaError} = this.state;
		const text = t('AttributeCreatingModal::FormulaError');

		if (showFormulaError) {
			return (
				<div className={styles.infoPanel}>
					<InfoPanel onClose={this.hideFormulaError} text={text} />
				</div>
			);
		}
	};

	renderLegacyFormatInfo = () => {
		const {showLegacyFormatInfo} = this.state;
		const text = t('AttributeCreatingModal::OldFormat');

		if (showLegacyFormatInfo) {
			return (
				<div className={styles.infoPanel}>
					<InfoPanel onClose={this.hideLegacyFormatInfo} text={text} />
				</div>
			);
		}
	};

	renderOperatorControl = (control: Control, index: number) => {
		const {name, value} = control;

		return (
			<OperatorControl
				index={index}
				name={name}
				onSelect={this.handleSelect}
				options={OPERATORS}
				type={CONTROL_TYPES.OPERATOR}
				value={value}
			/>
		);
	};

	renderRemoveButton = (control: Control, index: number) => {
		const {controls} = this.state;

		if (index === controls.length - 1 && control.name !== TEMPLATE_NAME) {
			return (
				<div className={styles.removeIcon}>
					<Icon name={ICON_NAMES.SQUARE_REMOVE} onClick={this.handleClickRemoveIcon} />
				</div>
			);
		}
	};

	renderRemoveInfo = () => {
		const {showRemoveInfo} = this.state;
		const text = t('AttributeCreatingModal::Confirm');

		if (showRemoveInfo) {
			return (
				<div className={styles.infoPanel}>
					<InfoPanel onClose={this.hideRemoveInfo} onConfirm={this.handleClickConfirmRemoveButton} text={text} />
				</div>
			);
		}
	};

	renderSourceControl = (control: Control, index: number) => {
		const {onFetch, options} = this.props;
		let {name, value} = control;

		if (typeof value !== 'object') {
			value = null;
		}

		return (
			<SourceControl
				index={index}
				name={name}
				onAddConstant={this.handleChangeType}
				onFetch={onFetch}
				onSelect={this.handleSelect}
				options={options}
				value={value}
			/>
		);
	};

	render () {
		this.constantsInputs = [];
		return (
			<Modal header={t('AttributeCreatingModal::CreateField')} renderFooter={this.renderFooter} size={MODAL_SIZES.LARGE}>
				<div className={styles.container}>
					{this.renderFormulaError()}
					{this.renderRemoveInfo()}
					{this.renderLegacyFormatInfo()}
					{this.renderFieldName()}
					{this.renderControls()}
				</div>
			</Modal>
		);
	}
}

export default AttributeCreatingModal;
