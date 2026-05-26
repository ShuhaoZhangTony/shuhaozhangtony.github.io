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

function rewriteRootRelativeLinks(container = document) {
    const basePath = getSiteBasePath();
    const rewriteTargets = [
        ['a', 'href'],
        ['img', 'src'],
        ['source', 'src'],
        ['link', 'href'],
    ];

    rewriteTargets.forEach(([selector, attribute]) => {
        container.querySelectorAll(`${selector}[${attribute}^="/"]`).forEach((element) => {
            const value = element.getAttribute(attribute);

            if (!value || value.startsWith('//')) {
                return;
            }

            if (basePath !== '/' && value.startsWith(basePath)) {
                return;
            }

            element.setAttribute(attribute, siteUrl(value));
        });
    });
}