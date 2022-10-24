// @flow
import type {AppState} from 'store/types';
import type {SourceData} from 'store/widgets/data/types';

const getSourceAttributeGroup = (state: AppState, data: ?SourceData): string | null => {
	let result = null;

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
