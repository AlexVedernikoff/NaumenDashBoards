import React from 'react';
import Loader from 'components/atoms/Loader';
import SignatureTemplate from 'components/molecules/SignatureTemplate';

const WithLoading = (Component) =>
	({ isLoading, ...props }) => {

		if (!isLoading) {
			return <Component {...props} />;
		}

		return (
			<SignatureTemplate>
				<Loader/>
			</SignatureTemplate>
		);
};

export default WithLoading;
