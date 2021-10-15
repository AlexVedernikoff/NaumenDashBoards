// @flow
import type {EmailUserDTO, Transport} from 'api/types';
import type {FileToMailAPI} from 'api/interfaces';

export default class FileToMail implements FileToMailAPI {
	transport: Transport;

	constructor (transport: Transport) {
		this.transport = transport;
	}

	send (tokenKey: string, format: string, fileName: string, users: Array<EmailUserDTO>) {
		return this.transport('dashboardSendEmail', 'sendFileToMail', ['requestContent'], {fileName, format, tokenKey, users});
	}
}
