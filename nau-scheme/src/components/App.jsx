// @flow
import 'styles/app.less';
import Content from 'components/organisms/Content';
import React from 'react';
import Startup from 'components/organisms/Startup';

export const App = () => {
	return (
		<Startup>
			<Content />
		</Startup>
	);
};

export default App;
