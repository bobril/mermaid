# Bobril Mermaid Component

[![npm version](https://badge.fury.io/js/%40bobril%2Fmermaid.svg)](https://badge.fury.io/js/%40bobril%2Fmermaid)

[Demo](https://bobril.com/mermaid/)

## How to use

It must be wrapped by Suspense and ErrorBoundary (just good to have) components.

```tsx
import * as b from "bobril";
import * as mermaid from "@bobril/mermaid";

b.init(() => (
    <b.ErrorBoundary fallback={(e) => <div>Error occurred {e.message}</div>}>
        <b.Suspense fallback={<div>Rendering...</div>}>
            <mermaid.Mermaid>{`graph TD; A-->B;`}</mermaid.Mermaid>
        </b.Suspense>
    </b.ErrorBoundary>
));
```

## Global settings

```tsx
import * as mermaid from "@bobril/mermaid";

mermaid.setTheme("dark");
mermaid.setSecurityLevel("loose");
mermaid.setLogLevel(5);
mermaid.setDarkMode(true);
```

## Props of component

-   `children?: string` - only one string child is allowed and it must contain mermaid code to render
-   `style?: b.IBobrilStyle` - optional style for the component

## Acknowledges

-   mermaid - actual ground work
