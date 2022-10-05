// @flow
import type {DTOValue} from 'api/types';
import fakeExecMFFrame from 'api/fakeExecMFAPI/frame';

const fakeDataList = [
	// {
	// body: '',
	// data: data['modules.dashboardSettings.getUserData'],
	// url: 'func=modules.dashboardSettings.getUserData'
	// },
	// {
	// body: '',
	// data: data['modules.dashboards.getDataSources'],
	// url: 'func=modules.dashboards.getDataSources'
	// },
	// {
	// body: '"widgetKey":"root_DashbordyContent_"',
	// data: data['data.root_DashbordyContent_'],
	// url: 'modules.dashboardDataSet.getDataForCompositeDiagram'
	// }
];

const fakeFetch = (url: string, options: DTOValue): Promise<DTOValue> | null => {
	const data = fakeDataList.find(item => url.includes(item.url) && (options.body?.includes(item.body) ?? true));

	if (data) {
		return new Promise<DTOValue>(resolve => resolve({
			json: () => data.data,
			ok: true
		}));
	}

	return null;
};

export default class Frame extends fakeExecMFFrame {
	restCallAsJson (url: string, options: DTOValue) {
		const fakeUrl = `/sd/services/rest/${url}&accessKey=${process.env.ACCESS_KEY ?? ''}`;
		const {headers = {}} = options;
		const newHeaders = {...headers, 'Content-Type': 'application/json'};
		const fakePromise = fakeFetch(fakeUrl, options);

		return fakePromise === null
			? fetch(fakeUrl, {...options, headers: newHeaders})
			: fakePromise;
	}
}
