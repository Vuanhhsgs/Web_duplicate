//Geogebra api set up
let api;
var params = {"appName": "geometry", "width": 1400, "height": 670, "showToolBar": true, "showAlgebraInput": false, "showMenuBar": true, "buttonShadows": true
, "customToolBar":
"0 6 27 28 1 2 15 5 19 10 11 34 24 13 3 4 8 9 18 16 36 20 21 22 23 53 45 46 47 44 51 29 30 31 32 33 38 49 50 64 65 70 77 501 39 41 42",      
   "appletOnLoad": function(ggbApi) {
    // ggbApi provides the applet API
        api = ggbApi;
        ggbApi.setGridVisible(false);
        ggbApi.setAxesVisible(false, false);
        ggbApi.setMode(0); 

    }


};
    var applet = new GGBApplet(params, true);
    window.addEventListener("load", function() {
        applet.inject('ggb-element');

    });
function draw_diagram(commands_list){
    commands_list.forEach(command => {
        api.evalCommand(command)
    });
}
window.addEventListener("load", function() {
    

    let have_searched_successfully = false;
    const generate_button = document.getElementById('moduleButton');
    const textareaInput = document.getElementById('module_overlayInputOverlay');
    generate_button.addEventListener('click', () => {
        //If not long enough to be a problem
        if (!have_searched_successfully){


            if (textareaInput.value.length < 80) {
                const originalText = generate_button.textContent;
                generate_button.style.opacity = "0.6";
                generate_button.style.cursor = "not-allowed";

                // Animated warning messages
                let dots = 0;
                generate_button.textContent = "Please enter a complete problem";

                const interval = setInterval(() => {
                    dots = (dots + 1) % 4; // 
                    generate_button.textContent = "Please enter a complete problems" + ".".repeat(dots);
                }, 500);

                // Revert after 2 seconds
                setTimeout(() => {
                    clearInterval(interval);
                    generate_button.textContent = originalText;
                    generate_button.disabled = false;
                    generate_button.style.opacity = "1";
                    generate_button.style.cursor = "pointer";
                }, 2000);
                return; 
            }


            //if is a problem
            else{
                generate_button.disabled = true;
                $.ajax({
                    url: '/process',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(textareaInput.value),
                    success: function(response) {
                        draw_diagram(response.result);
                    },
                    error: function(error) {
                        console.log(error);
                    },
                    complete: function(){
                        generate_button.textContent = "Try another problem?"
                        have_searched_successfully = true
                        generate_button.disabled = false
                    }

                });

            }
        }

        else{
            api.reset()
            textareaInput.value = ""
            have_searched_successfully = false
            generate_button.textContent = "Generate Diagram"
        }

    });
});