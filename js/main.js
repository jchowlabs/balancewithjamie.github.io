document.addEventListener('DOMContentLoaded', function() {
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const handleIntersection = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    };

    const observer = new IntersectionObserver(handleIntersection, options);
    
    const sections = document.querySelectorAll('section:not(:first-of-type)');
    
    sections.forEach(section => {
        observer.observe(section);
    });

    document.querySelectorAll('.book-call-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.getElementById('section4').scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});