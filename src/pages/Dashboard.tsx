// ** React Imports
import { useEffect } from "react";

// ** MUI Imports
import { Box, Stack, Typography, Grid, useTheme } from "@mui/material";

// ** Library ImportsImports
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ** Components
import { Icon, Paper } from "@/components/ui";
import { Repeat } from "@/components";

// ** Utils
import { hexToRGBA } from "@/utils/helpers";

function Dashboard() {
  const theme = useTheme();
  const chartData = [
    { name: "Week 1", active: 40, inactive: 10 },
    { name: "Week 2", active: 30, inactive: 20 },
    { name: "Week 3", active: 20, inactive: 30 },
    { name: "Week 4", active: 50, inactive: 10 },
  ];
  useEffect(() => {}, []);

  return (
    <Stack direction="column" sx={{ gap: "1.5rem", paddingBottom: "3rem" }}>
      <Grid container rowSpacing="1rem" columnSpacing="1rem">
        <Repeat times={4}>
          <Grid item md={3} sm={6} xs={12}>
            <Paper sx={{ padding: "1.5rem" }}>
              <Stack direction="column">
                <Stack
                  direction="row"
                  sx={{
                    marginBottom: "0.5rem",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      marginBottom: "0.25rem",
                      fontSize: "14px",
                    }}>
                    Total Users
                  </Typography>
                  <Icon icon="stash:user-group" />
                </Stack>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: "24px",
                  }}>
                  2543
                </Typography>
                <Typography color="text.secondary" sx={{ fontSize: "13px" }}>
                  Active users on the platform
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        </Repeat>
      </Grid>

      <Grid container rowSpacing="1rem" columnSpacing="1rem">
        <Grid item md={8} xs={12}>
          <Paper sx={{ p: 0 }}>
            <Box
              sx={{
                marginBottom: "2.5rem",
                paddingInline: "2rem",
                paddingTop: "2rem",
              }}>
              <Typography
                sx={{
                  fontWeight: 500,
                  marginBottom: "0.25rem",
                  fontSize: "18px",
                }}>
                Total Users
              </Typography>
              <Typography
                color="text.secondary"
                sx={{
                  fontWeight: 500,
                  fontSize: "15px",
                }}>
                Yearly Earnings Overview
              </Typography>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart margin={{ right: 120 }} data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={hexToRGBA(theme.palette.secondary.main, 0.4, 1)}
                />
                <XAxis
                  dataKey="name"
                  stroke={hexToRGBA(theme.palette.secondary.main, 0.9, 1)}
                />
                <YAxis
                  stroke={hexToRGBA(theme.palette.secondary.main, 0.9, 1)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: hexToRGBA(
                      theme.palette.background.paper,
                      1,
                      15,
                    ),
                    border: `1px solid ${theme.palette.divider}`,
                    color: theme.palette.text.primary,
                  }}
                  labelStyle={{
                    fontWeight: "bold",
                    color: theme.palette.text.primary,
                  }}
                />
                <Legend
                  wrapperStyle={{
                    width: "100%",
                    padding: "0.5rem",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="active"
                  stroke={theme.palette.primary.main}
                  name="Active Users"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="inactive"
                  stroke={theme.palette.success.main}
                  name="Inactive Users"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
}

export default Dashboard;
