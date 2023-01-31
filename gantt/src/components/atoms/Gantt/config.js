import {gantt} from 'naumen-gantt';

const config = {
	cols: [
		{
			min_width: gantt.config.grid_width,
			rows: [
				{
					scrollX: 'scrollHor1',
					scrollY: 'scrollVer',
					scrollable: true,
					view: 'grid'
				},
				{
					group: 'hor',
					id: 'scrollHor1',
					scroll: 'x',
					view: 'scrollbar'
				}
			]
		},
		{
			resizer: true, width: 1
		},
		{
			gravity: 3,
			rows: [
				{
					scrollX: 'scrollHor',
					scrollY: 'scrollVer',
					view: 'timeline'
				},
				{
					group: 'hor',
					id: 'scrollHor',
					scroll: 'x',
					view: 'scrollbar'
				}
			]
		},
		{
			id: 'scrollVer',
			view: 'scrollbar'
		}
	],
	css: 'gantt_container'
};

export {config};
