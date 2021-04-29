import '!style-loader!css-loader!less-loader!../src/styles/app.less';
import React from 'react';
import {Provider} from 'react-redux';
import {store} from 'app.constants';

export const decorators = [
	(Story) => <Provider store={store}><Story /></Provider>,
];

export const parameters = {
	actions: { argTypesRegex: "^on[A-Z].*" },
	layout: 'centered'
}
