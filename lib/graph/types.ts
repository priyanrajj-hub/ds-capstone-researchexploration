export interface GraphNodeAttrs {
    company?: string;
    school?: string;
    city?: string;
    [key: string]: string | undefined;
}

export interface GraphNode {
    id: string;
    label: string;
    x?: number;
    y?: number;
    z?: number;
    attrs?: GraphNodeAttrs;
}

export interface GraphEdge {
    u: string;
    v: string;
    weight: number;
}
