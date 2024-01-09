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

    document.addEventListener('DOMContentLoaded', function () {
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
                const currentForm = currentPopup.querySelector('.form');
                const title = el.dataset?.title || 'Получите консультацию специалиста бесплатно';
                const additional = el.dataset?.additional || '';

                popups.forEach(function (popup) {
                    popupClose(popup);
                    popup.addEventListener('click', function (e) {
                        if (!e.target.closest('.popup__content')) {
                            popupClose(e.target.closest('.popup'));
                        }
                    });
                });

                if (currentForm) {
                    const formTitle = currentForm.querySelector('.form-popup__title')
                    const addition = currentForm.querySelector('.additional__field');
                    if (addition) {
                        addition.value = additional;
                    }
                    if (formTitle && !currentForm.classList.contains('form-review')) {
                        formTitle.textContent = title;
                    }
                }
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

        new Tabs().initTabs();
        initPhoneMask();
    });
})();
