(() => {
    function setWidthScrollBar() {
        let div = document.createElement('div');

        div.style.position = 'absolute';
        div.style.overflowY = 'scroll';
        div.style.width = '50px';
        div.style.height = '50px';

        document.body.append(div);
        let scrollWidth = div.offsetWidth - div.clientWidth;

        div.remove();

        return scrollWidth;
    }

    function initPhoneMask() {
        const phoneFields = document.querySelectorAll('input[type="tel"]');
        const maskOptions = {
            mask: '+{7} (000) 000 00-00'
        };

        phoneFields.forEach((phoneField) => {
            IMask(phoneField, maskOptions);
        });
    }

    function setNavigationDropdownheight() {
        const navigationDropdown = document.querySelector('.header__navigation-dropdown');

        const contraindicationsHeight = document.querySelector('.contraindications').scrollHeight;
        const headerHeight = document.querySelector('.header').clientHeight;

        navigationDropdown.style.height = (document.documentElement.clientHeight - (contraindicationsHeight + headerHeight)) + 'px'
    }

    function setHeaderTop() {
        const header = document.querySelector('.header');
        const headerTopHeight = document.querySelector('.header__top').clientHeight;

        header.style.top = '-' + headerTopHeight + 'px'
    }

    function menuOpen(menuSelector) {
        menuSelector.classList.toggle('active');
        document.body.classList.toggle('lock');
    }

    function menuClose(menuSelector) {
        menuSelector.classList.remove('active');
        document.body.classList.remove('lock');
    }

    document.addEventListener('DOMContentLoaded', function () {
        const header = document.querySelector('.header');

        // Popups
        function popupClose(popupActive) {
            const formPopup = popupActive.querySelector('.form');
            if (formPopup) {
                const additional = formPopup.querySelector('.additional__field');
                if (additional) {
                    additional.value = "Неизвестная форма"
                }
            }
            popupActive.classList.remove('open');
            document.body.classList.remove('lock');
            document.querySelector('html').style.paddingRight = 0;
            document.querySelectorAll('.padding-lock').forEach(function (elem) {
                elem.style.paddingRight = 0;
            });
        }

        const popupOpenBtns = document.querySelectorAll('.popup-btn');
        const popups = document.querySelectorAll('.popup');
        const closePopupBtns = document.querySelectorAll('.close-popup');

        closePopupBtns.forEach(function (el) {
            el.addEventListener('click', function (e) {
                popupClose(e.target.closest('.popup'));
            });
        });

        popupOpenBtns.forEach(function (el) {
            el.addEventListener('click', function (e) {
                const path = e.currentTarget.dataset.path;
                const currentPopup = document.querySelector(`[data-target="${path}"]`);
                const title = el.dataset?.title || 'Записаться на прием к врачу';
                const popupTitle = currentPopup.querySelector('.popup__title');

                if (title) {
                    popupTitle.textContent = title;
                }

                popups.forEach(function (popup) {
                    popupClose(popup);
                    popup.addEventListener('click', function (e) {
                        if (!e.target.closest('.popup__content')) {
                            popupClose(e.target.closest('.popup'));
                        }
                    });
                });

                menuClose(header);

                currentPopup.classList.add('open');
                document.body.classList.add('lock');
                document.querySelector('html').style.paddingRight = setWidthScrollBar() + 'px';
                document.querySelectorAll('.padding-lock').forEach(function (elem) {
                    elem.style.paddingRight = setWidthScrollBar() + 'px';
                });
            });
        });

        // Tabs
        class Tabs {
            container;
            tab_button_class;
            tab_content_class;
            tab_attribute_key;
            tab_attribute_target;
            tab_navigation_next;
            tab_navigation_prev;
            tab_active_name;

            constructor({ container = '.tabs-container', tabs_wrapper_class = '.tabs__wrapper', button_class = '.tab', content_class = '.tab-content', attribute_key = 'path', attribute_target = 'target', nav_next = '.tabs__arrow_next', nav_prev = '.tabs__arrow_prev', name_active = '.tabs__active' } = {}) {
                this.container = container;
                this.tabs_wrapper_class = tabs_wrapper_class;
                this.tab_button_class = button_class;
                this.tab_content_class = content_class;
                this.tab_attribute_key = attribute_key;
                this.tab_attribute_target = attribute_target;
                this.tab_navigation_next = nav_next;
                this.tab_navigation_prev = nav_prev;
                this.tab_active_name = name_active;
            }

            initTabs() {
                document.querySelectorAll(this.container).forEach((wrapper) => {
                    this.initTabsWrapper(wrapper);
                });
            }

            initTabsWrapper(wrapper) {
                const tabsWrapper = wrapper.querySelector(this.tabs_wrapper_class);
                const tabsButtonList = wrapper.querySelectorAll(this.tab_button_class);
                const tabsContentList = wrapper.querySelectorAll(this.tab_content_class);
                const tabsNavigationNext = wrapper.querySelector(this.tab_navigation_next);
                const tabsNavigationPrev = wrapper.querySelector(this.tab_navigation_prev);
                const tabActiveName = wrapper.querySelector(this.tab_active_name);
                const tabsClose = document.querySelectorAll('.tabs__close');
                let currentTab = 0;
                if (tabActiveName) {
                    tabActiveName.querySelector('.tabs__active-text').textContent = tabsButtonList[currentTab].textContent;
                }

                for (let index = 0; index < tabsButtonList.length; index++) {
                    if (tabsButtonList[index].dataset.start === true) {
                        currentTab = index;
                    }

                    tabsButtonList[index].addEventListener('click', () => {
                        if (tabsContentList[index]) {
                            currentTab = index;
                            this.showTabsContent({
                                list_tabs: tabsContentList,
                                list_buttons: tabsButtonList,
                                index: currentTab,
                            });
                            if (tabActiveName) {
                                tabActiveName.querySelector('.tabs__active-text').textContent = tabsButtonList[index].textContent;
                                tabActiveName.closest('.tabs').classList.remove('active');
                                document.body.classList.remove('lock');
                            }
                            setTimeout(() => {
                                AOS.refresh();
                            }, 500);
                        }
                    });
                }

                this.showTabsContent({
                    list_tabs: tabsContentList,
                    list_buttons: tabsButtonList,
                    index: currentTab,
                });

                if (tabsNavigationNext) {
                    tabsNavigationNext.addEventListener('click', () => {
                        if (currentTab + 1 < tabsButtonList.length) {
                            currentTab += 1;
                        } else {
                            currentTab = 0;
                        }

                        const tabsWrapperPositionX = tabsWrapper.getBoundingClientRect().left;
                        const currentTabPositionX = tabsButtonList[currentTab].getBoundingClientRect().left;
                        const currentTabPositionXRegardingParent = currentTabPositionX - tabsWrapperPositionX;

                        tabsWrapper.scrollBy({
                            left: currentTabPositionXRegardingParent,
                            behavior: 'smooth'
                        });

                        this.showTabsContent({
                            list_tabs: tabsContentList,
                            list_buttons: tabsButtonList,
                            index: currentTab,
                        });
                    });
                }

                if (tabsNavigationPrev) {
                    tabsNavigationPrev.addEventListener('click', () => {
                        if (currentTab - 1 >= 0) {
                            currentTab -= 1;
                        } else {
                            currentTab = tabsButtonList.length - 1;
                        }

                        const tabsWrapperPositionX = tabsWrapper.getBoundingClientRect().left;
                        const currentTabPositionX = tabsButtonList[currentTab].getBoundingClientRect().left;
                        const currentTabPositionXRegardingParent = currentTabPositionX - tabsWrapperPositionX;

                        tabsWrapper.scrollBy({
                            left: currentTabPositionXRegardingParent,
                            behavior: 'smooth'
                        });

                        this.showTabsContent({
                            list_tabs: tabsContentList,
                            list_buttons: tabsButtonList,
                            index: currentTab,
                        });
                    });
                }

                if (tabActiveName) {
                    tabActiveName.addEventListener('click', function () {
                        tabActiveName.closest('.tabs').classList.add('active');
                        document.body.classList.add('lock');
                    });
                }

                if (tabsClose.length > 0) {
                    for (let i = 0; i < tabsClose.length; i += 1) {
                        const tabClose = tabsClose[i]
                        tabClose.addEventListener('click', function () {
                            tabClose.closest('.tabs').classList.remove('active');
                            document.body.classList.remove('lock');
                        });
                    }
                }


                tabsWrapper.closest('.tabs__container').addEventListener('click', function (e) {
                    if (!e.target.closest('.tabs__wrapper')) {
                        tabsWrapper.closest('.tabs').classList.remove('active');
                        document.body.classList.remove('lock');
                    }
                });
            }

            hideTabsContent({ list_tabs, list_buttons }) {
                list_buttons.forEach((el) => {
                    el.classList.remove('active');
                });
                list_tabs.forEach((el) => {
                    el.classList.remove('active');
                });
            }

            showTabsContent({ list_tabs, list_buttons, index }) {
                this.hideTabsContent({
                    list_tabs,
                    list_buttons
                });

                if (list_tabs[index]) {
                    list_tabs[index].classList.add('active');
                }

                if (list_buttons[index]) {
                    list_buttons[index].classList.add('active');
                }
            }
        }

        // header navigation
        const navTabs = document.querySelectorAll('.header__navigation-tab');

        if (navTabs.length > 0) {
            navTabs.forEach((navTab) => {
                navTab.addEventListener('click', function () {
                    if (navTab.closest('.header__navigation-content-item').classList.contains('active')) {
                        navTab.closest('.header__navigation-content-item').classList.remove('active');
                        return;
                    }
                    navTabs.forEach((elem) => {
                        elem.closest('.header__navigation-content-item').classList.remove('active');
                    });
                    navTab.closest('.header__navigation-content-item').classList.add('active');
                });
            });
        }

        setNavigationDropdownheight();
        setHeaderTop();

        window.addEventListener('resize', () => {
            setNavigationDropdownheight();
            setHeaderTop();
        });

        const navBtns = document.querySelectorAll('.header__nav-btn');
        const backgroundClose = document.querySelector('.background-close');

        if (navBtns.length > 0) {
            navBtns.forEach((navBtn) => {
                navBtn.addEventListener('click', function () {
                    if (navBtn.closest('.header__navigation-wrapper').classList.contains('active')) {
                        navBtn.closest('.header__navigation-wrapper').classList.remove('active');
                        backgroundClose.classList.remove('active');
                        return;
                    }
                    navTabs.forEach((elem) => {
                        elem.closest('.header__navigation-wrapper').classList.remove('active');
                        backgroundClose.classList.remove('active');
                    });
                    navBtn.closest('.header__navigation-wrapper').classList.add('active');
                    backgroundClose.classList.add('active');
                });
            });

            backgroundClose.addEventListener('click', function () {
                navTabs.forEach((elem) => {
                    elem.closest('.header__navigation-wrapper').classList.remove('active');
                    backgroundClose.classList.remove('active');
                });
            });
        }

        // header menu
        const openMenuBtns = document.querySelectorAll('.open-menu');
        const closeMenuBtns = document.querySelectorAll('.close-menu');

        openMenuBtns.forEach(function (openMenuBtn) {
            openMenuBtn.addEventListener('click', function () {
                menuOpen(header);
            })
        });

        closeMenuBtns.forEach(function (closeMenuBtn) {
            closeMenuBtn.addEventListener('click', function () {
                menuClose(header);
            })
        });

        // steps slider
        const stepsSliderList = document.querySelectorAll('.steps__slider');

        if (stepsSliderList.length > 0) {
            stepsSliderList.forEach((slider) => {
                const stepsSlidesList = slider.querySelectorAll('.step');

                const stepsSlider = new Swiper(slider, {
                    autoHeight: true,
                    effect: 'fade',
                    fadeEffect: {
                        crossFade: true
                    },
                    pagination: {
                        el: slider.closest(".steps__wrapper").querySelector(".steps__pagination"),
                        clickable: true,
                        renderBullet: function (index, className) {
                            return '<button class="steps__pagination-btn ' + className + '">' + `<p class="steps__pagination-btn-num">${index + 1}</p><img class="steps__pagination-btn-img" src="${stepsSlidesList[index].dataset.img}"><span class="steps__pagination-btn-text">${stepsSlidesList[index].dataset.title}</span>` + "</button>";
                        },
                    },
                    on: {
                        slideChange: function () {
                            setTimeout(() => {
                                AOS.refresh();
                            }, 500);
                        }
                    }
                });
            });
        }

        // services slider
        const servicesSliders = document.querySelectorAll('.services__slider');

        if (servicesSliders.length > 0) {
            servicesSliders.forEach((slider) => {
                const sliderService = new Swiper(slider, {
                    slidesPerView: 2,
                    spaceBetween: 6,
                    pagination: {
                        el: slider.closest('.slider-wrapper').querySelector('.services__slider-pagination'),
                        type: 'bullets',
                        clickable: true,
                    },
                    breakpoints: {
                        0: {
                            slidesPerView: 1.01,
                            spaceBetween: 6,
                        },
                        575: {
                            slidesPerView: 1.5,
                            spaceBetween: 6,
                        },
                        767: {
                            slidesPerView: 2,
                            spaceBetween: 6,
                        },
                    },
                    on: {
                        slideChange: function () {
                            setTimeout(() => {
                                AOS.refresh();
                            }, 500);
                        }
                    }
                });

                ['resize', 'load'].forEach((event) => {
                    window.addEventListener(event, function () {
                        if (window.innerWidth <= 1024) {
                            const sliderWrapper = slider.querySelector('.services__slider-wrapper');
                            const serviceSlides = slider.querySelectorAll('.service');

                            slider.classList.add('swiper');
                            sliderWrapper.classList.add('swiper-wrapper');
                            sliderWrapper.classList.remove('grid-3');
                            serviceSlides.forEach((slide) => {
                                slide.classList.add('swiper-slide');
                            });

                            sliderService.disable();
                            sliderService.enable();
                        } else {
                            const sliderWrapper = slider.querySelector('.services__slider-wrapper');
                            const serviceSlides = slider.querySelectorAll('.service');
                            slider.classList.remove('swiper');
                            sliderWrapper.classList.remove('swiper-wrapper');
                            sliderWrapper.classList.add('grid-3');
                            serviceSlides.forEach((slide) => {
                                slide.classList.remove('swiper-slide');
                                slide.removeAttribute("style");
                            });
                            sliderService.disable();
                        }
                    });
                });
            });
        }

        // documents slider
        const documentsSliders = document.querySelectorAll('.documents__slider');

        if (documentsSliders.length > 0) {
            documentsSliders.forEach((slider) => {
                const documentsSlider = new Swiper(slider, {
                    slidesPerView: 4,
                    spaceBetween: 100,
                    pagination: {
                        el: slider.closest('.slider-wrapper').querySelector('.slider-pagination'),
                        type: 'bullets',
                        clickable: true,
                    },
                    breakpoints: {
                        0: {
                            slidesPerView: 1.5,
                            spaceBetween: 40,
                        },
                        575: {
                            slidesPerView: 2.2,
                            spaceBetween: 40,
                        },
                        767: {
                            slidesPerView: 3,
                            spaceBetween: 40,
                        },
                        1024: {
                            slidesPerView: 4,
                            spaceBetween: 40,
                        },
                        1600: {
                            slidesPerView: 4,
                            spaceBetween: 100,
                        },
                    },
                    navigation: {
                        nextEl: slider.closest('.slider-wrapper').querySelector('.slider-btn_next'),
                        prevEl: slider.closest('.slider-wrapper').querySelector('.slider-btn_prev'),
                    },
                    on: {
                        slideChange: function () {
                            setTimeout(() => {
                                AOS.refresh();
                            }, 500);
                        }
                    }
                });
            });
        }

        // documents fancybox
        Fancybox.bind('[data-fancybox="documents"]', {
            placeFocusBack: false,
        });

        new Tabs().initTabs();
        initPhoneMask();
        AOS.init({
            once: true,
        });
    });
})();
