// @flow
import 'styles/app.less';
import Content from 'components/organisms/Content';
import ContextMenu from 'components/organisms/ContextMenu';
import Control from 'components/organisms/Control';
import type {KonvaEventObject} from 'konva/lib/Node';
import List from 'components/organisms/List';
import React, { useState } from 'react';
import Startup from 'components/organisms/Startup';

export const App = () => {
	const [contextMenu, setContextMenu] = useState(null);
	const openContextMenu = (e: KonvaEventObject) => {
		if (!e) {
			setContextMenu(null);
		} else {
			e.evt.preventDefault(true);
			const mousePosition = e.target.getStage().getPointerPosition();
			setContextMenu(mousePosition);
		}
	};

	return (
		<Startup>
			<Content openContextMenu={openContextMenu} />
			<List />
			<Control />
			<ContextMenu contextMenu={contextMenu} />
		</Startup>
	);
};

export default App;
