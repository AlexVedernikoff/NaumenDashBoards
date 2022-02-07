import document from 'utils/mocks/document';

export default class FakeApi {
	async getFileUuid () {
		return 'file$101';
	}

	getSubjectUuid () {
		return 'root$101';
	}

	async getVerifyResult (decisionUUID) {
		await new Promise(resolve => setTimeout(() => resolve(), 500));
		return document;
	}

	async getVerifyDocument (documentUUID) {
		await new Promise(resolve => setTimeout(() => resolve(), 500));

		return document.document;
	}

	async updateEntityStatus (UUID, status) {
		await new Promise(resolve => setTimeout(() => resolve(), 500));
		return true;
	}

	async generateDocument (documentUUID) {
		await new Promise(resolve => setTimeout(() => resolve(), 500));
		return true;
	}

	async getWsDocument (documentUUID) {
		return documentUUID;
	}
}
