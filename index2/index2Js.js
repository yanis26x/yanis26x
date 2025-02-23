//opacite du sang!
document.getElementById('opacitySlider').addEventListener('input', function() {
    document.getElementById('bloodImage').style.opacity = this.value;
});

const slider = document.getElementById('opacitySlider');
        const image = document.getElementById('bloodImage');
        
        slider.addEventListener('input', () => {
            image.style.opacity = slider.value;
        });


//pour changer background
let images = ["/yanis26x/OST_IMG/sillentHill.jpg", "/yanis26x/OST_IMG/xp.jpg"]; 
    let index = 0;

    function changerBackground() {
        index = (index + 1) % images.length; // Passe à l'image suivante
        document.body.style.backgroundImage = `url('${images[index]}')`;
    }

//pour l'heure
function afficherHeure() {
    let maintenant = new Date();
    let heures = maintenant.getHours().toString().padStart(2, '0');
    let minutes = maintenant.getMinutes().toString().padStart(2, '0');
    let secondes = maintenant.getSeconds().toString().padStart(2, '0');
    document.getElementById("horloge").textContent = `${heures}:${minutes}:${secondes}`;
}

setInterval(afficherHeure, 1000); // Mettre à jour toutes les secondes
afficherHeure(); // Appel initial
