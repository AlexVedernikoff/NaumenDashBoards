// @flow
import 'styles/app.less';
import Startup from 'containers/Startup';
import React from 'react';
import VerificationContent from 'containers/VerificationContent';
import VerificationHeader from 'containers/VerificationHeader';

export const App = () => (
	<Startup>
		<VerificationHeader />
		<VerificationContent />
	</Startup>
);

export default App;
