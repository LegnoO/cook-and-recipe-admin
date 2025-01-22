// ** React Imports
import { useState } from "react";

// ** MUI Imports
import { Stack, Typography, Theme } from "@mui/material";

// ** Components
import { Paper } from "@/components/ui";

// ** Library Imports
import { useQuery } from "@tanstack/react-query";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ** Utils
import { generateRandomColor, hexToRGBA } from "@/utils/helpers";

// ** Config
import { queryOptions } from "@/config/query-options";

// ** Services
import { fetchCategoryStatistics } from "@/services/statisticService";

// ** Types
type Props = {
  theme: Theme;
};

const CategoryChart = ({ theme }: Props) => {
  const { data } = useQuery({
    queryKey: ["category-chart"],
    queryFn: fetchCategoryStatistics,
    ...queryOptions,
  });

  const categoryData = data?.filter((category) => category.numberOf !== 0);

  const [colors, setColors] = useState<string[]>([
    "#EA5455",
    "#ff9e42",
    "#00CFE8",
    "#7367F0",
    "#A8AAAE",
    "#24B364",
  ]);

  function renderLabelColor(index: number) {
    if (index > colors.length - 1) {
      const newColors = [...colors, generateRandomColor()];
      setColors(newColors);
      return newColors[index];
    }

    return colors[index];
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { payload: payloadChild } = payload[0];

      return (
        <Stack
          sx={{
            paddingBlock: "0.5rem",
            paddingInline: "0.75rem",
            borderRadius: `${theme.shape.borderRadius}px`,
            backgroundColor: hexToRGBA(theme.palette.background.paper, 1, 5),
            boxShadow: (theme) => theme.shadows[6],
          }}>
          <Typography
            sx={{
              color: payloadChild.fill,
            }}>
            {payloadChild.name}
          </Typography>
        </Stack>
      );
    }
    return null;
  };

  return (
    <Paper
      sx={{
        p: "1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}>
      <Stack
        sx={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: "18px",
          }}>
          Categories
        </Typography>
      </Stack>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#24B364"
            dataKey="numberOf"
            label={({
              cx,
              cy,
              midAngle,
              innerRadius,
              outerRadius,
              percent,
            }) => {
              const radius = innerRadius + (outerRadius - innerRadius) / 2;
              const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
              const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

              const percentResult = (percent * 100).toFixed(0);

              return (
                <text
                  x={x}
                  y={y}
                  fill="white"
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="0.8125rem"
                  fontWeight={500}>
                  {percentResult}%
                </text>
              );
            }}>
            {Array.from(
              { length: categoryData ? categoryData?.length : 0 },
              (_, index) => (
                <Cell key={`cell-${index}`} fill={renderLabelColor(index)} />
              ),
            )}
          </Pie>

          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{
              width: "100%",
              paddingTop: "1.5rem",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default CategoryChart;
