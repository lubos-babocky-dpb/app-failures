import { liveQuery } from 'dexie';
import { db } from '../db';

class FailureRepository
{
    live()
    {
        return liveQuery(async () => {
            const failures = await db.failures
                .orderBy('created_at')
                .reverse()
                .toArray();

            return Promise.all(
                failures.map(async (failure) => {
                    const vehicleId = failure?.vehicle_id
                        ? Number(failure.vehicle_id) || failure.vehicle_id
                        : null;

                    const vehicle = vehicleId
                        ? await db.vehicles.get(vehicleId)
                        : null;

                    return {
                        ...failure,
                        vehicleCode: vehicle?.code ?? failure.vehicle_id ?? '---'
                    };
                })
            );
        });
    }

    async get(uuid)
    {
        const failure = await db.failures.get(uuid);

        if (!failure) {
            return null;
        }

        const vehicleId = failure?.vehicle_id
            ? Number(failure.vehicle_id) || failure.vehicle_id
            : null;

        const vehicle = vehicleId
            ? await db.vehicles.get(vehicleId)
            : null;

        return {
            ...failure,
            vehicleCode: vehicle?.code ?? failure?.vehicle_id ?? '---'
        };
    }
}

export const failureRepository = new FailureRepository();