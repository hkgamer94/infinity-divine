const STORAGE='infinityDivineBookings';
const PRODUCT_STORAGE='infinityDivineProducts';
const ORDER_STORAGE='infinityDivineOrders';
const defaultProducts=[
  {id:1,name:'Rose Quartz Heart Bracelet',category:'Love',price:1299,color:'#d99ca8',type:'bracelet',desc:'For compassion, harmony & gentle self-love',badge:'Bestseller'},
  {id:2,name:'Black Tourmaline Bracelet',category:'Protection',price:1499,color:'#252331',type:'bracelet',desc:'For grounding and energetic protection',badge:'New'},
  {id:3,name:'Citrine Abundance Bracelet',category:'Abundance',price:1699,color:'#d09a3d',type:'bracelet',desc:'For confidence, joy & prosperity'},
  {id:4,name:'Amethyst Point',category:'Clarity',price:1899,color:'#8d68ab',type:'crystal',desc:'For intuition, calm & a clear mind'},
  {id:5,name:'Moonstone Intuition Bracelet',category:'Clarity',price:1599,color:'#9eb2c7',type:'bracelet',desc:'For intuition and emotional balance'},
  {id:6,name:'Green Aventurine Stone',category:'Healing',price:899,color:'#6b9d7b',type:'crystal',desc:'For renewal, wellbeing & opportunity'},
  {id:7,name:'Tiger Eye Courage Bracelet',category:'Protection',price:1399,color:'#9e6734',type:'bracelet',desc:'For courage, focus & grounded action'},
  {id:8,name:'Clear Quartz Point',category:'Healing',price:1199,color:'#bab9c7',type:'crystal',desc:'For cleansing and amplified intention'}
];
const loginScreen=document.querySelector('#loginScreen');
const adminShell=document.querySelector('#adminShell');
if(!document.querySelector('link[href="detail-admin.css"]'))document.head.insertAdjacentHTML('beforeend','<link rel="stylesheet" href="detail-admin.css">');
let bookings=[],products=[],orders=[],pendingImage='';

function enterAdmin(){loginScreen.style.display='none';adminShell.hidden=false;loadBookings();loadProducts();loadOrders()}
if(sessionStorage.getItem('infinityAdmin')==='true')enterAdmin();
document.querySelector('#loginForm').addEventListener('submit',e=>{e.preventDefault();if(document.querySelector('#pin').value==='DHarmishtha'){sessionStorage.setItem('infinityAdmin','true');enterAdmin()}else document.querySelector('#loginError').textContent='Incorrect PIN. Please try again.'});
document.querySelector('#logout').addEventListener('click',()=>{sessionStorage.removeItem('infinityAdmin');location.reload()});

function loadBookings(){bookings=JSON.parse(localStorage.getItem(STORAGE)||'[]');render()}
function save(){localStorage.setItem(STORAGE,JSON.stringify(bookings));render()}
function price(session){const match=session.match(/₹([\d,]+)/);return match?Number(match[1].replace(',','')):0}
function formatDate(date){if(!date)return '—';return new Date(`${date}T00:00:00`).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
function formatCreated(date){return new Date(date).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}
function toast(message){const t=document.querySelector('#adminToast');t.textContent=message;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}
function render(){
  const query=document.querySelector('#search').value.toLowerCase();const selected=document.querySelector('#statusFilter').value;
  const filtered=bookings.filter(b=>(selected==='All statuses'||b.status===selected)&&(`${b.name} ${b.phone}`.toLowerCase().includes(query)));
  document.querySelector('#totalStat').textContent=bookings.length;
  document.querySelector('#newStat').textContent=bookings.filter(b=>b.status==='New').length;
  document.querySelector('#confirmedStat').textContent=bookings.filter(b=>b.status==='Confirmed').length;
  document.querySelector('#revenueStat').textContent=`₹${bookings.filter(b=>!['Cancelled','Completed'].includes(b.status)).reduce((n,b)=>n+price(b.session),0).toLocaleString('en-IN')}`;
  const rows=document.querySelector('#bookingRows');const empty=document.querySelector('#emptyState');
  rows.innerHTML=filtered.map(b=>`<tr><td class="client"><strong>${escapeHtml(b.name)}</strong><small>${escapeHtml(b.phone)}</small></td><td class="session">${escapeHtml(b.session)}</td><td>${formatDate(b.date)}</td><td>${formatCreated(b.createdAt)}</td><td><select class="status ${b.status}" data-status="${b.id}"><option ${b.status==='New'?'selected':''}>New</option><option ${b.status==='Confirmed'?'selected':''}>Confirmed</option><option ${b.status==='Completed'?'selected':''}>Completed</option><option ${b.status==='Cancelled'?'selected':''}>Cancelled</option></select></td><td><button class="delete" data-delete="${b.id}" title="Delete booking">×</button></td></tr>`).join('');
  empty.style.display=filtered.length?'none':'block';
}
function escapeHtml(value){const d=document.createElement('div');d.textContent=value||'';return d.innerHTML}
document.querySelector('#search').addEventListener('input',render);document.querySelector('#statusFilter').addEventListener('change',render);
document.addEventListener('change',e=>{if(e.target.matches('[data-status]')){const b=bookings.find(x=>x.id===e.target.dataset.status);b.status=e.target.value;save();toast('Booking status updated')}});
document.addEventListener('click',e=>{if(e.target.matches('[data-delete]')&&confirm('Delete this booking?')){bookings=bookings.filter(b=>b.id!==e.target.dataset.delete);save();toast('Booking deleted')}});
window.addEventListener('storage',loadBookings);

function loadProducts(){products=JSON.parse(localStorage.getItem(PRODUCT_STORAGE)||'null')||defaultProducts;renderProducts()}
function saveProducts(){try{localStorage.setItem(PRODUCT_STORAGE,JSON.stringify(products));renderProducts()}catch(e){toast('Image is too large. Please choose a smaller image.')}}
function renderProducts(){
  const list=document.querySelector('#adminProducts');
  list.innerHTML=products.map(p=>`<article class="admin-product"><div class="admin-product-image" style="background:${p.color}22">${p.image?`<img src="${p.image}" alt="${escapeHtml(p.name)}">`:(p.type==='crystal'?'♦':'◌')}</div><div class="admin-product-body"><small>${escapeHtml(p.category)}</small><h3>${escapeHtml(p.name)}</h3><strong>₹${Number(p.price).toLocaleString('en-IN')}</strong><div class="admin-product-actions"><button data-edit-product="${p.id}">Edit</button><button class="remove-product" data-remove-product="${p.id}">Remove</button></div></div></article>`).join('');
  document.querySelector('#productEmpty').style.display=products.length?'none':'block';
}
function openProductForm(product){
  const form=document.querySelector('#productForm');form.hidden=false;
  document.querySelector('#formTitle').textContent=product?'Edit product':'Add to your collection';document.querySelector('#formEyebrow').textContent=product?'EDIT PRODUCT':'NEW PRODUCT';
  document.querySelector('#productId').value=product?.id||'';document.querySelector('#productName').value=product?.name||'';document.querySelector('#productPrice').value=product?.price||'';document.querySelector('#productCategory').value=product?.category||'Love';document.querySelector('#productType').value=product?.type||'bracelet';document.querySelector('#productDesc').value=product?.desc||'';document.querySelector('#productDetails').value=product?.details||'';document.querySelector('#productBenefits').value=product?.benefits||'';document.querySelector('#productUsage').value=product?.usage||'';document.querySelector('#productBadge').value=product?.badge||'';document.querySelector('#productColor').value=product?.color||'#8d68ab';pendingImage=product?.image||'';showPreview();form.scrollIntoView({behavior:'smooth',block:'center'});
}
function closeProductForm(){document.querySelector('#productForm').hidden=true;document.querySelector('#productForm').reset();pendingImage=''}
function showPreview(){document.querySelector('#imagePreview').innerHTML=pendingImage?`<img src="${pendingImage}" alt="Product image preview">`:'<span>◇</span><p>No image selected</p>'}
function resizeImage(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onerror=reject;reader.onload=()=>{const img=new Image();img.onerror=reject;img.onload=()=>{const max=900,scale=Math.min(1,max/Math.max(img.width,img.height));const canvas=document.createElement('canvas');canvas.width=Math.round(img.width*scale);canvas.height=Math.round(img.height*scale);canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);resolve(canvas.toDataURL('image/jpeg',.8))};img.src=reader.result};reader.readAsDataURL(file)})}
document.querySelector('#addProduct').addEventListener('click',()=>openProductForm());
document.querySelector('#closeProductForm').addEventListener('click',closeProductForm);
document.querySelector('#removeImage').addEventListener('click',()=>{pendingImage='';document.querySelector('#productImage').value='';showPreview()});
document.querySelector('#productImage').addEventListener('change',async e=>{if(e.target.files[0]){pendingImage=await resizeImage(e.target.files[0]);showPreview()}});
document.querySelector('#productForm').addEventListener('submit',e=>{e.preventDefault();const id=document.querySelector('#productId').value;const product={id:id?Number(id):Date.now(),name:document.querySelector('#productName').value.trim(),price:Number(document.querySelector('#productPrice').value),category:document.querySelector('#productCategory').value,type:document.querySelector('#productType').value,desc:document.querySelector('#productDesc').value.trim(),details:document.querySelector('#productDetails').value.trim(),benefits:document.querySelector('#productBenefits').value.trim(),usage:document.querySelector('#productUsage').value.trim(),badge:document.querySelector('#productBadge').value.trim(),color:document.querySelector('#productColor').value,image:pendingImage};if(id)products=products.map(p=>p.id===Number(id)?product:p);else products.unshift(product);saveProducts();closeProductForm();toast(id?'Product updated':'Product added to shop')});
document.addEventListener('click',e=>{const edit=e.target.closest('[data-edit-product]');if(edit)openProductForm(products.find(p=>p.id===Number(edit.dataset.editProduct)));const remove=e.target.closest('[data-remove-product]');if(remove&&confirm('Remove this product from the shop?')){products=products.filter(p=>p.id!==Number(remove.dataset.removeProduct));saveProducts();toast('Product removed')}});

function loadOrders(){orders=JSON.parse(localStorage.getItem(ORDER_STORAGE)||'[]');renderOrders()}
function saveOrders(){localStorage.setItem(ORDER_STORAGE,JSON.stringify(orders));renderOrders()}
function renderOrders(){
  const selected=document.querySelector('#orderFilter').value;
  const shown=orders.filter(o=>selected==='All orders'||o.status===selected);
  document.querySelector('#orderRows').innerHTML=shown.map(o=>`<tr><td class="client"><strong>${escapeHtml(o.name)}</strong><small>${escapeHtml(o.phone)}</small><span class="order-id">${escapeHtml(o.id)}</span></td><td class="order-products">${o.items.map(i=>`<strong>${escapeHtml(i.name)}</strong>`).join('')}</td><td class="order-address">${escapeHtml(o.address)}<br>${escapeHtml(o.city)}, ${escapeHtml(o.state)} — ${escapeHtml(o.pincode)}</td><td><strong>₹${Number(o.total).toLocaleString('en-IN')}</strong></td><td>${escapeHtml(o.paymentStatus||o.payment)}${o.paymentId?`<br><span class="order-id">${escapeHtml(o.paymentId)}</span>`:''}</td><td><select class="order-status ${o.status}" data-order-status="${o.id}"><option ${o.status==='New'?'selected':''}>New</option><option ${o.status==='Confirmed'?'selected':''}>Confirmed</option><option ${o.status==='Packed'?'selected':''}>Packed</option><option ${o.status==='Shipped'?'selected':''}>Shipped</option><option ${o.status==='Delivered'?'selected':''}>Delivered</option><option ${o.status==='Cancelled'?'selected':''}>Cancelled</option></select></td><td><button class="delete" data-delete-order="${o.id}" title="Delete order">×</button></td></tr>`).join('');
  document.querySelector('#orderEmpty').style.display=shown.length?'none':'block';
}
document.querySelector('#orderFilter').addEventListener('change',renderOrders);
document.addEventListener('change',e=>{if(e.target.matches('[data-order-status]')){const order=orders.find(o=>o.id===e.target.dataset.orderStatus);order.status=e.target.value;saveOrders();toast('Order status updated')}});
document.addEventListener('click',e=>{if(e.target.matches('[data-delete-order]')&&confirm('Delete this order?')){orders=orders.filter(o=>o.id!==e.target.dataset.deleteOrder);saveOrders();toast('Order deleted')}});
window.addEventListener('storage',e=>{if(e.key===ORDER_STORAGE)loadOrders()});
