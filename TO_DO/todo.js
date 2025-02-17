//opacite du sang!
document.getElementById('opacitySlider').addEventListener('input', function() {
    document.getElementById('bloodImage').style.opacity = this.value;
});

const slider = document.getElementById('opacitySlider');
        const image = document.getElementById('bloodImage');
        
        slider.addEventListener('input', () => {
            image.style.opacity = slider.value;
        });



let images = ["/yanis26x/OST_IMG/sillentHill.jpg", "/yanis26x/OST_IMG/xp.jpg"]; 
    let index = 0;

    function changerBackground() {
        index = (index + 1) % images.length; // Passe à l'image suivante
        document.body.style.backgroundImage = `url('${images[index]}')`;
    }