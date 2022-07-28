import '!style-loader!css-loader!less-loader!../src/styles/app.less';
import React from 'react';
import {Provider} from 'react-redux';
import {store} from 'app.constants';
import TranslationProvider from 'components/templates/TranslationProvider';

export const decorators = [
	(Story) => (
		<TranslationProvider>
			<Provider store={store}>
				<Story />
			</Provider>
		</TranslationProvider>
	),
	(Story) => <div style={{height: '100%', width: '100%', overflowY: 'auto'}}><Story /></div>
];

export const parameters = {
	actions: { argTypesRegex: "^on[A-Z].*" }
}
