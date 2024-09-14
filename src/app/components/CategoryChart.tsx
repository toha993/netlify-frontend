import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ItemWithVotes } from "@/types";

interface CategoryChartProps {
  items: ItemWithVotes[];
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

const CategoryChart: React.FC<CategoryChartProps> = ({ items }) => {
  const renderCustomizedLabel = (props: any) => {
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      percent,
      index,
      startAngle,
      endAngle,
    } = props;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const item = items[index];
    const name =
      item.name.length > 10 ? item.name.substring(0, 10) + "..." : item.name;
    const text = `${name}: ${item.voteCount}`;

    // Calculate the angle of the slice
    const sliceAngle = Math.abs(endAngle - startAngle);
    // Only render label if the slice is big enough
    if (sliceAngle < 30) return null;

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="12"
      >
        <tspan x={x} dy="-0.5em">
          {name}
        </tspan>
        <tspan x={x} dy="1.2em">
          {item.voteCount} vote(s)
        </tspan>
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={items}
          dataKey="voteCount"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          labelLine={false}
          label={renderCustomizedLabel}
        >
          {items.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CategoryChart;
