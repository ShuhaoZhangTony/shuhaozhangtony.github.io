const content_dir = 'contents/'
const config_file = 'config.yml'
const section_names = ['home', 'publications', 'news', 'resources']


window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });


    // Yaml
    fetch(siteUrl(content_dir + config_file))
        .then(response => response.text())
        .then(text => {
            const yml = jsyaml.load(text);
            Object.keys(yml).forEach(key => {
                try {
                    const targetElement = document.getElementById(key);
                    targetElement.innerHTML = yml[key];
                    rewriteRootRelativeLinks(targetElement);
                } catch {
                    console.log("Unknown id and value: " + key + "," + yml[key].toString())
                }

            })
        })
        .catch(error => console.log(error));


    // Marked
    marked.use({ mangle: false, headerIds: false })
    section_names.forEach((name, idx) => {
        const sectionElement = document.getElementById(name + '-md');

        fetch(siteUrl(content_dir + name + '.md'))
            .then(response => response.text())
            .then(markdown => {
                const html = marked.parse(markdown);
                sectionElement.innerHTML = html;
                rewriteRootRelativeLinks(sectionElement);
            }).then(() => {
                // MathJax
                MathJax.typeset();
            })
            .catch(error => {
                console.log(error);
                sectionElement.textContent = '内容加载失败，请刷新重试。';
            });
    })

}); 
