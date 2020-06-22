// @flow
import {CustomGroup, SystemGroup} from './components';
import {DEFAULT_SYSTEM_GROUP, GROUP_WAYS} from 'store/widgets/constants';
import {FIELDS} from './constants';
import {FormControl, Modal} from 'components/molecules';
import {getProcessedValue} from 'store/sources/attributes/helpers';
import type {Group, GroupWay} from 'store/widgets/data/types';
import type {OnChangeInputEvent} from 'components/types';
import type {Props, State} from './types';
import type {Props as SystemProps} from './components/SystemGroup/types';
import {RadioField, TextInput} from 'components/atoms';
import React, {Component, Fragment} from 'react';
import styles from './styles.less';

export class GroupCreatingModal extends Component<Props, State> {
	static defaultProps = {
		systemProps: {
			defaultValue: DEFAULT_SYSTEM_GROUP.OVERLAP,
			options: []
		}
	};

	state = {
		attributeTitle: '',
		way: GROUP_WAYS.SYSTEM
	};

	customGroupSubmit: Function;
	systemGroupSubmit: Function;

	componentDidMount () {
		const {attribute, group} = this.props;
		const {way} = group;
		const attributeTitle = getProcessedValue(attribute, 'title', '');

		this.setState({
			attributeTitle,
			way
		});
	}

	componentDidCatch () {
		this.props.onClose();
	}

	handleChange = ({name, value}: OnChangeInputEvent) => this.setState({[name]: value});

	handleChangeAttributeTitle = (e: OnChangeInputEvent) => {
		const {value} = e;
		this.setState({attributeTitle: String(value)});
	};

	handleSubmit = () => {
		const submit = this.state.way === GROUP_WAYS.SYSTEM ? this.systemGroupSubmit : this.customGroupSubmit;
		submit && submit();
	};

	handleSubmitGroup = (group: Group) => {
		const {onSubmit} = this.props;
		const {attributeTitle} = this.state;

		onSubmit(group, attributeTitle);
	};

	setSubmit = (way: GroupWay) => (submit: Function) => {
		way === GROUP_WAYS.CUSTOM ? this.customGroupSubmit = submit : this.systemGroupSubmit = submit;
	};

	renderCustomGroup = () => {
		const {createCustomGroup, customGroups, customProps, deleteCustomGroup, group, updateCustomGroup, widgets} = this.props;
		const {way} = this.state;
		const show = way === GROUP_WAYS.CUSTOM;

		return (
			<CustomGroup
				{...customProps}
				group={group}
				map={customGroups}
				onCreate={createCustomGroup}
				onRemove={deleteCustomGroup}
				onSubmit={this.handleSubmitGroup}
				onUpdate={updateCustomGroup}
				setSubmit={this.setSubmit(GROUP_WAYS.CUSTOM)}
				show={show}
				widgets={widgets}
			/>
		);
	};

	renderDefaultSystemGroup = (props: $Shape<SystemProps>) => {
		const {systemProps} = this.props;
		return systemProps ? <SystemGroup {...systemProps} {...props} /> : null;
	};

	renderNameField = () => {
		const {attributeTitle} = this.state;

		return (
			<FormControl className={styles.field} label="Название поля">
				<TextInput
					name={FIELDS.attributeTitle}
					onChange={this.handleChangeAttributeTitle}
					value={attributeTitle}
				/>
			</FormControl>
		);
	};

	renderSystemGroup = () => {
		const {group, renderSystemGroup} = this.props;
		const props = {
			className: styles.shortField,
			group,
			onSubmit: this.handleSubmitGroup,
			setSubmit: this.setSubmit(GROUP_WAYS.SYSTEM)
		};

		return renderSystemGroup ? renderSystemGroup(props) : this.renderDefaultSystemGroup(props);
	};

	renderWayControl = () => (
		<FormControl className={styles.wayControl} label="Тип группировки">
			{this.renderWayField(GROUP_WAYS.SYSTEM, 'Системная', this.renderSystemGroup())}
			{this.renderWayField(GROUP_WAYS.CUSTOM, 'Пользовательская', this.renderCustomGroup())}
		</FormControl>
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

		return (
			<Modal className={styles.modal} header="Настройка группировки" onClose={onClose} onSubmit={this.handleSubmit} size={920}>
				<div className={styles.content}>
					{this.renderNameField()}
					{this.renderWayControl()}
				</div>
			</Modal>
		);
	}
}

export default GroupCreatingModal;
