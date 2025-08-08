import React from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;

  return (
    <g>
      <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill="#333" fontWeight="bold">
        {payload.name}
      </text>
      <text x={cx} y={cy + 10} dy={8} textAnchor="middle" fill="#555">
        {`R$ ${payload.value.toLocaleString('pt-BR')}`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

export default function DashboardPieChart({ data, activeIndex, onPieEnter, onPieLeave, defaultLabel }) {
  // Paleta de cores do gráfico de pizza original
  const COLORS = ['#007bff', '#17a2b8', '#28a745', '#ffc107', '#6c757d'];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={65}
          outerRadius={90}
          fill="#8884d8"
          dataKey="value"
          onMouseEnter={onPieEnter}
          onMouseLeave={onPieLeave}
          paddingAngle={3}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        {/* Renderiza o texto padrão (nome e valor) no centro */}
        {activeIndex === null && defaultLabel && (
          <>
            <text 
              x="50%" 
              y="50%" 
              dy="-5" 
              textAnchor="middle" 
              fill="#333" 
              fontSize="16" 
              fontWeight="bold"
              style={{ opacity: 1 }} /* <-- CORREÇÃO APLICADA AQUI */
            >
                {defaultLabel.name}
            </text>
            <text 
              x="50%" 
              y="50%" 
              dy="15" 
              textAnchor="middle" 
              fill="#555" 
              fontSize="14"
              style={{ opacity: 1 }} /* <-- E AQUI */
            >
                {`R$ ${defaultLabel.value.toLocaleString('pt-BR')}`}
            </text>
          </>
        )}
      </PieChart>
    </ResponsiveContainer>
  );
}