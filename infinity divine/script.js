const defaultProducts = [
  {id:1,name:'Rose Quartz Heart Bracelet',category:'Love',price:1299,color:'#d99ca8',type:'bracelet',desc:'For compassion, harmony & gentle self-love',badge:'Bestseller'},
  {id:2,name:'Black Tourmaline Bracelet',category:'Protection',price:1499,color:'#252331',type:'bracelet',desc:'For grounding and energetic protection',badge:'New'},
  {id:3,name:'Citrine Abundance Bracelet',category:'Abundance',price:1699,color:'#d09a3d',type:'bracelet',desc:'For confidence, joy & prosperity'},
  {id:4,name:'Amethyst Point',category:'Clarity',price:1899,color:'#8d68ab',type:'crystal',desc:'For intuition, calm & a clear mind'},
  {id:5,name:'Moonstone Intuition Bracelet',category:'Clarity',price:1599,color:'#9eb2c7',type:'bracelet',desc:'For intuition and emotional balance'},
  {id:6,name:'Green Aventurine Stone',category:'Healing',price:899,color:'#6b9d7b',type:'crystal',desc:'For renewal, wellbeing & opportunity'},
  {id:7,name:'Tiger Eye Courage Bracelet',category:'Protection',price:1399,color:'#9e6734',type:'bracelet',desc:'For courage, focus & grounded action'},
  {id:8,name:'Clear Quartz Point',category:'Healing',price:1199,color:'#bab9c7',type:'crystal',desc:'For cleansing and amplified intention'}
];
let products = JSON.parse(localStorage.getItem('infinityDivineProducts') || 'null') || defaultProducts;
let cart = JSON.parse(localStorage.getItem('infinityDivineCart') || '[]');
const money = value => `₹${value.toLocaleString('en-IN')}`;
const productGrid = document.querySelector('#productGrid');

function renderProducts(filter='All'){
  const shown = filter === 'All' ? products : products.filter(p => p.category === filter);
  productGrid.innerHTML = shown.map(p => `<article class="product-card">${p.badge?`<span class="badge">${p.badge}</span>`:''}<div class="product-art" style="background:linear-gradient(145deg,${p.color}33,#eee7dd)">${p.image?`<img class="product-image" src="${p.image}" alt="${p.name}">`:`<div class="${p.type}" style="--stone:${p.color}"></div>`}</div><div class="product-info"><small>${p.category}</small><h3>${p.name}</h3><p>${p.desc}</p><div class="product-bottom"><strong>${money(p.price)}</strong><button class="add-cart" data-id="${p.id}">Add to bag +</button></div></div></article>`).join('');
}
function updateCart(){
  cart=cart.filter(id=>products.some(p=>p.id===id));
  localStorage.setItem('infinityDivineCart',JSON.stringify(cart));
  document.querySelector('#cartCount').textContent=cart.length;
  const items=document.querySelector('#cartItems');
  if(!cart.length) items.innerHTML='<div class="empty-cart">Your bag is waiting for a little magic. ✦</div>';
  else items.innerHTML=cart.map((id,i)=>{const p=products.find(x=>x.id===id);return `<div class="cart-item"><div class="cart-thumb" style="background:${p.color}22">${p.type==='crystal'?'♦':'◌'}</div><div><h4>${p.name}</h4><small>${money(p.price)}</small></div><button data-remove="${i}" aria-label="Remove ${p.name}">×</button></div>`}).join('');
  document.querySelector('#cartTotal').textContent=money(cart.reduce((sum,id)=>sum+products.find(p=>p.id===id).price,0));
}
function toast(message){const t=document.querySelector('#toast');t.textContent=message;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2400)}
function openCart(){document.body.classList.add('cart-open');document.querySelector('.cart-drawer').setAttribute('aria-hidden','false')}
function closeCart(){document.body.classList.remove('cart-open');document.querySelector('.cart-drawer').setAttribute('aria-hidden','true')}
function openCheckout(){
  if(!cart.length){toast('Your bag is empty.');return}
  const selected=cart.map(id=>products.find(p=>p.id===id)).filter(Boolean);
  const total=selected.reduce((sum,p)=>sum+p.price,0);
  document.querySelector('#checkoutSummary').innerHTML=selected.map(p=>`<div><span>${p.name}</span><strong>${money(p.price)}</strong></div>`).join('')+`<div class="checkout-total"><span>Total</span><strong>${money(total)}</strong></div>`;
  closeCart();document.querySelector('#checkoutModal').classList.add('open');document.querySelector('#checkoutModal').setAttribute('aria-hidden','false');
}
function closeCheckout(){document.querySelector('#checkoutModal').classList.remove('open');document.querySelector('#checkoutModal').setAttribute('aria-hidden','true')}
async function processOnlinePayment(customer,selected,total){
  const config=window.PAYMENT_CONFIG||{};
  if(!config.razorpayKeyId||!config.createOrderEndpoint){throw new Error('Online payment is awaiting merchant setup. Please choose Cash on Delivery for now.')}
  if(typeof Razorpay==='undefined'){throw new Error('The payment service could not load. Please check your connection and try again.')}
  const response=await fetch(config.createOrderEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items:selected.map(p=>({id:p.id,quantity:1})),customer})});
  if(!response.ok)throw new Error('Unable to start payment. Please try again.');
  const gatewayOrder=await response.json();
  return new Promise((resolve,reject)=>{
    const checkout=new Razorpay({key:config.razorpayKeyId,order_id:gatewayOrder.orderId,amount:gatewayOrder.amount,currency:gatewayOrder.currency||'INR',name:'Infinity Divine',description:'Crystal and bracelet order',prefill:{name:customer.name,contact:customer.phone},theme:{color:'#604473'},handler:resolve,modal:{ondismiss:()=>reject(new Error('Payment was cancelled. Your order has not been placed.'))}});
    checkout.on('payment.failed',()=>reject(new Error('Payment failed. Please try again or choose Cash on Delivery.')));checkout.open();
  });
}
function setFilter(filter){document.querySelectorAll('.filters button').forEach(b=>b.classList.toggle('active',b.dataset.filter===filter));renderProducts(filter)}

document.addEventListener('click',e=>{
  const add=e.target.closest('.add-cart'); if(add){cart.push(Number(add.dataset.id));updateCart();toast('Added to your bag ✦');return}
  const remove=e.target.closest('[data-remove]');if(remove){cart.splice(Number(remove.dataset.remove),1);updateCart();return}
  if(e.target.closest('.cart-button'))openCart();
  if(e.target.closest('.close-cart')||e.target.classList.contains('drawer-backdrop'))closeCart();
  const filter=e.target.closest('[data-filter]');if(filter)setFilter(filter.dataset.filter);
  const filterLink=e.target.closest('[data-filter-link]');if(filterLink)setTimeout(()=>setFilter(filterLink.dataset.filterLink),200);
  if(e.target.closest('.open-booking')){document.querySelector('#bookingModal').classList.add('open');document.querySelector('#bookingModal').setAttribute('aria-hidden','false')}
  if(e.target.closest('.close-modal')||e.target.id==='bookingModal'){document.querySelector('#bookingModal').classList.remove('open');document.querySelector('#bookingModal').setAttribute('aria-hidden','true')}
  if(e.target.closest('.close-checkout')||e.target.id==='checkoutModal')closeCheckout();
  if(e.target.closest('.menu-toggle')){const nav=document.querySelector('.main-nav');nav.classList.toggle('open');e.target.closest('.menu-toggle').setAttribute('aria-expanded',nav.classList.contains('open'))}
  if(e.target.closest('.main-nav a'))document.querySelector('.main-nav').classList.remove('open');
});
document.querySelector('#bookingForm').addEventListener('submit',e=>{
  e.preventDefault();
  const data=new FormData(e.target);
  const bookings=JSON.parse(localStorage.getItem('infinityDivineBookings')||'[]');
  bookings.unshift({
    id:`ID-${Date.now().toString().slice(-6)}`,
    name:data.get('name'),phone:data.get('phone'),session:data.get('session'),date:data.get('date'),
    status:'New',createdAt:new Date().toISOString()
  });
  localStorage.setItem('infinityDivineBookings',JSON.stringify(bookings));
  document.querySelector('#bookingStatus').textContent='Thank you! Your request is received. We’ll contact you shortly. ✦';
  e.target.reset();setTimeout(()=>document.querySelector('#bookingModal').classList.remove('open'),2800)
});
document.querySelector('#newsletterForm').addEventListener('submit',e=>{e.preventDefault();document.querySelector('#newsletterStatus').textContent='You’re in the circle. Welcome ✦';e.target.reset()});
document.querySelector('.checkout').addEventListener('click',openCheckout);
document.querySelector('#checkoutForm').addEventListener('submit',async e=>{
  e.preventDefault();if(!cart.length)return;
  const data=new FormData(e.target);const selected=cart.map(id=>products.find(p=>p.id===id)).filter(Boolean);
  const customer={name:data.get('name'),phone:data.get('phone'),address:data.get('address'),city:data.get('city'),state:data.get('state'),pincode:data.get('pincode')};
  const total=selected.reduce((sum,p)=>sum+p.price,0);let paymentDetails=null;
  if(data.get('payment')==='Online payment'){
    const button=e.target.querySelector('[type="submit"]');button.disabled=true;button.textContent='Opening secure payment…';document.querySelector('#orderStatus').textContent='';
    try{paymentDetails=await processOnlinePayment(customer,selected,total)}catch(error){document.querySelector('#orderStatus').textContent=error.message;button.disabled=false;button.textContent='Place order';return}
    button.disabled=false;button.textContent='Place order';
  }
  const orders=JSON.parse(localStorage.getItem('infinityDivineOrders')||'[]');
  const order={id:`ORD-${Date.now().toString().slice(-7)}`,...customer,payment:data.get('payment'),paymentStatus:paymentDetails?'Paid':'Cash on Delivery',paymentId:paymentDetails?.razorpay_payment_id||'',items:selected.map(p=>({id:p.id,name:p.name,price:p.price})),total,status:'New',createdAt:new Date().toISOString()};
  orders.unshift(order);localStorage.setItem('infinityDivineOrders',JSON.stringify(orders));
  cart=[];updateCart();e.target.reset();document.querySelector('#orderStatus').textContent=`Order ${order.id} placed successfully. We’ll contact you to confirm. ✦`;setTimeout(closeCheckout,3500);
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeCart();closeCheckout();document.querySelector('#bookingModal').classList.remove('open')}});
renderProducts();updateCart();
const onlineOption=document.querySelector('#checkoutForm select[name="payment"] option:last-child');onlineOption.disabled=false;onlineOption.value='Online payment';onlineOption.textContent='UPI / Card / Netbanking (Razorpay)';
window.addEventListener('storage',e=>{if(e.key==='infinityDivineProducts'){products=JSON.parse(e.newValue||'[]');renderProducts();updateCart()}});
