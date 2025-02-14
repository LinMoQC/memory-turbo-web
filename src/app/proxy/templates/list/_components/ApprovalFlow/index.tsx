'use client'

import React, { useCallback, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type ReactFlowInstance,
  ReactFlowProvider,
  Background,
  Position,
} from '@xyflow/react';

import '@xyflow/react/dist/base.css';
import './index.css'
import { Ban, CheckCircle, Edit, UserCheck } from 'lucide-react';
import TurboNode, { TurboNodeData } from './TurboNode';
import TurboEdge from './TurboEdge';
import { templateStatus } from '@/constants/templateSatus';
import { AnimatePresence, motion } from "framer-motion";

const templateApprovalNodes: Node<TurboNodeData>[] = [
  {
    id: '1',
    position: { x: 0, y: 0 },
    data: {
      icon: <Edit />,
      title: '模版创建',
      status: templateStatus.DRAFT
    },
    type: 'turbo',
    targetPosition: Position.Left,
  },
  {
    id: '2',
    position: { x: 400, y: 0 },
    data: {
      icon: <UserCheck />,
      title: '管理员审批',
      status: templateStatus.PENDING
    },
    type: 'turbo',
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: '3',
    position: { x: 800, y: 0 },
    data: {
      icon: <CheckCircle />,
      title: '通过',
      status: templateStatus.APPROVED
    },
    type: 'turbo',
    sourcePosition: Position.Right,
  },
  {
    id: '4',
    position: { x: 800, y: 0 },
    data: {
      icon: <Ban />,
      title: '拒绝',
      status: templateStatus.REJECTED
    },
    type: 'turbo',
    sourcePosition: Position.Right,
  },
];

const templateApprovalEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1', // 模版创建
    target: '2', // 提交审核
  },
  {
    id: 'e2-3',
    source: '2', // 提交审核
    target: '3', // 管理员审批（通过）
  },
  {
    id: 'e2-4',
    source: '2', // 提交审核
    target: '4', // 管理员审批（拒绝）
  },
];


const nodeTypes = {
  turbo: TurboNode,
};

const edgeTypes = {
  turbo: TurboEdge,
};

const defaultEdgeOptions = {
  type: 'turbo',
  markerEnd: 'edge-circle',
};

interface FlowProps {
  filteredNodes: Node<TurboNodeData>[]
  filteredEdges: Edge[]
}

const Flow = ({ filteredEdges, filteredNodes }: FlowProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(filteredNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(filteredEdges);

  useEffect(() => {
    setNodes([...filteredNodes]);
    setEdges([...filteredEdges])
  }, [filteredNodes,filteredEdges]);

  const onInit = useCallback((reactFlowInstance: ReactFlowInstance<Node<TurboNodeData>, Edge>) => {
    reactFlowInstance.zoomTo(0.8);
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      defaultEdgeOptions={defaultEdgeOptions}
      onInit={onInit}
    >
      <Background />
      <svg>
        <defs>
          <linearGradient id="edge-gradient">
            <stop offset="0%" stopColor="#ae53ba" />
            <stop offset="100%" stopColor="#2a8af6" />
          </linearGradient>

          <marker
            id="edge-circle"
            viewBox="-5 -5 10 10"
            refX="0"
            refY="0"
            markerUnits="strokeWidth"
            markerWidth="10"
            markerHeight="10"
            orient="auto"
          >
            <circle stroke="#2a8af6" strokeOpacity="0.75" r="2" cx="0" cy="0" />
          </marker>
        </defs>
      </svg>
    </ReactFlow>
  );
};

export default ({ status }: { status: templateStatus }) => {

  useEffect(() => {
    console.log('status change')
  },[status])

  const filteredNodes = useMemo(() => {
    console.log("计算 filteredNodes，当前 status:", status);
    const statusArray = Object.values(templateStatus);
    const statusIndex = statusArray.indexOf(status);

    return templateApprovalNodes.filter((node) => {
      const nodeStatusIndex = statusArray.indexOf(node.data.status);
      return nodeStatusIndex <= statusIndex;
    });
  }, [status]); 

  const filteredEdges = useMemo(() => {
    return templateApprovalEdges.filter(
      (edge) =>
        filteredNodes.some((node) => node.id === edge.source) &&
        filteredNodes.some((node) => node.id === edge.target)
    );
  }, [filteredNodes]); 

  return (
    <ReactFlowProvider>
      <Flow filteredNodes={filteredNodes} filteredEdges={filteredEdges} />
    </ReactFlowProvider>
  );
};