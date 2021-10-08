import '!style-loader!css-loader!less-loader!../src/styles/app.less';
import React from 'react';
import {Provider} from 'react-redux';
import {store} from 'app.constants';

export const decorators = [
	Story => <Provider store={store}><Story /></Provider>,
	Story => <div style={{height: '100%', width: '100%', overflowY: 'auto'}}><Story /></div>
];

export const parameters = {
	actions: {argTypesRegex: "^on[A-Z].*"}
}
