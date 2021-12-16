// @flow
import 'styles/app.less';
import DocumentVerifyContent from 'containers/DocumentVerifyContent';
import DocumentVerifyTable from 'containers/DocumentVerifyTable';
import React, {useState} from 'react';
import Startup from 'containers/Startup';

export const App = () => {
	const [switchView, setSwitchView] = useState(false);

	const onSwitchView = () => {
		setSwitchView(!switchView);
	};

	return (
		<Startup>
			<DocumentVerifyContent onSwitchView={onSwitchView} switchView={switchView} />
			<DocumentVerifyTable onSwitchView={onSwitchView} switchView={switchView} />
		</Startup>
	);
};

export default App;
