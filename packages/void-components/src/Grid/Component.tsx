import React, { forwardRef } from "react";

import GridView from "./View";
import GridItem from "./GridItem";
import type { GridProps } from "./types";

/**
 * Grid component for two-dimensional layouts
 *
 * Supports responsive column configurations with breakpoint-specific
 * column counts. Use Grid.Item for spanning multiple columns.
 *
 * @example
 * // Basic 3-column grid
 * <Grid cols={3} spacing="lg">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </Grid>
 *
 * @example
 * // Responsive grid
 * <Grid cols={1} colsMd={2} colsLg={3}>
 *   {items.map(item => <Card key={item.id}>{item.title}</Card>)}
 * </Grid>
 *
 * @example
 * // With spanning items
 * <Grid cols={12} spacing="md">
 *   <Grid.Item span={8}>Main content</Grid.Item>
 *   <Grid.Item span={4}>Sidebar</Grid.Item>
 * </Grid>
 */
interface GridComponent
  extends React.ForwardRefExoticComponent<
    GridProps & React.RefAttributes<HTMLElement>
  > {
  Item: typeof GridItem;
}

const GridBase = forwardRef<HTMLElement, GridProps>((props, ref) => {
  return <GridView ref={ref} {...props} />;
});

GridBase.displayName = "Grid";

const Grid = React.memo(GridBase) as unknown as GridComponent;
Grid.Item = GridItem;

export default Grid;
