function getSiteBasePath() {
    const pathname = window.location.pathname;
    const lastSegment = pathname.split('/').filter(Boolean).pop() || '';
    const looksLikeFile = lastSegment.includes('.');

    if (pathname.endsWith('/')) {
        return pathname;
    }

    if (pathname === '/' || !lastSegment) {
        return '/';
    }

    if (!looksLikeFile) {
        return pathname + '/';
    }

    const lastSlashIndex = pathname.lastIndexOf('/');
    return lastSlashIndex >= 0 ? pathname.slice(0, lastSlashIndex + 1) : '/';
}

function siteUrl(path = '') {
    const basePath = getSiteBasePath();
    const trimmedPath = path.replace(/^\/+/, '');

    if (!trimmedPath) {
        return basePath;
    }

    return basePath + trimmedPath;
}