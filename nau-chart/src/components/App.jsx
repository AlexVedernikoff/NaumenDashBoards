// @flow
import 'styles/app.less';
import Content from 'components/organisms/Content';
import ContextMenu from 'components/organisms/ContextMenu';
import Control from 'components/organisms/Control';
import List from 'components/organisms/List';
import React, { useState } from 'react';
import Startup from 'components/organisms/Startup';
import styles from './styles.less';
import TopMenu from 'components/organisms/TopMenu';

export const App = () => {
	const [contextMenu, setContextMenu] = useState(null);
	const openContextMenu = (e: Event) => {
		if (e) {
			e.evt.preventDefault(true);
			const mousePosition = e.target.getStage().getPointerPosition();
			setContextMenu(mousePosition);
		} else {
			setContextMenu(null);
		}
	};

	return (
		<Startup>
			<TopMenu />
			<div className={styles.wrapContent}>
				<Content openContextMenu={openContextMenu} />
				<List />
				<Control />
				<ContextMenu contextMenu={contextMenu} />
			</div>
		</Startup>
	);
};

export default App;
