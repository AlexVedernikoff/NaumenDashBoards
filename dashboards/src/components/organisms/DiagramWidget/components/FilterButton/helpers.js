// @flow
import api from 'api';
import {createFilterContext, getFilterContext} from 'store/helpers';
import type {CustomFilter, Widget} from 'store/widgets/data/types';
import {getPartsClassFqn} from 'store/widgets/links/helpers';

const isNotEmptyDescriptor = (descriptor: ?string) => {
	if (descriptor) {
		try {
			const {filters} = JSON.parse(descriptor);
			return Array.isArray(filters) && filters.length > 0;
		} catch (e) {
			console.error('Filters on widgets has unparsed descriptor');
			return false;
		}
	}

	return false;
};

const hasUsedFilters = (widget: Widget) => {
	return widget.data.some(item => item.source.widgetFilterOptions?.some(filter => isNotEmptyDescriptor(filter.descriptor)));
};

const getNewDescriptor = async (filter: CustomFilter, classFqn: string): Promise<string> => {
	const {descriptor} = filter;
	let newDescriptor = '';

	try {
		const context = descriptor ? getFilterContext(descriptor, classFqn) : createFilterContext(classFqn);

		if (context) {
			context['attrCodes'] = filter.attributes.map(attr => {
				const {code, declaredMetaClass, metaClassFqn} = attr;
				const {classFqn} = getPartsClassFqn(declaredMetaClass ?? metaClassFqn);

				return `${classFqn}@${code}`;
			});

			({serializedContext: newDescriptor} = await api.filterForm.openForm(context, true));
		}
	} catch (ex) {
		console.error('Ошибка формы фильтрации', ex);
	}

	return newDescriptor;
};

export {
	getNewDescriptor,
	hasUsedFilters,
	isNotEmptyDescriptor
};
