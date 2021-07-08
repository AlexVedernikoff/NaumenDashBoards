import '!style-loader!css-loader!less-loader!../src/styles/app.less';
import React from 'react';

export const decorators = [
	Story => <div style={{height: '100%', width: '100%', overflowY: 'auto'}}><Story /></div>
];

export const parameters = {
	actions: { argTypesRegex: "^on[A-Z].*" }
}
