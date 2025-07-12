"use client";

import styled, { css } from "styled-components";

import { useComponentCSS } from "../hooks";
import { PolymorphicComponentProps } from "../types";

const TextStyled = styled.p<{ $customStyles?: string }>`
  ${({ $customStyles }) =>
    $customStyles &&
    css`
      ${$customStyles}
    `}
`;

export const Text = <C extends React.ElementType = "p">(
  props: PolymorphicComponentProps<
    C,
    {
      variantName: string;
    }
  >
) => {
  const { as, children, variantName, ...rest } = props;
  const { data } = useComponentCSS("text_body", variantName);

  return (
    <TextStyled
      $customStyles={data}
      as={as}
      data-variant={variantName}
      {...rest}
    >
      {children}
    </TextStyled>
  );
};
