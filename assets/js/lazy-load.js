// lazy-load.js
document.addEventListener('DOMContentLoaded', function () {
    let lazyImages = document.querySelectorAll('img[loading="lazy"]');

    let observer = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                let lazyImage = entry.target;
                lazyImage.src = lazyImage.getAttribute('data-src');
                observer.unobserve(lazyImage);
            }
        });
    }, { threshold: 0.5 });

    lazyImages.forEach(function (lazyImage) {
        observer.observe(lazyImage);
    });
});
