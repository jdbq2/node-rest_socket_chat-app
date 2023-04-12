const formulario = document.querySelector("form");

function handleCredentialResponse(response) {
    const body = { id_token: response.credential };
    fetch("http://localhost:8080/api/auth/google", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })
        .then((resp) => resp.json())
        .then((resp) => {
            console.log(resp);
            localStorage.setItem("email", resp.usuario.correo);
            localStorage.setItem("token", resp.token);
            window.location = "chat.html";
        })
        .catch((err) => console.warn(err));
}

document.getElementById("google_sign_out").addEventListener("click", () => {
    console.log(google.accounts.id);
    google.accounts.id.disableAutoSelect();
    google.accounts.id.revoke(localStorage.getItem("email"), (done) => {
        localStorage.clear();
        location.reload();
    });
});

formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = {};
    for (const el of formulario.elements) {
        if (el.name.length > 0) {
            formData[el.name] = el.value;
        }
    }

    fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((resp) => {
            return resp.json();
        })
        .then((data) => {
            localStorage.setItem("token", data.token);
            window.location = "chat.html";
        })
        .catch((err) => console.log(err));
});
