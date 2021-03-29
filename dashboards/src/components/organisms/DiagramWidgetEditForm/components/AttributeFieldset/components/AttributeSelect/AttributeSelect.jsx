// @flow
import type {Attribute} from 'store/sources/attributes/types';
import cn from 'classnames';
import Container from 'components/atoms/Container';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import LabelEditingForm from 'components/molecules/InputForm';
import Loader from 'components/atoms/Loader';
import type {Props, State} from './types';
import type {Props as ContainerProps} from 'components/atoms/Container/types';
import React, {PureComponent} from 'react';
import Select from 'components/molecules/Select';
import styles from './styles.less';

export class AttributeSelect extends PureComponent<Props, State> {
	static defaultProps = {
		...Select.defaultProps,
		droppable: false,
		removable: false
	};
	components = null;
	state = {
		showForm: false
	};

	getComponents = () => {
		const {Field, ...components} = this.props.components;

		if (!this.components) {
			this.components = {
				IndicatorsContainer: this.renderIndicators,
				ValueContainer: this.renderValueContainer,
				...components
			};
		}

		return this.components;
	};

	getOptionLabel = (attribute: Attribute | null) => attribute?.title ?? '';

	getOptionValue = (attribute: Attribute | null) => attribute?.code ?? '';

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

	renderForm = () => {
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

	renderLoader = () => this.props.loading ? <Loader className={styles.loader} /> : null;

	renderRemoveIcon = () => {
		const {removable} = this.props;

		return removable && <IconButton icon={ICON_NAMES.MINUS} onClick={this.handleClickRemoveIcon} />;
	};

	renderSelect = () => {
		const {disabled, fetchOptions, getOptions, loading, onSelect, options, value} = this.props;

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
				placeholder="Не выбрано"
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
