import React, { ChangeEvent, useState, useMemo, useCallback } from "react";
import {
  Grid,
  Container,
  TextField,
  Button,
  Typography,
} from "@material-ui/core";

interface BinTreeNode {
  id: string | number;
  left?: BinTreeNode | null;
  right?: BinTreeNode | null;
}

interface ConvertedJSON {
  isValid: boolean;
  tree: BinTreeNode | null;
}

function App() {
  const [input, setInput] = useState<string>("");
  const [convertedJSON, setConvertedJSON] = useState<ConvertedJSON>({
    isValid: true,
    tree: null,
  });

  const convertArrToObj = useCallback((arr): BinTreeNode | null => {
    return arr && arr.length
      ? {
          id: arr[0],
          ...(Array.isArray(arr)
            ? { ...(arr.length > 1 && { left: convertArrToObj(arr[1]) }) }
            : { ...(arr === null && { left: null }) }),
          ...(Array.isArray(arr)
            ? { ...(arr.length > 2 && { right: convertArrToObj(arr[2]) }) }
            : { ...(arr === null && { right: null }) }),
        }
      : null;
  }, []);

  const fetch = useCallback(() => {
    const tempConvertedJSON: ConvertedJSON = {
      isValid: true,
      tree: null,
    };

    try {
      const [id, left, right] = JSON.parse(input);
      const isValid =
        (typeof id === "string" || typeof id === "number") &&
        (Array.isArray(left) || left === null) &&
        (Array.isArray(right) || right === null);

      tempConvertedJSON.isValid = isValid;
      tempConvertedJSON.tree = convertArrToObj([id, left, right]);
    } catch (err) {
      tempConvertedJSON.isValid = false;
      console.warn(err, "error trying to conver");
    }

    setConvertedJSON({ ...tempConvertedJSON });
    // eslint-disable-next-line
  }, [input]);

  console.log(convertedJSON, "convertedJSON");

  return (
    <Container maxWidth="sm">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">Process the input into a tree</Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Tree Source"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setInput(e.target.value);
            }}
            error={!convertedJSON.isValid}
            {...(!convertedJSON.isValid && {
              helperText: `Please add an array as input eg. ["a", ["b"], ["c"]]`,
            })}
          />
        </Grid>
        <Grid item xs={12}>
          <Button onClick={fetch} variant="contained" color="primary">
            Fetch
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
