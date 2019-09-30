// @flow
import classnames from 'classnames';
import React from 'react';
import styles from './style.less';

export const Title = (props: Props) => {
  const {className} = props;
  const classProps: string = classnames(
    className,
    styles.title
  );

  return <h2 className={classProps}>{props.children}</h2>;
};

export default Title;
