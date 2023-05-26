const toggle = document.querySelector('.toggle');
const main = document.querySelector('.main');
const navigation = document.querySelector('.navigation');
const ordersContainer = document.querySelector('.ordersContainer')
const footer= document.getElementsByTagName("footer")[0];
const reportsContainer=document.querySelector('.reportsContainer')
//////     toggle active   ///////////////
toggle.onclick = function () {
    main.classList.toggle('active');
    navigation.classList.toggle('active');
    footer.classList.toggle('active');
  };
  ////// date validate   ////////////
  let dateValidate= function(day=0, month=0, year=0) {
    let date= new Date();
    let validationDate={
    year:Number(date.toLocaleDateString().split('/')[2])-year,
    month:Number(date.toLocaleDateString().split('/')[0])-month,
    day:Number(date.toLocaleDateString().split('/')[1])-day
}
    if (validationDate.day <= 0) {
        validationDate.day += 30;
        validationDate.month -= 1;
      }
      if (validationDate.month <= 0) {
        validationDate.month += 12;
        validationDate.year -= 1;
      }
      return validationDate
  }
  ///////Connection with server
  let orders=[]
  let headers = new Headers();
  headers.set(
    'Authorization',
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NGQzM2VmNDdiYmY3NTVmMGE4NGMxZCIsImlhdCI6MTY4MzM5MzEyOSwiZXhwIjoxNjg1OTg1MTI5fQ.FU3qSmdG9MUW-min_wfSqD76i-QfKMjI6TzBCKTpQZ8'
  );
  headers.set("Content-Type","application/json")
  async function getOrders(from=0,to=null) {
      console.log("getttting");
    if(to==null){
      let toDate=new Date();
        to={
            year:Number(toDate.toLocaleDateString().split('/')[2]),
             month:Number(toDate.toLocaleDateString().split('/')[0]),
             day:Number(toDate.toLocaleDateString().split('/')[1])
        }
    }
    let toTotalHours =
    to.year * 12 * 30 * 24 + to.month * 30 * 24 + to.day * 24;
    let fromTotalHours = from ;
    if(from!=0){
      fromTotalHours=  from.year * 12 * 30 * 24 + from.month * 30 * 24 + from.day * 24;
    }
    console.log(from);
    console.log(to);

    const response = await fetch(`http://127.0.0.1:3000/api/orders/done?from=${fromTotalHours}&to=${toTotalHours}`, {
      method: 'GET',
      headers: headers,

    });
    const jsonData = await response.json();
    console.log(jsonData);
    let reports = [];
    for(let i = 0; i < jsonData.data.length; i++) {
        let x= Object.assign(jsonData.data[i],jsonData.products[i])
        console.log(x);
        reports.push(x)
    }
    console.log(reports);
    let reportP='reports'
    if(reports.length<2)reportP='report'
    document.querySelector('.ordersHeader p:nth-child(2)').innerHTML=`(${reports.length} ${reportP})`
//     orders=[...jsonData.data.orders]
//     console.log(jsonData.results);
//     const numOrders=document.querySelector(".ordersHeader p:last-child")
//     numOrders.innerHTML=`(${jsonData.results} orders)`
//     console.log(orders);

reportsContainer.innerHTML=`<div class="oneReport orderHeader">
<div>Product</div>
<div>Category</div>
<div>Price</div>
<div>Discount</div>
<div>Amount</div>
<div>Total</div>
</div>`; 
    reports.map(report =>{
      console.log(report._id);
      if(!report.discount)report.discount=0
       report.total=(report.price-report.discount)*report.quantity
       console.log(report.total);
    //   let dat=order.addDate.split("T")[0]
    reportsContainer.innerHTML+=`<div class="report">
      <div class="oneReport">
      <div class="productReport"><img src=${report.coverImg || "profile.png"} ><p>${report.name}</p></div>
      <div>${report.category || "Other"}</div>
      <div>${report.price} $</div>
      <div>${report.discount}</div>
      <div>${report.quantity}</div>
      <div>${report.total} $</div>
    </div>`;
    })
//     //////// UPDATE ORDER //////////////
//     let btns= document.querySelectorAll(".order button")
//     console.log(btns);
//   btns.forEach((btn)=>{
//       btn.addEventListener("click",async()=>{
//           if(btn.innerHTML=="Remove"){
//               const response= await fetch(`http://127.0.0.1:3000/api/orders/${btn.id}`,{
//                   method:"DELETE",
//                   headers:headers,
//               })
  
//               if(response.status==204)location.reload();
//           // if(jsonData.status=="success")console.log("success");
//           }
//           else{
//           const response = await fetch(`http://127.0.0.1:3000/api/orders/${btn.id}`, {
//           method: 'PATCH',
//           headers: headers,
//           body: JSON.stringify({Status:btn.innerHTML})
//           });
//           const jsonData = await response.json();
          
//           if(jsonData.status=="success"){
//                document.getElementById(`${btn.id}status`).innerHTML=btn.innerHTML
//                document.getElementById(`${btn.id}status`).nextElementSibling.nextElementSibling.innerHTML="Cancel"
//               }
//               if(btn.innerHTML=="Cancel")btn.innerHTML="Remove";
//       }
//       })
//   })
  }
//   getOrders("today");

// getOrders(dateValidate(2));
getOrders()

///////// Sorting by Date ///////////
 const dateButton=document.querySelector('.date') 
 const dateList=document.querySelector('.sortByDate') 
 dateButton.onclick=function(){
    dateList.classList.toggle("active");
 }
 const fromBeginning=document.querySelector('.fromBeginning');
 fromBeginning.onclick=function(){
    getOrders()
    dateList.classList.toggle("active");
    dateButton.innerHTML='From Beginning'
 } 
 const today=document.querySelector('.today');
 today.onclick=function(){
    getOrders(dateValidate(1))
    dateList.classList.toggle("active");
    dateButton.innerHTML='Today'
 } 
 const yesterday=document.querySelector('.yesterday');
 yesterday.onclick=function(){
    getOrders(dateValidate(2),dateValidate(1))
    dateList.classList.toggle("active");
    dateButton.innerHTML='Yesterday'
 } 
 const lastWeek=document.querySelector('.lastWeek');
 lastWeek.onclick=function(){
    getOrders(dateValidate(7))
    dateList.classList.toggle("active");
    dateButton.innerHTML='Last Week'
 } 
 const lastMonth=document.querySelector('.lastMonth');
 lastMonth.onclick=function(){
    let from=dateValidate(0,1)
    from.day=1
    let to = dateValidate()
    to.day=1 
    getOrders(from,to)
    dateList.classList.toggle("active");
    dateButton.innerHTML='Last Month'
 } 
 const lastYear=document.querySelector('.lastYear');
 lastYear.onclick=function(){
    let from=dateValidate(0,0,1)
    from.day=1
    from.month=1
    let to = dateValidate()
    to.day=1
    to.month=1
    getOrders(from,to)
    dateList.classList.toggle("active");
    dateButton.innerHTML='Last Year'
 } 