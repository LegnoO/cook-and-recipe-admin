// ** React Imports
import { useState, useEffect } from "react";

// ** Mui Imports
import {
  Stack,
  Typography,
  Box,
  IconButton,
  Avatar,
  Chip,
} from "@mui/material";

// ** Components
import { ModalLoading, ChipStatus, Icon, Image } from "@/components/ui";
import Instructions from "./Instructions";
import Ingredients from "./Ingredients";
import Feedback from "./Feedback";

// ** Library Imports
import PerfectScrollbar from "react-perfect-scrollbar";
import { useQuery } from "@tanstack/react-query";

// ** Services
import { getDetailRecipe } from "@/services/recipeService";

// ** Config
import { queryOptions } from "@/config/query-options";

// ** Utils
import { formatDateTime, hexToRGBA } from "@/utils/helpers";

// ** Types
type Props = {
  recipeId: string;
  closeMenu: () => void;
};

const RecipeDetail = ({ recipeId, closeMenu }: Props) => {
  const [tabs, setTabs] = useState(0);
  const title = "Recipe Detail";
  const { data: recipeData, isLoading } = useQuery({
    queryKey: ["recipe-detail", recipeId],
    queryFn: () => getDetailRecipe(recipeId),
    ...queryOptions,
  });
  const statusMap: Record<string, ColorVariant | "default"> = {
    pending: "warning",
    rejected: "disabled",
    approved: "active",
  };

  const [recipe, setRecipe] = useState<RecipeDetail>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  function onTabChange(index: number) {
    setTabs(index);
  }

  function handleChangeImageIndex(next: boolean) {
    const length = recipe?.imageUrls.length!;
    if (next === true) {
      setCurrentImageIndex((prev) => (prev + 1) % length);
    } else {
      setCurrentImageIndex((prev) => (prev - 1 + length) % length);
    }
  }

  useEffect(() => {
    if (recipeData) {
      setRecipe(recipeData);
    }
  }, [recipeData]);

  if (!recipe) {
    return <ModalLoading title={title} closeMenu={closeMenu} />;
  }

  const HEAD_COLUMNS = [
    { title: "Name", sortName: "" },
    { title: "Quantity", sortName: "" },
    { title: "Measurement", sortName: "" },
  ];

  const BODY_CELLS: BodyCell<Ingredient>[] = [
    {
      render: ({ name }) => name,
    },
    {
      render: ({ quantity }) => quantity,
    },
    {
      render: ({ measurement }) => measurement,
    },
  ];

  const renderTabContent = () => {
    if (tabs === 0) {
      return (
        <Stack
          direction="column"
          sx={{ marginBottom: "1rem", paddingInline: "1.5rem" }}>
          <Ingredients
            recipe={recipe}
            bodyCells={BODY_CELLS}
            headColumns={HEAD_COLUMNS}
            isLoading={isLoading}
          />
        </Stack>
      );
    }

    if (tabs === 1) {
      return (
        <Stack
          direction="column"
          sx={{
            paddingInline: "1.5rem",
            paddingBottom: "1.5rem",
          }}>
          <Instructions recipe={recipe} />
        </Stack>
      );
    }

    return <Feedback recipeId={recipe.id} />;
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxHeight: "95dvh",
        backgroundColor: (theme) => theme.palette.background.paper,
        borderRadius: (theme) => `${theme.shape.borderRadius}px`,
        paddingBottom: "1rem",
      }}>
      <Box
        sx={{
          position: "relative",
          paddingBlock: "1rem",
          paddingInline: "1.5rem",
        }}>
        <Typography
          sx={{ textAlign: { xs: "center", sm: "left" } }}
          fontWeight={500}
          component="h2"
          variant="h4">
          {title}
        </Typography>
        <IconButton
          disableRipple
          onClick={closeMenu}
          sx={{
            position: "absolute",
            right: "0.5rem",
            top: "20%",
          }}>
          <Icon fontSize="1.5rem" icon="si:close-line" />
        </IconButton>
      </Box>

      <PerfectScrollbar
        options={{ useBothWheelAxes: true, wheelPropagation: false }}>
        <Box
          sx={{
            height: "100%",
            maxHeight: "calc(95dvh - 100px)",
          }}>
          <Stack
            direction="column"
            sx={{
              gap: 2,
            }}>
            <Stack
              sx={{
                position: "relative",
              }}
              direction="row"
              justifyContent="center">
              <Image
                sx={{
                  aspectRatio: "16/9",
                  objectFit: "cover",
                  borderRadius: (theme) => `${theme.shape.borderRadius}px`,
                  width: "100%",
                }}
                src={
                  recipe.imageUrls[currentImageIndex] ||
                  "https://pivoo.themepreview.xyz/home-three/wp-content/uploads/sites/4/2024/04/raspberry-2023404_1920.jpg"
                }
                alt={recipe.name}
              />
              <Stack
                direction="row"
                alignItems="center"
                sx={{
                  paddingInline: "0.5rem",
                  paddingBlock: "0.25rem",
                  backgroundColor: (theme) => theme.palette.background.paper,
                  color: (theme) => theme.palette.text.primary,
                  position: "absolute",
                  bottom: "0.5rem",
                  borderRadius: 4,
                }}
                spacing={0.5}>
                <Typography>{currentImageIndex + 1}</Typography>
                <Typography>/</Typography>
                <Typography>{recipe.imageUrls.length}</Typography>
              </Stack>
              <IconButton
                onClick={() => handleChangeImageIndex(false)}
                sx={{
                  position: "absolute",
                  left: "0.5rem",
                  top: "50%",
                  transform: "translate(0, -50%)",
                  backgroundColor: (theme) =>
                    hexToRGBA(theme.palette.background.paper, 0.85),
                  color: (theme) => theme.palette.text.primary,
                  "&:hover": {
                    backgroundColor: (theme) => theme.palette.background.paper,
                    color: (theme) => theme.palette.text.primary,
                  },
                }}>
                <Icon icon="ep:arrow-left" />
              </IconButton>
              <IconButton
                onClick={() => handleChangeImageIndex(true)}
                sx={{
                  "&": {
                    position: "absolute",
                    right: "0.5rem",
                    top: "50%",
                    transform: "translate(0, -50%)",
                    backgroundColor: (theme) =>
                      hexToRGBA(theme.palette.background.paper, 0.85),
                    color: (theme) => theme.palette.text.primary,
                    "&:hover": {
                      backgroundColor: (theme) =>
                        theme.palette.background.paper,
                      color: (theme) => theme.palette.text.primary,
                    },
                  },
                }}>
                <Icon icon="ep:arrow-right" />
              </IconButton>
            </Stack>
            <Box sx={{ paddingInline: "1.5rem" }}>
              <Typography fontWeight={500} component="h3" variant="h4">
                {recipe.name}
              </Typography>
            </Box>
            <Stack
              sx={{
                paddingInline: "1.5rem",
                flexWrap: "wrap",
                gap: 1.5,
              }}
              direction={"row"}
              alignItems="center">
              <ChipStatus
                variant="active"
                sx={{ textTransform: "capitalize", borderRadius: "1rem" }}
                label={recipe.category.name}
              />
              <Chip
                label={
                  <Stack direction="row" spacing={0.5} alignItems={"center"}>
                    <Icon icon="tabler:clock" />
                    <Typography>{recipe.timeToCook} minutes</Typography>
                  </Stack>
                }
              />

              <Chip
                label={
                  <Stack direction="row" spacing={0.5} alignItems={"center"}>
                    <Icon icon="solar:chef-hat-bold" />
                    <Typography>{recipe.difficulty}</Typography>
                  </Stack>
                }
              />

              <Chip
                label={
                  <Stack direction="row" spacing={0.5} alignItems={"center"}>
                    <Icon icon="octicon:people-16" />
                    <Typography>Serves {recipe.serves}</Typography>
                  </Stack>
                }
              />

              <ChipStatus
                sx={{ textTransform: "capitalize" }}
                variant={statusMap[recipe.verifyStatus]}
                label={recipe.verifyStatus}
              />
            </Stack>

            <Stack
              direction="column"
              spacing={2}
              sx={{ paddingInline: "1.5rem" }}>
              <Stack direction="column" spacing={1}>
                <Typography fontWeight={500} component="h4" variant="h5">
                  Created by
                </Typography>
                <Stack
                  sx={{ flex: 1, flexWrap: "wrap" }}
                  direction="row"
                  justifyContent={"space-between"}
                  alignItems={"center"}>
                  <Stack direction="row" spacing={1} alignItems={"center"}>
                    <Avatar
                      src={recipe.createdBy.userInfo.avatar}
                      alt={`Avatar ${recipe.createdBy.userInfo.fullName}`}
                    />
                    <Stack direction="column">
                      <Typography fontWeight="500" color="text.primary">
                        {recipe.createdBy.userInfo.fullName}
                      </Typography>
                      <Typography color="text.secondary">
                        {recipe.createdBy.userInfo.email}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Typography
                    sx={{
                      fontSize: "0.8125rem",
                      marginLeft: "0 !important",
                      marginTop: {
                        xs: "0.5rem !important",
                        md: "0 !important",
                      },
                    }}
                    color="text.secondary">
                    Created on {formatDateTime(recipe.createdDate)}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>

            {recipe.approvalBy && (
              <Stack
                direction="column"
                spacing={2}
                sx={{ paddingInline: "1.5rem", marginBottom: "1rem" }}>
                <Stack direction="column" spacing={1}>
                  <Typography fontWeight={500} component="h4" variant="h5">
                    Approval by
                  </Typography>
                  <Stack
                    sx={{ flex: 1, flexWrap: "wrap" }}
                    direction="row"
                    justifyContent={"space-between"}
                    alignItems={"center"}>
                    <Stack direction="row" spacing={1} alignItems={"center"}>
                      <Avatar
                        src={recipe.approvalBy?.avatar}
                        alt={`Avatar ${recipe.approvalBy?.fullName}`}
                      />
                      <Stack direction="column">
                        <Typography fontWeight="500" color="text.primary">
                          {recipe.approvalBy?.fullName}
                        </Typography>
                        <Typography color="text.secondary">
                          {recipe.approvalBy?.email}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Typography
                      sx={{
                        fontSize: "0.8125rem",
                        marginLeft: "0 !important",
                        marginTop: {
                          xs: "0.5rem !important",
                          md: "0 !important",
                        },
                      }}
                      color="text.secondary">
                      Approval on {formatDateTime(recipe.approvalDate!)}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            )}
            <Stack
              sx={{
                paddingInline: "1.5rem",
                flexDirection: "row",
                alignItems: "stretch",
                justifyContent: "space-between",
                gap: "0.5rem",
              }}>
              {["Ingredients", "Instructions", "Feedbacks"].map(
                (content, index) => (
                  <Box
                    onClick={() => onTabChange(index)}
                    key={index}
                    sx={{
                      cursor: "pointer",
                      transition: "all 0.25s ease-in-out",
                      outline: (theme) => `1px solid ${theme.palette.divider}`,
                      backgroundColor: (theme) =>
                        tabs === index
                          ? theme.palette.primary.main
                          : "transparent",
                      paddingBlock: "0.375rem",
                      paddingInline: "1.25rem",
                      mb: "1.5rem",
                      flex: 1,
                      borderRadius: (theme) =>
                        `${theme.shape.borderRadius - 2}px`,
                    }}>
                    <Typography
                      sx={{
                        textAlign: "center",
                        color: (theme) => theme.palette.primary.contrastText,
                        fontSize: "1rem",
                      }}
                      fontWeight={500}>
                      {content}
                    </Typography>
                  </Box>
                ),
              )}
            </Stack>
            {renderTabContent()}
          </Stack>
        </Box>
      </PerfectScrollbar>
    </Box>
  );
};

export default RecipeDetail;
