import { Applicative1, Applicative2 } from 'fp-ts/es6/Applicative';
import { Kind, URIS } from 'fp-ts/es6/HKT';
import React from 'react';

export default <F extends URIS>(F: Applicative1<F>) => ({
    height: fHeight,
    weight: fWeight
}: {
    height: Kind<F, number>;
    weight: Kind<F, number>;
}) => {
    const fHeightMeters =
        F.map(
            fHeight,
            (x: number) => x * 0.01
        );

    const fBMI =
        F.ap(
            F.ap(
                F.of(
                    (weight: number) =>
                        (heightMeters: number) =>
                            Math.round(
                                weight /
                                (heightMeters * heightMeters)
                            )
                ),
                fWeight
            ),
            fHeightMeters
        );

    return (
        F.ap(
            F.ap(
                F.ap(
                    F.of(
                        (height: number) =>
                            (weight: number) =>
                                (BMI: number) => (
                                    <div>
                                        <div>
                                            {`Weight ${weight}kg`}
                                        </div>
                                        <div>
                                            {`Height ${height}kg`}
                                        </div>
                                        <h2>
                                            {`BMI is ${BMI}`}
                                        </h2>
                                    </div>
                                )
                    ),
                    fHeight
                ),
                fWeight
            ),
            fBMI
        )
    );
}
