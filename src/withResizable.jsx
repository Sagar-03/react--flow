import { memo } from 'react';
import { NodeResizer } from '@xyflow/react';

// This is a higher-order component (HOC) that adds resize functionality to any node
const withResizable = (NodeComponent) => {
  const ResizableNode = ({ selected, ...rest }) => {
    return (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <NodeResizer
          color="#ff0071"
          isVisible={selected}
          minWidth={250}
          minHeight={200}
          keepAspectRatio={false}
        />
        <NodeComponent {...rest} selected={selected} />
      </div>
    );
  };
  
  return memo(ResizableNode);
};

export default withResizable;
