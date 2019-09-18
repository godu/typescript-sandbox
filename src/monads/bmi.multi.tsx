import { Applicative1 } from 'fp-ts/es6/Applicative';
import { Kind, URIS } from 'fp-ts/es6/HKT';
import React from 'react';

export default <F extends URIS>(F: Applicative1<F> & {
    join: <A, B, C>(fa: Kind<F, A>, fb: Kind<F, B>, f: (a: A, b: B) => C) => Kind<F, C>
}) => ({
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


        const fBMI = F.join(
            fWeight,
            fHeightMeters,
            (weight: number, heightMeters: number) =>
                Math.round(
                    weight /
                    (heightMeters * heightMeters)
                )
        );

        return F.join(
            F.join(fWeight, fHeight, (weight: number, height: number) => [weight, height]),
            fBMI,
            ([weight, height], BMI) => (
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
        );
    }
