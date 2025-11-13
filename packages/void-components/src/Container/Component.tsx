import React, { forwardRef } from "react";

import { pipeline } from "../utils/pipeline";
import ContainerView from "./View";
import type { ContainerProps } from "./types";

/**
 * Container component for centering and constraining content width
 *
 * Provides consistent max-width and horizontal padding across breakpoints.
 * Use the `as` prop to render as different semantic elements.
 *
 * @example
 * // Basic usage
 * <Container>
 *   <h1>Page content</h1>
 * </Container>
 *
 * @example
 * // Narrow container
 * <Container size="md">
 *   <article>Narrow content</article>
 * </Container>
 *
 * @example
 * // As semantic element
 * <Container as="main" size="lg">
 *   <h1>Main content</h1>
 * </Container>
 */
const Container = forwardRef<HTMLDivElement, ContainerProps>((props, ref) => {
  return <ContainerView ref={ref} {...props} />;
});

Container.displayName = "Container";

export default pipeline(React.memo)(Container) as React.MemoExoticComponent<
  typeof Container
>;
