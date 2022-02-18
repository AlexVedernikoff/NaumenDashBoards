// @flow
import React from 'react';
import Truncate from 'react-truncate';

export const truncatedText = (text: string, line: number = 3) => {
	const ellipsis = <span>...</span>;

	return (
		<Truncate lines={line} ellipsis={ellipsis}>
			{text}
		</Truncate>
	);
};
