/*
Le but est d'avoir un éditeur minimaliste.
*/

var BZ = {
    enrich(textarea) {
        // the textarea being substituted
        this.origElement = textarea;
        // the view
        this.view = document.createElement('div');
        this.origElement.parent.replaceChild(this.view, this.origElement);
        
    }
};

