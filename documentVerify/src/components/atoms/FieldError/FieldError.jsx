// @flow
import React from 'react';

const FieldError = ({className, forwardedRef, text}: Props) => {
	return <div className={className} ref={forwardedRef} title={text}>{text}</div>;
};

export default FieldError;
