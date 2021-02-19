// @flow
import {Caret, IndicatorsContainer, ValueContainer} from 'components/molecules/Select/components';
import type {ComponentProps as CaretComponentProps} from 'components/molecules/Select/components/Caret/types';
import type {ComponentProps as IndicatorsContainerComponentProps} from 'components/molecules/Select/components/IndicatorsContainer/types';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import type {OnChangeInputEvent, OnSelectEvent} from 'components/types';
import type {Props, State} from './types';
import type {Props as ValueContainerProps} from 'components/molecules/Select/components/ValueContainer/types';
import type {Props as ValueLabelProps} from 'components/molecules/Select/components/ValueLabel/types';
import React, {PureComponent} from 'react';
import Select from 'components/molecules/Select';
import styles from './styles.less';
import TextInput from 'components/atoms/TextInput';
import type {User} from 'store/users/types';

export class UserField extends PureComponent<Props, State> {
	state = {
		focusedSelectInput: false
	};

	getUserLabel = (user: User) => {
		const {email, name} = user;
		let label = '';

		if (name && email) {
			label = `${name} (${email})`;
		} else if (name) {
			label = name;
		} else if (email) {
			label = email;
		}

		return label;
	};

	getUserValue = (user: User) => user.email;

	handleBlurTextInput = () => this.setState({focusedSelectInput: false});

	handleChangeLabel = ({value}: OnChangeInputEvent) => {
		const {index, onSelect} = this.props;
		onSelect(index, {email: value.toString()});
	};

	handleFocusTextInput = () => this.setState({focusedSelectInput: true});

	handleRemoveUser = () => {
		const {index, onRemove} = this.props;
		onRemove(index);
	};

	handleSelectUser = (event: OnSelectEvent) => {
		const {index, onSelect} = this.props;
		const {value} = event;

		onSelect(index, value);
	};

	renderCaret = (props: CaretComponentProps) => <Caret iconName={ICON_NAMES.USER} onClick={props.onClick} round={false} />;

	renderIndicatorsContainer = (props: IndicatorsContainerComponentProps) => {
		const {children} = props;

		return (
			<IndicatorsContainer className={styles.indicatorsContainer}>
				{children}
			</IndicatorsContainer>
		);
	};

	renderUserRemoveButton = () => {
		const {removable} = this.props;

		if (removable) {
			return (
				<IconButton
					className={styles.removeButton}
					icon={ICON_NAMES.MINUS}
					onClick={this.handleRemoveUser}
					round={false}
					tip="Удалить получателя"
				/>
			);
		}
	};

	renderUserSelect = () => {
		const {fetchUsers, usersData, value} = this.props;
		const {data: options, error, loading, uploaded} = usersData;
		const components = {
			Caret: this.renderCaret,
			IndicatorsContainer: this.renderIndicatorsContainer,
			ValueContainer: this.renderValueContainer,
			ValueLabel: this.renderValueLabel
		};

		return (
			<Select
				async={true}
				className={styles.select}
				components={components}
				error={error}
				fetchOptions={fetchUsers}
				getOptionLabel={this.getUserLabel}
				getOptionValue={this.getUserValue}
				isSearching={true}
				loading={loading}
				onChangeLabel={this.handleChangeLabel}
				onSelect={this.handleSelectUser}
				options={options}
				uploaded={uploaded}
				value={value}
			/>
		);
	};

	renderValueContainer = ({onClick, ...props}: ValueContainerProps) => <ValueContainer {...props} />;

	renderValueLabel = (props: ValueLabelProps) => {
		const {value} = this.props;
		const {focusedSelectInput} = this.state;
		const {label} = props;
		const inputValue = value && focusedSelectInput ? value.email : label;

		return (
			<TextInput
				className={styles.selectInput}
				onBlur={this.handleBlurTextInput}
				onChange={this.handleChangeLabel}
				onFocus={this.handleFocusTextInput}
				value={inputValue}
			/>
		);
	};

	render () {
		return (
			<div className={styles.field}>
				{this.renderUserSelect()}
				{this.renderUserRemoveButton()}
			</div>
		);
	}
}

export default UserField;
