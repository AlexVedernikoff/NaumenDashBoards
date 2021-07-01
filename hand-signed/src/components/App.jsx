// @flow
import type {Props} from 'containers/App/types';
import React, {useEffect} from 'react'
import Signature from 'components/organisms/Signature';

const App = ({getAppConfig}: Props) => {
	useEffect(() => {
		getAppConfig();
	}, []);

	return (
		<Signature/>
	);
};

export default App;
