// @flow

// Проблема с экспортом. В styles.less не переносить

const LEGEND = {
	cursor: 'pointer',
	overflow: 'auto',
	position: 'absolute'
};

const LEGEND_ITEM_BOX = {
	display: 'inline-block',
	height: '1em', // такие параметры используются в apexchart
	margin: '0 5px',
	width: '1em'
};

const DISPLAY_INLINE_HORIZONTAL = {
	display: 'block'
};

const DISPLAY_INLINE_HORIZONTAL_ITEM = {
	display: 'inline-block'
};

const POSITION_BOTTOM = {
	bottom: 0,
	inset: 'auto 0 0',
	left: 0,
	right: 0
};

const POSITION_LEFT = {
	inset: '0 0 auto',
	left: 0,
	padding: '15px 0 0 15px',
	right: 0,
	top: 0
};

const POSITION_RIGHT = {
	inset: '0 0 auto auto',
	padding: '15px 0',
	right: 0,
	top: 0
};

const LEGEND_ITEM = {
	marginBottom: '5px'
};

const CROP_LEGEND_ITEM = {
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap'
};

const WRAP_LEGEND_ITEM = {
	whiteSpace: 'normal'
};

export {
	CROP_LEGEND_ITEM,
	DISPLAY_INLINE_HORIZONTAL_ITEM,
	DISPLAY_INLINE_HORIZONTAL,
	LEGEND_ITEM,
	LEGEND_ITEM_BOX,
	LEGEND,
	POSITION_BOTTOM,
	POSITION_LEFT,
	POSITION_RIGHT,
	WRAP_LEGEND_ITEM
};
