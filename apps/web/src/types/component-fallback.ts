import type { ComponentType, FunctionComponent } from "react";

/**
 * Type for components that have a Fallback property for Suspense loading states.
 * Use this to extend component types that need a skeleton fallback.
 *
 * @example
 * ```tsx
 * const TeamSelect = withForm({...}) as ComponentWithFallback<Props>;
 * TeamSelect.Fallback = TeamSelectSkeleton;
 * ```
 */
export type ComponentWithFallback<P = object> = FunctionComponent<P> & {
  Fallback: ComponentType;
};

/**
 * Helper type for skeleton components that match a component's props structure.
 * The skeleton should replicate the layout without dynamic data.
 */
export type FallbackComponent = ComponentType;

/**
 * Extends a component with a Fallback property for Suspense integration.
 *
 * @param Component - The component to extend
 * @param FallbackComponent - The skeleton/loading component to use as fallback
 * @returns The component with Fallback property attached
 *
 * @example
 * ```tsx
 * const TeamSelect = withForm({...});
 * export default withFallback(TeamSelect, TeamSelectSkeleton);
 * ```
 */
export function withFallback<P>(
  Component: FunctionComponent<P>,
  FallbackComponent: ComponentType
): ComponentWithFallback<P> {
  const ComponentWithFallback = Component as ComponentWithFallback<P>;
  ComponentWithFallback.Fallback = FallbackComponent;
  return ComponentWithFallback;
}
