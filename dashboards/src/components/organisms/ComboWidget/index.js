// @flow
import ComboWidget from './ComboWidget';
import {compose} from 'redux';
import withBaseWidget from 'containers/withBaseWidget';
import {withLabelsStorage} from 'containers/LabelsStorage';

export {ComboWidget};
export default compose(withBaseWidget, withLabelsStorage)(ComboWidget);
