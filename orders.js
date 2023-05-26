const toggle = document.querySelector('.toggle');
const main = document.querySelector('.main');
const navigation = document.querySelector('.navigation');
const ordersContainer = document.querySelector('.ordersContainer')
const footer= document.getElementsByTagName("footer")[0];
const addProductContainer = document.querySelector('.addProductContainer')


//////     toggle active   ///////////////
toggle.onclick = function () {
    main.classList.toggle('active');
    navigation.classList.toggle('active');
    footer.classList.toggle('active');
  };
  const addNewProductBtn=document.querySelector(".addProd")
  const addNewProductFrame=document.querySelector(".addFrame")
  addNewProductFrame.style.gridTemplateColumns="none"
  
  //////// toggle button   //////////////////////////////////
  addNewProductBtn.onclick = function () {
  addNewProductFrame.classList.toggle('active');
  addNewProductBtn.textContent = addNewProductBtn.textContent=='Close'? 'Add New Order':"Close";
  }
  
    ///////Connection with server
let orders=[]
let headers = new Headers();
headers.set(
  'Authorization',
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NGQzM2VmNDdiYmY3NTVmMGE4NGMxZCIsImlhdCI6MTY4MzM5MzEyOSwiZXhwIjoxNjg1OTg1MTI5fQ.FU3qSmdG9MUW-min_wfSqD76i-QfKMjI6TzBCKTpQZ8'
);
headers.set("Content-Type","application/json")
  ///////get products//////
  async function getProducts() {
    const response = await fetch('http://127.0.0.1:3000/api/products', {
      method: 'GET',
      headers: headers,
    });
    const jsonData = await response.json();
    console.log(jsonData);
    products=[...jsonData.data.products]
    console.log(products);
    products.map(product =>{
  
      addProductContainer.innerHTML+=`<div class="product" id=${product._id}>
      <img src=${product.coverImg||'https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png'} alt="">
      <div class="productDetails">
        <div>${product.name}</div>
        <div>${product.category||"Others"}</div>
        <div>${product.price} $</div>
        <div>${product.amount||0} on stock</div>
      </div>
    </div>`;
    })
      ///////select button////////
 let myProducts=document.getElementsByClassName('product');
 console.log(myProducts);
 for(let i=0; i<myProducts.length; i++){
    myProducts[i].addEventListener('click', function(){
        let selected = document.getElementsByClassName('select')
        if(selected.length==0)this.classList.add('select')
        else{
            if(selected[0]==this)this.classList.remove('select')
            else {
                selected[0].classList.remove('select')
                this.classList.add('select')
            }
        }
          })
 }
 }

  getProducts();
/////////get orders ///////////
async function getOrders() {
  const response = await fetch('http://127.0.0.1:3000/api/orders', {
    method: 'GET',
    headers: headers,
  });
  const jsonData = await response.json();
  console.log(jsonData);
  orders=[...jsonData.data.orders]
  console.log(jsonData.results);
  const numOrders=document.querySelector(".ordersHeader p:last-child")
  numOrders.innerHTML=`(${jsonData.results} orders)`
  console.log(orders);
  orders.map(order =>{
    console.log(order._id);
    let dat=order.addDate.split("T")[0]
    ordersContainer.innerHTML+=`<div class="order">
     <img src="profile.png"><p>${order.product.name}</p>
     <P id="${order._id}status">${order.Status}</P>
     <button id="${order._id}">Wait</button>
     <button id="${order._id}">${order.Status=="Cancel"?"Remove":"Cancel"}</button>
     <button id="${order._id}">Done</button>
     <p>${order.product.price} $</p><p>${dat}</p>
 </div>`;
  })

  //////// UPDATE ORDER //////////////
  let btns= document.querySelectorAll(".order button")
  console.log(btns);
btns.forEach((btn)=>{
    btn.addEventListener("click",async()=>{
        if(btn.innerHTML=="Remove"){
            const response= await fetch(`http://127.0.0.1:3000/api/orders/${btn.id}`,{
                method:"DELETE",
                headers:headers,
            })

            if(response.status==204)location.reload();
        // if(jsonData.status=="success")console.log("success");
        }
        else{
        const response = await fetch(`http://127.0.0.1:3000/api/orders/${btn.id}`, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify({Status:btn.innerHTML})
        });
        const jsonData = await response.json();
        
        if(jsonData.status=="success"){
             document.getElementById(`${btn.id}status`).innerHTML=btn.innerHTML
             document.getElementById(`${btn.id}status`).nextElementSibling.nextElementSibling.innerHTML="Cancel"
            }
            if(btn.innerHTML=="Cancel")btn.innerHTML="Remove";
    }
    })
})
}
getOrders();
async function addOrder(data) {
//  let data={
//     name:"shoes",
//     price:100,
//     amount:10
//  }

  const response = await fetch('http://127.0.0.1:3000/api/orders', {
    method: 'POST',
    headers: headers,  
    body: JSON.stringify(data)
  });
  const jsonData = await response.json();
  if(jsonData.status=="success")location.reload();
}
///////// add Order
const addBtn= document.querySelector("#formAdd")
addBtn.onclick=function(){
  let newOrderData={};
  newOrderData.product=document.querySelector(".select").id;
  console.log(newOrderData);
   addOrder(newOrderData)
}

