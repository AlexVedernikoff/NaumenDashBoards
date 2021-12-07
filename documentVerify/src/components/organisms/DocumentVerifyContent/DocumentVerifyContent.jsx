// @flow
import type {Props} from 'containers/DocumentVerifyTable/types';
import React, {useEffect, useState} from 'react';
import styles from './styles.less';

const DocumentVerifyContent = ({verify}: Props) => {
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
				<div className={styles.document} dangerouslySetInnerHTML={{__html: verify?.data?.document + verify?.data?.document}} id='scrollDocument' style={{height}} />
			</div>
		</div>
	);
};

export default DocumentVerifyContent;
