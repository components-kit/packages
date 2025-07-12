"use client";

import styled, { css } from "styled-components";

import { useComponentCSS } from "../hooks";
import { PolymorphicComponentProps } from "../types";

const HeadingStyled = styled.h1<{ $customStyles?: string }>`
  ${({ $customStyles }) =>
    $customStyles &&
    css`
      ${$customStyles}
    `}
`;

export const Heading = <C extends React.ElementType = "h1">(
  props: PolymorphicComponentProps<
    C,
    {
      variantName: string;
    }
  >
) => {
  const { as, children, variantName, ...rest } = props;
  const { data } = useComponentCSS("text_heading", variantName);

  return (
    <HeadingStyled
      $customStyles={data}
      as={as}
      data-variant={variantName}
      {...rest}
    >
      {children}
    </HeadingStyled>
  );
};
