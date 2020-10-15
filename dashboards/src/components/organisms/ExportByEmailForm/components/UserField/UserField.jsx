// @flow
import {IconButton} from 'components/atoms';
import {ICON_NAMES} from 'components/atoms/Icon';
import type {OnSelectEvent} from 'components/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import {Select} from 'components/molecules';
import styles from './styles.less';
import type {User} from 'store/users/types';

export class UserField extends PureComponent<Props> {
	getUserLabel = (user: User) => {
		const {email, name} = user;
		return email ? `${name} (${email})` : `${name}`;
	};

	getUserValue = (user: User) => user.email;

	handleRemoveUser = () => {
		const {index, onRemove} = this.props;
		onRemove(index);
	};

	handleSelectUser = (event: OnSelectEvent) => {
		const {index, onSelect} = this.props;
		const {value} = event;

		onSelect(index, value);
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

		return (
			<Select
				async={true}
				className={styles.select}
				error={error}
				fetchOptions={fetchUsers}
				getOptionLabel={this.getUserLabel}
				getOptionValue={this.getUserValue}
				isSearching={true}
				loading={loading}
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
