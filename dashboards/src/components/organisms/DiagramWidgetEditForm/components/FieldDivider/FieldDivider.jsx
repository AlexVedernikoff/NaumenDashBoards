// @flow
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class FieldDivider extends PureComponent<{}> {
	render () {
		return <div className={styles.divider} />;
	}
}

export default FieldDivider;
