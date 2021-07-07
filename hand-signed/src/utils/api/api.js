import axios from 'axios';

export default class Api {

	constructor () {
		top.injectJsApi && top.injectJsApi(top, window);
		this.jsApi = window.jsApi;
	}

	async getParams() {
		return this.jsApi.contents.getParameters();
	}

	getSubjectUuid() {
		return this.jsApi.extractSubjectUuid();
	}

	async getSignature(subjectUuid: string, signatureAttributeCode: string) {
		return this.jsApi.restCallAsJson(`get/${subjectUuid}?attrs=${signatureAttributeCode}`);
	}

	async postSignature(dataUrl: string, signatureAttributeCode: string, subjectUuid: string)  {
		const image = await axios.get(dataUrl, {responseType: 'blob'}).then(response => new Blob([response.data]));
		const url = `add-file/${subjectUuid}?attrCode=${signatureAttributeCode}`;
		const formData = new FormData();

		formData.append("content", image, "подпись.png");
		await this.jsApi.restCall(url, {
			method: 'POST',
			body: formData
		});
	}
}
