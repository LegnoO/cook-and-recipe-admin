// ** Components
import { Table, TableContainer } from "@/components/ui";
import { TableHead, TableBody } from "@/components";

// ** Types
type Props = {
  recipe: RecipeDetail;
  headColumns: {
    title: string;
    sortName: string;
  }[];
  bodyCells: BodyCell<Ingredient>[];
  isLoading: boolean;
};
const Ingredients = ({ recipe, isLoading, headColumns, bodyCells }: Props) => {
  return (
    <TableContainer
      sx={{
        "&": {
          borderTopRightRadius: (theme) => `${theme.shape.borderRadius}px`,
          borderTopLeftRadius: (theme) => `${theme.shape.borderRadius}px`,
        },
        "& .MuiTableHead-root .MuiTableCell-root": {
          paddingBlock: "1rem !important",
        },
      }}>
      <Table>
        <TableHead headColumns={headColumns} />
        <TableBody
          isLoading={isLoading}
          size={recipe.ingredients.length}
          data={recipe.ingredients}
          bodyCells={bodyCells}
        />
      </Table>
    </TableContainer>
  );
};

export default Ingredients;
