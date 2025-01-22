// ** React Imports
import { useState, useEffect } from "react";

// ** MUI Imports
import { Stack, Typography, Grid, useTheme } from "@mui/material";

// ** Components
import { Icon, Paper } from "@/components/ui";
import UserChart from "./UserChart";
import CategoryChart from "./CategoryChart";
import ChefChart from "./ChefChart";
import RecipeChart from "./RecipeChart";

// ** Services
import {
  fetchUserTotalStatistics,
  fetchRecipeTotalStatistics,
  fetchCategoryTotalStatistics,
  fetchChefTotalStatistics,
} from "@/services/statisticService";

const Dashboard = () => {
  const theme = useTheme();
  const [dashboardData, setDashboardData] = useState({
    totalUsers: null,
    totalRecipes: null,
    totalCategories: null,
    totalChefs: null,
  });

  const statisticsCards = [
    {
      title: "Total Users",
      description: "Active users on the platform",
      icon: "stash:user-group",
      value: dashboardData.totalUsers,
    },
    {
      title: "Total Recipes",
      description: "Number of recipes shared",
      icon: "material-symbols-light:menu-book-outline-sharp",
      value: dashboardData.totalRecipes,
    },
    {
      title: "Total Categories",
      description: "Number of recipe categories",
      icon: "iconamoon:category-thin",
      value: dashboardData.totalCategories,
    },
    {
      title: "Total Chefs",
      description: "Registered chefs on the platform",
      icon: "ph:chef-hat-thin",
      value: dashboardData.totalChefs,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const [users, recipes, categories, chefs] = await Promise.all([
        fetchUserTotalStatistics(),
        fetchRecipeTotalStatistics(),
        fetchCategoryTotalStatistics(),
        fetchChefTotalStatistics(),
      ]);

      setDashboardData({
        totalUsers: users,
        totalRecipes: recipes,
        totalCategories: categories,
        totalChefs: chefs,
      });
    };

    fetchData();
  }, []);

  return (
    <Stack direction="column" sx={{ gap: "1.5rem", paddingBottom: "3rem" }}>
      <Grid container rowSpacing="1rem" columnSpacing="1rem">
        {statisticsCards.map((content, index) => (
          <Grid key={index} item md={3} sm={6} xs={12}>
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
                    {content.title}
                  </Typography>
                  <Icon icon={content.icon} />
                </Stack>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: "24px",
                  }}>
                  {content.value || "N/A"}
                </Typography>
                <Typography color="text.secondary" sx={{ fontSize: "13px" }}>
                  {content.description}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container rowSpacing="1rem" columnSpacing="1rem">
        <Grid item md={7.5} xs={12}>
          <UserChart theme={theme} />
        </Grid>
        <Grid item md={4.5} xs={12}>
          <CategoryChart theme={theme} />
        </Grid>
      </Grid>

      <Grid container rowSpacing="1rem" columnSpacing="1rem">
        <Grid item md={5.5} xs={12}>
          <RecipeChart theme={theme} />
        </Grid>
        <Grid item md={6.5} xs={12}>
          <ChefChart theme={theme} />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default Dashboard;
