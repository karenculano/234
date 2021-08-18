/**
 * Copyright IBM Corp. 2016, 2018
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import PropTypes from 'prop-types';
import { useState } from 'react';
import ReactDOM from 'react-dom';

/**
 * Helper component for rendering content within a portal. By default, the
 * portal will render into document.body. You can customize this behavior with
 * the `container` prop. Any `children` provided to this component will be
 * rendered in the portal node.
 */
function Portal({ container, children }) {
  const [mountNode, setMountNode] = useState(null);

  React.useEffect(() => {
    const node = container.current || container || document.body;
    setMountNode(node);
  }, [container]);

  if (mountNode) {
    return ReactDOM.createPortal(children, mountNode);
  }

  return null;
}

Portal.propTypes = {
  /**
   * Specify the children elements to be rendered inside of the <Portal>
   */
  children: PropTypes.node,

  /**
   * Provide a ref for a container node to render the portal
   */
  container: PropTypes.shape({
    current: PropTypes.any,
  }),
};

export { Portal };
