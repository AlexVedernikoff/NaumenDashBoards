// @flow
import 'styles/app.less';
import GanttContent from 'containers/GanttContent';
import GanttHeader from 'containers/GanttHeader';
import React from 'react';
import Startup from 'containers/Startup';

export const App = () => (
	<Startup>
		<GanttHeader />
		<GanttContent />
	</Startup>
);

export default App;
