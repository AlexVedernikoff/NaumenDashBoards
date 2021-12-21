// @flow
import type {ComponentProps as IconButtonProps} from 'components/atoms/IconButton/types';
import Container from 'components/atoms/Container';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import type {OnChangeEvent, OnSelectEvent} from 'components/types';
import type {Props as ValueProps} from 'components/molecules/Select/components/Value/types';
import type {Props as ContainerProps} from 'components/atoms/Container/types';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import Select from 'components/molecules/Select';
import styles from './styles.less';
import t from 'localization';
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

	handleChangeLabel = ({value}: OnChangeEvent<string>) => {
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

	renderCaret = (props: IconButtonProps) => (
		<Container className={styles.caret}>
			<IconButton icon={ICON_NAMES.USER} onClick={props.onClick} round={false} />
		</Container>
	);

	renderIndicatorsContainer = (props: ContainerProps) => {
		const {children} = props;

		return (
			<Container className={styles.indicatorsContainer}>
				{children}
			</Container>
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
					tip={t('ExportByEmailForm::UserField::DeleteRecipient')}
				/>
			);
		}
	};

	renderUserSelect = () => {
		const {fetchUsers, usersData, value} = this.props;
		const components = {
			Caret: this.renderCaret,
			IndicatorsContainer: this.renderIndicatorsContainer,
			Value: this.renderValue
		};
		const {data: options, loading} = usersData;

		return (
			<Select
				className={styles.select}
				components={components}
				fetchOptions={fetchUsers}
				getOptionLabel={this.getUserLabel}
				getOptionValue={this.getUserValue}
				isSearching={true}
				loading={loading}
				onChangeLabel={this.handleChangeLabel}
				onSelect={this.handleSelectUser}
				options={options}
				value={value}
			/>
		);
	};

	renderValue = (props: ValueProps) => {
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
