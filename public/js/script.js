document.addEventListener('DOMContentLoaded', function(){

  const allButtons = document.querySelectorAll('.searchBtn');
  const searchBar = document.querySelector('.searchBar');
  const searchInput = document.getElementById('searchInput');
  const searchClose = document.getElementById('searchClose');

  for (var i = 0; i < allButtons.length; i++) {
    allButtons[i].addEventListener('click', function() {
      searchBar.style.visibility = 'visible';
      searchBar.classList.add('open');
      this.setAttribute('aria-expanded', 'true');
      searchInput.focus();
    });
  }

  searchClose.addEventListener('click', function() {
    searchBar.style.visibility = 'hidden';
    searchBar.classList.remove('open');
    this.setAttribute('aria-expanded', 'false');
  });


  // ===== Hero image carousel (rotates src every 3 seconds using recursive setTimeout) =====
  // Behavior:
  // - Finds the <img class="hero-image"> on the page
  // - Attempts to preload a list of candidate hero images from /img/
  // - Uses only the images that successfully load
  // - Rotates them every 3000ms (3s) using setTimeout recursion
  (function heroCarousel() {
    const hero = document.querySelector('.hero-image');
    if (!hero) return; // nothing to do if image isn't present

    const basePath = '/img/';

    // Customize this list to match your actual filenames in public/img/
    // Order here is the rotation order. Keep the existing default filename as a fallback.
    const candidates = [
      'hero-image1.png',
      'hero-image2.png',
      'hero-image3.png',
      'hero-image.webp' // fallback / existing image
    ];

    const available = []; // filenames that successfully preload
    let idx = 0;
    let timeoutId = null;

    function preloadList(list, done) {
      let remaining = list.length;
      if (remaining === 0) return done();

      list.forEach(name => {
        const img = new Image();
        img.src = basePath + name;
        img.onload = function() {
          available.push(name);
          remaining--;
          if (remaining === 0) done();
        };
        img.onerror = function() {
          // ignore missing/broken images
          remaining--;
          if (remaining === 0) done();
        };
      });
    }

    function startRotation() {
      if (available.length <= 1) {
        // nothing to rotate; if one image available, ensure hero uses it
        if (available.length === 1) hero.src = basePath + available[0];
        return;
      }

      // Set initial image if not already set to one of the available list
      const currentSrc = hero.getAttribute('src') || '';
      const currentName = currentSrc.split('/').pop();
      const startIndex = available.indexOf(currentName);
      idx = startIndex >= 0 ? startIndex : 0;
      hero.src = basePath + available[idx];

      function tick() {
        idx = (idx + 1) % available.length;
        hero.src = basePath + available[idx];
        timeoutId = setTimeout(tick, 3000);
      }

      // start the loop
      timeoutId = setTimeout(tick, 3000);

      // Optional: pause on hover so users can inspect the image
      hero.addEventListener('mouseenter', function() {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
      });
      hero.addEventListener('mouseleave', function() {
        if (!timeoutId) timeoutId = setTimeout(tick, 3000);
      });
    }

    preloadList(candidates, startRotation);
  })();

});