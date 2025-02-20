// ** Mui Imports
import { Stack, Typography } from "@mui/material";

// ** Components
import {
  Icon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@/components/ui";

// ** Types
type Props = { recipe: RecipeDetail };

const Instructions = ({ recipe }: Props) => {
  return recipe.instructionSections.map((section, index) => (
    <Accordion key={`${section.title} ${index}`}>
      <AccordionSummary expandIcon={<Icon icon="ic:twotone-expand-more" />}>
        {section.title}
      </AccordionSummary>
      <AccordionDetails>
        <Stack direction="column" sx={{ gap: 2 }}>
          {section.instructions.map((instruction) => (
            <Stack
              key={`${section.title} ${index} ${instruction.step}`}
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
  ));
};

export default Instructions;
