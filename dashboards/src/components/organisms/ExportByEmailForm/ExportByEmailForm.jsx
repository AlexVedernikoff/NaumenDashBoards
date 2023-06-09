// @flow
import cn from 'classnames';
import {createDefaultUser} from './helpers';
import exporter from 'utils/export';
import {FILE_VARIANTS} from 'utils/export/constants';
import FormContent from './components/FormContent';
import FormFooter from './components/FormFooter';
import FormHeader from './components/FormHeader';
import {FORMATS} from './constants';
import {gridRef} from 'components/organisms/WidgetsGrid/constants';
import type {OnSelectEvent} from 'components/types';
import type {Props} from 'containers/ExportByEmailForm/types';
import React, {PureComponent} from 'react';
import type {State} from './types';
import styles from './styles.less';
import type {User} from 'store/users/types';

export class Form extends PureComponent<Props, State> {
	state = {
		format: FORMATS[0],
		selectedUsers: [createDefaultUser()]
	};

	componentDidMount () {
		this.setDefaultUser();
	}

	handleAddUser = () => {
		const {selectedUsers} = this.state;

		this.setState({selectedUsers: [...selectedUsers, createDefaultUser()]});
	};

	handleRemoveUser = (index: number) => {
		const {selectedUsers} = this.state;

		selectedUsers.splice(index, 1);

		this.setState({selectedUsers: [...selectedUsers]});
	};

	handleReset = () => this.setState({selectedUsers: [createDefaultUser()]});

	handleSelectFormat = ({value: format}: OnSelectEvent) => this.setState({format});

	handleSelectUser = (index: number, user: User) => {
		const {selectedUsers} = this.state;

		selectedUsers[index] = user;

		this.setState({selectedUsers: [...selectedUsers]});
	};

	handleSend = async () => {
		const {sendToEmails} = this.props;
		const {format, selectedUsers} = this.state;
		const {current} = gridRef;
		const type = format.value;

		if (current) {
			const {PNG} = FILE_VARIANTS;
			const {file, name} = type === PNG
				? await exporter.exportDashboardAsPNG(current)
				: await exporter.exportDashboardAsPDF(false);

			const users = selectedUsers.filter(user => user.email);

			file && sendToEmails(name, type, file, users);
		}
	};

	setDefaultUser = () => {
		const {currentUser} = this.props;
		const {selectedUsers} = this.state;
		const {email, name} = currentUser;

		if (email) {
			selectedUsers[0] = {
				email,
				name
			};

			this.setState({selectedUsers: [...selectedUsers]});
		}
	};

	renderFormContent = () => {
		const {fetchUsers, usersData} = this.props;
		const {selectedUsers} = this.state;

		return (
			<FormContent
				fetchUsers={fetchUsers}
				onRemove={this.handleRemoveUser}
				onSelect={this.handleSelectUser}
				selectedUsers={selectedUsers}
				usersData={usersData}
			/>
		);
	};

	renderFormDivider = () => <div className={styles.divider} />;

	renderFormFooter = () => {
		const {sending} = this.props;
		const {selectedUsers} = this.state;
		const nothingSelected = selectedUsers.length === 0 || selectedUsers.some(user => user.email === '');

		return (
			<FormFooter nothingSelected={nothingSelected} onReset={this.handleReset} onSend={this.handleSend} sending={sending} />
		);
	};

	renderFormHeader = () => {
		const {format} = this.state;

		return (
			<FormHeader
				format={format}
				formatOptions={FORMATS}
				onAddUser={this.handleAddUser}
				onSelectFormat={this.handleSelectFormat}
			/>
		);
	};

	render () {
		const {className} = this.props;

		return (
			<div className={cn(styles.form, className)}>
				{this.renderFormHeader()}
				{this.renderFormDivider()}
				{this.renderFormContent()}
				{this.renderFormFooter()}
			</div>
		);
	}
}

export default Form;
