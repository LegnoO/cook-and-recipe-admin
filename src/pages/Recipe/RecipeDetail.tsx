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
import { RenderIf } from "@/components";

// ** Library Imports
import PerfectScrollbar from "react-perfect-scrollbar";
import { useQuery } from "@tanstack/react-query";
import { formatDateTime, hexToRGBA } from "@/utils/helpers";

// ** Services
import { getDetailRecipe } from "@/services/recipeService";

// ** Config
import { queryOptions } from "@/config/query-options";

// ** Types
type Props = {
  recipeId: string;
  closeMenu: () => void;
};

const RecipeDetail = ({ recipeId, closeMenu }: Props) => {
  const title = "Recipe Detail";
  const { data: recipeData } = useQuery({
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

  function handleChangeImageIndex(next: boolean) {
    const length = recipe?.imageUrls.length!;
    if (next === true) {
      setCurrentImageIndex((prev) => (prev + 1) % length);
    } else {
      setCurrentImageIndex((prev) => (prev - 1 + length) % length);
    }
  }

  function formatIngredient(ingredient: Ingredient) {
    return Object.values(ingredient).join(" ");
  }

  useEffect(() => {
    if (recipeData) {
      setRecipe(recipeData);
    }
  }, [recipeData]);

  if (!recipe) {
    return <ModalLoading title={title} closeMenu={closeMenu} />;
  }

  return (
    <Box
      sx={{
        overflow: "hidden",
        width: {
          xs: "90%",
          sm: "420px",
          md: "500px",
        },
        maxHeight: "95dvh",
        backgroundColor: (theme) => theme.palette.background.paper,
        borderRadius: (theme) => `${theme.shape.borderRadius}px`,
      }}>
      <Box
        sx={{
          position: "relative",
          paddingBlock: "1rem",
          paddingInline: "1.5rem",
        }}>
        <Typography
          sx={{ textAlign: "center" }}
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
          <Stack direction="column" spacing={2}>
            <Stack
              sx={{
                height: "15rem",
                position: "relative",
              }}
              direction="row"
              justifyContent="center">
              {/* <Image src={recipe.imageUrls[currentImageIndex]} alt="" /> */}
              <Image
                sx={{
                  borderRadius: (theme) => `${theme.shape.borderRadius}px`,
                  width: "100%",
                }}
                src={
                  "https://pivoo.themepreview.xyz/home-three/wp-content/uploads/sites/4/2024/04/raspberry-2023404_1920.jpg"
                }
                alt=""
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
                <Typography>{currentImageIndex}</Typography>
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
            </Stack>
            <Stack
              sx={{ paddingInline: "1.5rem", paddingBlock: "0.5rem" }}
              direction="row"
              spacing={1}
              alignItems={"center"}>
              <Typography>Status:</Typography>
              <ChipStatus
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
                      src={recipe.createdBy.avatar}
                      alt={`Avatar ${recipe.createdBy.fullName}`}
                    />
                    <Stack direction="column">
                      <Typography fontWeight="500" color="text.primary">
                        {recipe.createdBy.fullName}
                      </Typography>
                      <Typography color="text.secondary">
                        {recipe.createdBy.email}
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
                <Typography variant="subtitle2">
                  {recipe.description}
                </Typography>
              </Stack>
            </Stack>

            <RenderIf condition={Boolean(recipe.approvalBy)}>
              <Stack
                direction="column"
                spacing={2}
                sx={{ paddingInline: "1.5rem" }}>
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
            </RenderIf>

            <Stack
              direction="column"
              spacing={2}
              sx={{ paddingInline: "1.5rem" }}>
              <Stack direction="column" spacing={1}>
                <Typography fontWeight={500} variant="h5">
                  Ingredients
                </Typography>
                {recipe.ingredients.map((ingredient, index) => (
                  <Stack key={index} direction="row" alignItems={"center"}>
                    <Icon icon="radix-icons:dot-filled" />
                    <Typography lineHeight={1} variant="subtitle1">
                      {formatIngredient(ingredient)}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>

            <Stack
              direction="column"
              spacing={2}
              sx={{ paddingInline: "1.5rem", paddingBottom: "1.5rem" }}>
              <Stack direction="column" spacing={1}>
                <Typography fontWeight={500} variant="h5">
                  Instructions
                </Typography>
                {recipe.instructions.map((instruction, index) => (
                  <Stack
                    key={index}
                    sx={{ paddingInline: "0.5rem" }}
                    spacing={0.5}
                    direction="row"
                    alignItems={"center"}>
                    <Typography lineHeight={1} variant="subtitle1">
                      {instruction.step}.
                    </Typography>
                    <Typography lineHeight={1} variant="subtitle1">
                      {instruction.description}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </PerfectScrollbar>
    </Box>
  );
};

export default RecipeDetail;
