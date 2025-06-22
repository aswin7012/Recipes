import * as React from "react";
import { styled } from "@mui/system";
import TablePagination from "@mui/material/TablePagination";
import { tablePaginationClasses as classes } from "@mui/material/TablePagination";
import axios from "axios";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";

export default function TableUnstyled() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);
  const [rows, setRows] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const [filter, setFilter] = React.useState({});
  const [selectedRecipe, setSelectedRecipe] = React.useState(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [showTimes, setShowTimes] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      if (
        filter.title ||
        filter.cuisine ||
        filter.rating ||
        filter.total_time 
      ) {
        const response = await axios.get(
          "http://localhost:3000/api/recipes/search",
          {
            params: {
              ...filter,
              page: page + 1,
              limit: rowsPerPage,
            },
          }
        );
        console.log(response.data.total);
        setRows(response.data.data);
        setTotal(response.data.total);

        return;
      }
      const response = await axios.get("http://localhost:3000/api/recipes", {
        params: {
          page: page + 1,
          limit: rowsPerPage,
        },
      });
   //   console.log(response.data);
      setRows(response.data.data);
      setTotal(response.data.total);
    };
    fetchData();
  }, [filter, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function renderStars(rating) {
    const count = Math.round(Number(rating));
    return "★".repeat(count) + "☆".repeat(5 - count);
  }

  return (
    <Root sx={{ maxWidth: "100%", width: "100%" }}>
      <table aria-label="custom pagination table">
        <thead>
          <tr>
            <CustomTablePagination
              rowsPerPageOptions={[
                15,
                20,
                25,
                30,
                50,
                { label: "All", value: -1 },
              ]}
              colSpan={rows.length > 0 ? Object.keys(rows[0]).length : 1}
              count={total}
              rowsPerPage={rowsPerPage}
              page={page}
              slotProps={{
                select: {
                  "aria-label": "rows per page",
                },
                actions: {
                  showFirstButton: true,
                  showLastButton: true,
                },
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </tr>
          <tr>
            <th>
              <input
                type="text"
                value={filter.title || ""}
                onChange={(e) =>
                  setFilter({ ...filter, title: e.target.value })
                }
              ></input>
              <br></br>
              Title
            </th>
            <th>
              <input
                type="text"
                value={filter.cuisine || ""}
                onChange={(e) =>
                  setFilter({ ...filter, cuisine: e.target.value })
                }
              ></input>
              <br></br>
              Cuisine
            </th>
            <th>
              <input
                type="text"
                value={filter.rating || ""}
                onChange={(e) =>
                  setFilter({ ...filter, rating: e.target.value })
                }
              ></input>
              <br></br>
              Rating
            </th>
            <th>
              <input
                type="text"
                value={filter.total_time || ""}
                onChange={(e) =>
                  setFilter({ ...filter, total_time: e.target.value })
                }
              ></input>
              <br></br>
              Total Time
            </th>
            <th>
              No. of People serves
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 &&
            rows.map((row, idx) => (
              <tr
                key={idx}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setSelectedRecipe(row);
                  setDrawerOpen(true);
                  setShowTimes(false);
                }}
              >
                <td>{row.title}</td>
                <td>{row.cuisine}</td>
                <td>{renderStars(row.rating)}</td>
                <td>{row.total_time}</td>
                <td>{row.serves}</td>
              </tr>
            ))}
        </tbody>
        <tfoot></tfoot>
      </table>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 400, p: 2 } }}
      >
        {selectedRecipe && (
          <div>
            {/* Header */}
            <Typography variant="h6" gutterBottom>
              {selectedRecipe.title} ({selectedRecipe.cuisine})
            </Typography>
            {/* Description */}
            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              <b>Description:</b> {selectedRecipe.description}
            </Typography>
            {/* Total Time with expand */}
            <div style={{ display: "flex", alignItems: "center", marginTop: 16 }}>
              <Typography variant="subtitle1">
                <b>Total Time:</b> {selectedRecipe.total_time}
              </Typography>
              <IconButton
                size="small"
                onClick={() => setShowTimes((prev) => !prev)}
                aria-label="expand"
              >
                <ExpandMoreIcon
                  style={{
                    transform: showTimes ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s"
                  }}
                />
              </IconButton>
            </div>
            <Collapse in={showTimes}>
              <Typography variant="body2" sx={{ ml: 2 }}>
                <b>Cook Time:</b> {selectedRecipe.cook_time || "-"}
                <br />
                <b>Prep Time:</b> {selectedRecipe.prep_time || "-"}
              </Typography>
            </Collapse>
            {/* Nutrition Table */}
            <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
              <b>Nutrition</b>
            </Typography>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {Object.entries({
                  "Calories": selectedRecipe.nutrients.calories,
                  "Carbohydrate": selectedRecipe.nutrients.carbohydrateContent,
                  "Cholesterol": selectedRecipe.nutrients.cholesterolContent,
                  "Fiber": selectedRecipe.nutrients.fiberContent,
                  "Protein": selectedRecipe.nutrients.proteinContent,
                  "Saturated Fat": selectedRecipe.nutrients.saturatedFatContent,
                  "Sodium": selectedRecipe.nutrients.sodiumContent,
                  "Sugar": selectedRecipe.nutrients.sugarContent,
                  "Fat": selectedRecipe.nutrients.fatContent,
                }).map(([label, value]) => (
                  <tr key={label}>
                    <td style={{ border: "1px solid #ccc", padding: 4 }}>{label}</td>
                    <td style={{ border: "1px solid #ccc", padding: 4 }}>{value || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Drawer>
    </Root>
  );
}

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const Root = styled("div")(
  ({ theme }) => `
  table {
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    border-collapse: collapse;
    width: 100%;
  }

  td,
  th {
    border: 1px solid ${ grey[800]};
    text-align: left;
    padding: 8px;
  }

  th {
    background-color: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  }
  `
);

const CustomTablePagination = styled(TablePagination)`
  & .${classes.toolbar} {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: center;
    }
  }

  & .${classes.selectLabel} {
    margin: 0;
  }

  & .${classes.displayedRows} {
    margin: 0;

    @media (min-width: 768px) {
      margin-left: auto;
    }
  }

  & .${classes.spacer} {
    display: none;
  }

  & .${classes.actions} {
    display: flex;
    gap: 0.25rem;
  }
`;
