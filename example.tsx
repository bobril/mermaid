import * as b from "bobril";
import * as mermaid from "./index";

const themes: mermaid.MermaidConfig["theme"][] = ["default", "base", "dark", "forest", "neutral", "null"];

b.init(() => {
    const currentThemeIndex = b.useState(0);
    mermaid.setTheme(themes[currentThemeIndex()]);
    return (
        <>
            <h1>
                Demo page for <a href="https://github.com/bobril/mermaid">@bobril/mermaid</a>
            </h1>
            <div>
                Theme:
                {themes.map((theme, index) => (
                    <button
                        key={theme}
                        onClick={() => currentThemeIndex(index)}
                        disabled={currentThemeIndex() === index}
                    >
                        {theme}
                    </button>
                ))}
            </div>
            <b.ErrorBoundary fallback={(e) => <div>Error occurred {(e as Error).message}</div>}>
                <b.Suspense fallback={<div>Rendering...</div>}>
                    <mermaid.Mermaid>
                        {`graph TD;
                        A-->B;
                        A-->C;
                        B-->D;
                        C-->D;
                    `}
                    </mermaid.Mermaid>
                </b.Suspense>
            </b.ErrorBoundary>
        </>
    );
});
