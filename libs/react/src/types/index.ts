type AsProp<C extends React.ElementType> = {
  as?: C;
};

type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);

export type PolymorphicComponentProps<
  C extends React.ElementType,
  Props
> = Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>> &
  React.PropsWithChildren<AsProp<C> & Props>;

export type ComponentNameType = "text_body" | "text_heading";
