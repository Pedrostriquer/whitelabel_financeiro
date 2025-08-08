import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Dados de exemplo (mantidos)
const data = [
  { name: 'Jan', uv: 4000, pv: 2400 },
  { name: 'Fev', uv: 3000, pv: 1398 },
  { name: 'Mar', uv: 2000, pv: 9800 },
  { name: 'Abr', uv: 2780, pv: 3908 },
  { name: 'Mai', uv: 1890, pv: 4800 },
  { name: 'Jun', uv: 2390, pv: 3800 },
  { name: 'Jul', uv: 3490, pv: 4300 },
];

// Componente customizado para o Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${label} : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export default function DashboardGrafico() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        {/* Definindo o degradê */}
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#007bff" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#007bff" stopOpacity={0}/>
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: '#888' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#888' }} axisLine={false} tickLine={false} />

        {/* Usando o Tooltip customizado */}
        <Tooltip content={<CustomTooltip />} />

        <Area 
          type="monotone" 
          dataKey="uv" 
          stroke="#007bff" 
          strokeWidth={2}
          fillOpacity={1} 
          fill="url(#colorUv)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}