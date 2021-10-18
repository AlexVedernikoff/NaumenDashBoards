// @flow
import 'styles/app.less';
import React from 'react';
import Startup from 'containers/Startup';
import VerificationContent from 'containers/VerificationContent';
import VerificationHeader from 'containers/VerificationHeader';

export const App = () => (
	<Startup>
		<VerificationHeader />
		<VerificationContent />
	</Startup>
);

export default App;
