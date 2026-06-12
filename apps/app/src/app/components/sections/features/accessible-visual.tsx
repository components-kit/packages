"use client";

import { useCombobox } from "downshift";
import { useCallback, useMemo, useRef, useState } from "react";

import { GradientVisual } from "./gradient-visual";

const ITEMS = ["Alert", "Badge", "Button", "Checkbox", "Combobox"];

export function AccessibleVisual() {
  const [selected, setSelected] = useState("Button");
  const [inputValue, setInputValue] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const announcementTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const filteredItems = useMemo(() => {
    if (!inputValue) return ITEMS;
    return ITEMS.filter((item) =>
      item.toLowerCase().includes(inputValue.toLowerCase()),
    );
  }, [inputValue]);

  const { getInputProps, getItemProps, getMenuProps, highlightedIndex } =
    useCombobox({
      inputValue,
      isOpen: true,
      items: filteredItems,
      itemToString: (item) => item ?? "",
      onInputValueChange: ({ inputValue: v }) => setInputValue(v ?? ""),
      onSelectedItemChange: ({ selectedItem: item }) => {
        if (item) {
          setSelected(item);
          clearTimeout(announcementTimer.current);
          setAnnouncement(`${item} selected`);
          announcementTimer.current = setTimeout(
            () => setAnnouncement(""),
            1000,
          );
        }
      },
      scrollIntoView: () => {},
      selectedItem: selected,
      stateReducer: (_state, { changes }) => ({ ...changes, isOpen: true }),
    });

  // Prevent page scroll when input receives focus
  const inputRef = useCallback((node: HTMLInputElement | null) => {
    if (!node) return;
    const originalFocus = node.focus.bind(node);
    // eslint-disable-next-line no-param-reassign
    node.focus = (opts?: FocusOptions) =>
      originalFocus({ ...opts, preventScroll: true });
  }, []);

  return (
    <div className="relative h-104 sm:h-96 rounded-xl overflow-hidden will-change-transform">
      <GradientVisual
        className="absolute inset-0"
        darkGlows={[
          { blur: "blur-3xl", color: "oklch(49% 0.095 170 / 0.32)", position: "-top-16 right-1/4", size: "h-52 w-52" },
          { blur: "blur-3xl", color: "oklch(46% 0.085 160 / 0.28)", position: "bottom-1/3 -left-16", size: "h-48 w-48" },
          { blur: "blur-2xl", color: "oklch(50% 0.075 180 / 0.22)", position: "-bottom-20 -right-12", size: "h-56 w-56" },
        ]}
        darkGradient="linear-gradient(170deg, oklch(22% 0.014 170) 0%, oklch(19% 0.016 160) 50%, oklch(16.5% 0.014 180) 100%)"
        glows={[
          { blur: "blur-3xl", color: "oklch(85% 0.11 170 / 0.36)", position: "-top-16 right-1/4", size: "h-52 w-52" },
          { blur: "blur-3xl", color: "oklch(87% 0.095 160 / 0.3)", position: "bottom-1/3 -left-16", size: "h-48 w-48" },
          { blur: "blur-2xl", color: "oklch(86% 0.085 180 / 0.24)", position: "-bottom-20 -right-12", size: "h-56 w-56" },
        ]}
        gradient="linear-gradient(170deg, oklch(96% 0.022 170) 0%, oklch(92.5% 0.034 160) 54%, oklch(90% 0.03 180) 100%)"
      />

      <div className="absolute inset-0 flex items-start justify-center px-6 pt-12 sm:pt-10 md:pt-12">
        <div className="w-72 sm:w-80">
          {/* Combobox input — uses Downshift directly for full keyboard + ARIA support */}
          <div data-ck="combobox" data-has-value={selected ? true : undefined} data-state="open" data-variant="default">
            <div aria-atomic="true" aria-live="polite" data-ck="combobox-live" role="status">
              {announcement}
            </div>
            <div data-ck="combobox-input-wrapper">
              <input
                {...getInputProps({ ref: inputRef })}
                aria-labelledby={undefined}
                data-ck="combobox-input"
                placeholder="Search components..."
              />
              <button
                aria-label="Toggle menu"
                data-ck="combobox-trigger"
                data-state="open"
                tabIndex={-1}
                type="button"
              >
                <div aria-hidden="true" data-slot="icon" />
              </button>
            </div>
          </div>

          {/* Dropdown — inline in DOM flow, fully managed by Downshift */}
          <div style={{ marginTop: 8, position: "relative", zIndex: 1 }} data-ck="combobox-positioner" data-state="open">
            <div
              {...getMenuProps()}
              data-ck="combobox-content"
              data-side="bottom"
              data-state="open"
            >
              {filteredItems.map((item, index) => {
                const isSelected = item === selected;
                return (
                  <div
                    key={item}
                    {...getItemProps({ index, item })}
                    style={{ cursor: "pointer" }}
                    data-ck="combobox-item"
                    data-highlighted={highlightedIndex === index || undefined}
                    data-state={isSelected ? "checked" : "unchecked"}
                  >
                    {item}
                    <div aria-hidden="true" data-slot="icon" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
