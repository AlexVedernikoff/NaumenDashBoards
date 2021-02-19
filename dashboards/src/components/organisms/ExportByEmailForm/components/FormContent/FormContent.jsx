// @flow
import type {Props} from './types';
import React, {PureComponent} from 'react';
import Slider from 'components/molecules/Slider';
import styles from './styles.less';
import type {User} from 'store/users/types';
import UserField from 'components/organisms/ExportByEmailForm/components/UserField';

export class FormContent extends PureComponent<Props> {
	renderField = (value: User, index: number) => {
		const {fetchUsers, onRemove, onSelect, selectedUsers, usersData} = this.props;
		const removable = selectedUsers.length > 1;

		return (
			<UserField
				fetchUsers={fetchUsers}
				index={index}
				onRemove={onRemove}
				onSelect={onSelect}
				removable={removable}
				usersData={usersData}
				value={value}
			/>
		);
	};

	render () {
		const {selectedUsers} = this.props;

		return (
			<Slider className={styles.content}>
				{selectedUsers.map(this.renderField)}
			</Slider>
		);
	}
}

export default FormContent;
