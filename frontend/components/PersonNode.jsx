import { Handle, Position } from '@xyflow/react';

export default function PersonNode({ data }) {
  return (
    <div className="flex flex-col items-center">
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-red-600" />
      
      {/* Circular Avatar */}
      <div className="w-14 h-14 rounded-full bg-red-100 border-4 border-red-600 flex items-center justify-center shadow-md">
        <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      </div>
      
      {/* Node Label */}
      <div className="mt-2 text-xs font-bold text-gray-900 bg-white px-2 py-0.5 rounded shadow border border-gray-200 text-center">
        {data.label}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-red-600" />
    </div>
  );
}