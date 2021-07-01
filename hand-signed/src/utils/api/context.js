// @flow
import {api} from './';
import {initialSignatureState} from 'store/signature/init';
import type {Params} from 'store/signature/types';

/**
 * Вычисляет uuid объекта, на карточке которого выведено ВП.
 * @returns {string} - uuid объекта, на карточке которого выведено ВП.
 */
const getContext = (): string => {
	return api.getSubjectUuid();
};

/**
 * Возвращает параметры, переданные ВП
 * @returns {Promise<Params>} - параметры
 */
const getInitialParams = async (): Promise<Params> => {
	const {params} = initialSignatureState;
	const appParams = await api.getParams();
	const {signatureAttributeCode, drawingStartButtonName} = appParams;

	if (!signatureAttributeCode) {
		appParams.signatureAttributeCode = params.signatureAttributeCode;
	}

	if (!drawingStartButtonName) {
		appParams.drawingStartButtonName = params.drawingStartButtonName;
	}

	return appParams;
};

/**
 * Делает запрос на получение подписи
 * @returns {Promise<null | Array<Object>>} - ответ на запрос
 */
const getSignature = async (subjectUuid: string, signatureAttributeCode: string): Promise<null | Array<Object>> => {
	const data = await api.getSignature(subjectUuid, signatureAttributeCode);
	return data[signatureAttributeCode];
};

export {
	getContext,
	getInitialParams,
	getSignature
};
