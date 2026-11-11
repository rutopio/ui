declare const fill: {
    duration: number;
    seed: number;
    loudness: number;
    lowpass: number;
    reverb: {
        mix: number;
        decay: number;
        predelay: number;
        damp: number;
    };
    layers: ({
        type: string;
        freq: {
            from: number;
            to: number;
            time: number;
            curve: number;
        };
        partials: number[][];
        env: {
            attack: number;
            decay: number;
            curve: number;
            rise?: undefined;
        };
        color?: undefined;
        at?: undefined;
        gain?: undefined;
        filter?: undefined;
    } | {
        freq?: undefined;
        partials?: undefined;
        type: string;
        color: string;
        at: number;
        gain: number;
        filter: {
            type: string;
            freq: {
                from: number;
                to: number;
                time: number;
                curve: number;
            };
            q: number;
        };
        env: {
            attack: number;
            rise: number;
            decay: number;
            curve: number;
        };
    })[];
};
export default fill;
