// @flow
import React, { useState } from 'react';
import styles from './styles.less';
import TextInput from 'components/atoms/TextInput/TextInput';

const MandatoryAttributes = (props: Props) => {
	const {code, title} = props;

	const [values, setValues] = useState('');

	const onChange = (e) => {
		setValues(e.value);
	};

	return (
		<TextInput className={styles.input} label={title} name={code} onChange={onChange} placeholder="" value={values} />
	);
};

export default MandatoryAttributes;
