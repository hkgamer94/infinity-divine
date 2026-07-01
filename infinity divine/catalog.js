window.DEFAULT_PRODUCTS=[
  {id:1,name:'Rose Quartz Heart Bracelet',category:'Love',price:1299,color:'#d99ca8',type:'bracelet',desc:'For compassion, harmony & gentle self-love',badge:'Bestseller'},
  {id:2,name:'Black Tourmaline Bracelet',category:'Protection',price:1499,color:'#252331',type:'bracelet',desc:'For grounding and energetic protection',badge:'New'},
  {id:3,name:'Citrine Abundance Bracelet',category:'Abundance',price:1699,color:'#d09a3d',type:'bracelet',desc:'For confidence, joy & prosperity'},
  {id:4,name:'Amethyst Point',category:'Clarity',price:1899,color:'#8d68ab',type:'crystal',desc:'For intuition, calm & a clear mind'},
  {id:5,name:'Moonstone Intuition Bracelet',category:'Clarity',price:1599,color:'#9eb2c7',type:'bracelet',desc:'For intuition and emotional balance'},
  {id:6,name:'Green Aventurine Stone',category:'Healing',price:899,color:'#6b9d7b',type:'crystal',desc:'For renewal, wellbeing & opportunity'},
  {id:7,name:'Tiger Eye Courage Bracelet',category:'Protection',price:1399,color:'#9e6734',type:'bracelet',desc:'For courage, focus & grounded action'},
  {id:8,name:'Clear Quartz Point',category:'Healing',price:1199,color:'#bab9c7',type:'crystal',desc:'For cleansing and amplified intention'}
];
window.getProducts=()=>JSON.parse(localStorage.getItem('infinityDivineProducts')||'null')||window.DEFAULT_PRODUCTS;
window.getCart=()=>JSON.parse(localStorage.getItem('infinityDivineCart')||'[]');
window.saveCart=cart=>localStorage.setItem('infinityDivineCart',JSON.stringify(cart));
window.formatMoney=value=>`₹${Number(value).toLocaleString('en-IN')}`;
