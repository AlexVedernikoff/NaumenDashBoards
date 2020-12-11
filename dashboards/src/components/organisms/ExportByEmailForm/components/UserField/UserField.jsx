// @flow
import {Caret, IndicatorsContainer} from 'components/molecules/Select/components';
import type {ComponentProps as CaretComponentProps} from 'components/molecules/Select/components/Caret/types';
import type {ComponentProps as IndicatorsContainerComponentProps} from 'components/molecules/Select/components/IndicatorsContainer/types';
import {IconButton} from 'components/atoms';
import {ICON_NAMES} from 'components/atoms/Icon';
import type {OnChangeInputEvent, OnSelectEvent} from 'components/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import {Select} from 'components/molecules';
import styles from './styles.less';
import type {User} from 'store/users/types';

export class UserField extends PureComponent<Props> {
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

	handleChangeLabel = ({value}: OnChangeInputEvent) => {
		const {index, onSelect} = this.props;
		onSelect(index, {email: value.toString()});
	};

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
			IndicatorsContainer: this.renderIndicatorsContainer
		};

		return (
			<Select
				async={true}
				className={styles.select}
				components={components}
				editable={true}
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
