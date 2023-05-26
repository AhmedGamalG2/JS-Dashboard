const toggle = document.querySelector('.toggle');
const main = document.querySelector('.main');
const navigation = document.querySelector('.navigation');
const productContainer = document.querySelector('.productContainer')
const footer= document.getElementsByTagName("footer")[0];
//////     toggle active   ///////////////
toggle.onclick = function () {
  main.classList.toggle('active');
  navigation.classList.toggle('active');
  footer.classList.toggle('active');
};
const addNewProductBtn=document.querySelector(".addProd")
const addNewProductFrame=document.querySelector(".addFrame")

//////// toggle button   //////////////////////////////////
addNewProductBtn.onclick = function () {
addNewProductFrame.classList.toggle('active');
addNewProductBtn.textContent = addNewProductBtn.textContent=='Close'? 'Add New Product':"Close";
}

////////// add image //////////////////////////////////
const image= document.querySelector("#img");
const newImg=document.querySelector(".newImg")

image.onchange=function () {
var fReader = new FileReader();
console.log(fReader);
fReader.readAsDataURL(image.files[0]);
fReader.onloadend = function(event){
    newImg.src = event.target.result;
}}

///////Connection with server
let products=[]
let headers = new Headers();
headers.set(
  'Authorization',
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NGQzM2VmNDdiYmY3NTVmMGE4NGMxZCIsImlhdCI6MTY4MzM5MzEyOSwiZXhwIjoxNjg1OTg1MTI5fQ.FU3qSmdG9MUW-min_wfSqD76i-QfKMjI6TzBCKTpQZ8'
);
headers.set("Content-Type","application/json")
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

    productContainer.innerHTML+=`<div class="product">
    <img src=${product.coverImg||'https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png'} alt="">
    <div class="productDetails">
      <div>${product.name}</div>
      <div>${product.category||"Others"}</div>
      <div>${product.price} $</div>
      <div>${product.amount||0} on stock</div>
    </div>
  </div>`;
  })
}
getProducts();
async function addProduct(data) {
//  let data={
//     name:"shoes",
//     price:100,
//     amount:10
//  }
 console.log(JSON.stringify(data));
  const response = await fetch('http://127.0.0.1:3000/api/products', {
    method: 'POST',
    headers: headers,  
    body: JSON.stringify(data)
  });
  const jsonData = await response.json();
  console.log(jsonData);
}

///////// add Product
const addBtn= document.querySelector("#formAdd")
addBtn.onclick=function(){
  let newProductData={};
  newProductData.name=document.querySelector("#name").value;
  newProductData.category=document.querySelector("#cat").value;
  newProductData.price=document.querySelector("#price").value*1;
  newProductData.amount=document.querySelector("#amount").value*1;
  newProductData.coverImg=newImg.src
  console.log(newProductData);
  addProduct(newProductData)
}

