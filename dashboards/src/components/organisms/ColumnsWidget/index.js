// @flow
import ColumnsWidget from './ColumnsWidget';
import {compose} from 'redux';
import withBaseWidget from 'containers/withBaseWidget';
import {withLabelsStorage} from 'containers/LabelsStorage';

export {ColumnsWidget};
export default compose(withBaseWidget, withLabelsStorage)(ColumnsWidget);
