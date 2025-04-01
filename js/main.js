document.addEventListener('DOMContentLoaded', function() {
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, options);
    
    document.querySelectorAll('section:not(:first-of-type)').forEach(section => {
        observer.observe(section);
    });

    document.querySelectorAll('.book-call-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.getElementById('section4').scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    const section2 = document.getElementById('section2');
    if (section2) {
        const acronymHeader = section2.querySelector('.acronym-header');
        const tagline = section2.querySelector('.tagline');
        
        if (acronymHeader && tagline) {
            const container = document.createElement('div');
            container.className = 'acronym-container';
            
            const parent = acronymHeader.parentNode;
            parent.insertBefore(container, acronymHeader);
            
            container.appendChild(acronymHeader);
            container.appendChild(tagline);
        }
    }
});