// @flow
import AnimateHeight from 'react-animate-height';
import ChevronDown from 'icons/form/chevron-down-bare.svg';
import ChevronUp from 'icons/form/chevron-up-bare.svg';
import type {Node} from 'react';
import type {Props} from './types';
import React, {Component, Fragment} from 'React';
import styles from './style.less';

export class DropDownMenu extends Component<Props, State> {
    constructor (props) {
        super(props);

        this.state = {
          height: 0
        };
    }

    renderIcon = () => {
        const {height} = this.state;
        const icon = height ? <ChevronDown /> : <ChevronUp />;

        return <div className={styles.icon}>{icon}</div>;
    };

    renderMenu = () => {
        const {height} = this.state;
        return <AnimateHeight duration={500} height={height}>{this.renderMenuItems()}</AnimateHeight>;
    };

    renderMenuItem = (item: Node): Node => <li>{item}</li>;

    renderMenuItems = (): ChildrenArray<Node> => {
        const {children} = this.props;
        return <ul className={styles.menu}>{children.map(this.renderMenuItem)}</ul>;
    };

    renderName = () => {
        const {name} = this.props;

        return (
            <div onClick={this.toggleMenu} className={styles.name}>
                {name}
                {this.renderIcon()}
            </div>
        );
    };

    toggleMenu = () => {
        const {height} = this.state;

        this.setState({
            height: height === 0 ? 'auto' : 0
        });
    };

    render () {
        return (
            <Fragment>
                {this.renderName()}
                {this.renderMenu()}
            </Fragment>
        );
    }
}

export default DropDownMenu;
