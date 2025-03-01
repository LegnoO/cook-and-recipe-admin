// ** React Imports
import { useState, useRef } from "react";

// ** Mui Imports
import { Avatar, Rating, Skeleton, Stack, Typography } from "@mui/material";

// ** Components
import { Icon, Select } from "@/components/ui";
import { SearchInput } from "@/components/fields";
import { Repeat } from "@/components";

// ** Library Imports
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

// ** Config
import { queryOptions } from "@/config/query-options";

// ** Utils
import { formatDateTime, getTruthyObject } from "@/utils/helpers";

// ** Services
import { queryFeedback } from "@/services/recipeService";

// ** Types
type Props = { recipeId: string };

const Feedback = ({ recipeId }: Props) => {
  const [filter, setFilter] = useState<{
    rating: string | null;
    fullName: string;
    index: string;
    size: string;
    sortOrder: string;
  }>({
    rating: null,
    fullName: "",
    index: "1",
    size: "10",
    sortOrder: "desc",
  });

  const searchInputRef = useRef<HTMLInputElement>(null);
  const handleSearchGroup = useDebouncedCallback(() => {
    const fullName = searchInputRef.current?.value.trim() || "";

    setFilter((prev) => ({
      ...prev,
      fullName,
    }));
  }, 300);

  const params = getTruthyObject(filter) as Record<string, string>;
  const { data: feedbackData, isLoading } = useQuery({
    queryKey: ["feedback", recipeId, new URLSearchParams(params).toString()],
    queryFn: () =>
      queryFeedback(recipeId, new URLSearchParams(params).toString()),
    ...queryOptions,
  });

  const feedbackList = feedbackData?.data ?? [];

  function updateRating(value: string) {
    setFilter((prev) => ({
      ...prev,
      rating: value,
    }));
  }

  const SkeletonUserFeedback = () => {
    return (
      <Stack
        sx={{
          flexDirection: "column",
          gap: "0.5rem",
        }}>
        <Stack
          sx={{ alignItems: "center", flexDirection: "row", gap: "0.5rem" }}>
          <Skeleton variant="circular" width={40} height={40} />

          <Stack
            sx={{
              flexDirection: "column",
            }}>
            <Skeleton variant="text" width={200} sx={{ fontSize: "1rem" }} />
          </Stack>
        </Stack>

        <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
      </Stack>
    );
  };

  const UserFeedback = ({ feedbackData }: { feedbackData: Feedback }) => {
    return (
      <Stack
        sx={{
          flexDirection: "column",
          gap: "0.5rem",
        }}>
        <Stack
          sx={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}>
          <Stack
            sx={{ alignItems: "center", flexDirection: "row", gap: "0.5rem" }}>
            <Avatar
              src={feedbackData.user ? feedbackData.user.avatar : ""}
              alt={`Avatar ${feedbackData?.user?.fullName}`}
              sx={{ width: "2.5rem", height: "2.5rem" }}
            />

            <Stack
              sx={{
                flexDirection: "column",
              }}>
              <Typography>{feedbackData?.user?.fullName}</Typography>
              <Typography color="text.secondary" sx={{ fontSize: "0.875rem" }}>
                {feedbackData?.user?.email}
              </Typography>
            </Stack>
          </Stack>

          <Rating defaultValue={feedbackData?.rating} readOnly size="small" />
        </Stack>
        <Typography sx={{ fontSize: "0.875rem" }}>
          {feedbackData?.comment}
        </Typography>
        <Typography color="text.secondary" sx={{ fontSize: "0.75rem" }}>
          {formatDateTime(feedbackData?.feedbackDate)}
        </Typography>
      </Stack>
    );
  };

  const renderStar = (star: number) => {
    return (
      <Stack
        sx={{
          "&": {
            flexDirection: "row",
            alignItems: "center",
            gap: "0.25rem",
          },
          "& .star": { color: "#faaf00" },
        }}>
        <Typography sx={{ lineHeight: 1, fontSize: "inherit" }}>
          {star}
        </Typography>
        <Icon className="star" icon="ion:android-star" fontSize="1rem" />
      </Stack>
    );
  };

  return (
    <Stack sx={{ flexDirection: "column" }}>
      <Stack
        sx={{
          paddingInline: "1.5rem",
          marginBottom: "1.5rem",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <SearchInput
          ref={searchInputRef}
          disabled={isLoading && !feedbackData}
          placeholder="Search FullName"
          onChange={handleSearchGroup}
          fullWidth
          sx={{ height: 40, width: { xs: "100%", md: 185 } }}
        />
        <Select
          sx={{
            "&": { height: 40, width: { xs: "100%", md: "fit-content" } },
            "& .MuiSelect-select": {
              width: { xs: "100%", md: 105 },
            },
          }}
          value={filter.rating || ""}
          onChange={(event) => updateRating(event.target.value)}
          menuItems={[1, 2, 3, 4, 5].map((star) => ({
            value: star,
            label: renderStar(star),
          }))}
          defaultOption={"Select Rating"}
          fullWidth
          isLoading={isLoading && !feedbackData}
        />
      </Stack>
      <Stack
        sx={{
          paddingInline: "1.5rem",
          flexDirection: "column",
          gap: "0.5rem",
        }}>
        <Typography sx={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
          User Feedbacks
        </Typography>
        {!isLoading ? (
          <Stack sx={{ flexDirection: "column", gap: "2.25rem" }}>
            {feedbackList.length === 0 ? (
              <Typography
                color="text.secondary"
                sx={{
                  fontStyle: "italic",

                  textAlign: "center",
                  fontSize: "1.25rem",
                  paddingTop: "1.75rem",
                  paddingBottom: "2.5rem",
                }}>
                No data available
              </Typography>
            ) : (
              <Stack sx={{ flexDirection: "column", gap: "2.25rem" }}>
                {feedbackList?.map((feedback, index) => (
                  <UserFeedback key={index} feedbackData={feedback} />
                ))}
              </Stack>
            )}
          </Stack>
        ) : (
          <Stack sx={{ flexDirection: "column", gap: "2.25rem" }}>
            <Repeat times={3}>
              <SkeletonUserFeedback />
            </Repeat>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default Feedback;
