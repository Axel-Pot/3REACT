export interface Change {
    changes: { key: string }[];
}

export interface Work {
    key: string;
    title: string;
    description?: { value: string };
    created?: { value: string };
    authors?: { author: { key: string } }[];
    covers?: number[];
}


export interface Author {
    key: string;
    name: string;
}

