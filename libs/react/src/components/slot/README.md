# Slot

A utility component enabling the "asChild" composition pattern for flexible component rendering.

## Usage

```tsx
import { Slot } from '@components-kit/react';

// Default rendering (with wrapper)
<Slot as="div" className="wrapper">
  <span>Content</span>
</Slot>
// Output: <div class="wrapper"><span>Content</span></div>

// AsChild mode (no wrapper, props merged to child)
<Slot asChild className="slot-class" onClick={handleClick}>
  <a href="/link" className="link-class">Link</a>
</Slot>
// Output: <a href="/link" class="slot-class link-class" onclick={...}>Link</a>

// Used in a component for composition
const Button = ({ asChild, children, ...props }) => (
  <Slot asChild={asChild} className="btn" {...props}>
    {asChild ? children : <button>{children}</button>}
  </Slot>
);

// Consumer renders as a link instead of button
<Button asChild>
  <a href="/home">Go Home</a>
</Button>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `ElementType` | `"span"` | Fallback element when not using asChild |
| `asChild` | `boolean` | `false` | Merge props with child element |
| `children` | `ReactNode` | - | Content (must be single element when asChild) |

Also accepts all HTML attributes for the rendered element.

## Prop Merging Behavior

When `asChild` is true:

| Prop Type | Merge Strategy |
|-----------|----------------|
| `ref` | Both refs are called (merged via callback) |
| `className` | Concatenated with space (parent first, then child) |
| Event handlers | Both called (child first, then parent) |
| Other props | Child props override parent props |

### Merged Event Handlers

- `onClick`
- `onKeyDown`
- `onBlur`
- `onFocus`
- `onMouseEnter`
- `onMouseLeave`

## Requirements for AsChild Mode

- Must have exactly **one** child element
- Child must be a valid React element (not Fragment, string, or number)
- If requirements aren't met, falls back to wrapper mode with a dev warning

## Examples

### Ref Forwarding

```tsx
const ref = useRef<HTMLAnchorElement>(null);
<Slot asChild ref={ref}>
  <a href="/link">Link</a>
</Slot>
// ref.current points to the <a> element
```

### Event Handler Merging

```tsx
<Slot asChild onClick={() => console.log('parent')}>
  <button onClick={() => console.log('child')}>Click</button>
</Slot>
// Clicking logs: "child" then "parent"
```

### Building Composable Components

```tsx
// Internal component implementation
const Badge = ({ asChild, children, ...props }) => {
  const sharedProps = {
    ...props,
    'data-variant': props.variantName,
  };

  if (asChild) {
    return <Slot asChild {...sharedProps}>{children}</Slot>;
  }

  return <span {...sharedProps}>{children}</span>;
};

// Usage
<Badge asChild variantName="success">
  <button>Clickable Badge</button>
</Badge>
```

## Best Practices

- Use Slot internally to enable `asChild` in your components
- Ensure child elements can accept the merged props
- Handle the fallback case when asChild requirements aren't met
