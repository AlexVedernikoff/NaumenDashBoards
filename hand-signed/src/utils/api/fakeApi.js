export default class FakeApi {

	async getParams() {
		await new Promise(resolve => setTimeout(() => resolve(), 1300));
		return {
			drawingStartButtonName: 'Добавить подпись',
			signatureAttributeCode: 'signature'
		};
	}

	getSubjectUuid() {
		return 'serviceCall$2308201';
	}

	async getSignature(subjectUuid: string, signatureAttributeCode: string) {
		return {
			[signatureAttributeCode]: []
		};
	}

	async postSignature(dataUrl: string, signatureAttributeCode: string, subjectUuid: string)  {
		await new Promise((resolve, reject) => setTimeout(() => Math.random() > 0.7 ? reject("Рандом так решил(") : resolve(), 3000));
	}
}
