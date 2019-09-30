// @flow
import classnames from 'classnames';
import Plus from 'icons/form/plus.svg';
import type {Node} from 'react';
import type {Props} from './types';
import React, {Component} from 'react';
import styles from './style.less';

export class TextWithIcon extends Component<Props> {
    renderIcon = (): Node => {
        const {handleClick} = this.props;

        return (
            <div className={styles.icon}>
                <Plus onClick={handleClick}/>
            </div>
        );
    }

    renderTextWithIcon = (): Node => {
        const {className, name} = this.props;
        const classProps: string = classnames(
            className,
            styles.textWithIcon
        );

        return (
            <div className={classProps}>
                <p className={styles.name}>{name}</p>
                {this.renderIcon()}
            </div>
        );
    }

    render () {
        return this.renderTextWithIcon();
    }
}

export default TextWithIcon;
