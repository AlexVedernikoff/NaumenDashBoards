// @flow
import DiagramWidget from './DiagramWidget';
import withLoadingContent from './HOCs/withLoadingContent';

const LoadingDiagramWidget = withLoadingContent(DiagramWidget);

export {
	LoadingDiagramWidget
};

export default DiagramWidget;
