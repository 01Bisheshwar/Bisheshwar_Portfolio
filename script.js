document.addEventListener("DOMContentLoaded", function() {
    window.addEventListener("scroll", function() {
        const footer = document.getElementById("footer");
        if (window.scrollY + window.innerHeight >= document.body.offsetHeight) {
            footer.style.display = "block";
        } else {
            footer.style.display = "none";
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const loadingOverlay = document.getElementById('loading-overlay');
    const loadingText = document.getElementById('loading-text');
    const jokeText = document.getElementById('joke-text');
    const contentWrapper = document.getElementById('content-wrapper');
    let images = document.images;
    let videos = document.querySelectorAll('video');
    let totalItems = images.length + videos.length;
    let itemsLoaded = 0;
    let thresholdReached = false;

    function fetchJoke() {
        fetch('https://official-joke-api.appspot.com/random_joke')
            .then(response => response.json())
            .then(data => {
                jokeText.textContent = `${data.setup} - ${data.punchline}`;
            })
            .catch(error => {
                jokeText.textContent = "Why did the API go down? It had too many requests.";
            });
    }

    function updateLoadingProgress() {
        itemsLoaded++;
        let progress = Math.floor((itemsLoaded / totalItems) * 100);
        if (loadingText) {
            loadingText.textContent = progress + '%';
        }

        if (itemsLoaded >= totalItems * 0.8 && !thresholdReached) {  // 80% threshold
            thresholdReached = true;
            // Show content once 80% of items are loaded
            contentWrapper.style.display = 'block';
            loadingOverlay.style.display = 'none';
        }
    }

    // Fetch a new joke every 7 seconds
    setInterval(fetchJoke, 7000);

    Array.from(images).forEach((img) => {
        if (img.complete) {
            updateLoadingProgress();
        } else {
            img.addEventListener('load', updateLoadingProgress);
            img.addEventListener('error', updateLoadingProgress);
        }
    });

    Array.from(videos).forEach((video) => {
        if (video.readyState === 4) {
            updateLoadingProgress();
        } else {
            video.addEventListener('loadeddata', updateLoadingProgress);
            video.addEventListener('error', updateLoadingProgress);
        }
    });

    // Initial joke fetch
    fetchJoke();
});
