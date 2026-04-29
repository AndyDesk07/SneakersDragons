// 1. BASE DE DATOS DE LANZAMIENTOS (AQUÍ ESTÁ EL ARREGLO)
const lib = [
    { name: "Nike Shox Triple Black", img: "https://images.stockx.com/360/Nike-Shox-TL-Black-Metallic-Hematite/Images/Nike-Shox-TL-Black-Metallic-Hematite/Lv2/img01.jpg?auto=compress&w=480" },
    { name: "Jordan 5 Metallic Black", img: "https://images.stockx.com/images/Air-Jordan-5-Retro-Black-Metallic-2016-Product.jpg?auto=compress&w=480" },
    { name: "Nike Air Force 1 White", img: "https://nikeclprod.vtexassets.com/arquivos/ids/160793-1200-1200?v=637654399803530000&width=1200&height=1200&aspect=true" }
];

const modelInput = document.getElementById('model');
const optionsMenu = document.getElementById('select-options');

// Función de alerta arreglada
function showMsg(texto) {
    const alerta = document.getElementById('alert-msg');
    alerta.textContent = "" + texto;
    alerta.style.right = "20px";
    setTimeout(() => { alerta.style.right = "-400px"; }, 2500);
}

// Sugerencias de solo texto
modelInput.onclick = () => optionsMenu.classList.add('active');
lib.forEach(item => {
    const div = document.createElement('div');
    div.className = 'option-item';
    div.textContent = item.name;
    div.onclick = (e) => {
        modelInput.value = item.name;
        optionsMenu.classList.remove('active');
        e.stopPropagation();
    };
    optionsMenu.appendChild(div);
});

window.onclick = (e) => { if (e.target !== modelInput) optionsMenu.classList.remove('active'); };

// 2. LLUVIA VISUAL
const canvas = document.getElementById('sneaker-rain');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth; canvas.height = window.innerHeight;
let particles = [];
for(let i=0; i<20; i++) {
    particles.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height, s: Math.random()*2+2, e: ['👟','🔥','🐉'][Math.floor(Math.random()*3)] });
}
function anim() {
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.font = "25px Arial";
    particles.forEach(p => { ctx.fillText(p.e, p.x, p.y); p.y += p.s; if(p.y > canvas.height) p.y = -30; });
    requestAnimationFrame(anim);
}
anim();

// 3. INVENTARIO (NUEVA LÓGICA DE FOTOS)
let inventory = [];
const form = document.getElementById('sneaker-form');
const list = document.getElementById('inventory-list');

const render = () => {
    list.innerHTML = '';
    inventory.forEach((item, index) => {
        // --- ARREGLO DE LA FOTO ---
        // Ahora buscamos coincidencias más específicas (ej: "Jordan 1" o "Jordan 5")
        const nameLower = item.model.toLowerCase();
        let found = null;

        if (nameLower.includes("jordan 1")) {
            found = lib.find(s => s.name.includes("Jordan 1"));
        } else if (nameLower.includes("jordan 5")) {
            found = lib.find(s => s.name.includes("Jordan 5"));
        } else if (nameLower.includes("shox")) {
            found = lib.find(s => s.name.includes("Shox"));
        } else if (nameLower.includes("force 1")) {
            found = lib.find(s => s.name.includes("Air Force 1"));
        }

        const imgUrl = found ? found.img : "https://via.placeholder.com/150/111/ff0000?text=SNEAKER";
        // --- FIN DEL ARREGLO ---

        const card = document.createElement('div');
        card.className = 'sneaker-card';
        card.innerHTML = `
            <div class="sneaker-img-container"><img src="${imgUrl}" class="sneaker-img"></div>
            <h3>${item.model}</h3>
            <span class="valor-precio">$${Number(item.price).toLocaleString('es-CL')}</span>
            <p>Stock: ${item.stock} | ${item.category}</p>
            <div class="btn-group">
                <button class="btn-action btn-edit" onclick="edit(${index})">EDITAR</button>
                <button class="btn-action btn-delete" onclick="del(${index})">BORRAR</button>
            </div>`;
        list.appendChild(card);
    });
};

form.onsubmit = (e) => {
    e.preventDefault();
    const idx = parseInt(document.getElementById('edit-index').value);
    const data = {
        model: modelInput.value,
        price: document.getElementById('price').value,
        stock: document.getElementById('stock').value,
        category: document.getElementById('category').value
    };

    if(idx === -1) {
        inventory.push(data);
        showMsg("PRODUCTO AGREGADO CON EXITO!🔥");
    } else {
        inventory[idx] = data;
        document.getElementById('edit-index').value = "-1";
        document.getElementById('btn-add').textContent = "AGREGAR AL STOCK";
        showMsg("CAMBIOS REALIZADOS CON EXITO!🔥");
    }

    form.reset();
    render();
};

window.edit = (i) => {
    const item = inventory[i];
    modelInput.value = item.model;
    document.getElementById('price').value = item.price;
    document.getElementById('stock').value = item.stock;
    document.getElementById('category').value = item.category;
    document.getElementById('edit-index').value = i;
    document.getElementById('btn-add').textContent = "GUARDAR CAMBIOS";
    window.scrollTo({top: 0, behavior: 'smooth'});
};

window.del = (i) => { 
    if(confirm('¿Estas seguro que quieres eliminar este producto del stock actual?')) { 
        inventory.splice(i,1); 
        render(); 
        showMsg("PRODUCTO ELIMINADO CON EXITO!🔥");
    } 
};