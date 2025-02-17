//opacite du sang!
document.getElementById('opacitySlider').addEventListener('input', function() {
    document.getElementById('bloodImage').style.opacity = this.value;
});

const slider = document.getElementById('opacitySlider');
        const image = document.getElementById('bloodImage');
        
        slider.addEventListener('input', () => {
            image.style.opacity = slider.value;
        });



let images = [ "/yanis26x/OST_IMG/xp.jpg","/yanis26x/OST_IMG/sillentHill.jpg"]; 
    let index = 0;

    function changerBackground() {
        index = (index + 1) % images.length; // Passe à l'image suivante
        document.body.style.backgroundImage = `url('${images[index]}')`;
    }




    function DevinerNombre() {
        let nombreADeviner = Math.floor(Math.random() * 20);
        let essai = 1;
        const nombreEssaiAutorise = 4;
    
        let nombreDevine = parseInt(prompt("⛧⛧Entre un nombre⛧entre de 0 à 20. Ta 4 essais. Essai 1 !"));
        
        let nombreTrouve = false;
        while (essai <= nombreEssaiAutorise)
        {
            if (isNaN(nombreDevine)) {
                break;
            }
    
            if (nombreDevine < nombreADeviner && essai != nombreEssaiAutorise) {
                nombreDevine = parseInt(prompt(`Incorrect lol, il te reste ${nombreEssaiAutorise - essai} essais ! .Entre un nombre + grand que ${nombreDevine}, mais - ou égal à 20`));
            }
            else if (nombreDevine > nombreADeviner && essai != nombreEssaiAutorise) {
                nombreDevine = parseInt(prompt(`Incorrect mdrr, il te reste ${nombreEssaiAutorise - essai} essais !.Entrer un nombre plus petit que ${nombreDevine}, mais + ou égal à 0`));
            }
            else if (nombreDevine == nombreADeviner){
                nombreTrouve = true;
                alert(`bien joué ta deviné le nombre ${nombreADeviner}. Bravo! ⛧42365⛧ `)
                break;
            }
    
            essai++;
        };
    
        if (!isNaN(nombreDevine) && !nombreTrouve) {
            alert("tes trop null haha. Le nombre qu’on⛧cherchait est " + nombreADeviner +" lol");
        }
    }