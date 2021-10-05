import { LinearProgress } from "@material-ui/core";
import { blue, blueGrey } from "@material-ui/core/colors";
import { GridOverlay } from "@material-ui/data-grid";

export function LoadingOverlay() {
  return (
    <GridOverlay>
      <div style={{ position: 'absolute', top: 0, width: '100%' }}>
        <LinearProgress color="secondary" />
      </div>
    </GridOverlay>
  );
}