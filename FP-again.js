let shoppingicon = document.querySelector('.shopping-icon');
let itemcount = document.querySelector('.itemCount');
let prodmain = document.querySelector('.productsmain');
let productsdiv = document.querySelector('.productsdiv');
let cartmain = document.querySelector('.cartmain');
let cartoverly = document.querySelector('.cartoverly');
let exitbtn = document.querySelector('.exit-btn');
let cartproduct = document.querySelector('.cartproduct');
let arrowup = document.querySelector('.fa-arrow-up');
let arrowdown = document.querySelector('.fa-arrow-down');
let itemremove = document.querySelector('.itemremove');
let cartitemcount = document.querySelector('.cartitemcount');
let grandtotal = document.querySelector('.total');
let cartclear = document.querySelector('.cartclear');
let cart = [];
let buttondom = [];

class Products{
   async addproducts(){
     let product = await fetch('file.json');
     let data = await product.json()
     let items= data.items
     let  products =  items.map((item)=>{
     let title = item.fields.title;
     let id = item.sys.id;
     let price = item.fields.price;
     let image = item.fields.image.fields.file.url;
    return {title,price, id , image}
     })
    return products
   
    }
 
   

}

class Ui{
    setproducts(products){
      products.forEach((item)=>{
        productsdiv.innerHTML += 
    `
        <div class="product">
        <div class="image">
        <img class='image' src='${item.image}' alt='products'>
        <button class="add-to-cart cartbtn" data-id=${item.id}>
        <i class="fas fa-shopping-cart "> </i>
        add to bag </button>
        </div>
        <div class='title'>${item.title}</div>
        <div class='price'>${item.price}</div>
        </div>
    `
      })
       exitbtn.addEventListener('click' , ()=>{
      cartmain.classList.add('hidecart')
    })

      shoppingicon.addEventListener("click" , ()=>{
        cartmain.classList.toggle('hidecart')
    })

    }
addtocartbutton(){
    let cartbutton = [...document.querySelectorAll('.cartbtn')];
   buttondom = cartbutton
    cartbutton.forEach((button)=>{
    let id = button.dataset.id;
    let incart = cart.find((item)=>{
        return item.id == id
    })
    if(incart){
        button.disabled = true;
        button.innerHTML = `In cart`
    }
    button.addEventListener('click' , (e)=>{
    e.target.disabled = true;
    e.target.innerHTML = `incart`
    let getproducts = {...Storage.getproducts(id), amount:1}
    cart = [...cart ,  getproducts];
    this.setcartvalues(cart)
    this.addcartitems(getproducts)
    this.showcart()
    Storage.savecart(cart)
    })
    })
   
}
showcart(){
    cartmain.classList.remove('hidecart')
}
addcartitems(cart){
   cartproduct.innerHTML += 
   `
        <div class='productdiv'>
        <div className="imagediv">
        <img class='cartimage' src='${cart.image}'>
        </div>
        <div class='cartitem'>${cart.title}</div>
        <div class='cartprice'>${cart.price}</div>
        <div class='itemremove' id =${cart.id}>remove</div>
        <div class='threebtn'>
        <i class="fas fa-chevron-up" data-id = ${cart.id}></i>
        <p class="item-amount">${cart.amount}</p>
        <i class="fas fa-chevron-down" data-id = ${cart.id}></i>
        </div>
        </div>
    `
}
setcartvalues(cart){
    let temptotal = 0;
    let tempcount = 0
    cart.forEach((item)=>{
    tempcount+= item.amount;
    temptotal+= item.price * item.amount 
    })
    grandtotal.innerHTML = `$ ${temptotal}`;
    itemcount.innerHTML = tempcount
  
}
cartclear(){
 cartclear.addEventListener('click',()=>{
     this.cartempty(cart)
 }) 

}
cartempty(cart){
  cart.forEach((item)=>{
      let id = item.id;
     this.removeitem(id)
    cartproduct.removeChild(cartproduct.children[0])
  })

}
removeitem(id){
    cart = cart.filter((item)=>{
        return item.id !== id
    })
    Storage.savecart(cart);
    this.setcartvalues(cart)
    buttondom.forEach((btn)=>{
      if(btn.dataset.id == id){
          btn.innerHTML = `
          <i class="fas fa-shopping-cart "> </i>
          add to cart     `
            btn.disabled = false
      }
    })
   
}
cartlogic(){
    cartproduct.addEventListener('click', (e)=>{
      if(e.target.classList.contains('itemremove')){
       let remove = e.target;
       let id = remove.id;
       this.removeitem(id);
       cartproduct.removeChild(remove.parentElement)
       }else if(e.target.classList.contains('fa-chevron-up')){
           let up= e.target;
           let id = up.dataset.id;
           let tempam = 0
    cart.map((item)=>{
       if(item.id == id){
        item.amount+= 1
        tempam = item.amount
        }   
    })
        this.setcartvalues(cart)
        Storage.savecart(cart)
        console.log(cart);
        up.nextElementSibling.innerHTML = tempam     
        }else if(e.target.classList.contains('fa-chevron-down')){
           let down = e.target;
           let id = down.dataset.id;
           let amount = 0
           cart.map((item)=>{
               console.log(cart);
               if(item.id == id){ 
                item.amount-= 1
               if(item.amount > 0){
                amount =   item.amount ;
               }else{
                   this.removeitem(id)
                   cartproduct.removeChild(down.parentElement.parentElement)
               }
               }
           })
           console.log(cart);
           this.setcartvalues(cart)
           Storage.savecart(cart)
           down.previousElementSibling.innerHTML = amount
       }
    })
}
setdatawhilerefresh(){
    cart = Storage.getcart(cart);
    this.setcartvalues(cart);
    this.pop(cart)
}
pop(cart){
    cart.map((item)=>{
        this.addcartitems(item)
    })
}

}
class Storage{
    static saveproducts(products){
     return   localStorage.setItem('products' , JSON.stringify(products))
    }
    static getproducts(id){
    let products = JSON.parse(localStorage.getItem('products'));
    return products.find((item)=>{
        return item.id === id
    })
    }
    static savecart(cart){
        localStorage.setItem('cart' , JSON.stringify(cart))
    }
    static getcart(){
        return localStorage.getItem('cart')? 
       JSON.parse(localStorage.getItem('cart')) : []
    }
}
document.addEventListener('DOMContentLoaded' ,()=>{

let productsclass = new Products()
let ui = new Ui()
ui.setdatawhilerefresh()

productsclass.addproducts().then((products)=>{
   Storage.saveproducts(products)
   ui.setproducts(products)
}).then(()=>{
    ui.addtocartbutton();
    ui.cartclear();
    ui.cartlogic()
})


} )