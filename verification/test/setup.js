import 'jest-canvas-mock';
import 'regenerator-runtime/runtime';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';

Enzyme.configure({adapter: new Adapter()});
