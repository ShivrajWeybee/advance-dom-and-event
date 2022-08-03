'use strict';

const header = document.querySelector('.header');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsCorainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

// ---------------------------------
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


// ---------------------------------
// Smooth Scroll

btnScrollTo.addEventListener('click', function(e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  console.log(e.target.getBoundingClientRect());

  console.log('Current Scroll Position', window.pageXOffset, pageYOffset);

  console.log('Height/Width ViewPort', document.documentElement.clientHeight, document.documentElement.clientWidth);

  //Scrolling
  /*window.scrollTo(s1coords.left, s1coords.top + window.pageYOffset);

  window.scrollTo({
    left : s1coords.left + window.pageXOffset,
    top : s1coords.top + pageYOffset,
    behavior : 'smooth'
  });*/

  section1.scrollIntoView({behavior: 'smooth'});
})


// ---------------------------------
// Page Navigation

// Way 1
/*document.querySelectorAll('.nav__link').forEach(function(el) {
  el.addEventListener('click', function(e) {
    e.preventDefault();
    const id = this.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({behavior: 'smooth'});
  })
})*/

// Way 2
// Event Delegation
// 1. add event listner to comman parent
// 2. determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function(e) {
  e.preventDefault();
  if(e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({behavior: 'smooth'});
  }
})


// ---------------------------------
// Tabbed Component

tabsCorainer.addEventListener('click', function(e) {
  e.preventDefault();
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);
  console.log(clicked.dataset);

  // Guard Class
  if(!clicked) return;

  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});


// ---------------------------------
// Menu fade animation

const handleHove = function(e) {
  if(e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if(el !== link) el.style.opacity = this;
    })
    logo.style.opacity = this;
  }
}

nav.addEventListener('mouseover', handleHove.bind(0.5));

nav.addEventListener('mouseout', handleHove.bind(1));


// ---------------------------------
// Sticky Navigation

/*const initialCoords = section1.getBoundingClientRect();

window.addEventListener('scroll', function() {
  console.log(window.scrollY);

  if(window.scrollY > initialCoords.top) {
    nav.classList.add('sticky');
  }
  else {
    nav.classList.remove('sticky');
  }
})*/

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function(entries) {
  const [entry] = entries;
  entry.isIntersecting ? nav.classList.remove('sticky') : nav.classList.add('sticky');
}

const headerObserver = new IntersectionObserver(stickyNav, {root: null, threshold: 0, rootMargin: `-${navHeight}px`});
headerObserver.observe(header);


// ---------------------------------
// Reveal Sections

const allSections = document.querySelectorAll('.section');

const revealSection = function(entries, observer){
  const [entry] = entries;
  if(entry.isIntersecting) {
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  }
}

const sectionObserver = new IntersectionObserver (revealSection, {root: null, threshold: 0.15});

allSections.forEach(function(section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
})


// ---------------------------------
// Lazy Loading Images

const imgTargets = document.querySelectorAll('img[data-src');

const loadImg = function(entries, observer) {
  const [entry] = entries;
  if(entry.isIntersecting) {
    entry.target.src = entry.target.dataset.src;

    entry.target.addEventListener('load', function() {
      entry.target.classList.remove('lazy-img');
    })

    observer.unobserve(entry.target);
  }
}

const imgObserver = new IntersectionObserver(loadImg, {root: null, threshold: 0.5});
imgTargets.forEach(img => imgObserver.observe(img));


// ---------------------------------
// Slider
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

let maxSlide = slides.length;
let curSlide = 0;

const createDots = function() {
  slides.forEach((s,i) => {
    dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`);
  })
}

const activateDot = function(slide) {
  document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));

  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
}

const goToSlide = function(slide) {
  slides.forEach((s,i) => s.style.transform = `translateX(${100*(i-slide)}%)`);
}

const init = function() {
  createDots();
  goToSlide(0);
  activateDot(0);
}
init();

const nextSlide = function() {
  if(curSlide === maxSlide-1) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
}

const prevSlide = function() {
  if(curSlide === 0) {
    curSlide = maxSlide-1;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
}

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function(e) {
  e.key === 'ArrowLeft' && prevSlide();
  e.key === 'ArrowRight' && nextSlide();
});

dotContainer.addEventListener('click', function(e) {
  if(e.target.classList.contains('dots__dot')) {
    const {slide} = e.target.dataset;
    goToSlide(slide);
    activateDot(slide);
  }
})









// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

// Creating and Inserting elements
// const message = document.createElement('div');
// message.classList.add('cookie-message');
// message.innerHTML = `we are using your cookie for better user experience <button class="btn btn--close--cookie">Got it!</button>`;
// header.prepend(message);
// header.append(message.cloneNode(true));
// header.append(message);

// document.querySelector('.btn--close--cookie').addEventListener('click', function() {
//   message.remove();
  // message.parentElement.removeChild(message);
// })


// Styles
// message.style.backgroundColor = '#37383d';
// message.style.height = Number.parseInt(getComputedStyle(message).height, 10) + 30 + 'px';

// document.documentElement.style.setProperty('--color-primary', 'coral');
// becase that css variable is declare in root, so equvivelant to root in DOM is document object


// Attributes
// const logo = document.querySelector('.nav__logo');
// console.log(logo);
// console.log(logo.alt);
// logo.alt = 'Amazing Logo';
// console.log(logo.alt);
// console.log(logo.src);
// console.log(logo.className);

// set & get attribute old way
// logo.setAttribute('compny', 'bankish')
// logo.getAttribute('designer');




// ---------------------------------
// Lifecycle DOM Events
document.addEventListener('DOMContentLoaded', function(e) {
  console.log(e);
});

window.addEventListener('load', function(e) {
  console.log(e);
});

window.addEventListener('beforeunload', function(e) {
  console.log(e);
});