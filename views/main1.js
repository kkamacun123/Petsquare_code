
const navbar = document.querySelector('#navbar');
const navbarHeight = navbar.getBoundingClientRect().height;
document.addEventListener('scroll', () => {
  console.log(window.scrollY)
  console.log(`navbarHeight: ${navbarHeight}`)
  
  if(window.scrollY > navbarHeight) {
    navbar.classList.add('navbar--dark');
  } else {
    navbar.classList.remove('navbar--dark');
    
  }
});

/* 
  content+scroll+padding+border = Elem size
  HTMLElement.offsetWidth&
  HTMLElemet.offsetHeight
  Element.getBoundingClientRect().height/width       - rendered figure  */

// scrolling to each navbar_menu side

const navbarMenu = document.querySelector('.navbar__menu');
navbarMenu.addEventListener('click', (e) =>{
  

  const target = e.target; //event 타깃 노드취득
  const link = target.dataset.link;
  const scrollTo = document.querySelector(link);

  if(link == null){
    return;
  }
  else if(link == '#home'){
    console.log(e.target.dataset.link);
    window.scrollTo(0,0);
  }
  else{
  console.log(e.target.dataset.link);
  scrollTo.scrollIntoView();
  }
});
/*추가3*/

// const searchIcon = document.querySelector('#searchIcon');

// const mapbox = document.querySelector('#map');
// searchIcon.addEventListener('click' , () => {
// mapbox.scrollIntoView();
// })

/* 추가코드 */
let slides = document.querySelector(".slides");
let slideImg = document.querySelectorAll(".slides li");
let currentIdx = 0;
slideCount = slideImg.length;
prev = document.querySelector(".prev");
next = document.querySelector(".next");

slideWidth = 400;
slideMargin = 100;
slides.style.width = (slideWidth + slideMargin)*slideCount + "px";

function moveSlide(num){
  // 왼쪽으로 400px씩 이동
  slides.style.left = -num * 400 + "px"; 
  currentIdx = num;
}

prev.addEventListener('click', function(){
  // 첫 번째 슬라이드로 표시 됐을때는 이전 버튼 눌러도 아무런 반응 없게 하기 위해
  // currentIdx !==0일때만 moveSlide 함수 불러옴
  if(currentIdx !== 0) moveSlide(currentIdx - 1);
});


next.addEventListener('click', function(){
  // 마지막 슬라이드로 표시 됐을때는 다음 버튼 눌러도 아무런 반응 없게 하기 위해
  // currentIdx !==slideCount - 1 일때만 moveSlide 함수 불러옴
  if(currentIdx !== slideCount - 1) moveSlide(currentIdx + 1);
})







