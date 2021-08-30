// @flow
import {COMPONENTS_CONTEXT} from './HOCs/withComponents';
import CustomGroup from './components/CustomGroup';
import defaultComponents from './defaultComponents';
import {FIELDS} from './constants';
import FormField from './components/FormField';
import {getDefaultSystemGroup} from 'store/widgets/helpers';
import type {GroupWay} from 'store/widgets/data/types';
import {GROUP_WAYS} from 'store/widgets/constants';
import Label from 'components/atoms/Label';
import Modal from 'components/molecules/Modal';
import type {OnChangeEvent, OnChangeInputEvent, Ref} from 'components/types';
import {OR_CONDITION_OPTIONS_CONTEXT} from './HOCs/withOrConditionOptions';
import type {Props, State} from './types';
import RadioField from 'components/atoms/RadioField';
import React, {Component, createRef, Fragment} from 'react';
import styles from './styles.less';
import TextInput from 'components/atoms/TextInput';

export class GroupModal extends Component<Props, State> {
	static defaultProps = {
		components: defaultComponents,
		systemOptions: []
	};

	state = this.initState(this.props);

	customGroupRef: Ref<typeof CustomGroup> = createRef();

	initState (props: Props): State {
		const {attribute, value} = props;
		const {data, way} = value;
		const {CUSTOM, SYSTEM} = GROUP_WAYS;
		const systemData = way === SYSTEM ? data : getDefaultSystemGroup(attribute).data;
		const customData = way === CUSTOM ? data : '';

		return {
			attribute,
			customData,
			submitted: false,
			submitting: false,
			systemData,
			way
		};
	}

	componentDidCatch (e: Error) {
		console.error(e);
		this.props.onClose();
	}

	handleChange = ({name, value}: OnChangeInputEvent) => this.setState({[name]: value});

	handleChangeAttributeTitle = (e: OnChangeEvent<string>) => {
		const {attribute} = this.state;
		const {value: title} = e;
		const newAttribute = {
			...attribute,
			title
		};

		this.setState({
			attribute: newAttribute
		});
	};

	handleSelectCustomGroup = (customData: string) => this.setState({
		customData,
		submitted: false
	});

	handleSelectSystemGroup = (systemData: string) => this.setState({systemData});

	handleSubmit = async (force: boolean = false) => {
		const {onSubmit} = this.props;
		const {attribute, systemData, way} = this.state;
		const data = way === GROUP_WAYS.SYSTEM ? systemData : await this.saveCustomGroup(force);

		if (data) {
			const group = {
				data,
				way
			};

			onSubmit(group, attribute);
		}

		this.setState({submitted: true});
	};

	saveCustomGroup = async (force: boolean = false) => {
		this.setState({submitting: true});

		const id = await this.customGroupRef.current?.save(force);

		this.setState({submitting: false});

		return id;
	};

	renderCustomGroup = () => {
		const {components, customGroups, customType, orConditionOptions, schema} = this.props;
		const {customData, submitted, way} = this.state;

		if (way === GROUP_WAYS.CUSTOM) {
			return (
				<COMPONENTS_CONTEXT.Provider value={components}>
					<OR_CONDITION_OPTIONS_CONTEXT.Provider value={orConditionOptions}>
						<div className={styles.divider} />
						<components.CustomGroup
							forwardedRef={this.customGroupRef}
							onSelect={this.handleSelectCustomGroup}
							onSubmit={this.handleSubmit}
							options={customGroups}
							schema={schema}
							submitted={submitted}
							type={customType}
							value={customData}
						/>
					</OR_CONDITION_OPTIONS_CONTEXT.Provider>
				</COMPONENTS_CONTEXT.Provider>
			);
		}

		return null;
	};

	renderNameField = () => {
		const {attribute} = this.state;

		return (
			<FormField label="Название поля">
				<TextInput onChange={this.handleChangeAttributeTitle} value={attribute.title} />
			</FormField>
		);
	};

	renderSystemGroup = () => {
		const {components, systemOptions} = this.props;
		const {systemData} = this.state;

		return (
			<components.SystemGroup onChange={this.handleSelectSystemGroup} options={systemOptions} value={systemData} />
		);
	};

	renderWayControl = () => (
		<Fragment>
			<Label className={styles.wayLabel}>Тип группировки</Label>
			{this.renderWayField(GROUP_WAYS.SYSTEM, 'Системная', this.renderSystemGroup())}
			{this.renderWayField(GROUP_WAYS.CUSTOM, 'Пользовательская', this.renderCustomGroup())}
		</Fragment>
	);

	renderWayField = (value: GroupWay, label: string, children: React$Node) => {
		const {way} = this.state;
		const checked = way === value;

		return (
			<Fragment>
				<RadioField
					checked={checked}
					className={styles.radioField}
					label={label}
					name={FIELDS.way}
					onChange={this.handleChange}
					value={value}
				/>
				{children}
			</Fragment>
		);
	};

	render () {
		const {onClose} = this.props;
		const {submitting} = this.state;

		return (
			<Modal
				className={styles.modal}
				header="Настройка группировки"
				onClose={onClose}
				onSubmit={this.handleSubmit}
				size={920}
				submitting={submitting}
			>
				<div className={styles.content}>
					{this.renderNameField()}
					{this.renderWayControl()}
				</div>
			</Modal>
		);
	}
}

export default GroupModal;
