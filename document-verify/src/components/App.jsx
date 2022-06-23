// @flow
import 'styles/app.less';
import DocumentVerifyContent from 'containers/DocumentVerifyContent';
import DocumentVerifyPopup from 'containers/DocumentVerifyPopup';
import DocumentVerifyTable from 'containers/DocumentVerifyTable';
import React, {useEffect, useState} from 'react';
import Startup from 'containers/Startup';

export const App = () => {
	const [switchView, setSwitchView] = useState(false);

	const onSwitchView = () => {
		setSwitchView(!switchView);
	};

	useEffect(() => {
		const checkHeight = window.setInterval(function () {
			if (window.frameElement && window.frameElement.height) {
				window.frameElement.setAttribute('style', `height:${window.frameElement.height}px`);
				clearInterval(checkHeight);
			}
		}, 10);
	});

	return (
		<Startup>
			<DocumentVerifyPopup />
			<DocumentVerifyContent onSwitchView={onSwitchView} switchView={switchView} />
			<DocumentVerifyTable onSwitchView={onSwitchView} switchView={switchView} />
		</Startup>
	);
};

export default App;
