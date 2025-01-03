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
import {
  ModalLoading,
  ChipStatus,
  Icon,
  Image,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@/components/ui";

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
        maxWidth: "700px",
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
              direction="column"
              sx={{ marginBottom: "1rem", paddingInline: "1.5rem" }}>
              <Stack sx={{ gap: 1 }} direction="column">
                <Typography fontWeight={500} sx={{ mb: 0.25 }} variant="h5">
                  Ingredients
                </Typography>
                {recipe.ingredients.map((ingredient, index) => (
                  <Stack key={index} direction="row" alignItems={"center"}>
                    <Icon fontSize="1.15rem" icon="radix-icons:dot-filled" />
                    <Typography lineHeight={1} variant="subtitle1">
                      {formatIngredient(ingredient)}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>

            <Stack
              direction="column"
              sx={{
                paddingInline: "1.5rem",
                paddingBottom: "1.5rem",
              }}>
              <Stack sx={{ gap: 1.5 }} direction="column">
                <Typography sx={{ mb: 0.25 }} fontWeight={500} variant="h5">
                  Instructions
                </Typography>
                {recipe.instructionSections.map((section, index) => (
                  <Accordion key={index}>
                    <AccordionSummary
                      expandIcon={<Icon icon="ic:twotone-expand-more" />}>
                      {section.title}
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack direction="column" sx={{ gap: 2 }}>
                        {section.instructions.map((instruction) => (
                          <Stack
                            key={index}
                            sx={{ gap: 1, paddingInline: "0.5rem" }}
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
                    </AccordionDetails>
                  </Accordion>
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
