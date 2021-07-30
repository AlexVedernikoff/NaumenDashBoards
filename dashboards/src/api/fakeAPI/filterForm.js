// @flow
import type {FilterFormAPI} from 'api/interfaces';
import type {FilterFormDescriptorDTO} from 'api/types';

export default class FilterForm implements FilterFormAPI {
	async openForm (descriptor: FilterFormDescriptorDTO, useAttrFilter?: boolean) {
		const {clazz} = descriptor;
		let result = {
			command: 'filterForm',
			serializedContext: JSON.stringify({
				cardObjectUuid: process.env.CONTEXT_OBJECT_META_CLASS,
				clazz,
				contentType: 'ObjectList'
			})
		};

		if (clazz === 'serviceCall') {
			result = {
				command: 'filterForm',
				serializedContext: JSON.stringify({
					cardObjectUuid: process.env.CONTEXT_OBJECT_META_CLASS,
					clazz,
					contentType: 'ObjectList',
					filters: [
						[
							{
								dtObjectWrapper: {
									fqn: 'catalogs$route',
									title: '1C СОУ: регистрация пользователей, настройка прав доступа 1С',
									uuid: 'catalogs$1828171'
								},
								properties: {
									attrTypeCode: 'object',
									attributeFqn: 'serviceCall@route',
									conditionCode: 'contains',
									isAttributeOfRelatedObject: 'false',
									isLinkToParent: 'false',
									isWithSemantic: 'true'
								}
							}
						]
					]
				})
			};
		}

		const awaitResult = await result;

		return awaitResult;
	}
}
