document.getElementById('opacitySlider').addEventListener('input', function() {
    document.getElementById('bloodImage').style.opacity = this.value;
});



const slider = document.getElementById('opacitySlider');
        const image = document.getElementById('bloodImage');
        
        slider.addEventListener('input', () => {
            image.style.opacity = slider.value;
        });