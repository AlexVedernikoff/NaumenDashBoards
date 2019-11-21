// @flow
import type {Props} from './types';
import React, {Component} from 'react';
import {TileLayer} from 'react-leaflet';

export class Copyright extends Component<Props> {
	/*
	 * Открываем ссылку на библиотеку в новом окне.
	 * Ссылка на leaflet, в подписи, подставляется самой библиотекой.
	 * Ставим задержку, так как библиотека грузится асинхронно, в противном случае, библиотека потрет добавленный атрибут
	*/
	componentDidMount () {
		setTimeout(() => {
			const label = document.querySelector('.leaflet-control-attribution.leaflet-control a');
			label && label.setAttribute('target', '_blank');
		}, 1000);
	}

	render () {
		const tile = "&amp;copy <a href='http://osm.org/copyright' target='_blank'>OpenStreetMap</a>";

		return (
			<div>
				<TileLayer
					attribution={tile}
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					visible={false}
					noWrap={true}
				/>
			</div>
		);
	}
}
export default Copyright;
