import verifyResult from 'utils/mocks/verifyResult';

export default class FakeApi {
	async getFileUuid () {
		return 'file$101';
	}

	getSubjectUuid () {
		return 'root$101';
	}

	async getVerifyResult (decisionUUID) {
		await new Promise(resolve => setTimeout(() => resolve(), 500));

		return verifyResult;
	}
}
