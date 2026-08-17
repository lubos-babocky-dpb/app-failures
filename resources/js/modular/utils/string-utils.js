export function truncate(value, length)
{
    if (!value) {
        return null;
    }

    return value.length > length
        ? `${value.substring(0, length)}...`
        : value;
}

export function capitalize(value)
{
    if (!value) {
        return value;
    }

    return value.charAt(0).toUpperCase() + value.slice(1);
}