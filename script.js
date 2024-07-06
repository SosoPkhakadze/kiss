document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.querySelector('.gallery');
    const imageBoxes = document.querySelectorAll('.image-box');
    const heartsContainer = document.getElementById('hearts');
    const backgroundHeartsContainer = document.querySelector('.background-hearts');

    const boxWidth = 240;
    const boxHeight = 220;
    const padding = 20;
    const occupiedSpaces = [];

    function isSpaceAvailable(x, y) {
        for (let space of occupiedSpaces) {
            if (
                x < space.x + boxWidth + padding &&
                x + boxWidth + padding > space.x &&
                y < space.y + boxHeight + padding &&
                y + boxHeight + padding > space.y
            ) {
                return false;
            }
        }
        return true;
    }

    function positionImages() {
        occupiedSpaces.length = 0;
        const containerWidth = gallery.clientWidth;
        const containerHeight = gallery.clientHeight;

        imageBoxes.forEach(box => {
            let randomX, randomY;
            let attempts = 0;
            const maxAttempts = 100;

            do {
                randomX = Math.floor(Math.random() * (containerWidth - boxWidth));
                randomY = Math.floor(Math.random() * (containerHeight - boxHeight));
                attempts++;

                if (attempts > maxAttempts) {
                    randomX = 0;
                    randomY = containerHeight;
                    break;
                }
            } while (!isSpaceAvailable(randomX, randomY));

            box.style.left = `${randomX}px`;
            box.style.top = `${randomY}px`;
            occupiedSpaces.push({ x: randomX, y: randomY });

            // Set hover image
            const hoverImage = box.dataset.hoverImage;
            box.style.setProperty('--hover-image', `url(${hoverImage})`);
        });
    }

    function createHeart(container, x, y) {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerHTML = '❤';
        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;
        container.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 3000);
    }

    function createBackgroundHeart() {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerHTML = '❤';
        heart.style.left = `${Math.random() * 100}vw`;
        heart.style.fontSize = `${Math.random() * 20 + 10}px`;
        heart.style.opacity = Math.random() * 0.5;
        heart.style.animation = `backgroundHeartAnimation ${Math.random() * 5 + 5}s linear`;
        backgroundHeartsContainer.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 10000);
    }

    positionImages();
    window.addEventListener('resize', positionImages);

    setInterval(createBackgroundHeart, 300);

    imageBoxes.forEach(box => {
        ['mouseenter', 'touchstart'].forEach(eventType => {
            box.addEventListener(eventType, (e) => {
                if (e.type === 'touchstart') e.preventDefault();
                const rect = box.getBoundingClientRect();
                heartsContainer.style.display = 'block';
                heartsContainer.style.left = `${rect.left}px`;
                heartsContainer.style.top = `${rect.top - 200}px`;

                for (let i = 0; i < 20; i++) {
                    setTimeout(() => createHeart(heartsContainer, Math.random() * 200, 200), i * 150);
                }
            });
        });

        ['mouseleave', 'touchend'].forEach(eventType => {
            box.addEventListener(eventType, () => {
                setTimeout(() => {
                    heartsContainer.style.display = 'none';
                    heartsContainer.innerHTML = '';
                }, 3000);
            });
        });
    });
});