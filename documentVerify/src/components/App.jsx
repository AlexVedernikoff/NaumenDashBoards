// @flow
import 'styles/app.less';
import DocumentVerifyContent from 'containers/DocumentVerifyContent';
import DocumentVerifyTable from 'containers/DocumentVerifyTable';
import React from 'react';
import Startup from 'containers/Startup';

export const App = () => (
	<Startup>
		<DocumentVerifyContent />
		<DocumentVerifyTable />
	</Startup>
);

export default App;
