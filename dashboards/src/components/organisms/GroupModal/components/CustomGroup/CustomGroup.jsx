// @flow
import type {Breakdown, Parameter, Widget} from 'store/widgets/data/types';
import {createNewSubGroup} from 'GroupModal/helpers';
import {ERRORS_CONTEXT} from 'GroupModal/HOCs/withErrors';
import GroupSelect from 'GroupModal/components/CustomGroupSelect';
import InfoPanel from 'components/atoms/InfoPanel';
import type {InfoPanelProps, Props, State} from './types';
import Loader from 'components/atoms/Loader';
import {LOCAL_PREFIX_ID} from 'GroupModal/constants';
import type {OnChangeEvent, OnSelectEvent} from 'components/types';
import React, {Component} from 'react';
import styles from './styles.less';
import type {SubGroup} from 'GroupModal/types';
import SubGroupSection from 'GroupModal/components/SubGroupSection';
import Text, {TEXT_TYPES} from 'components/atoms/Text';
import uuid from 'tiny-uuid';
import {VARIANTS} from 'components/atoms/InfoPanel/constants';

export class CustomGroup extends Component<Props, State> {
	static defaultProps = {
		loading: false,
		schema: null,
		value: null
	};

	state = {
		errors: {},
		isSubmitting: false,
		showLimitInfo: false,
		showRemovalInfo: false,
		showSaveInfo: false,
		showUseInfo: false,
		usedInWidgets: []
	};

	componentDidUpdate (prevProps: Props) {
		const {submitted, value} = this.props;
		const {value: prevValue} = prevProps;
		const {errors} = this.state;

		if (submitted && prevValue !== value) {
			this.validate();
		}

		if (value?.id !== prevProps.value?.id && Object.keys(errors).length > 0) {
			this.setState({
				errors: {}
			});
		}
	}

	getUsingWidgets = (): Array<string> => {
		const {widgets} = this.props;

		return widgets.reduce((names, widget) => this.isUsingCurrentGroup(widget) ? [...names, widget.name] : names, []);
	};

	handleChangeName = (event: OnChangeEvent<string>) => {
		const {onUpdate, value} = this.props;

		value && onUpdate({...value, name: event.value});
	};

	handleClickCreate = () => {
		const {onSelect, onUpdate, options, type} = this.props;
		const id = `${LOCAL_PREFIX_ID}${uuid()}`;

		if (options.length < 30) {
			const group = {
				id,
				name: '',
				subGroups: [createNewSubGroup()],
				type
			};

			onUpdate(group);
			onSelect(id);
		} else {
			this.setState({showLimitInfo: true});
		}
	};

	handleCloseLimitInfo = () => this.setState({showLimitInfo: false});

	handleCloseRemovalInfo = () => this.setState({showRemovalInfo: false});

	handleCloseSaveInfo = () => this.setState({showSaveInfo: false});

	handleCloseUseInfo = () => this.setState({showUseInfo: false, usedInWidgets: []});

	handleConfirmRemovalInfo = () => {
		const {onRemove, onSelect, value} = this.props;

		if (value) {
			this.setState({showRemovalInfo: false});

			onRemove(value.id, !value.id.startsWith(LOCAL_PREFIX_ID));
			onSelect('');
		}
	};

	handleRemove = () => {
		const usedInWidgets = this.getUsingWidgets();

		usedInWidgets.length > 0
			? this.setState({showUseInfo: true, usedInWidgets})
			: this.setState({showRemovalInfo: true});
	};

	handleSelect = ({value}: OnSelectEvent) => {
		this.setState({errors: {}});
		this.props.onSelect(value.id);
	};

	handleSubmit = () => this.props.onSubmit(true);

	handleUpdate = (subGroups: Array<SubGroup>) => {
		const {onUpdate, value} = this.props;

		value && onUpdate({...value, subGroups});
	};

	// $FlowFixMe[prop-missing]
	isUsingCurrentGroup = (widget: Widget) => !!widget.data.find(({breakdown, parameters}) => {
		return this.testFieldAtUsingGroup(breakdown) || this.testFieldAtUsingGroup(parameters);
	});

	save = async (force: boolean): Promise<string | null> => {
		const {onCreate, onSelect, onUpdate, value} = this.props;
		const isValid = await this.validate();
		let id = null;

		if (value && isValid) {
			if (value.id.startsWith(LOCAL_PREFIX_ID)) {
				id = await onCreate(value);
			} else {
				if (force || this.getUsingWidgets().length === 0) {
					onUpdate(value, true);

					id = value.id;
				} else {
					this.setState({showSaveInfo: true});
				}

				id && onSelect(id);
			}
		}

		return id;
	};

	testFieldAtUsingGroup = (field?: Breakdown | Array<Parameter>) => {
		const {value} = this.props;

		return !!field?.find(fieldSet => fieldSet.group.data === value?.id);
	};

	validate = async () => {
		const {schema, value} = this.props;
		let errors = {};

		if (value) {
			try {
				await schema?.validate(value, {
					abortEarly: false
				});
			} catch (e) {
				e.inner.forEach(({message, path}) => {
					errors[path] = message;
				});
			}

			this.setState({errors});
		}

		return Object.keys(errors).length === 0;
	};

	renderInfoPanel = (props: InfoPanelProps) => {
		const {onClose, onConfirm, text} = props;

		return (
			<div className={styles.infoPanel}>
				<InfoPanel onClose={onClose} onConfirm={onConfirm} text={text} />
			</div>
		);
	};

	renderLimitInfo = () => {
		const {showLimitInfo} = this.state;
		const props = {
			onClose: this.handleCloseLimitInfo,
			text: 'Количество созданных на дашборде пользовательских группировок достигло максимума (30 шт)'
		};

		if (showLimitInfo) {
			return this.renderInfoPanel(props);
		}
	};

	renderLoader = () => this.props.loading && <div className={styles.loaderContainer}><Loader size={50} /></div>;

	renderRemovalInfo = () => {
		const {showRemovalInfo} = this.state;

		if (showRemovalInfo) {
			return this.renderInfoPanel({
				onClose: this.handleCloseRemovalInfo,
				onConfirm: this.handleConfirmRemovalInfo,
				text: 'Группировка будет удалена без возможности восстановления.'
			});
		}

		return null;
	};

	renderSaveInfo = () => {
		const {showSaveInfo} = this.state;

		if (showSaveInfo) {
			const text = 'Изменения применятся к этой группировке во всех виджетах.';

			return (
				<InfoPanel
					className={styles.infoPanel}
					onClose={this.handleCloseSaveInfo}
					onConfirm={this.handleSubmit}
					text={text}
					variant={VARIANTS.WARNING}
				/>
			);
		}
	};

	renderSelect = () => {
		const {loading, onFetchOptions, options, value} = this.props;

		return (
			<GroupSelect
				loading={loading}
				onChangeName={this.handleChangeName}
				onCreate={this.handleClickCreate}
				onFetch={onFetchOptions}
				onRemove={this.handleRemove}
				onSelect={this.handleSelect}
				options={options}
				value={value}
			/>
		);
	};

	renderSubGroupSection = () => {
		const {value} = this.props;
		return value && <SubGroupSection onUpdate={this.handleUpdate} subGroups={value.subGroups} />;
	};

	renderTitle = () => <Text className={styles.title} type={TEXT_TYPES.TITLE}>Настройка пользовательской группировки</Text>;

	renderUseInfo = () => {
		const {showUseInfo, usedInWidgets} = this.state;

		if (showUseInfo) {
			const props = {
				onClose: this.handleCloseUseInfo,
				text: `Группировка используется в виджетах: ${usedInWidgets.join(', ')}.`
			};

			return this.renderInfoPanel(props);
		}
	};

	render () {
		const {errors} = this.state;

		return (
			<ERRORS_CONTEXT.Provider value={errors}>
				{this.renderSaveInfo()}
				{this.renderRemovalInfo()}
				{this.renderLimitInfo()}
				{this.renderUseInfo()}
				{this.renderTitle()}
				{this.renderSelect()}
				{this.renderLoader()}
				{this.renderSubGroupSection()}
			</ERRORS_CONTEXT.Provider>
		);
	}
}

export default CustomGroup;
