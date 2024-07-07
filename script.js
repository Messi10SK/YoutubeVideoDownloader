document.getElementById('download-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const videoURL = document.getElementById('video-url').value;
    console.log('Form submitted with URL:', videoURL); // Debugging line

    fetch(`http://localhost:3000/download?url=${encodeURIComponent(videoURL)}`)
        .then(response => {
            if (response.ok) {
                return response.blob();
            } else {
                throw new Error('Failed to download video');
            }
        })
        .then(blob => {
            const url = window.URL.createObjectURL(new Blob([blob]));
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'video.mp4';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to download video. Please check the URL and try again.');
        });
});
