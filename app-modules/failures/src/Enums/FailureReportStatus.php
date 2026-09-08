<?php

namespace Dpb\Failures\Enums;

enum FailureReportStatus: string
{
    /**
     * The report has been successfully received and persisted by the API.
     * Central dispatch is aware of the failure.
     */
    case RECEIVED = 'received';

    /**
     * The vehicle is currently in the workshop and maintenance is actively performed.
     */
    case IN_PROGRESS = 'in_progress';

    /**
     * The report was evaluated as groundless or rejected by the workshop manager.
     */
    case REJECTED = 'rejected';

    /**
     * The issue has been successfully fixed and the vehicle is ready for service.
     */
    case RESOLVED = 'resolved';

    /**
     * The issue cannot be resolved under current conditions (e.g., total loss, decommissioning).
     */
    case UNRESOLVABLE = 'unresolvable';

    /**
     * The repair is postponed (e.g., waiting for spare parts), but the vehicle might remain operational with limitations.
     */
    case DEFERRED = 'deferred';
}