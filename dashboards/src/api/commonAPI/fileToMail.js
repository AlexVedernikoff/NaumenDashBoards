// @flow
import type {EmailUserDTO, Transport} from 'api/types';
import type {FileToMailAPI} from 'api/interfaces';

export default class FileToMail implements FileToMailAPI {
	transport: Transport;

	constructor (transport: Transport) {
		this.transport = transport;
	}

	send (key: string, type: string, name: string, users: Array<EmailUserDTO>) {
		return this.transport('dashboardSendEmail', 'sendFileToMail', key, type, name, users);
	}
}
