// @flow
import type {Attribute} from 'store/sources/attributes/types';
import cn from 'classnames';
import type {Components, Props, State} from './types';
import Container from 'components/atoms/Container';
import {DEFAULT_PROPS as SELECT_DEFAULT_PROPS} from 'components/molecules/Select/constants';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import LabelEditingForm from 'components/molecules/InputForm';
import ListOption from 'components/molecules/Select/components/ListOption';
import Loader from 'components/atoms/Loader';
import type {Props as ContainerProps} from 'components/atoms/Container/types';
import React, {Component} from 'react';
import Select from 'components/molecules/Select';
import styles from './styles.less';
import t from 'localization';
import {TIMER_VALUE} from 'store/sources/attributes/constants';
import TimerValueListOptionValue from 'components/organisms/WidgetFormPanel/components/AttributeFieldset/components/TimerValueListOptionValue';

export class AttributeSelect extends Component<Props, State> {
	static defaultProps = {
		...SELECT_DEFAULT_PROPS,
		droppable: false,
		removable: false
	};
	components = null;
	state = {
		showForm: false
	};

	getComponents = (): $Shape<Components> => {
		const {Field, ...components} = this.props.components;

		if (!this.components) {
			this.components = {
				IndicatorsContainer: this.renderIndicators,
				ListOption: this.renderListOption,
				ValueContainer: this.renderValueContainer,
				...components
			};
		}

		return this.components;
	};

	getListOptionComponents = option => ({
		Value: this.renderListOptionValue(option)
	});

	getOptionLabel = (attribute: Attribute | null) => attribute?.title ?? '';

	getOptionValue = (attribute: Attribute | null) => {
		let code = '';

		if (attribute) {
			code = attribute.code;

			if (attribute.timerValue === TIMER_VALUE.VALUE) {
				code += '$TV:' + TIMER_VALUE.VALUE;
			}
		}

		return code;
	};

	handleClickDropIcon = () => {
		const {name, onDrop} = this.props;

		onDrop && onDrop(name);
	};

	handleClickEditIcon = () => this.setState({showForm: true});

	handleClickRemoveIcon = () => {
		const {name, onRemove} = this.props;

		onRemove && onRemove(name);
	};

	handleCloseForm = () => this.setState({showForm: false});

	handleSubmitForm = (label: string) => {
		const {onChangeLabel} = this.props;

		onChangeLabel(label);
		this.setState({showForm: false});
	};

	renderDropIcon = () => {
		const {droppable, value} = this.props;

		return droppable && value && <IconButton icon={ICON_NAMES.BASKET} onClick={this.handleClickDropIcon} />;
	};

	renderEditIcon = () => {
		const {value} = this.props;

		return value && <IconButton icon={ICON_NAMES.EDIT} onClick={this.handleClickEditIcon} />;
	};

	renderField = () => {
		const {Field} = this.props.components;

		return <div className={styles.fieldContainer}><Field /></div>;
	};

	renderForm = (): React$Node => {
		const {value} = this.props;

		if (value) {
			return (
				<LabelEditingForm
					className={styles.form}
					onClose={this.handleCloseForm}
					onSubmit={this.handleSubmitForm}
					value={this.getOptionLabel(value)}
				/>
			);
		}

		return null;
	};

	renderIndicators = (props: ContainerProps) => (
		<div className={cn(props.className, styles.indicatorContainer)}>
			{this.renderEditIcon()}
			{this.renderDropIcon()}
			{this.renderRemoveIcon()}
		</div>
	);

	renderListOption = props => {
		const {option} = props;
		return (
			<ListOption
				components={this.getListOptionComponents(option)}
				{...props}
			/>
		);
	};

	renderListOptionValue = attribute => props => {
		const {children, className} = props;

		if (attribute.timerValue !== null) {
			return <TimerValueListOptionValue attribute={attribute} className={className} />;
		}

		return <Container className={className}>{children}</Container>;
	};

	renderLoader = () => this.props.loading ? <Loader className={styles.loader} /> : null;

	renderRemoveIcon = () => {
		const {removable} = this.props;

		return removable && <IconButton icon={ICON_NAMES.MINUS} onClick={this.handleClickRemoveIcon} />;
	};

	renderSelect = () => {
		const {disabled, fetchOptions, getOptions, loading, onSelect, options, removable, value} = this.props;

		return (
			<Select
				className={styles.select}
				components={this.getComponents()}
				disabled={disabled}
				fetchOptions={fetchOptions}
				getOptionLabel={this.getOptionLabel}
				getOptionValue={this.getOptionValue}
				getOptions={getOptions}
				isSearching={true}
				loading={loading}
				onSelect={onSelect}
				options={options}
				placeholder={t('AttributeSelect::Empty')}
				removable={removable}
				value={value}
			/>
		);
	};

	renderValueContainer = (props: ContainerProps) => {
		const {children, className} = props;

		return (
			<Container className={className}>
				{this.renderField()}
				<div className={styles.valueContainerChildren}>{children}</div>
				{this.renderLoader()}
			</Container>
		);
	};

	render () {
		const {showForm} = this.state;

		return showForm ? this.renderForm() : this.renderSelect();
	}
}

export default AttributeSelect;
