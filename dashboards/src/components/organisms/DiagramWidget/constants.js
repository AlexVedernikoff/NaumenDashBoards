// @flow
import Content from 'components/organisms/DiagramWidget/components/Content';
import ControlPanel from 'containers/DiagramWidgetControlPanel';
import {FILE_VARIANTS} from 'utils/export';

const EXPORT_LIST = [FILE_VARIANTS.PDF, FILE_VARIANTS.PNG];

const DEFAULT_COMPONENTS = {
	Content,
	ControlPanel
};

export {
	DEFAULT_COMPONENTS,
	EXPORT_LIST
};
