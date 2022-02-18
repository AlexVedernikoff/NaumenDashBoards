// @flow
import type {AppState} from 'store/types';
import {isUserModeDashboard} from 'store/dashboard/settings/selectors';
import {parseCasesAndGroupCode} from 'utils/descriptorUtils';
import type {SourceData} from 'store/widgets/data/types';

const getSourceAttributeGroup = (state: AppState, data: ?SourceData): string | null => {
	const isUserMode = isUserModeDashboard(state);
	let result = null;

	if (isUserMode && data) {
		if (data && data.descriptor) {
			const attrSetConditions = parseCasesAndGroupCode(data.descriptor);

			if (attrSetConditions) {
				const {attrGroupCode = null} = attrSetConditions;

				result = attrGroupCode;
			}
		}
	}

	if (data?.value) {
		const {map: sources} = state.sources.data;
		const source = sources[data.value.value];

		if (source) {
			result = source.value.sourceFilterAttributeGroup;
		}
	}

	return result;
};

export {
	getSourceAttributeGroup
};
