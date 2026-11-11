export default fill;
declare namespace fill {
    let duration: number;
    let seed: number;
    let loudness: number;
    let lowpass: number;
    namespace reverb {
        let mix: number;
        let decay: number;
        let predelay: number;
        let damp: number;
    }
    let layers: ({
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
        freq?: undefined;
        partials?: undefined;
    })[];
}
