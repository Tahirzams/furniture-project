const cartbtn = document.querySelector('.cart-button');
const productcenter = document.querySelector('.product-center');
const cartoverly = document.querySelector('.cart-overly');
const cartdom = document.querySelector('.cart');
const cartclose = document.querySelector('.close-cart');
const cartcontent = document.querySelector('.cart-content');
const removeitem = document.querySelector('.remove-item');
const cartincrease = document.querySelector('.fa-chevron-up');
const cartdecrease = document.querySelector('.fa-chevron-down');
const amount = document.querySelector('.item-amount');
const carttotal = document.querySelector('.cart-total');
const cartclear = document.querySelector('.clear-cart');
const cartitem = document.querySelector('.cart-items');
let cart = [];
let buttonsdom = []

// cartbtn.addEventListener('click', ()=>{
//     cartoverly.classList.toggle('visible')
// })
//get products
class Products {
    async getproducts() {
        try {
            let result = await fetch('file.json');
            let data = await result.json();
            let products = data.items
            products = products.map((item) => {
                const { title, price } = item.fields;

                const { id } = item.sys;
                const image = item.fields.image.fields.file.url;
                return { title, price, id, image }
            })

            return products


        } catch (error) {

        }
    }

}
// display products
class Ui {
    showproducts(products) {
        let result = '';
        products.forEach((products) => {
            result += `
       <article class="product">
                <div class="img-container">
                    <img src=${products.image} alt="product image">
                    <button class="bag-btn" data-id=${products.id}>
         <i class="fas fa-shopping-cart editbtn"> </i>
                        add to bag </button>
                </div>
               
                <h3>${products.title}</h3>
                <h4>$${products.price}</h4>
 
            </article>
       `
        })
        productcenter.innerHTML = result

    }
    getbagbuttons() {
        const buttons = [...document.querySelectorAll('.bag-btn')];
        buttonsdom = buttons;
        buttons.forEach((button) => {
            let id = button.dataset.id;
            let incart = cart.find(item => item.id === id)
            const editbtn = document.querySelector('.editbtn');
            editbtn.disabled = true
        cart.forEach((item)=>{
            console.log(item);
        })
     
            if (incart) {
                button.innerText = 'in cart';
                button.disabled = true;
            }
            button.addEventListener('click', (e) => {
                e.target.innerText = 'in cart';
                e.target.disabled = true;
                //get product from products local storage
                let cartitem = {
                    ...storage.getproduct(id),
                    amount: 1
                };
           
                // add products to the cart
                cart = [...cart, cartitem]
                // save cart in the local storage
                storage.savecart(cart);
                // set cart values
                this.setcartvalues(cart)
                // display cart item
                this.addcartitem(cartitem)
                // show the cart
                this.showcart()
            })
        })
    }
 
    setcartvalues(cart) {
        let temptotal = 0;
        let itemtotal = 0;
        cart.map((item) => {
            temptotal += item.price * item.amount;
            itemtotal += item.amount
        })
        carttotal.innerText = parseFloat(temptotal.toFixed(2))
        cartitem.innerText = itemtotal;
    }
    addcartitem(item) {

     
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
        <div class="imagediv">
         <img src=${item.image} alt="cart image">
         </div>
         <h4>${item.title}</h4>
         <h5>$${item.price}</h5>
     <span class="remove-item" data-id = ${item.id}>remove</span>
     <div class="threebtn">
     <i class="fas fa-chevron-up" data-id = ${item.id}></i>
     <p class="item-amount">${item.amount}</p>
     <i class="fas fa-chevron-down" data-id = ${item.id}></i>
     </div>
         `
        cartcontent.appendChild(div)
    }
    showcart() {
        cartoverly.classList.add('visible')
    }
    //-------while refresh remain the card updated  -----
    setupapp() {
        cart = storage.getcart();
        this.setcartvalues(cart);
        this.populatecard(cart);
        cartbtn.addEventListener('click', this.showcart);
        cartclose.addEventListener('click', this.hidecart)
    }
    populatecard(cart) {
        cart.forEach((item) => {
         this.addcartitem(item)
           
        })
    }
    hidecart() {
        cartoverly.classList.remove('visible')
    }
    //-------cart logic  ----------------------
    //----------------- clear cart button -------------------
    cartlogic() {
        cartclear.addEventListener('click', () => {
            this.clearcart();
        })
        //-------------cart functionality--------------
        // remove 1 by 1 item from cart and local storage
        // and increase and decrease items
        cartcontent.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-item')) {
                let removeitem = e.target;
                let idremoveitem = removeitem.dataset.id;
                cartcontent.removeChild(removeitem.parentElement);
                this.removeitem(idremoveitem);
            } else if (e.target.classList.contains('fa-chevron-up')) {
                let addamount = e.target;
                let id = addamount.dataset.id;
                console.log(id)
                let tempitem = cart.find(item => item.id === id);
                tempitem.amount = tempitem.amount + 1;
                storage.savecart(cart);
                this.setcartvalues(cart);
                addamount.nextElementSibling.innerText = tempitem.amount;
            }
            else if (e.target.classList.contains('fa-chevron-down')) {
                let loweramount = e.target;
                let id = loweramount.dataset.id;
                console.log(cart);
                let tempitem = cart.find(item => item.id === id);
                tempitem.amount = tempitem.amount - 1;
                console.log(tempitem.amount);
                console.log(id);
        if(tempitem.amount > 0) {
            storage.savecart(cart);
            this.setcartvalues(cart);
        loweramount.previousElementSibling.innerText= tempitem.amount;
         }else{
        cartcontent.removeChild(loweramount.parentElement.parentElement);
            this.removeitem(id);
            }
            }
        })
    }

    clearcart() {
        let cartitems = cart.map((item) => {
            return item.id
        })
        cartitems.forEach((id)=>{ this.removeitem(id) })
        console.log(cartcontent.children);
        while (cartcontent.children.length > 0) {
            cartcontent.removeChild(cartcontent.children[0]);
        } this.hidecart()
    }

    removeitem(id) {
        cart = cart.filter(item => item.id !== id)
        this.setcartvalues(cart);
        storage.savecart(cart);
        let button = this.getsinglebutton(id);
        button.disabled = false;
        button.innerHTML = `<i class="fas fa-shopping-cart">
            </i>add to cart `
    }
    getsinglebutton(id) {
        return buttonsdom.find(button => button.dataset.id == id)
    }
}
// local storage
class storage {
    static saveproducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }
    static getproduct(id) {
        let products = JSON.parse(localStorage.getItem("products"));
        return products.find((product) => {
            return product.id === id
        })
    }
    static savecart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    static getcart() {
        return localStorage.getItem('cart') ?
            JSON.parse(localStorage.getItem('cart')) : []
    }
}
// domcontent loaded
document.addEventListener('DOMContentLoaded', () => {
    const products = new Products();
    const ui = new Ui()
    //setupapp
    ui.setupapp();
    //get products
    products.getproducts().then((products) => {
        ui.showproducts(products);
        storage.saveproducts(products);
    }).then(() => {
        ui.getbagbuttons();
        ui.cartlogic();
    })
})
// --------------end of project --------------