const STATUS_MAP = {
    pending_sync: {
        labelKey: 'status.pending_sync',
        color: 'text-amber-600 animate-pulse'
    },

    synced: {
        labelKey: 'status.synced',
        color: 'text-green-600'
    },

    reported: {
        labelKey: 'status.reported',
        color: 'text-[#e30613]'
    },

    accepted: {
        labelKey: 'status.accepted',
        color: 'text-blue-600'
    },

    resolved: {
        labelKey: 'status.resolved',
        color: 'text-gray-500'
    }
};

export class FailureStatusResolver
{
    static getBadge(status)
    {
        return STATUS_MAP[status] ?? STATUS_MAP.reported;
    }
}