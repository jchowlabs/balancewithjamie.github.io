document.addEventListener('DOMContentLoaded', function() {
    // Section animation on scroll
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

    // Button click handler for smooth scrolling
    document.querySelectorAll('.book-call-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.getElementById('section3').scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Wrap the acronym header and tagline in a container
    const section2 = document.getElementById('section2');
    if (section2) {
        const acronymHeader = section2.querySelector('.acronym-header');
        const separator = section2.querySelector('.separator');
        const tagline = section2.querySelector('.tagline');
        
        if (acronymHeader && tagline) {
            const container = document.createElement('div');
            container.className = 'acronym-container';
            
            const parent = acronymHeader.parentNode;
            parent.insertBefore(container, acronymHeader);
            
            container.appendChild(acronymHeader);
            if (separator) container.appendChild(separator);
            container.appendChild(tagline);
        }
    }
    
    // Add the resources header container styling
    const section3 = document.getElementById('section3');
    if (section3) {
        const sectionHeader = section3.querySelector('.section-header');
        
        if (sectionHeader && !sectionHeader.closest('.resources-header-container')) {
            const container = document.createElement('div');
            container.className = 'resources-header-container';
            
            const parent = sectionHeader.parentNode;
            parent.insertBefore(container, sectionHeader);
            
            container.appendChild(sectionHeader);
        }
    }
    
    // Optimized flipbook functionality to prevent flashing
    const flipbook = document.querySelector('.flipbook');
    if (flipbook) {
        const pages = flipbook.querySelectorAll('.page');
        const pageIndicator = document.querySelector('.page-indicator');
        const dots = document.querySelectorAll('.dot');
        const prevArrow = document.querySelector('.prev-arrow');
        const nextArrow = document.querySelector('.next-arrow');
        const prevZone = document.querySelector('.prev-zone');
        const nextZone = document.querySelector('.next-zone');
        
        let currentPage = 1;
        const totalPages = pages.length;
        
        // Set initial state - hide all pages except the first one
        pages.forEach((page, index) => {
            if (index === 0) {
                page.classList.add('active');
            } else {
                page.style.opacity = '0';
            }
        });
        
        updatePageIndicator();
        
        // Previous page navigation
        if (prevArrow) {
            prevArrow.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                goToPreviousPage();
            });
        }
        
        if (prevZone) {
            prevZone.addEventListener('click', function() {
                goToPreviousPage();
            });
        }
        
        // Next page navigation
        if (nextArrow) {
            nextArrow.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                goToNextPage();
            });
        }
        
        if (nextZone) {
            nextZone.addEventListener('click', function() {
                goToNextPage();
            });
        }
        
        // Dot navigation
        if (dots && dots.length > 0) {
            dots.forEach((dot, index) => {
                dot.addEventListener('click', function() {
                    // Don't do anything if already on this page
                    if (currentPage === index + 1) return;
                    
                    // If going backward
                    if (currentPage > index + 1) {
                        while (currentPage > index + 1) {
                            goToPreviousPage(false);
                        }
                    } 
                    // If going forward
                    else {
                        while (currentPage < index + 1) {
                            goToNextPage(false);
                        }
                    }
                });
            });
        }
        
        function goToNextPage(animate = true) {
            if (currentPage < totalPages) {
                const activePage = pages[currentPage - 1];
                const nextPageEl = pages[currentPage];
                
                if (!activePage || !nextPageEl) return;
                
                // Prepare next page for animation
                nextPageEl.style.opacity = '1';
                nextPageEl.style.transition = animate ? 'opacity 0.3s ease' : 'none';
                
                if (animate) {
                    // With animation
                    activePage.style.zIndex = '3';
                    nextPageEl.style.zIndex = '2';
                    
                    // Start animation
                    activePage.classList.add('turning');
                    
                    setTimeout(() => {
                        activePage.classList.remove('active', 'turning');
                        activePage.classList.add('flipped');
                        
                        // Activate next page
                        nextPageEl.classList.add('active');
                        
                        currentPage++;
                        updatePageIndicator();
                    }, 400);
                } else {
                    // Without animation
                    activePage.classList.remove('active');
                    activePage.classList.add('flipped');
                    nextPageEl.classList.add('active');
                    currentPage++;
                    updatePageIndicator();
                }
            }
        }
        
        function goToPreviousPage(animate = true) {
            if (currentPage > 1) {
                const activePage = pages[currentPage - 1];
                const prevPageEl = pages[currentPage - 2];
                
                if (!activePage || !prevPageEl) return;
                
                // Remove active from current page
                activePage.classList.remove('active');
                
                // Make sure previous page is visible
                prevPageEl.style.opacity = '1';
                
                if (animate) {
                    // With animation
                    prevPageEl.style.transition = 'transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1), opacity 0.3s ease';
                    prevPageEl.classList.add('active-prev'); // Special class for z-index handling
                    
                    // Unflip with animation
                    prevPageEl.classList.remove('flipped');
                    
                    // After animation completes
                    setTimeout(() => {
                        prevPageEl.classList.add('active');
                        prevPageEl.classList.remove('active-prev');
                        currentPage--;
                        updatePageIndicator();
                    }, 300);
                } else {
                    // Without animation
                    prevPageEl.style.transition = 'none';
                    prevPageEl.classList.remove('flipped');
                    prevPageEl.classList.add('active');
                    currentPage--;
                    updatePageIndicator();
                }
            }
        }
        
        function updatePageIndicator() {
            if (pageIndicator) {
                pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
            }
            
            if (dots && dots.length > 0) {
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index + 1 === currentPage);
                });
            }
            
            // Update arrow visibility
            if (prevArrow) {
                prevArrow.style.opacity = currentPage === 1 ? '0.3' : '1';
                prevArrow.style.pointerEvents = currentPage === 1 ? 'none' : 'auto';
            }
            
            if (nextArrow) {
                nextArrow.style.opacity = currentPage === totalPages ? '0.3' : '1';
                nextArrow.style.pointerEvents = currentPage === totalPages ? 'none' : 'auto';
            }
        }
        
        // Touch swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        flipbook.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, false);
        
        flipbook.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);
        
        function handleSwipe() {
            const swipeThreshold = 50;
            
            if (touchEndX < touchStartX - swipeThreshold) {
                // Swipe left - go to next page
                goToNextPage();
            }
            
            if (touchEndX > touchStartX + swipeThreshold) {
                // Swipe right - go to previous page
                goToPreviousPage();
            }
        }
        
        // Keyboard navigation for accessibility
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                goToPreviousPage();
            } else if (e.key === 'ArrowRight') {
                goToNextPage();
            }
        });
    }
    
    // Form submission handler
    const emailForm = document.querySelector('.email-form');
    if (emailForm) {
        const downloadBtn = emailForm.querySelector('.download-btn');
        const emailInput = emailForm.querySelector('.email-input');
        
        if (downloadBtn && emailInput) {
            downloadBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                const email = emailInput.value.trim();
                if (!email) {
                    alert('Please enter your email address.');
                    return;
                }
                
                if (!isValidEmail(email)) {
                    alert('Please enter a valid email address.');
                    return;
                }
                
                // Here you would typically send the email to your server or service
                // For now, we'll just show a success message
                emailForm.innerHTML = '<p class="success-message">Thank you! Your guide has been sent to your email.</p>';
            });
        }
    }
    
    // Helper function to validate email format
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
});