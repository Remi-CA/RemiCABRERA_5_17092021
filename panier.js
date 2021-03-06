let produitRegisterLS = JSON.parse(localStorage.getItem("produit"));

const displayProduitsPanier = document.getElementById("container");

if (produitRegisterLS === null) {
    const panierEmpty =
        `
<div class="Empty">
    <p>Le panier est vide</p>
</div>
`;
    displayProduitsPanier.innerHTML = panierEmpty;
}
else {
    let produitsPanier = [];

    for (j = 0; j < produitRegisterLS.length; j++) {
        produitsPanier = produitsPanier +
            `
    <div class="insertProduct">
        <img class="col-2 small-img" src=${produitRegisterLS[j].imageCamera} alt="Photo camera">
        <div class="col-2">${produitRegisterLS[j].nomCamera}</div>
        <div class="col-2">${produitRegisterLS[j].optionCamera}</div>
        <div class="col-2">${produitRegisterLS[j].prix} €</div>
        <div class="col-2"><button class="Delete">Retirer le produit du panier<i class="fas fa-trash-alt"></i></button></div>
    </div>
    `;
    }
    if (j == produitRegisterLS.length) {
        displayProduitsPanier.innerHTML = produitsPanier;
    }
}

const btnDelete = document.getElementsByClassName("Delete");
let currentOrder = JSON.parse(localStorage.getItem("produit"));

for (let k = 0; k < btnDelete.length; k++) {
    btnDelete[k].addEventListener("click", (event) => {
        // event.preventDefault();
        let productDelete = produitRegisterLS[k].nomCamera;

        produitRegisterLS.splice(produitRegisterLS.map(produit => produit.nomCamera).indexOf(productDelete), 1)
        localStorage.setItem("produit", JSON.stringify(produitRegisterLS));
        window.location.href = "panier.html";
    })
}

const finalPrice = produitRegisterLS.reduce((acc, cur) => acc + cur.prix, 0)

const selectForFinalPrice = document.getElementById("Price");

const displayFinalPrice = `
<div class="PrixFinal">Le montant total à payer est de : ${finalPrice} €</div>
`
selectForFinalPrice.innerHTML = displayFinalPrice;



const settingForm = () => {
    const selectForm = document.getElementById("Form");
    const htmlForm = `
        <div id="Formulaire">
            <form>
                    <label for="firstName">Prénom</label>
                    <input id="firstName" type="text" placeholder="Prénom" name="firstName" required>
                    <div id="errorPrenom" class="errors"></div>
                    <label for="lastName">Nom</label>
                    <input id="lastName" type="text" placeholder="Nom" name="lastName" required>
                    <div id="errorNom" class="errors"></div>
                    <label for="address">Adresse</label>
                    <textarea name="address" placeholder="Adresse" id="address" cols="20" rows="2" required></textarea>
                    <div id="errorAddress" class="errors"></div>
                    <label for="city">Ville</label>
                    <input id="city" type="text" placeholder="Ville" name="city" required>
                    <div id="errorCity" class="errors"></div>
                    <label for="email">E-mail</label>
                    <input id="email" type="text" placeholder="E-mail" name="email" required>
                    <div id="errorMail" class="errors"></div>
                    <button id="SendForm" class="btn btn-primary" type="submit" name="SendForm">Valider la commande</button>      
            </form>
        </div>
        
    `
    selectForm.insertAdjacentHTML("afterbegin", htmlForm)
}
settingForm();

const selectSendForm = document.getElementById("SendForm");

selectSendForm.addEventListener("click", (event) => {
    event.preventDefault();

    const formValues = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        email: document.getElementById("email").value
    }


    function prenomCTRL() {
        const recupPrenom = formValues.firstName;
        if (/^[A-Z a-z]{3,25}$/.test(recupPrenom)) {
            document.getElementById("errorPrenom").textContent = ""
            return true;
        }
        else {
            document.getElementById("errorPrenom").textContent = "Erreur de saisie"
            return false;
        };
    }

    function nomCTRL() {
        const recupNom = formValues.lastName;
        if (/^[A-Z a-z]{3,25}$/.test(recupNom)) {
            document.getElementById("errorNom").textContent = ""
            return true;
        }
        else {
            document.getElementById("errorNom").textContent = "Erreur de saisie"
            return false;
        };
    }


    function mailCTRL() {
        const recupMail = formValues.email;
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(recupMail)) {
            document.getElementById("errorMail").textContent = ""
            return true;
        }
        else {
            document.getElementById("errorMail").textContent = "Erreur de saisie"
            return false;
        };
    }

    function addressCTRL() {
        const recupAddress = formValues.address;
        if (/^[a-zA-Z0-9\s,.'-]{3,}$/.test(recupAddress)) {
            document.getElementById("errorAddress").textContent = ""
            return true;
        }
        else {
            document.getElementById("errorAddress").textContent = "Erreur de saisie"
            return false;
        };
    }

    function cityCTRL() {
        const recupCity = formValues.city;
        if (/^[a-zA-Z\u0080-\u024F\s\/\-\)\(\`\.\"\']+$/.test(recupCity)) {
            document.getElementById("errorCity").textContent = ""
            return true;
        }
        else {
            document.getElementById("errorCity").textContent = "Erreur de saisie"
            return false;
        };
    }

    if (prenomCTRL() && nomCTRL() && addressCTRL() && cityCTRL() && mailCTRL()) {
        localStorage.setItem("formValues", JSON.stringify(formValues));
    }
    else {
        return false;
    }

    let products = produitRegisterLS.map(product => product.id);

    const order = {
        contact: {
            firstName: formValues.firstName,
            lastName: formValues.lastName,
            address: formValues.address,
            city: formValues.city,
            email: formValues.email,
        },
        products: products,

    }


    const postDatasServer = fetch("http://localhost:3000/api/cameras/order",
        {
            method: "POST",
            body: JSON.stringify(order),
            headers: { "Content-Type": "application/json" },
        }
    )
        .then((response) => response.json())
        .then((json) => {
            localStorage.clear();
            localStorage.setItem("orderId", json.orderId)
            localStorage.setItem("pricePaid", finalPrice)
            document.location.href = "validation.html";
        })
        .catch((e) => {
            alert('Nous avons recontré un problème : Veuillez nous excuser');
        })

});