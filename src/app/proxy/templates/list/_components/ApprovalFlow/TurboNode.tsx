import React, { memo, type ReactNode } from 'react';
import { FiCloud } from 'react-icons/fi';

import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import { templateStatus } from '@/constants/templateSatus';

export type TurboNodeData = {
  title: string;
  icon?: ReactNode;
  subline?: string;
  status: templateStatus;
};

export default memo(({ data }: NodeProps<Node<TurboNodeData>>) => {
  return (
    <>
      <div className="cloud gradient">
        <div>
          <FiCloud />
        </div>
      </div>
      <div className="wrapper gradient">
        <div className="inner">
          <div className="body flex items-center">
            {data.icon && <div className="icon">{data.icon}</div>}
              <div className="title">{data.title}</div>
          </div>
        </div>
      </div>
      <Handle type="target" position={Position.Left} isConnectable={false} className='bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500'/>
      <Handle type="source" position={Position.Right} isConnectable={false} className='bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white'/>
    </>
  );
});