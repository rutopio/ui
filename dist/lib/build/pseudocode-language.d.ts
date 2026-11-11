export declare const pseudocodeLanguage: {
    name: string;
    scopeName: string;
    patterns: ({
        name: string;
        begin: string;
        end: string;
        patterns?: undefined;
        match?: undefined;
    } | {
        name: string;
        begin: string;
        end: string;
        patterns: {
            name: string;
            match: string;
        }[];
        match?: undefined;
    } | {
        begin?: undefined;
        end?: undefined;
        patterns?: undefined;
        name: string;
        match: string;
    })[];
};
