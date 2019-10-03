// @flow
import React from 'react';
import {TileLayer} from 'react-leaflet';

const CopyRight = () => (
	<TileLayer
		attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a>'
		url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
	/>
);
export default CopyRight;
