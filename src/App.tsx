import { ChangeEvent, useState, useCallback, ReactNode} from "react";
import {
  Grid,
  Container,
  TextField,
  Button,
  Typography,
} from "@material-ui/core";
import { TreeView } from "@material-ui/lab";
// Local

import StyledTreeItem from "./components/styledTreeItem";
import {
  CloseSquare,
  MinusSquare,
  PlusSquare,
} from "./components/svgComponent";

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
  const [showOutput, setShowOutput] = useState<boolean>(false);
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


  const fetch = useCallback((): void => {
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

  const makeRecursiveTreeItem = useCallback(
    (
      obj: BinTreeNode | null,
      startIndex: number = 0,
      prefix: string = "init"
    ): ReactNode => {
      if (obj) {
        return (Object.keys(obj) as Array<keyof typeof obj>).map((k, i) => {
          if (typeof obj[k] === "string" || typeof obj[k] === "number") {
            return (
              <StyledTreeItem
                key={`${prefix}-${startIndex}-${i}`}
                nodeId={`${prefix}-${startIndex}-${i}`}
                label={obj[k]}
              />
            );
          } else {
            return (
              <StyledTreeItem
                key={`${prefix}-${startIndex}-${i}`}
                nodeId={`${prefix}-${startIndex}-${i}`}
                label={k}
              >
                {makeRecursiveTreeItem(
                  obj[k] as BinTreeNode | null,
                  ++startIndex,
                  k
                )}
              </StyledTreeItem>
            );
          }
        });
      } else {
        return (
          <StyledTreeItem
            key={`empty-${prefix}-${startIndex}`}
            nodeId={`empty-${prefix}-${startIndex}`}
            label="< empty >"
          />
        );
      }
    },
    []
  );

  console.log(convertedJSON, "convertedJSON");

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">
                Process the input into a tree
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tree Source"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setShowOutput(false);
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
            <Grid item xs={12}>
              <TextField
                multiline
                rows={21}
                fullWidth
                variant="outlined"
                value={
                  convertedJSON.tree
                    ? JSON.stringify(convertedJSON.tree, null, 2)
                    : ""
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                onClick={() => {
                  setShowOutput(true);
                }}
                disabled={!convertedJSON.isValid}
                color="primary"
                variant="contained"
              >
                Process
              </Button>
            </Grid>
          </Grid>
        </Grid>
        {showOutput && (
          <Grid item xs={12} md={6}>
            <TreeView
              defaultExpanded={["1"]}
              defaultCollapseIcon={<MinusSquare />}
              defaultExpandIcon={<PlusSquare />}
              defaultEndIcon={<CloseSquare />}
            >
              {makeRecursiveTreeItem(convertedJSON.tree)}
            </TreeView>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default App;
