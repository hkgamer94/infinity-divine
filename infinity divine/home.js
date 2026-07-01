document.querySelector('.menu-toggle').addEventListener('click',e=>{const nav=document.querySelector('.main-nav');nav.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',nav.classList.contains('open'))});
document.querySelector('#cartCount').textContent=window.getCart().length;
document.querySelector('#newsletterForm').addEventListener('submit',e=>{e.preventDefault();document.querySelector('#newsletterStatus').textContent='You’re in the circle. Welcome ✦';e.target.reset()});
