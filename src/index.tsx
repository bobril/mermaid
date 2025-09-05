import * as b from "bobril";
import mermaid, { MermaidConfig, RenderResult } from "mermaid";

export type { MermaidConfig };

const config: MermaidConfig = {
    startOnLoad: true,
    securityLevel: "strict",
    theme: "default",
    logLevel: 5,
    darkMode: false,
    suppressErrorRendering: true,
};

const configIndexes: Set<b.IProp<number>> = new Set();
let configIndex = 0;

function configChanged() {
    configIndex++;
    configIndexes.forEach((ci) => ci(ci() + 1));
}

export function setSecurityLevel(level: MermaidConfig["securityLevel"]) {
    if (config.securityLevel !== level) {
        config.securityLevel = level;
        configChanged();
    }
}

export function setTheme(theme: MermaidConfig["theme"]) {
    if (config.theme !== theme) {
        config.theme = theme;
        configChanged();
    }
}

export function setLogLevel(logLevel: MermaidConfig["logLevel"]) {
    if (config.logLevel !== logLevel) {
        config.logLevel = logLevel;
        configChanged();
    }
}

export function setDarkMode(darkMode: boolean) {
    if (config.darkMode !== darkMode) {
        config.darkMode = darkMode;
        configChanged();
    }
}

const code2res: Map<string, { ci: number; id: number; result?: Promise<RenderResult>; frame: number }> = new Map();
let lastId = 0;

function getResult(code: string): Promise<RenderResult> {
    let existing = code2res.get(code);
    if (existing) {
        if (existing.ci === configIndex) {
            existing.frame = b.frame();
            return existing.result!;
        }
    } else {
        const frame = b.frame();
        existing = { ci: 0, id: 0, result: undefined, frame };
        code2res.set(code, existing);
        for (const [k, v] of code2res) {
            if (frame - 2 > v.frame) {
                code2res.delete(k);
            }
        }
    }
    existing.frame = b.frame();
    existing.ci = configIndex;
    existing.id = lastId++;
    existing.result = (async () => {
        mermaid.initialize(config);
        const result = await mermaid.render(`mermaid-${existing.id}-svg`, code);
        return result;
    })();
    return existing.result;
}

export function Mermaid(data: { children: string; style?: b.IBobrilStyle }) {
    const result = b.use(getResult(data.children));
    const entry = code2res.get(data.children)!;
    b.useLayoutEffect(() => {
        entry.frame = b.frame();
        result.bindFunctions?.(b.getDomNode(b.getCurrentCtx()?.me) as HTMLElement);
    });
    const configIndex = b.useState<number>(0);
    configIndexes.add(configIndex);
    b.useDispose(() => {
        configIndexes.delete(configIndex);
    });
    return (
        <div key={"$mermaid#" + entry.id} style={data.style}>
            {{ tag: "/", children: result.svg }}
        </div>
    );
}
