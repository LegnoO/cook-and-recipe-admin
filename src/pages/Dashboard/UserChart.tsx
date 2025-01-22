// ** React Imports
import { Fragment, useState, MouseEvent } from "react";

// ** MUI Imports
import {
  Popper,
  Stack,
  Theme,
  Typography,
  IconButton,
  Box,
  Fade,
  ClickAwayListener,
} from "@mui/material";

// ** Components
import { Icon, Paper } from "@/components/ui";

// ** Library Imports
import { useSearchParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";

// ** Config
import { queryOptions } from "@/config/query-options";

// ** Services
import { fetchUserStatistics } from "@/services/statisticService";

// ** Utils
import { hexToRGBA } from "@/utils/helpers";

// ** Types
type Props = {
  theme: Theme;
};

const UserChart = ({ theme }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const actions = [
    {
      title: "Last 3 months",
      onClick: () => {
        handleMonthChange("3");
      },
    },
    {
      title: "Last 6 months",
      onClick: () => {
        handleMonthChange("6");
      },
    },
    {
      title: "Last 9 months",
      onClick: () => {
        handleMonthChange("9");
      },
    },
    {
      title: "Last 12 months",
      onClick: () => {
        handleMonthChange("12");
      },
    },
  ];

  function handleTogglePopper(event: MouseEvent<HTMLElement>) {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  }

  function handleClosePopper() {
    setAnchorEl(null);
  }

  const { data, refetch } = useQuery({
    queryKey: ["user-chart"],
    queryFn: () => fetchUserStatistics(searchParams),
    ...queryOptions,
  });

  function handleMonthChange(value: string) {
    searchParams.set("user_months", value);
    setSearchParams(searchParams);
    refetch();
  }

  const userData =
    data?.map(({ issuedDate, numberOf }) => {
      const date = new Date(issuedDate);
      return {
        name: `${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`,
        value: numberOf,
      };
    }) || [];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { payload: payloadChild, value, color } = payload[0];

      return (
        <Stack
          sx={{
            gap: "0.25rem",
            paddingBlock: "0.5rem",
            paddingInline: "0.75rem",
            borderRadius: `${theme.shape.borderRadius}px`,
            backgroundColor: hexToRGBA(theme.palette.background.paper, 1, 5),
            boxShadow: (theme) => theme.shadows[6],
          }}>
          <Typography
            sx={{
              color: theme.palette.text.primary,
            }}>
            {payloadChild.name}
          </Typography>
          <Typography
            sx={{
              color,
            }}>
            Users: {value}
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
          marginBottom: "2rem",
        }}>
        <Typography
          sx={{
            fontWeight: 500,
            marginBottom: "0.25rem",
            fontSize: {
              lg: "18px",
              xs: "16px",
            },
          }}>
          Total Users Across {searchParams.get("user_months") || 3} Months
        </Typography>

        <Fragment>
          <ClickAwayListener onClickAway={handleClosePopper}>
            <IconButton onClick={handleTogglePopper}>
              <Icon icon="tabler:dots-vertical" />
            </IconButton>
          </ClickAwayListener>
          <Popper
            sx={{ zIndex: 1200 }}
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            placement="bottom-end"
            transition>
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Stack
                  sx={{
                    paddingBlock: "0.25rem",
                    backgroundColor: (theme) => theme.palette.background.paper,
                    flexDirection: "column",
                    boxShadow: (theme) => theme.shadows[6],
                  }}>
                  {actions.map((action, index) => (
                    <Box
                      key={index}
                      onClick={action.onClick}
                      sx={{
                        paddingBlock: "0.5rem",
                        paddingInline: "1rem",
                        marginBottom: "0.125rem",
                        marginInline: "0.5rem",
                        borderRadius: `${theme.shape.borderRadius}px`,
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: (theme) =>
                            theme.palette.action.selected,
                        },
                      }}>
                      {action.title}
                    </Box>
                  ))}
                </Stack>
              </Fade>
            )}
          </Popper>
        </Fragment>
      </Stack>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart margin={{ right: 40 }} data={userData}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={hexToRGBA(theme.palette.secondary.main, 0.4, 1)}
          />
          <XAxis
            dataKey="name"
            stroke={hexToRGBA(theme.palette.secondary.main, 0.9, 1)}
          />
          <YAxis stroke={hexToRGBA(theme.palette.secondary.main, 0.9, 1)} />
          <Tooltip content={<CustomTooltip />} />

          <Line
            type="monotone"
            dataKey="value"
            stroke={theme.palette.primary.main}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default UserChart;
