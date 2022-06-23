// @flow
import LeftIcon from 'icons/left.svg';
import type {Props} from 'containers/DocumentVerifyTable/types';
import React, {useEffect, useState} from 'react';
import RightIcon from 'icons/right.svg';
import styles from './styles.less';

const DocumentVerifyContent = ({onSwitchView, switchView, verify}: Props) => {
	const [height, setHeight] = useState('auto');

	useEffect(() => {
		const scrollHeight = document.getElementById('scrollBlock')?.scrollHeight;

		if (scrollHeight) {
			setHeight(scrollHeight);
		}
	}, []);

	return (
		<div className={styles.container}>
			<div className={styles.scroll} id='scrollBlock'>

				<div className={styles.document} dangerouslySetInnerHTML={{__html: verify?.data?.html}} id='scrollDocument' style={{height}} />
			</div>
			<div className={styles.switch} onClick={onSwitchView}>{switchView ? <RightIcon /> : <LeftIcon /> }</div>
		</div>
	);
};

export default DocumentVerifyContent;
