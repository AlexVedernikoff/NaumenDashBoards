// @flow
import {ICON_NAMES, WIDGET_SUB_COLOR} from './constants';
import Sprite from './sprite';

const sprite = new Sprite();

sprite.add(ICON_NAMES.ACCEPT, `
	<path d="M13.7 5.7L7.5 11.9 3.3 7.7 4.7 6.3 7.5 9.1 12.3 4.3 13.7 5.7Z" />
`);

sprite.add(ICON_NAMES.ALIGN_CENTER, `
	<path d="M2 11V13H14V11H2Z" />
	<path d="M4 7V9H12V7H4Z" />
	<path d="M2 3L2 5H14V3H2Z" />
`);

sprite.add(ICON_NAMES.ALIGN_LEFT, `
	<path d="M2 11L2 13H14V11H2Z" />
	<path d="M2 7V9H11V7H2Z" />
	<path d="M2 3L2 5H14V3H2Z" />
`);

sprite.add(ICON_NAMES.ALIGN_RIGHT, `
	<path d="M14 11L14 13H2V11H14Z" />
	<path d="M14 7V9H5V7H14Z" />
	<path d="M14 3L14 5H2V3H14Z" />
`);

sprite.add(ICON_NAMES.ARROW_BOTTOM, `
	<path d="M13 6L12 5C11.4 5.6 8 9 8 9L4 5 3 6 8 11 13 6Z" />
`);

sprite.add(ICON_NAMES.ARROW_TOP, `
	<path d="M3 10L4 11C4.6 10.4 8 7 8 7L12 11 13 10 8 5 3 10Z" />
`);

sprite.add(ICON_NAMES.ASC, `
	<path d="M6 5V3H2V5H6Z" />
	<path d="M10 9V7H2V9H10Z" />
	<path d="M14 13V11H2V13H14Z" />
`);

sprite.add(ICON_NAMES.BAR_CHART, `
	<path fill-rule="evenodd" clip-rule="evenodd" d="M19 11L19 9L5 9L5 11L19 11ZM13 7L13 5L5 5L5 7L13 7ZM9 13L9 15L5 15L5 13L9 13ZM17 19L17 17L5 17L5 19L17 19Z" fill="${WIDGET_SUB_COLOR}"/>
`);

sprite.add(ICON_NAMES.BASKET, `
	<path d="M5.9 14C5.4 14 5 13.6 4.9 13.1L4 6H3V4H6V3C6 2.4 6.4 2 7 2H9C9.6 2 10 2.4 10 3V4H13V6H12L11.1 13.1C11 13.6 10.6 14 10.1 14H5.9Z"/>
`);

sprite.add(ICON_NAMES.BOLD, `
	<path d="M4 13V3H7.7C9 3 10 3.2 10.7 3.7 11.4 4.2 11.8 4.9 11.8 5.8 11.8 6.3 11.7 6.7 11.4 7.1 11.2 7.5 10.8 7.7 10.3 7.9 10.9 8 11.3 8.3 11.6 8.7 11.9 9 12 9.5 12 10 12 11 11.7 11.8 11 12.3 10.4 12.7 9.4 13 8.2 13H4ZM6.5 8.7V11.1H8.1C8.6 11.1 8.9 11 9.2 10.9 9.4 10.6 9.5 10.4 9.5 10 9.5 9.2 9.1 8.8 8.2 8.7H6.5ZM6.5 7.2H7.8C8.3 7.2 8.7 7.1 9 6.9 9.2 6.7 9.3 6.4 9.3 6 9.3 5.6 9.2 5.3 8.9 5.1 8.7 5 8.3 4.9 7.7 4.9H6.5V7.2Z" />
`);

sprite.add(ICON_NAMES.BRACKET_LEFT, `
	<path d="M10 14C10 14 8 11.5 8 8C8 4.5 10 2 10 2L8 2C8 2 6 4 6 8C6 12 8 14 8 14H10Z" />
`);

sprite.add(ICON_NAMES.BRACKET_RIGHT, `
	<path d="M6 14C6 14 8 11.5 8 8C8 4.5 6 2 6 2L8 2C8 2 10 4 10 8C10 12 8 14 8 14H6Z" />
`);

sprite.add(ICON_NAMES.CALENDAR, `
	<path d="M4.7 7.1C4.7 6.4 4.1 5.9 3.5 5.9 2.9 5.9 2.3 6.4 2.3 7.1 2.3 7.7 2.9 8.2 3.5 8.2 4.1 8.2 4.7 7.7 4.7 7.1ZM8.2 7.1C8.2 6.4 7.6 5.9 7 5.9 6.4 5.9 5.8 6.4 5.8 7.1 5.8 7.7 6.4 8.2 7 8.2 7.6 8.2 8.2 7.7 8.2 7.1ZM11.7 7.1C11.7 6.4 11.1 5.9 10.5 5.9 9.9 5.9 9.3 6.4 9.3 7.1 9.3 7.7 9.9 8.2 10.5 8.2 11.1 8.2 11.7 7.7 11.7 7.1ZM12 1L12 0H9L9 1H5L5 0H2L2 1H0L0 14H14V1H12ZM13 13H1V3.1H13V13Z" />
`);

sprite.add(ICON_NAMES.CANCEL, `
	<path fill-rule="evenodd" clip-rule="evenodd" d="M13 4L12 3L8 7L4 3L3 4L7 8L3 12L4 13L8 9L12 13L13 12L9 8L13 4Z" />
`);

sprite.add(ICON_NAMES.CARET, `
	<path fill-rule="evenodd" clip-rule="evenodd" d="M8 11L4 6H12L8 11Z" />
`);

sprite.add(ICON_NAMES.CARET_DOWN, `
	<path d="M13 6L12 5C11.4 5.6 8 9 8 9L4 5 3 6 8 11 13 6Z" />
`);

sprite.add(ICON_NAMES.CARET_UP, `
	<path d="M3 10L4 11C4.6 10.4 8 7 8 7L12 11 13 10 8 5 3 10Z" />
`);

sprite.add(ICON_NAMES.CHECKBOX, `
	<path fill-rule="evenodd" clip-rule="evenodd" d="M14 1H2C1.4 1 1 1.4 1 2V14C1 14.6 1.4 15 2 15H14C14.6 15 15 14.6 15 14V2C15 1.4 14.6 1 14 1ZM2 0C0.9 0 0 0.9 0 2V14C0 15.1 0.9 16 2 16H14C15.1 16 16 15.1 16 14V2C16 0.9 15.1 0 14 0H2Z"  />
`);

sprite.add(ICON_NAMES.CHECKBOX_CHECKED, `
	<path fill-rule="evenodd" clip-rule="evenodd" d="M2 0C0.9 0 0 0.9 0 2V14C0 15.1 0.9 16 2 16H14C15.1 16 16 15.1 16 14V2C16 0.9 15.1 0 14 0H2ZM3.8 6.5L6.5 9.3 11.7 4.5 12.8 5.6 6.5 11.5 2.7 7.6 3.8 6.5Z"  />
`);

sprite.add(ICON_NAMES.CHEVRON, `
	<path d="M12 7.3L8 11 4 7.3 5.3 6 8 8.5 10.7 6 12 7.3Z" />
`);

sprite.add(ICON_NAMES.CLOSE, `
	<path d="M11.6 13.1L8.1 9.5 4.5 13.1 3.1 11.6 6.6 8.1 3.1 4.5 4.5 3.1 8.1 6.6 11.6 3.1 13.1 4.5 9.5 8.1 13.1 11.6 11.6 13.1Z" />
`);

sprite.add(ICON_NAMES.COLUMN, `
	<path d="M3 8L13 8 13 5 3 5V8Z" />
	<path d="M3 12L13 12 13 9 3 9V12Z" />
`);

sprite.add(ICON_NAMES.COLUMN_CHART, `
	<rect width="24" height="24" fill="#EEEEEE"/>
	<path fill-rule="evenodd" clip-rule="evenodd" d="M7 5H9V19H7V5ZM3 11H5V19H3V11ZM13 15H11V19H13V15ZM15 7H17V19H15V7ZM21 13H19V19H21V13Z" fill="${WIDGET_SUB_COLOR}"/>
`);

sprite.add(ICON_NAMES.COMBO_CHART, `
	<path d="M9 5H7V10.2L8 11 9 10.2V5Z" fill="${WIDGET_SUB_COLOR}"/>
	<path d="M9 15.3L8 16 7 15.2V19H9V15.3Z" fill="${WIDGET_SUB_COLOR}"/>
	<path d="M11 13.7L12.4 12.6 13 13.1V19H11V13.7Z" fill="${WIDGET_SUB_COLOR}"/>
	<path d="M13 7.8L12.6 7.4 11 8.6V7H13V7.8Z" fill="${WIDGET_SUB_COLOR}"/>
	<path d="M15 14.8V19H17V14.8L16 15.6 15 14.8Z" fill="${WIDGET_SUB_COLOR}"/>
	<path d="M17 9.6L16 10.4 15 9.5V7H17V9.6Z" fill="${WIDGET_SUB_COLOR}"/>
	<path d="M19 13.2L19.2 13H21V19H19V13.2Z" fill="${WIDGET_SUB_COLOR}"/>
	<path d="M21.6 9.8L16 14.3 12.5 11.3 8 14.7 2.4 10.8 3.6 9.2 8 12.3 12.5 8.7 16 11.7 20.4 8.2 21.6 9.8Z" />
`);

sprite.add(ICON_NAMES.CROP, `
	<path d="M11 4H10V12H11V4Z" />
	<path d="M2 7V9H9V7H2Z" />
	<path d="M12 7V9H14V7H12Z" />
`);

sprite.add(ICON_NAMES.DATA, `
	<path d="M15 3.5C15 1.5 1 1.5 1 3.5C1 5.5 15 5.5 15 3.5Z" />
	<path d="M1 10.5V13.5C1 15.5 15 15.5 15 13.5V10.5C15 12.5 1 12.5 1 10.5Z" />
	<path d="M1 8.5V5.5C1 7.5 15 7.5 15 5.5V8.5C15 10.5 1 10.5 1 8.5Z" />
`);

sprite.add(ICON_NAMES.DESC, `
	<path d="M2 11L2 13H6V11H2Z" />
	<path d="M2 7V9H10V7H2Z" />
	<path d="M2 3L2 5H14V3H2Z" />
`);

sprite.add(ICON_NAMES.DIVISION, `
	<path d="M9.2 4.3C9.4 4.1 9.5 3.8 9.5 3.5 9.5 3.1 9.3 2.7 9.1 2.4 8.8 2.2 8.4 2 8 2 7.7 2 7.4 2.1 7.2 2.3 6.9 2.4 6.7 2.7 6.6 2.9 6.5 3.2 6.5 3.5 6.5 3.8 6.6 4.1 6.7 4.4 6.9 4.6 7.1 4.8 7.4 4.9 7.7 5 8 5 8.3 5 8.6 4.9 8.8 4.8 9.1 4.6 9.2 4.3Z" />
	<path d="M9.5 12.5C9.5 12.8 9.4 13.1 9.2 13.3 9.1 13.6 8.8 13.8 8.6 13.9 8.3 14 8 14 7.7 14 7.4 13.9 7.1 13.8 6.9 13.6 6.7 13.4 6.6 13.1 6.5 12.8 6.5 12.5 6.5 12.2 6.6 11.9 6.7 11.7 6.9 11.4 7.2 11.3 7.4 11.1 7.7 11 8 11 8.4 11 8.8 11.2 9.1 11.4 9.3 11.7 9.5 12.1 9.5 12.5Z" />
	<path d="M14 7H2V9H14V7Z" />
`);

sprite.add(ICON_NAMES.DONE, `
	<path d="M13.7 5.7L7.5 11.9 3.3 7.7 4.7 6.3 7.5 9.1 12.3 4.3 13.7 5.7Z "/>
`);

sprite.add(ICON_NAMES.DONUT_CHART, `
	<path d="M10.7 5.1L9.4 2.3C10.2 2.1 11.1 2 12 2 17.2 2 21.4 5.9 22 11H18.9C18.4 7.6 15.5 5 12 5 11.6 5 11.1 5 10.7 5.1Z" />
	<path d="M8.8 5.8L7.6 3C4.3 4.7 2 8.1 2 12 2 15.9 4.2 19.3 7.5 20.9L8.7 18.2C6.5 17 5 14.7 5 12 5 9.3 6.5 6.9 8.8 5.8Z" fill="${WIDGET_SUB_COLOR}"/>
	<path d="M10.6 18.9C11 19 11.5 19 12 19 15.5 19 18.4 16.4 18.9 13H22C21.4 18.1 17.2 22 12 22 11.1 22 10.2 21.9 9.3 21.6L10.6 18.9Z" fill="${WIDGET_SUB_COLOR}"/>
`);

sprite.add(ICON_NAMES.DOWNLOAD, `
	<path d="M11 6H9V10H7L7 6H5L8 1L11 6Z" />
	<path d="M2 7H4V12H12V7H14V14H2V7Z" />
`);

sprite.add(ICON_NAMES.DRAWER_OPEN, `
	<path d="M9 1H7V15H9V1Z" />
	<path d="M0 8L4 5V11L0 8Z" />
	<path d="M16 8L12 5V11L16 8Z" />
`);

sprite.add(ICON_NAMES.DRAWER_CLOSE, `
	<path d="M9 1H7V15H9V1Z" />
	<path d="M5 8L1 11V5L5 8Z" />
	<path d="M15 5L11 8L15 11V5Z" />
`);

sprite.add(ICON_NAMES.EDIT, `
	<path d="M2 11.1V14H5L12.5 6.4 9.6 3.5 2 11.1ZM14.8 4.1C15.1 3.8 15.1 3.4 14.8 3L13 1.2C12.6 0.9 12.2 0.9 11.9 1.2L10.4 2.7 13.3 5.6 14.8 4.1Z" />
`);

sprite.add(ICON_NAMES.ELLIPSIS, `
	<path d="M5 7.5C5 7.8 4.9 8.1 4.7 8.3 4.6 8.6 4.3 8.8 4.1 8.9 3.8 9 3.5 9 3.2 9 2.9 8.9 2.6 8.8 2.4 8.6 2.2 8.4 2.1 8.1 2 7.8 2 7.5 2 7.2 2.1 6.9 2.2 6.7 2.4 6.4 2.7 6.3 2.9 6.1 3.2 6 3.5 6 3.9 6 4.3 6.2 4.6 6.4 4.8 6.7 5 7.1 5 7.5ZM9.5 7.5C9.5 7.8 9.4 8.1 9.2 8.3 9.1 8.6 8.8 8.8 8.6 8.9 8.3 9 8 9 7.7 9 7.4 8.9 7.1 8.8 6.9 8.6 6.7 8.4 6.6 8.1 6.5 7.8 6.5 7.5 6.5 7.2 6.6 6.9 6.7 6.7 6.9 6.4 7.2 6.3 7.4 6.1 7.7 6 8 6 8.4 6 8.8 6.2 9.1 6.4 9.3 6.7 9.5 7.1 9.5 7.5ZM14 7.5C14 7.8 13.9 8.1 13.7 8.3 13.6 8.6 13.3 8.8 13.1 8.9 12.8 9 12.5 9 12.2 9 11.9 8.9 11.6 8.8 11.4 8.6 11.2 8.4 11.1 8.1 11 7.8 11 7.5 11 7.2 11.1 6.9 11.2 6.7 11.4 6.4 11.7 6.3 11.9 6.1 12.2 6 12.5 6 12.9 6 13.3 6.2 13.6 6.4 13.8 6.7 14 7.1 14 7.5Z" />
`);

sprite.add(ICON_NAMES.EXPAND, `
	<path d="M7 5L10 8 7 11 6 10 8 8 6 6 7 5Z "/>
`);

sprite.add(ICON_NAMES.EXPORT, `
	<path d="M11 5H9V8C9 8.55 8.55 9 8 9C7.45 9 7 8.55 7 8L7 5H5L8 1L11 5Z"/>
	<path d="M1.89 8.65C1.95 8.28 2.28 8 2.66 8H4C4.55 8 5 8.45 5 9C5 9.55 5.45 10 6 10H10C10.55 10 11 9.55 11 9C11 8.45 11.45 8 12 8H13.34C13.72 8 14.05 8.28 14.11 8.65L14.81 12.84C14.91 13.45 14.44 14 13.82 14H2.18C1.56 14 1.09 13.45 1.19 12.84L1.89 8.65Z"/>
`);

sprite.add(ICON_NAMES.EXTERNAL_LINK, `
	<path d="M2 2C1.4 2 1 2.4 1 3V10C1 12.8 3.2 15 6 15H13C13.6 15 14 14.6 14 14 14 13.4 13.6 13 13 13H6C4.3 13 3 11.7 3 10V3C3 2.4 2.6 2 2 2Z" />
	<path d="M14 2V7C14 7.6 13.6 8 13 8 12.4 8 12 7.6 12 7V5.3L7.8 9.5C7.4 9.9 6.8 9.9 6.4 9.5 6 9.1 6 8.5 6.4 8.1L10.5 4H9C8.4 4 8 3.6 8 3 8 2.4 8.4 2 9 2H14Z" />
`);

sprite.add(ICON_NAMES.FILLED_FILTER, `
	<path d="M13 6C14.7 6 16 4.7 16 3 16 1.3 14.7 0 13 0 11.3 0 10 1.3 10 3 10 4.7 11.3 6 13 6Z" />
	<path d="M1 2H8.1C8 2.3 8 2.7 8 3 8 4.7 8.8 6.1 10.1 7.1L8.6 8.5C8.2 8.9 8 9.4 8 9.9V14L6 15V9.9C6 9.4 5.8 8.9 5.4 8.5L1.3 4.5C1.1 4.3 1 4 1 3.8V2Z" />
`);

sprite.add(ICON_NAMES.FILTER, `
	<path d="M14 2H2V3.2L7 9.1V15L9 14V9.1L14 3.2V2Z" />
`);

sprite.add(ICON_NAMES.INFO, `
	<path d="M7.4 7.4H8.6V12H7.4V7.4ZM7.4 5H8.6V6.2H7.4V5ZM8 14C9.2 14 10.3 13.6 11.3 13 12.3 12.3 13.1 11.4 13.5 10.3 14 9.2 14.1 8 13.9 6.8 13.7 5.7 13.1 4.6 12.2 3.8 11.4 2.9 10.3 2.3 9.2 2.1 8 1.9 6.8 2 5.7 2.5 4.6 2.9 3.7 3.7 3 4.7 2.4 5.7 2 6.8 2 8 2 9.6 2.6 11.1 3.8 12.2 4.9 13.4 6.4 14 8 14Z" />
`);

sprite.add(ICON_NAMES.ITALIC, `
	<path d="M4 13L4.5 12 6 12 7.7 4H5.5L6 3H12L11.5 4H9.7L8 12H10L9.5 13 4 13Z" />
`);

sprite.add(ICON_NAMES.LINK, `
	<path d="M1 0H0V14H1V0Z"/>
	<path d="M12 13H0V14H12V13Z"/>
`);

sprite.add(ICON_NAMES.KEBAB, `
	<path d="M8 10.5C8.3 10.5 8.6 10.6 8.8 10.8 9.1 10.9 9.3 11.2 9.4 11.4 9.5 11.7 9.5 12 9.5 12.3 9.4 12.6 9.3 12.9 9.1 13.1 8.9 13.3 8.6 13.4 8.3 13.5 8 13.5 7.7 13.5 7.4 13.4 7.2 13.3 6.9 13.1 6.8 12.8 6.6 12.6 6.5 12.3 6.5 12 6.5 11.6 6.7 11.2 6.9 10.9 7.2 10.7 7.6 10.5 8 10.5ZM8 6C8.3 6 8.6 6.1 8.8 6.3 9.1 6.4 9.3 6.7 9.4 6.9 9.5 7.2 9.5 7.5 9.5 7.8 9.4 8.1 9.3 8.4 9.1 8.6 8.9 8.8 8.6 8.9 8.3 9 8 9 7.7 9 7.4 8.9 7.2 8.8 6.9 8.6 6.8 8.3 6.6 8.1 6.5 7.8 6.5 7.5 6.5 7.1 6.7 6.7 6.9 6.4 7.2 6.2 7.6 6 8 6ZM8 1.5C8.3 1.5 8.6 1.6 8.8 1.8 9.1 1.9 9.3 2.2 9.4 2.4 9.5 2.7 9.5 3 9.5 3.3 9.4 3.6 9.3 3.9 9.1 4.1 8.9 4.3 8.6 4.4 8.3 4.5 8 4.5 7.7 4.5 7.4 4.4 7.2 4.3 6.9 4.1 6.8 3.8 6.6 3.6 6.5 3.3 6.5 3 6.5 2.6 6.7 2.2 6.9 1.9 7.2 1.7 7.6 1.5 8 1.5Z"/>
`);

sprite.add(ICON_NAMES.LINE_CHART, `
	<path d="M6.5 10.4L3.9 3.6 2.1 4.4 5 12.1 6.5 10.4Z" fill="${WIDGET_SUB_COLOR}"/>
	<path d="M8.1 14.7L6.6 16.4 8.6 21.7 14.9 16.4 18.3 19.7 21.9 11.9 20.1 11.1 17.7 16.3 15.1 13.6 9.4 18.3 8.1 14.7Z" fill="${WIDGET_SUB_COLOR}"/>
	<path d="M21.8 4.5L17.5 11.4 15.9 8.8 11.6 14.5 9.1 12 3.8 18.2 2.2 16.8 8.9 9 11.4 11.5 16.1 5.2 17.5 7.6 20.2 3.5 21.8 4.5Z" />
`);

sprite.add(ICON_NAMES.LEFT_ANGLE, `
	<path fill-rule="evenodd" clip-rule="evenodd" d="M5 8L10 4V12L5 8Z" />
`);

sprite.add(ICON_NAMES.NUMBER, `
	<path d="M2.4 8.7H3.8V2H3.7L1 3V4.2L2.4 3.7V8.7Z" />
	<path d="M5.5 10.8H9.8V9.6H7.4L8.2 8.6C8.6 8.1 8.9 7.8 9.1 7.5 9.3 7.2 9.5 6.9 9.6 6.7 9.6 6.5 9.7 6.2 9.7 5.9 9.7 5.3 9.5 4.8 9.1 4.5 8.8 4.2 8.3 4 7.6 4 7.2 4 6.8 4.1 6.5 4.3 6.1 4.5 5.9 4.8 5.7 5.1 5.7 5.2 5.6 5.3 5.6 5.3L6.8 6.1C6.9 5.9 6.9 5.7 7 5.5 7.2 5.3 7.4 5.2 7.6 5.2 7.8 5.2 8 5.3 8.1 5.4 8.2 5.6 8.3 5.8 8.3 6.1 8.3 6.4 8 6.9 7.5 7.5L5.5 9.8V10.8Z" />
	<path d="M12.5 9.9H12.7C13.2 9.9 13.5 9.6 13.5 9.1 13.5 8.8 13.4 8.7 13.3 8.5 13.2 8.4 13 8.3 12.8 8.3 12.6 8.3 12.4 8.4 12.3 8.5 12.1 8.7 12 8.9 12 9.1L10.8 8.1C10.8 8.1 10.9 8.1 10.9 8 11.1 7.7 11.3 7.5 11.6 7.4 12 7.2 12.3 7.1 12.7 7.1 13.4 7.1 13.9 7.3 14.3 7.6 14.7 8 14.9 8.4 14.9 9 14.9 9.3 14.8 9.6 14.7 9.9 14.5 10.1 14.3 10.3 14 10.5 14.3 10.6 14.5 10.8 14.7 11.1 14.9 11.3 15 11.6 15 12 15 12.6 14.8 13.1 14.4 13.5 13.9 13.8 13.4 14 12.7 14 12.3 14 11.9 13.9 11.6 13.8 11.2 13.6 11 13.4 10.8 13.1 10.6 12.8 10.5 12.4 10.5 12H12C12 12.3 12 12.4 12.2 12.6 12.3 12.7 12.5 12.8 12.8 12.8 13 12.8 13.2 12.7 13.4 12.6 13.5 12.4 13.6 12.2 13.6 12 13.6 11.7 13.5 11.4 13.3 11.3 13.2 11.1 13 11.1 12.7 11.1H12.5V9.9Z" />
`);

sprite.add(ICON_NAMES.MAIL, `
	<path d="M3 3C2.4 3 2 3.4 2 4V12C2 12.6 2.4 13 3 13H13C13.6 13 14 12.6 14 12V4C14 3.4 13.6 3 13 3H3ZM12.8 6.5L8 9.2 3.2 6.5V5.3L8 7.8 12.8 5.3V6.5Z" />
`);

sprite.add(ICON_NAMES.MINUS, `
	<path d="M14 9L2 9V7L14 7 14 9Z" />
`);

sprite.add(ICON_NAMES.MOBILE, `
	<path fill-rule="evenodd" clip-rule="evenodd" d="M4 1C3.4 1 3 1.4 3 2V14C3 14.6 3.4 15 4 15H12C12.6 15 13 14.6 13 14V2C13 1.4 12.6 1 12 1H4ZM8 11C7.4 11 7 11.4 7 12 7 12.6 7.4 13 8 13 8.6 13 9 12.6 9 12 9 11.4 8.6 11 8 11Z" />
`);

sprite.add(ICON_NAMES.MULTIPLY, `
	<path d="M9 10.4V13H7L7 10.4 5.2 12.2 3.8 10.8 5.6 9H3V7H5.6L3.8 5.2 5.2 3.8 7 5.6 7 3H9V5.6L10.8 3.8 12.2 5.2 10.4 7H13V9H10.4L12.2 10.8 10.8 12.2 9 10.4Z" />
`);

sprite.add(ICON_NAMES.ONE_TO_ONE, `
	<path d="M3.5 13.5H5V3.5H4.9L2 4.5V5.7L3.5 5.3V13.5Z" />
	<path d="M12 13.5H13.5V3.5H13.4L10.5 4.5V5.7L12 5.3V13.5Z" />
	<path d="M8.3 7.5C8.6 7.5 8.7 7.6 8.9 7.7 9.1 7.8 9.1 8 9.1 8.2 9.1 8.5 9.1 8.6 8.9 8.8 8.7 8.9 8.6 9 8.3 9 8.1 9 7.9 8.9 7.7 8.8 7.6 8.6 7.5 8.5 7.5 8.2 7.5 8 7.6 7.9 7.7 7.7 7.9 7.6 8.1 7.5 8.3 7.5Z" />
	<path d="M8.9 11.7C8.7 11.6 8.6 11.5 8.3 11.5 8.1 11.5 7.9 11.6 7.7 11.7 7.6 11.9 7.5 12 7.5 12.2 7.5 12.5 7.6 12.6 7.7 12.8 7.9 12.9 8.1 13 8.3 13 8.6 13 8.7 12.9 8.9 12.8 9.1 12.6 9.1 12.5 9.1 12.2 9.1 12 9.1 11.8 8.9 11.7Z" />
`);

sprite.add(ICON_NAMES.PAN, `
	<path d="M10.5 4L8 0.5L5.5 4L10.5 4Z" />
	<path d="M5.5 12.5L8 16L10.5 12.5H5.5Z" />
	<path d="M4 10.5V9H12V10.5L15.5 8L12 5.5V7H4V5.5L0.5 8L4 10.5Z" />
`);

sprite.add(ICON_NAMES.PANEL_TO_LEFT, `
	<path d="M2.5 8L5.31 5 L6.25 6L4.37 8L6.25 10L5.31 11L2.5 8Z" fill="#595959"/>
	<path fill-rule="evenodd" clip-rule="evenodd" d="M13 0C13.55 0 14 0.45 14 1V13C14 13.55 13.55 14 13 14H1.5C0.67 14 0 13.33 0 12.5V1C0 0.45 0.45 0 1 0H13ZM1 12.5C1 12.78 1.22 13 1.5 13H7.5C7.78 13 8 12.78 8 12.5V3.5C8 3.22 7.78 3 7.5 3H1.5C1.22 3 1 3.22 1 3.5V12.5Z" fill="#595959"/>
`);

sprite.add(ICON_NAMES.PANEL_TO_RIGHT, `
	<path d="M11.5 8L8.69 5L7.75 6L9.62 8L7.75 10L8.69 11L11.5 8Z" fill="#595959"/>
	<path fill-rule="evenodd" clip-rule="evenodd" d="M0 1C0 0.45 0.45 0 1 0H13C13.55 0 14 0.45 14 1V12.5C14 13.33 13.33 14 12.5 14H1C0.45 14 0 13.55 0 13V1ZM12.5 3C12.78 3 13 3.22 13 3.5V12.5C13 12.78 12.78 13 12.5 13H6.5C6.22 13 6 12.78 6 12.5V3.5C6 3.22 6.22 3 6.5 3H12.5Z" fill="#595959"/>
`);

sprite.add(ICON_NAMES.PLUS, `
	<path d="M14 9L9 9V14L7 14V9L2 9V7L7 7V2L9 2V7L14 7 14 9Z" />
`);

sprite.add(ICON_NAMES.PIE_CHART, `
	<path d="M9.4 2.3L13.4 11H22C21.4 5.9 17.2 2 12 2 11.1 2 10.2 2.1 9.4 2.3Z" />
	<path d="M7.6 3L11.6 11.9 7.5 20.9C4.2 19.3 2 15.9 2 12 2 8.1 4.3 4.7 7.6 3Z" fill="${WIDGET_SUB_COLOR}"/>
	<path d="M22 13H13.2L9.3 21.6C10.2 21.9 11.1 22 12 22 17.2 22 21.4 18.1 22 13Z" fill="${WIDGET_SUB_COLOR}"/>
`);

sprite.add(ICON_NAMES.PLUS, `
	<path d="M14 9L9 9V14L7 14V9L2 9V7L7 7V2L9 2V7L14 7 14 9Z" />
`);

sprite.add(ICON_NAMES.POSITION_BOTTOM, `
	<path d="M4 10V12H12V10H4Z" />
	<path fill-rule="evenodd" clip-rule="evenodd" d="M13 3H3V13H13V3ZM2 2V14H14V2H2Z" />
`);

sprite.add(ICON_NAMES.POSITION_LEFT, `
	<path d="M4 12H6L6 4L4 4L4 12Z" />
	<path fill-rule="evenodd" clip-rule="evenodd" d="M13 3H3V13H13V3ZM2 2V14H14V2H2Z" />
`);

sprite.add(ICON_NAMES.POSITION_RIGHT, `
	<path d="M10 12H12V4L10 4L10 12Z" />
	<path fill-rule="evenodd" clip-rule="evenodd" d="M13 3H3V13H13V3ZM2 2V14H14V2H2Z" />
`);

sprite.add(ICON_NAMES.POSITION_TOP, `
	<path d="M4 4V6H12V4H4Z" />
	<path fill-rule="evenodd" clip-rule="evenodd" d="M13 3H3V13H13V3ZM2 2V14H14V2H2Z" />
`);

sprite.add(ICON_NAMES.PRINT, `
	<path d="M3 5V2C3 1.45 3.45 1 4 1H12C12.55 1 13 1.45 13 2V5H14C14.55 5 15 5.45 15 6V11C15 11.55 14.55 12 14 12H13V14C13 14.55 12.55 15 12 15H4C3.45 15 3 14.55 3 14V12H2C1.45 12 1 11.55 1 11V6C1 5.45 1.45 5 2 5H3ZM4 2H12V5H4V2ZM4 12V14H12V12H4ZM3 9.5C3 9.78 3.22 10 3.5 10H4.5C4.78 10 5 9.78 5 9.5 5 9.22 4.78 9 4.5 9H3.5C3.22 9 3 9.22 3 9.5Z" />
`);

sprite.add(ICON_NAMES.RADIO, `
	<path fill-rule="evenodd" clip-rule="evenodd" d="M8 15C11.9 15 15 11.9 15 8 15 4.1 11.9 1 8 1 4.1 1 1 4.1 1 8 1 11.9 4.1 15 8 15ZM8 16C12.4 16 16 12.4 16 8 16 3.6 12.4 0 8 0 3.6 0 0 3.6 0 8 0 12.4 3.6 16 8 16Z" />
`);

sprite.add(ICON_NAMES.RADIO_CHECKED, `
	<path d="M8 12C10.2 12 12 10.2 12 8 12 5.8 10.2 4 8 4 5.8 4 4 5.8 4 8 4 10.2 5.8 12 8 12Z" />
	<path fill-rule="evenodd" clip-rule="evenodd" d="M16 8C16 12.4 12.4 16 8 16 3.6 16 0 12.4 0 8 0 3.6 3.6 0 8 0 12.4 0 16 3.6 16 8ZM15 8C15 11.9 11.9 15 8 15 4.1 15 1 11.9 1 8 1 4.1 4.1 1 8 1 11.9 1 15 4.1 15 8Z" />
`);

sprite.add(ICON_NAMES.REFRESH, `
	<path d="M8 2.17C7.98 2.17 7.98 2.17 7.97 2.17V1L5.57 3.15 7.98 5.29V4.05C7.98 4.05 8 4.05 8.02 4.05 10.24 4.05 12.06 5.82 12.06 8 12.06 8.98 11.7 9.88 11.09 10.57L12.51 11.84C13.44 10.82 14 9.46 14 8 14 4.78 11.31 2.17 8 2.17Z" />
	<path d="M7.97 11.95C5.74 11.94 3.94 10.18 3.94 8 3.94 7.04 4.29 6.16 4.88 5.48L3.39 4.27C2.53 5.28 2 6.58 2 8 2 11.2 4.67 13.82 7.97 13.83V15L10.35 12.87 7.97 10.75V11.95Z" />
`);

sprite.add(ICON_NAMES.REMOVE, `
	<path fill-rule="evenodd" clip-rule="evenodd" d="M3 11.3C2.4 10.3 2 9.2 2 8 2 6.4 2.6 4.9 3.8 3.8 4.9 2.6 6.4 2 8 2 9.2 2 10.3 2.4 11.3 3 12.3 3.7 13.1 4.6 13.5 5.7 14 6.8 14.1 8 13.9 9.2 13.7 10.3 13.1 11.4 12.2 12.2 11.4 13.1 10.3 13.7 9.2 13.9 8 14.1 6.8 14 5.7 13.5 4.6 13.1 3.7 12.3 3 11.3ZM10.3 5L11 5.8 8.8 8 11 10.3 10.3 11 8 8.7 5.7 11 5 10.3 7.3 8 5 5.8 5.8 5 8 7.2 10.3 5Z" />
`);

sprite.add(ICON_NAMES.RIGHT_ANGLE, `
	<path fill-rule="evenodd" clip-rule="evenodd" d="M11 8L6 12L6 4L11 8Z" />
`);

sprite.add(ICON_NAMES.ROW, `
	<path d="M2 10L7 10 7 7 2 7V10Z" />
	<path d="M9 10L14 10 14 7 9 7V10Z" />
`);

sprite.add(ICON_NAMES.SAVE, `
	<path fill-rule="evenodd" clip-rule="evenodd" d="M11 2.00001L2 2V12.6667C2 13.4 2.59332 14 3.33337 14H12.6667C13.4 14 14 13.4 14 12.6667V5.00001L11 2.00001ZM10 6.00001H4V3.00001H10V6.00001ZM4 8.00001H12V9.00001H4V8.00001ZM12 10H4V11H12V10Z"/>
`);

sprite.add(ICON_NAMES.STACKED_BAR_CHART, `
	<path fill-rule="evenodd" clip-rule="evenodd" d="M13 19L13 17L5 17L5 19L13 19ZM12 11L12 9L5 9L5 11L12 11ZM8 7L8 5L5 5L5 7L8 7ZM8 13L8 15L5 15L5 13L8 13Z" fill="${WIDGET_SUB_COLOR}"/>
	<path fill-rule="evenodd" clip-rule="evenodd" d="M19 19L19 17L14 17L14 19L19 19ZM17 11L17 9L13 9L13 11L17 11ZM13 7L13 5L9 5L9 7L13 7ZM11 13L11 15L9 15L9 13L11 13Z" />
`);

sprite.add(ICON_NAMES.STACKED_COLUMN_CHART, `
	<path fill-rule="evenodd" clip-rule="evenodd" d="M15 11H17V19H15V11ZM7 12H9V19H7V12ZM3 16H5V19H3V16ZM13 16H11V19H13V16ZM21 15H19V19H21V15Z" fill="${WIDGET_SUB_COLOR}"/>
	<path fill-rule="evenodd" clip-rule="evenodd" d="M15 5H17V10H15V5ZM7 7H9V11H7V7ZM3 11H5V15H3V11ZM13 13H11V15H13V13ZM21 10H19V14H21V10Z" />
`);

sprite.add(ICON_NAMES.SEARCH, `
	<path d="M9.45 8.21C10.05 7.36 10.41 6.32 10.41 5.2 10.41 2.33 8.08 0 5.2 0 2.33 0 0 2.33 0 5.2 0 8.08 2.33 10.41 5.2 10.41 6.33 10.41 7.38 10.04 8.24 9.42L12.81 14 14 12.81 9.45 8.21ZM5.2 8.81C3.21 8.81 1.6 7.2 1.6 5.2 1.6 3.21 3.21 1.6 5.2 1.6 7.2 1.6 8.81 3.21 8.81 5.2 8.81 7.2 7.2 8.81 5.2 8.81Z" />
`);

sprite.add(ICON_NAMES.SPEEDOMETER, `
	<path d="M19.5 7.4C17.7 5.3 15 4 12 4 9 4 6.3 5.3 4.5 7.4L6.6 9.5C7.9 8 9.8 7 12 7 14.2 7 16.1 8 17.4 9.5L19.5 7.4Z" fill="#AD87DE"/>
	<path d="M5.8 10.8L3.6 8.6C2.6 10.2 2 12 2 14 2 14.3 2 14.7 2 15H5.1C5 14.7 5 14.3 5 14 5 12.9 5.3 11.8 5.8 10.8Z" fill="#AD87DE"/>
	<path d="M20.4 8.6L18.2 10.8C18.7 11.8 19 12.9 19 14 19 14.3 19 14.7 18.9 15H22C22 14.7 22 14.3 22 14 22 12 21.4 10.2 20.4 8.6Z" />
	<path d="M8 16L14 10V15C14 15.6 13.6 16 13 16H8Z" />
	<path d="M19 20C19.6 20 20.2 19.7 20.6 19.2 21 18.5 21.3 17.8 21.5 17H2.5C2.7 17.8 3 18.5 3.4 19.2 3.8 19.7 4.4 20 5 20H19Z" />
`);

sprite.add(ICON_NAMES.SQUARE, `
	<path d="M12 14H4C2.9 14 2 13.1 2 12V4C2 2.9 2.9 2 4 2H12C13.1 2 14 2.9 14 4V12C14 13.1 13.1 14 12 14ZM8.6 7.4H7.4V12H8.6V7.4ZM8.6 5H7.4V6.2H8.6V5Z"/>
`);

sprite.add(ICON_NAMES.SQUARE_REMOVE, `
	<path d="M4 14H12C13.1 14 14 13.1 14 12V4C14 2.9 13.1 2 12 2 9.3 2 6.8 2 4 2 2.9 2 2 2.9 2 4V12C2 13.1 2.9 14 4 14ZM10.3 5L11 5.8 8.8 8 11 10.3 10.3 11 8 8.7 5.7 11 5 10.3 7.3 8 5 5.8 5.8 5 8 7.2 10.3 5Z" />
`);

sprite.add(ICON_NAMES.SUM, `
	<path d="M2 14V11.5L6.8 7.3 2 4.5V2L14 2 13.5 4.5H6.5L10 6.5V8L6 11.5H13.5L14 14H2Z"/>
`);

sprite.add(ICON_NAMES.SUMMARY, `
	<path fill-rule="evenodd" clip-rule="evenodd" d="M2 11H4H6V19H4V13H2V11ZM8 17H10V19H8V17ZM20 16V19H22V16V15V14V11H20V14H18V11H16V14V15V16H20ZM12 11H10V13H12V19H14V11H12Z" fill="${WIDGET_SUB_COLOR}"/>
	<rect x="2" y="6" width="20" height="2" />
`);

sprite.add(ICON_NAMES.TABLE, `
	<path fill-rule="evenodd" clip-rule="evenodd" d="M11 5H5H3V7V11V13V17V19H5H11H13H19H21V17V13V11V7V5H19H13H11ZM11 7H5V11H11V7ZM11 13H5V17H11V13ZM13 17V13H19V17H13ZM13 11V7H19V11H13Z" fill="${WIDGET_SUB_COLOR}"/>
	<path fill-rule="evenodd" clip-rule="evenodd" d="M10 8H6V10H10V8ZM17 8H14V10H17V8ZM6 14H8V16H6V14ZM18 14H14V16H18V14Z" />
`);

sprite.add(ICON_NAMES.TEXT, `
	<path d="M9.7 11.1H6.3L5.7 13H3L6.8 3H9.2L13 13H10.3L9.7 11.1ZM6.9 9.3H9.1L8 5.8 6.9 9.3Z" />
`);

sprite.add(ICON_NAMES.TIMER, `
	<path d="M9.5 1C9.8 1 10 1.2 10 1.5 10 1.8 9.8 2 9.5 2H9V3.1C11.8 3.6 14 6 14 9 14 12.3 11.3 15 8 15 4.7 15 2 12.3 2 9 2 6 4.2 3.6 7 3.1V2H6.5C6.2 2 6 1.8 6 1.5 6 1.2 6.2 1 6.5 1H9.5ZM11 9C11.6 9 12 8.5 11.9 8 11.5 6.6 10.4 5.5 9 5.1 8.5 5 8 5.4 8 6V8C8 8.6 8.4 9 9 9H11Z" />
`);

sprite.add(ICON_NAMES.TIMER_OFF, `
	<path d="M14.5 4L13.6 3.1 2.5 15 3.4 15.9 5.1 14.2C5.9 14.7 6.9 15 8 15 11.3 15 14 12.3 14 9 14 7.8 13.6 6.7 13 5.7L14.5 4Z" />
	<path d="M9 3.1C9.8 3.2 10.5 3.5 11.1 3.9L3.1 12.4C2.4 11.5 2 10.3 2 9 2 6 4.2 3.6 7 3.1L7 2H6V1L10 1V2H9L9 3.1Z" />
`);

sprite.add(ICON_NAMES.TOGGLE_COLLAPSED, `
	<path fill-rule="evenodd" clip-rule="evenodd" d="M14 1H2C1.44772 1 1 1.44772 1 2V14C1 14.5523 1.44772 15 2 15H14C14.5523 15 15 14.5523 15 14V2C15 1.44772 14.5523 1 14 1ZM2 0C0.895431 0 0 0.895431 0 2V14C0 15.1046 0.895431 16 2 16H14C15.1046 16 16 15.1046 16 14V2C16 0.895431 15.1046 0 14 0H2Z" />
	<path fill-rule="evenodd" clip-rule="evenodd" d="M7.5 7.5V4H8.5V7.5L12 7.5V8.5H8.5V12H7.5V8.5H4V7.5H7.5Z" />
`);

sprite.add(ICON_NAMES.TOGGLE_EXPANDED, `
	<path fill-rule="evenodd" clip-rule="evenodd" d="M14 1H2C1.44772 1 1 1.44772 1 2V14C1 14.5523 1.44772 15 2 15H14C14.5523 15 15 14.5523 15 14V2C15 1.44772 14.5523 1 14 1ZM2 0C0.895431 0 0 0.895431 0 2V14C0 15.1046 0.895431 16 2 16H14C15.1046 16 16 15.1046 16 14V2C16 0.895431 15.1046 0 14 0H2Z" />
	<path fill-rule="evenodd" clip-rule="evenodd" d="M12 8.5L4 8.5V7.5L12 7.5V8.5Z" />
`);

sprite.add(ICON_NAMES.TOUCH_CALENDAR, `
	<path d="M14 7.9V14H2V4.1H8.1C8 3.7 8 3.4 8 3 8 2.7 8 2.3 8.1 2H6L6 1H3L3 2H1L1 15H15V7.6C14.7 7.7 14.3 7.8 14 7.9Z"/>
	<path d="M4.5 6.9C5.1 6.9 5.7 7.4 5.7 8.1 5.7 8.7 5.1 9.2 4.5 9.2 3.9 9.2 3.3 8.7 3.3 8.1 3.3 7.4 3.9 6.9 4.5 6.9Z"/>
	<path d="M8 6.9C8.6 6.9 9.2 7.4 9.2 8.1 9.2 8.7 8.6 9.2 8 9.2 7.4 9.2 6.8 8.7 6.8 8.1 6.8 7.4 7.4 6.9 8 6.9Z"/>
	<path d="M13 6C14.7 6 16 4.7 16 3 16 1.3 14.7 0 13 0 11.3 0 10 1.3 10 3 10 4.7 11.3 6 13 6Z"/>
`);

sprite.add(ICON_NAMES.TOUCH_NUMBER, `
	<path d="M16 3C16 4.7 14.7 6 13 6 11.3 6 10 4.7 10 3 10 1.3 11.3 0 13 0 14.7 0 16 1.3 16 3Z" />
	<path d="M1.4 9.7H2.8V3H2.7L0 4V5.2L1.4 4.7V9.7Z" />
	<path d="M4.5 11.8H8.8V10.6H6.4L7.2 9.6C7.6 9.1 7.9 8.8 8.1 8.5 8.3 8.2 8.5 7.9 8.6 7.7 8.6 7.5 8.7 7.2 8.7 6.9 8.7 6.3 8.5 5.8 8.1 5.5 7.8 5.2 7.3 5 6.6 5 6.2 5 5.8 5.1 5.5 5.3 5.1 5.5 4.9 5.8 4.7 6.1 4.7 6.2 4.6 6.3 4.6 6.3L5.8 7.1C5.9 6.9 5.9 6.7 6 6.5 6.2 6.3 6.4 6.2 6.6 6.2 6.8 6.2 7 6.3 7.1 6.4 7.2 6.6 7.3 6.8 7.3 7.1 7.3 7.4 7 7.9 6.5 8.5L4.5 10.8V11.8Z" />
	<path d="M11.7 10.9H11.5V12.1H11.7C12 12.1 12.2 12.1 12.3 12.3 12.5 12.4 12.6 12.7 12.6 13 12.6 13.2 12.5 13.4 12.4 13.6 12.2 13.7 12 13.8 11.8 13.8 11.5 13.8 11.3 13.7 11.2 13.6 11 13.4 11 13.3 11 13H9.5C9.5 13.4 9.6 13.8 9.8 14.1 10 14.4 10.2 14.6 10.6 14.8 10.9 14.9 11.3 15 11.7 15 12.4 15 12.9 14.8 13.4 14.5 13.8 14.1 14 13.6 14 13 14 12.6 13.9 12.3 13.7 12.1 13.5 11.8 13.3 11.6 13 11.5 13.3 11.3 13.5 11.1 13.7 10.9 13.8 10.6 13.9 10.3 13.9 10 13.9 9.4 13.7 9 13.3 8.6 12.9 8.3 12.4 8.1 11.7 8.1 11.3 8.1 11 8.2 10.6 8.4 10.3 8.5 10.1 8.7 9.9 9 9.9 9.1 9.8 9.1 9.8 9.1L11 10.1C11 9.9 11.1 9.7 11.3 9.5 11.4 9.4 11.6 9.3 11.8 9.3 12 9.3 12.2 9.4 12.3 9.5 12.4 9.7 12.5 9.8 12.5 10.1 12.5 10.6 12.2 10.9 11.7 10.9Z" />
`);

sprite.add(ICON_NAMES.TOUCH_TEXT, `
	<path d="M16 3C16 4.7 14.7 6 13 6 11.3 6 10 4.7 10 3 10 1.3 11.3 0 13 0 14.7 0 16 1.3 16 3Z" />
	<path d="M4.3 11.1H7.7L8.3 13H11L7.2 3H4.8L1 13H3.7L4.3 11.1ZM7.1 9.3H4.9L6 5.8 7.1 9.3Z" />
`);

sprite.add(ICON_NAMES.UNDERLINE, `
	<path d="M12 8.8V3H9.6V8.8C9.6 9.3 9.4 9.7 9.2 10 8.9 10.2 8.5 10.4 8 10.4 7 10.4 6.5 9.9 6.5 8.9V3H4V8.9C4 9.8 4.4 10.6 5.1 11.2 5.8 11.7 6.8 12 8 12 8.8 12 9.5 11.9 10.1 11.6 10.7 11.4 11.2 11 11.5 10.5 11.8 10 12 9.5 12 8.8Z" />
	<path d="M13 13H3V14H13V13Z" />
`);

sprite.add(ICON_NAMES.USER, `
	<path fill-rule="evenodd" clip-rule="evenodd" d="M1 12.7C1 14 2 15 3.3 15H12.7C14 15 15 14 15 12.7V3.3C15 2 14 1 12.7 1H3.3C2 1 1 2 1 3.3V12.7ZM10 5C10 6.1 9.1 7 8 7 6.9 7 6 6.1 6 5 6 3.9 6.9 3 8 3 9.1 3 10 3.9 10 5ZM8 9C5.8 9 4 10.5 4 12 4 12.5 4.5 13 5 13 5.5 13 11 13 11 13 11.6 13 12 12.5 12 12 12 10.5 10.2 9 8 9Z" />
`);

sprite.add(ICON_NAMES.WEB, `
	<path d="M2 2C1.4 2 1 2.4 1 3V11C1 11.6 1.4 12 2 12H14C14.6 12 15 11.6 15 11V3C15 2.4 14.6 2 14 2H2Z"/>
	<path d="M5 14C5 13.4 5.4 13 6 13H10C10.6 13 11 13.4 11 14 11 14.6 10.6 15 10 15H6C5.4 15 5 14.6 5 14Z"/>
`);

sprite.add(ICON_NAMES.WEB_MK, `
	<path d="M7 3H2C1.4 3 1 3.4 1 4V11C1 11.6 1.4 12 2 12H7V3Z"/>
	<path d="M7 13H5C4.4 13 4 13.4 4 14 4 14.6 4.4 15 5 15H7V13Z"/>
	<path d="M9 15H14C14.6 15 15 14.6 15 14V2C15 1.4 14.6 1 14 1H9V15Z"/>
`);

sprite.add(ICON_NAMES.WRAP, `
	<path d="M2 9V11H9V9H2Z" />
	<path d="M2 5L2 7H14V5H2Z" />
`);

sprite.add(ICON_NAMES.ZOOM, `
	<circle cx="8" cy="8.5" r="3" stroke-width="2" fill="none" />
	<path d="M7 2.5C7 1.9 7.4 1.5 8 1.5 8.6 1.5 9 1.9 9 2.5V6.5H7V2.5Z" />
	<path d="M14 7.4C14.5 7.4 15 7.8 15 8.4 15 8.9 14.6 9.4 14 9.4L10.2 9.5 10.2 7.5 14 7.4Z" />
	<path d="M7 10.5H9V14.5C9 15.1 8.6 15.5 8 15.5 7.4 15.5 7 15.1 7 14.5V10.5Z" />
	<path d="M5.9 7.5L6 9.5 2 9.6C1.5 9.6 1 9.2 1 8.6 1 8.1 1.5 7.6 2 7.6L5.9 7.5Z" />
`);

sprite.render();
