document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('productForm');
    const productsTableBody = document.querySelector('#productsTable tbody');
    const searchBar = document.getElementById('searchBar');
    const removeButton = document.getElementById('removeButton');
    const sortAsc = document.getElementById('sortAsc');
    const sortDesc = document.getElementById('sortDesc');
    const editButton = document.getElementById('editButton');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const product = {
            codigo: document.getElementById('codigo').value,
            fabricantePlacaMae: document.getElementById('fabricantePlacaMae').value,
            memoriaRAM: document.getElementById('memoriaRAM').value,
            velocidadeProcessador: document.getElementById('velocidadeProcessador').value,
            fabricanteProcessador: document.getElementById('fabricanteProcessador').value,
            nucleosProcessador: document.getElementById('nucleosProcessador').value,
            capacidadeSSD: document.getElementById('capacidadeSSD').value
        };

        const products = JSON.parse(localStorage.getItem('products')) || [];
        products.push(product);
        localStorage.setItem('products', JSON.stringify(products));

        addProductToTable(product);

        form.reset();
        alert('Produto cadastrado com sucesso!');
    });

    function addProductToTable(product) {
        const row = document.createElement('tr');

        for (const key in product) {
            const cell = document.createElement('td');
            cell.textContent = product[key];
            row.appendChild(cell);
        }

        productsTableBody.appendChild(row);
    }

    function loadProductsFromStorage() {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        products.forEach(product => addProductToTable(product));
    }

    function searchProducts() {
        const query = searchBar.value.toLowerCase();
        const rows = productsTableBody.querySelectorAll('tr');

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const matches = Array.from(cells).some(cell => cell.textContent.toLowerCase().includes(query));
            row.style.display = matches ? '' : 'none';
        });
    }

    function removeProduct() {
        const codigoToRemove = prompt('Digite o código do produto que deseja remover:');
        if (codigoToRemove) {
            let products = JSON.parse(localStorage.getItem('products')) || [];
            products = products.filter(product => product.codigo !== codigoToRemove);
            localStorage.setItem('products', JSON.stringify(products));

            while (productsTableBody.firstChild) {
                productsTableBody.removeChild(productsTableBody.firstChild);
            }
            loadProductsFromStorage();
        }
    }

    function sortProducts(order, field) {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        if (field) {
            products.sort((a, b) => {
                if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
                if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
                return 0;
            });
            localStorage.setItem('products', JSON.stringify(products));

            while (productsTableBody.firstChild) {
                productsTableBody.removeChild(productsTableBody.firstChild);
            }
            loadProductsFromStorage();
        }
    }

    function editProduct() {
        const codigoToEdit = prompt('Digite o código do produto que deseja editar:');
        if (codigoToEdit) {
            let products = JSON.parse(localStorage.getItem('products')) || [];
            const product = products.find(product => product.codigo === codigoToEdit);
            if (product) {
                const fieldToEdit = prompt('Digite o campo que deseja editar (codigo, fabricantePlacaMae, memoriaRAM, velocidadeProcessador, fabricanteProcessador, nucleosProcessador, capacidadeSSD):');
                if (fieldToEdit && product.hasOwnProperty(fieldToEdit)) {
                    const newValue = prompt(`Digite o novo valor para ${fieldToEdit}:`);
                    if (newValue) {
                        product[fieldToEdit] = newValue;
                        localStorage.setItem('products', JSON.stringify(products));

                        while (productsTableBody.firstChild) {
                            productsTableBody.removeChild(productsTableBody.firstChild);
                        }
                        loadProductsFromStorage();
                    }
                } else {
                    alert('Campo inválido!');
                }
            } else {
                alert('Produto não encontrado!');
            }
        }
    }

    searchBar.addEventListener('input', searchProducts);
    removeButton.addEventListener('click', removeProduct);
    sortAsc.addEventListener('change', () => sortProducts('asc', sortAsc.value));
    sortDesc.addEventListener('change', () => sortProducts('desc', sortDesc.value));
    editButton.addEventListener('click', editProduct);
    loadProductsFromStorage();
});
