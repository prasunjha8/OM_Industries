// JavaScript interactivity for OM Group of Companies website

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Navigation Scroll Effect
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section');
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Highlight Active Link
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check

  // 2. Mobile Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navLinksMenu = document.getElementById('nav-links');

  menuToggle.addEventListener('click', () => {
    navLinksMenu.classList.toggle('mobile-active');
    const icon = menuToggle.querySelector('i');
    if (navLinksMenu.classList.contains('mobile-active')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-xmark');
    } else {
      icon.classList.remove('fa-xmark');
      icon.classList.add('fa-bars');
    }
  });

  // Close mobile menu on click of nav links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinksMenu.classList.remove('mobile-active');
      const icon = menuToggle.querySelector('i');
      icon.classList.remove('fa-xmark');
      icon.classList.add('fa-bars');
    });
  });

  // 3. Business Verticals Tabs switching
  const tabsContainer = document.getElementById('vertical-tabs');
  const tabButtons = document.querySelectorAll('.vertical-tab-btn');
  const tabContents = document.querySelectorAll('.vertical-content');

  tabsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.vertical-tab-btn');
    if (!btn) return;
    
    const targetId = btn.dataset.target;
    
    // Deactivate previous
    tabButtons.forEach(button => button.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Activate target
    btn.classList.add('active');
    const targetContent = document.getElementById(targetId);
    if (targetContent) {
      targetContent.classList.add('active');
    }
  });

  // 4. Scroll Reveal Intersection Observer
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // 5. Contact Form Handler (Google Sheets Integration)
  // To connect your form to Google Sheets:
  // 1. In your Google Sheet, go to Extensions > Apps Script.
  // 2. Paste the Google Apps Script code (provided in the chat).
  // 3. Click "Deploy" > "New deployment" > Select type: "Web app".
  // 4. Set "Execute as" to "Me", and "Who has access" to "Anyone".
  // 5. Click Deploy, authorize permissions, and copy the Web App URL.
  // 6. Paste that URL in the APPS_SCRIPT_URL variable below:
  const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzhMrdOCl8P1V6XA6DbBVPlk621qGTGTyGRDBp5neVUHanAAe7FTuMVx_FFApyBZEw/exec"; 

  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const location = document.getElementById('location').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Simple validation feedback
    if (!name || !email || !phone || !location || !subject || !message) {
      formStatus.textContent = 'Please fill out all fields.';
      formStatus.className = 'form-message error';
      formStatus.style.display = 'block';
      return;
    }
    
    formStatus.textContent = 'Sending message...';
    formStatus.className = 'form-message';
    formStatus.style.display = 'block';
    
    const formData = { name, email, phone, location, subject, message };

    if (!APPS_SCRIPT_URL) {
      // Fallback to mock delay if URL is not configured yet
      setTimeout(() => {
        contactForm.reset();
        formStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> Thank you! Your message has been sent successfully. An expert will reach out to you shortly. <br><small style="opacity: 0.8;">(Mock Mode: Configure APPS_SCRIPT_URL in index.js to save to Google Sheets)</small>';
        formStatus.className = 'form-message success';
        
        setTimeout(() => {
          formStatus.style.display = 'none';
        }, 8000);
      }, 1500);
      return;
    }
    
    // Send form data to Google Sheets via Apps Script Web App
    fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Prevents browser CORS redirect errors from Google Apps Script
      headers: {
        'Content-Type': 'text/plain;charset=utf-8' // Avoids CORS preflight OPTIONS request
      },
      body: JSON.stringify(formData)
    })
    .then(() => {
      contactForm.reset();
      formStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> Thank you! Your message has been sent successfully. An expert will reach out to you shortly.';
      formStatus.className = 'form-message success';
      
      setTimeout(() => {
        formStatus.style.display = 'none';
      }, 8000);
    })
    .catch(error => {
      console.error('Submission error:', error);
      formStatus.textContent = 'Failed to send message. Please try again or contact us directly.';
      formStatus.className = 'form-message error';
    });
  });
});
