// @flow
import {Button, InfoPanel} from 'components/atoms';
import {ClearSquareIcon, CrossIcon} from 'icons/form';
import {ConstantControl, Modal, OperatorControl, SourceControl} from 'components/molecules';
import type {Control, Props, State} from './types';
import {getAggregationLabel} from 'components/molecules/AttributeAggregation/helpers';
import {OPERATORS, TEMPLATE_NAMES, TEMPLATES, TYPES} from './constants';
import React, {Fragment, PureComponent} from 'react';
import styles from './styles.less';
import {TYPES as ATTR_TYPES} from 'store/sources/attributes/constants';
import uuid from 'tiny-uuid';
import {VARIANTS as BUTTON_VARIANTS} from 'components/atoms/Button/constants';

export class AttributeCreatingModal extends PureComponent<Props, State> {
	static defaultProps = {
		value: null
	};

	state = {
		controls: {},
		first: '',
		info: '',
		last: '',
		secondTemplateType: TYPES.SOURCE,
		showLegacyFormatInfo: false,
		showRemoveInfo: false,
		title: ''
	};

	componentDidMount () {
		const {value} = this.props;

		if (value) {
			const {state: JSONState, title} = value;
			let valueProps = {title};

			if (JSONState) {
				const state = JSON.parse(JSONState);
				valueProps = {...state, ...valueProps};
			} else {
				this.setState({showLegacyFormatInfo: true});
			}

			this.setState(valueProps);
		}
	}

	changeControlType = (name: string) => {
		const {controls} = this.state;
		const control = controls[name];
		const type = control.type === TYPES.SOURCE ? TYPES.CONSTANT : TYPES.SOURCE;

		this.setState({
			controls: {
				...controls,
				[name]: {...control, type}
			}
		});
	};

	changeTemplateType = (name: string) => {
		const secondTemplateType = name === TEMPLATE_NAMES.SOURCE ? TYPES.CONSTANT : TYPES.SOURCE;
		this.setState({secondTemplateType});
	};

	createName = () => {
		const {controls} = this.state;
		const name = uuid();

		return controls[name] ? this.createName() : name;
	};

	createNewControl = (value: any, type: string) => {
		const name = this.createName();
		const {controls, last} = this.state;
		let {first} = this.state;

		const control: Control = {
			name,
			next: '',
			prev: last,
			type,
			value
		};

		if (!first) {
			first = name;
		}

		if (last) {
			controls[last].next = name;
		}

		this.setState({
			controls: {
				...controls,
				[name]: control
			},
			first,
			last: name,
			secondTemplateType: TYPES.SOURCE
		});
	};

	handleChangeName = (e: SyntheticInputEvent<HTMLInputElement>) => {
		const {value: title} = e.currentTarget;
		this.setState({title});
	};

	handleChangeType = (name: string) => name in TEMPLATE_NAMES ? this.changeTemplateType(name) : this.changeControlType(name);

	handleClickClearIcon = () => this.setState({title: ''});

	handleClickConfirmRemoveButton = () => {
		const {onRemove, value} = this.props;

		if (onRemove && value) {
			onRemove(value.code);
		}
	};

	handleClickRemoveIcon = () => {
		const {controls, last} = this.state;
		const lastControl = controls[last];

		if (Object.keys(controls).length === 1) {
			return this.setState({
				controls: {},
				first: '',
				last: ''
			});
		}

		if (lastControl) {
			const {prev} = lastControl;
			delete controls[last];

			if (prev) {
				this.setState({
					controls: {
						...controls,
						[prev]: {...controls[prev], next: ''}
					},
					last: prev
				});
			}
		}
	};

	handleClickSaveButton = () => {
		const {onSubmit, value} = this.props;
		const {controls, first, last, title: customTitle} = this.state;
		const {SOURCE} = TYPES;
		const code = value ? value.code : uuid();
		const computeData = {};
		const state = JSON.stringify({controls, first, last});
		let controlName = first;
		let stringForCompute = '';
		let title = '';

		while (controlName) {
			const {name, next, type, value} = controls[controlName];
			controlName = next;

			if (value) {
				if (type === SOURCE) {
					const {aggregation, attribute: attr, dataKey, source} = value;

					computeData[name] = {
						aggregation,
						attr,
						dataKey
					};

					title = `${title} ${source.label} - ${attr.title} (${getAggregationLabel(aggregation)})`;
				} else {
					title = `${title} ${value}`;
				}

				stringForCompute = type === SOURCE ? `${stringForCompute}{${name}}` : `${stringForCompute}${value}`;
			}
		}

		onSubmit({
			code,
			computeData,
			state,
			stringForCompute,
			title: customTitle || title,
			type: ATTR_TYPES.COMPUTED_ATTR
		});
	};

	handleSelect = (name: string, value: any, type: string) => {
		const {controls} = this.state;

		if (name in TEMPLATE_NAMES) {
			return this.createNewControl(value, type);
		}

		this.setState({
			controls: {
				...controls,
				[name]: {...controls[name], value}
			}
		});
	};

	handleSelectOperator = (name: string, value: string) => this.handleSelect(name, value, TYPES.OPERATOR);

	handleSelectSource = (name: string, value: Object) => this.handleSelect(name, value, TYPES.SOURCE);

	handleSubmitConstant = (name: string, value: string) => this.handleSelect(name, value, TYPES.CONSTANT);

	hideLegacyFormatInfo = () => this.setState({showLegacyFormatInfo: false});

	hideRemoveInfo = () => this.setState({showRemoveInfo: false});

	resolveControlRender = (control: Control) => {
		const {CONSTANT, OPERATOR, SOURCE} = TYPES;
		const {type} = control;

		switch (type) {
			case CONSTANT:
				return this.renderConstantControl(control);
			case OPERATOR:
				return this.renderOperatorControl(control);
			case SOURCE:
				return this.renderSourceControl(control);
		}
	};

	showRemovalInfo = () => this.setState({showRemoveInfo: true});

	renderConstantControl = (control: Control) => {
		let {name, value} = control;

		if (value && typeof value !== 'string') {
			value = '';
		}

		return (
			<ConstantControl
				name={name}
				onCancel={this.handleChangeType}
				onSubmit={this.handleSubmitConstant}
				value={value}
			/>
		);
	};

	renderControlByType = (control: Control) => {
		const {name} = control;

		return (
			<div className={styles.controlContainer} key={name}>
				{this.resolveControlRender(control)}
				{this.renderRemoveButton(name)}
			</div>
		);
	};

	renderControls = () => {
		const {controls, first} = this.state;
		const items = [];
		let controlName = first;

		while (controlName) {
			const control = controls[controlName];
			controlName = control.next;
			items.push(this.renderControlByType(control));
		}

		return (
			<div className={styles.controlsContainer}>
				{items}
				{this.renderTemplates()}
			</div>
		);
	};

	renderFieldName = () => {
		const {title} = this.state;

		return (
			<div className={styles.nameContainer}>
				<div className={styles.nameLabel}>Название поля</div>
				<CrossIcon className={styles.nameClearIcon} onClick={this.handleClickClearIcon} />
				<input
					className={styles.nameInput}
					onChange={this.handleChangeName}
					value={title}
				/>
			</div>
		);
	};

	renderFooter = () => {
		const {onClose, value} = this.props;

		return (
			<div className={styles.footer}>
				<div>
					<Button className={styles.saveButton} onClick={this.handleClickSaveButton}>Сохранить</Button>
					<Button onClick={onClose} variant={BUTTON_VARIANTS.ADDITIONAL}>Отмена</Button>
				</div>
				<div>
					{value && <Button onClick={this.showRemovalInfo} variant={BUTTON_VARIANTS.SIMPLE}>Удалить</Button>}
				</div>
			</div>
		);
	};

	renderLegacyFormatInfo = () => {
		const {showLegacyFormatInfo} = this.state;
		const text = 'Формат данных формулы является устаревшим. Редактирование не доступно.';

		if (showLegacyFormatInfo) {
			return (
				<div className={styles.infoPanel}>
					<InfoPanel onClose={this.hideLegacyFormatInfo} text={text} />
				</div>
			);
		}
	};

	renderOperatorControl = (control: Control) => {
		const {name, value} = control;

		return (
			<OperatorControl
				name={name}
				onSelect={this.handleSelectOperator}
				options={OPERATORS}
				type={TYPES.OPERATOR}
				value={value}
			/>
		);
	};

	renderRemoveButton = (name: string) => {
		const {last} = this.state;

		if (name === last) {
			return (
				<div className={styles.removeIcon}>
					<ClearSquareIcon onClick={this.handleClickRemoveIcon} />
				</div>
			);
		}
	};

	renderRemoveInfo = () => {
		const {showRemoveInfo} = this.state;
		const text = 'Вычислимый атрибут будет удален без возможности восстановления. Подтвердите операцию';

		if (showRemoveInfo) {
			return (
				<div className={styles.infoPanel}>
					<InfoPanel onClose={this.hideRemoveInfo} onConfirm={this.handleClickConfirmRemoveButton} text={text} />
				</div>
			);
		}
	};

	renderSourceControl = (control: Control) => {
		const {sources} = this.props;
		let {name, value} = control;

		if (typeof value !== 'object') {
			value = null;
		}

		return (
			<SourceControl
				name={name}
				onClickButton={this.handleChangeType}
				onSelect={this.handleSelectSource}
				options={sources}
				type={TYPES.SOURCE}
				value={value}
			/>
		);
	};

	renderTemplates = () => {
		const {secondTemplateType} = this.state;
		const {CONSTANT_TEMPLATE, OPERATOR_TEMPLATE, SOURCE_TEMPLATE} = TEMPLATES;
		const secondTemplate = secondTemplateType === TYPES.SOURCE
			? this.renderControlByType(SOURCE_TEMPLATE)
			: this.renderControlByType(CONSTANT_TEMPLATE);

		return (
			<Fragment>
				{this.renderControlByType(OPERATOR_TEMPLATE)}
				{secondTemplate}
			</Fragment>
		);
	};

	render () {
		return (
			<Modal header="Создать поле" renderFooter={this.renderFooter} size="large">
				<div className={styles.container}>
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
