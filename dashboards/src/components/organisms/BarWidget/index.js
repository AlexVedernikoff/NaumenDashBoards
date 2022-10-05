// @flow
import BarWidget from './BarWidget';
import {compose} from 'redux';
import withBaseWidget from 'containers/withBaseWidget';
import {withLabelsStorage} from 'containers/LabelsStorage';

export {BarWidget};
export default compose(withBaseWidget, withLabelsStorage)(BarWidget);
