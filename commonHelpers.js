import{a as L,S as b,i as p}from"./assets/vendor-c145bea9.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))o(e);new MutationObserver(e=>{for(const a of e)if(a.type==="childList")for(const l of a.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&o(l)}).observe(document,{childList:!0,subtree:!0});function n(e){const a={};return e.integrity&&(a.integrity=e.integrity),e.referrerpolicy&&(a.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?a.credentials="include":e.crossorigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(e){if(e.ep)return;e.ep=!0;const a=n(e);fetch(e.href,a)}})();const v=document.querySelector(".form"),c=document.querySelector(".gallery"),y=document.querySelector(".loader"),i=document.querySelector(".load-more");let s={key:"41751590-b6ce5e955eace60263a904c25",image_type:"photo",orientation:"horizontal",safesearch:!0,page:1,per_page:40};function x(){y.style.display="block",c.style.display="none",i.style.display="none"}function d(){y.style.display="none",c.style.display="flex",i.style.display="block"}function w(r){return r.reduce((t,n)=>{const{largeImageURL:o,webformatURL:e,tags:a,likes:l,views:f,comments:g,downloads:h}=n;return t+`<li class="gallery-item">
        <a href=${o}> 
          <img class="gallery-img" src=${e} alt=${a} />
        </a>
        <div class="gallery-text-box">
          <p>Likes: <span class="text-value">${l}</span></p>
          <p>views: <span class="text-value">${f}</span></p>
          <p>comments: <span class="text-value">${g}</span></p>
          <p>downloads: <span class="text-value">${h}</span></p>
        </div>
      </li>`},"")}function S(r){const t=w(r);c.innerHTML+=t}function H(){new b(".gallery a",{nav:!0,captionDelay:250,captionsData:"alt",close:!0,enableKeyboard:!0,docClose:!0}).refresh()}function u(){c.style.display="none",i.style.display="none",p.error({position:"topRight",color:"red",message:"Sorry, there are no images matching your search query. Please try again!"})}function P(){i.style.display="none",p.info({position:"topRight",message:"We're sorry, but you've reached the end of search results."})}async function m(r){x();try{const t=await L.get(`https://pixabay.com/api/?${r}`);d(),!t.data.totalHits||t.data.totalHits===0?u():(S(t.data.hits),H(),s.page++);const n=t.data.totalHits||0,o=s.page||1,e=s.per_page||20;n-o*e<=0&&P()}catch(t){console.error(t),d(),u()}}v.addEventListener("submit",r=>{r.preventDefault(),s.q=r.target.elements.search.value.trim();const t=new URLSearchParams(s);m(t),r.currentTarget.reset()});i.addEventListener("click",r=>{r.preventDefault();const t=new URLSearchParams(s);m(t)});
//# sourceMappingURL=commonHelpers.js.map