var routes = [
    //-------------------
    // Index page
    {
        path: "/",
        url: "./index.html",
        name: "home",
    },
    // About page
    {
        path: "/about/",
        url: "./pages/about.html",
        name: "about",
    },
    {
        name: "tabs-animated",
        path: "/tabs-animated/",
        url: "./pages/tabs-animated.html",
    },
    {
        name: "newprod",
        path: "/newprod/",
        componentUrl: "./pages/newprod.html",
    },
    {
        name: "history",
        path: "/history/",
        componentUrl: "./pages/history.html",
    },
    {
        name: "construccion",
        path: "/construccion/",
        componentUrl: "./pages/construccion.html",
    },
    {
        name: "tablerocalificaciones",
        path: "/tablerocalificaciones/",
        componentUrl: "./pages/tablerocalificaciones.html",
    },
    //inicio Revision Limpieza
    {
        name: "yallegueLimp",
        path: "/yallegueLimp/",
        componentUrl: "./pages/yallegueLimp.html",
    },
    {
        name: "formLimp1",
        path: "/formLimp1/",
        componentUrl: "./pages/formLimp1.html",
    },
    {
        name: "formLimp2",
        path: "/formLimp2/",
        componentUrl: "./pages/formLimp2.html",
    },
    {
        name: "formLimp3",
        path: "/formLimp3/",
        componentUrl: "./pages/formLimp3.html",
    },
    //inicio de checklist
    {
        name: "yallegue",
        path: "/yallegue/",
        componentUrl: "./pages/yallegue.html",
    },
    {
        name: "formCheck1",
        path: "/formCheck1/",
        componentUrl: "./pages/formCheck1.html",
    },
    {
        name: "formCheck2",
        path: "/formCheck2/",
        componentUrl: "./pages/formCheck2.html",
    },
    {
        name: "formCheck3",
        path: "/formCheck3/",
        componentUrl: "./pages/formCheck3.html",
    },
    //fin de checklist
    //Inicio Desincorporacion
    {
        name: "formDesin1",
        path: "/formDesin1/",
        componentUrl: "./pages/formDesin1.html",
    },
    {
        name: "formDesin2",
        path: "/formDesin2/",
        componentUrl: "./pages/formDesin2.html",
    },
    {
        name: "formDesin3",
        path: "/formDesin3/",
        componentUrl: "./pages/formDesin3.html",
    },
    {
        name: "formDesin4",
        path: "/formDesin4/",
        componentUrl: "./pages/formDesin4.html",
    },
    {
        name: "formDesin5",
        path: "/formDesin5/",
        componentUrl: "./pages/formDesin5.html",
    },
    {
        name: "yallegue_desin",
        path: "/yallegue_desin/",
        componentUrl: "./pages/yallegue_desin.html",
    },
    //Fin Desincorporacion
    //inicio Recaudo
    {
        name: "yallegueRecaudo",
        path: "/yallegueRecaudo/",
        componentUrl: "./pages/yallegueRecaudo.html",
    },
    {
        name: "formRecaudo1",
        path: "/formRecaudo1/",
        componentUrl: "./pages/formRecaudo1.html",
    },
    {
        name: "formRecaudo2",
        path: "/formRecaudo2/",
        componentUrl: "./pages/formRecaudo2.html",
    },
    {
        name: "formRecaudo3",
        path: "/formRecaudo3/",
        componentUrl: "./pages/formRecaudo3.html",
    },
    //fin Recaudo
    //inicio diesel
    {
        name: "yallegueDiesel",
        path: "/yallegueDiesel/",
        componentUrl: "./pages/yallegueDiesel.html",
    },
    {
        name: "formDiesel1",
        path: "/formDiesel1/",
        componentUrl: "./pages/formDiesel1.html",
    },
    {
        name: "formDiesel2",
        path: "/formDiesel2/",
        componentUrl: "./pages/formDiesel2.html",
    },
    {
        name: "formDiesel3",
        path: "/formDiesel3/",
        componentUrl: "./pages/formDiesel3.html",
    },
    //fin diesel
    //inicio de Flota
    {
        name: "yallegueFlota",
        path: "/yallegueFlota/",
        componentUrl: "./pages/yallegueFlota.html",
    },
    {
        name: "formFlota1",
        path: "/formFlota1/",
        componentUrl: "./pages/formFlota1.html",
    },
    {
        name: "formFlota2",
        path: "/formFlota2/",
        componentUrl: "./pages/formFlota2.html",
    },
    {
        name: "formFlota3",
        path: "/formFlota3/",
        componentUrl: "./pages/formFlota3.html",
    },
    {
        name: "formFlota4",
        path: "/formFlota4/",
        componentUrl: "./pages/formFlota4.html",
    },
    {
        name: "formFlota5",
        path: "/formFlota5/",
        componentUrl: "./pages/formFlota5.html",
    },
    //fin de Flota
    {
        name: "visualizar",
        path: "/visualizar/",
        componentUrl: "./pages/visualizar.html",
    },
    {
        name: "tablaventa",
        path: "/tablaventa/",
        componentUrl: "./pages/tablaventa.html",
    },
    // Components
    {
        path: "/accordion/",
        url: "./pages/examples/accordion.html",
    },
    {
        path: "/action-sheet/",
        componentUrl: "./pages/action-sheet.html",
    },
    {
        path: "/appbar/",
        componentUrl: "./pages/appbar.html",
    },
    {
        path: "/autocomplete/",
        componentUrl: "./pages/autocomplete.html",
    },
    {
        path: "/badge/",
        componentUrl: "./pages/badge.html",
    },
    {
        path: "/buttons/",
        url: "./pages/buttons.html",
    },
    {
        path: "/calendar/",
        componentUrl: "./pages/calendar.html",
    },
    {
        name: "calendar-page",
        path: "/calendar-page/",
        componentUrl: "./pages/calendar-page.html",
    },
    {
        path: "/cards/",
        url: "./pages/cards.html",
    },
    {
        path: "/cards-expandable/",
        url: "./pages/cards-expandable.html",
    },
    {
        path: "/checkbox/",
        componentUrl: "./pages/checkbox.html",
    },
    {
        path: "/chips/",
        componentUrl: "./pages/chips.html",
    },
    {
        path: "/color-picker/",
        componentUrl: "./pages/color-picker.html",
    },
    {
        path: "/contacts-list/",
        url: "./pages/contacts-list.html",
    },
    {
        path: "/content-block/",
        url: "./pages/content-block.html",
    },
    {
        path: "/data-table/",
        componentUrl: "./pages/data-table.html",
    },
    {
        path: "/dialog/",
        componentUrl: "./pages/dialog.html",
    },
    {
        path: "/elevation/",
        url: "./pages/elevation.html",
    },
    {
        path: "/fab/",
        url: "./pages/fab.html",
    },
    {
        path: "/fab-morph/",
        url: "./pages/fab-morph.html",
    },
    {
        path: "/form-storage/",
        url: "./pages/form-storage.html",
    },
    {
        path: "/gauge/",
        componentUrl: "./pages/gauge.html",
    },
    {
        path: "/grid/",
        url: "./pages/grid.html",
    },
    {
        path: "/icons/",
        componentUrl: "./pages/icons.html",
    },
    {
        path: "/infinite-scroll/",
        componentUrl: "./pages/infinite-scroll.html",
    },
    {
        path: "/inputs/",
        url: "./pages/inputs.html",
    },
    {
        path: "/lazy-load/",
        url: "./pages/lazy-load.html",
    },
    {
        path: "/list/",
        url: "./pages/list.html",
    },
    {
        path: "/list-index/",
        componentUrl: "./pages/list-index.html",
    },
    {
        path: "/login-screen/",
        componentUrl: "./pages/login-screen.html",
    },
    {
        path: "/login-screen-page/",
        componentUrl: "./pages/login-screen-page.html",
    },
    {
        path: "/menu/",
        componentUrl: "./pages/menu.html",
    },
    {
        path: "/messages/",
        componentUrl: "./pages/messages.html",
    },
    {
        path: "/navbar/",
        url: "./pages/navbar.html",
    },
    {
        path: "/navbar-hide-scroll/",
        url: "./pages/navbar-hide-scroll.html",
    },
    {
        path: "/notifications/",
        componentUrl: "./pages/notifications.html",
    },
    {
        path: "/panel/",
        url: "./pages/panel.html",
    },
    {
        path: "/photo-browser/",
        componentUrl: "./pages/photo-browser.html",
    },
    {
        path: "/picker/",
        componentUrl: "./pages/picker.html",
    },
    {
        path: "/popup/",
        componentUrl: "./pages/popup.html",
    },
    {
        path: "/popover/",
        url: "./pages/popover.html",
    },
    {
        path: "/preloader/",
        componentUrl: "./pages/preloader.html",
    },
    {
        path: "/progressbar/",
        componentUrl: "./pages/progressbar.html",
    },
    {
        path: "/pull-to-refresh/",
        componentUrl: "./pages/pull-to-refresh.html",
    },
    {
        path: "/radio/",
        url: "./pages/radio.html",
    },
    {
        path: "/range/",
        componentUrl: "./pages/range.html",
    },
    {
        path: "/searchbar/",
        url: "./pages/searchbar.html",
    },
    {
        path: "/searchbar-expandable/",
        url: "./pages/searchbar-expandable.html",
    },
    {
        path: "/sheet-modal/",
        componentUrl: "./pages/sheet-modal.html",
    },
    {
        path: "/skeleton/",
        componentUrl: "./pages/skeleton.html",
    },
    {
        path: "/smart-select/",
        url: "./pages/smart-select.html",
    },
    {
        path: "/sortable/",
        url: "./pages/sortable.html",
    },
    {
        path: "/statusbar/",
        componentUrl: "./pages/statusbar.html",
    },
    {
        path: "/stepper/",
        componentUrl: "./pages/stepper.html",
    },
    {
        path: "/subnavbar/",
        url: "./pages/subnavbar.html",
    },
    {
        path: "/subnavbar-title/",
        url: "./pages/subnavbar-title.html",
    },
    {
        path: "/swiper/",
        url: "./pages/swiper.html",
        routes: [
            {
                path: "swiper-horizontal/",
                url: "./pages/swiper-horizontal.html",
            },
            {
                path: "swiper-vertical/",
                url: "./pages/swiper-vertical.html",
            },
            {
                path: "swiper-space-between/",
                url: "./pages/swiper-space-between.html",
            },
            {
                path: "swiper-multiple/",
                url: "./pages/swiper-multiple.html",
            },
            {
                path: "swiper-nested/",
                url: "./pages/swiper-nested.html",
            },
            {
                path: "swiper-loop/",
                url: "./pages/swiper-loop.html",
            },
            {
                path: "swiper-3d-cube/",
                url: "./pages/swiper-3d-cube.html",
            },
            {
                path: "swiper-3d-coverflow/",
                url: "./pages/swiper-3d-coverflow.html",
            },
            {
                path: "swiper-3d-flip/",
                url: "./pages/swiper-3d-flip.html",
            },
            {
                path: "swiper-fade/",
                url: "./pages/swiper-fade.html",
            },
            {
                path: "swiper-scrollbar/",
                url: "./pages/swiper-scrollbar.html",
            },
            {
                path: "swiper-gallery/",
                componentUrl: "./pages/swiper-gallery.html",
            },
            {
                path: "swiper-custom-controls/",
                url: "./pages/swiper-custom-controls.html",
            },
            {
                path: "swiper-parallax/",
                url: "./pages/swiper-parallax.html",
            },
            {
                path: "swiper-lazy/",
                url: "./pages/swiper-lazy.html",
            },
            {
                path: "swiper-pagination-progress/",
                url: "./pages/swiper-pagination-progress.html",
            },
            {
                path: "swiper-pagination-fraction/",
                url: "./pages/swiper-pagination-fraction.html",
            },
            {
                path: "swiper-zoom/",
                url: "./pages/swiper-zoom.html",
            },
        ],
    },
    {
        path: "/swipeout/",
        componentUrl: "./pages/swipeout.html",
    },
    {
        path: "/tabs/",
        url: "./pages/tabs.html",
    },
    {
        path: "/tabs-static/",
        url: "./pages/tabs-static.html",
    },
    {
        path: "/tabs-animated/",
        url: "./pages/tabs-animated.html",
    },
    {
        path: "/tabs-swipeable/",
        url: "./pages/tabs-swipeable.html",
    },
    {
        path: "/tabs-routable/",
        url: "./pages/tabs-routable.html",
        tabs: [
            {
                path: "/",
                id: "tab1",
                content:
                    ' \
        <div class="block"> \
          <p>Tab 1 content</p> \
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam enim quia molestiae facilis laudantium voluptates obcaecati officia cum, sit libero commodi. Ratione illo suscipit temporibus sequi iure ad laboriosam accusamus?</p> \
          <p>Saepe explicabo voluptas ducimus provident, doloremque quo totam molestias! Suscipit blanditiis eaque exercitationem praesentium reprehenderit, fuga accusamus possimus sed, sint facilis ratione quod, qui dignissimos voluptas! Aliquam rerum consequuntur deleniti.</p> \
          <p>Totam reprehenderit amet commodi ipsum nam provident doloremque possimus odio itaque, est animi culpa modi consequatur reiciendis corporis libero laudantium sed eveniet unde delectus a maiores nihil dolores? Natus, perferendis.</p> \
        </div> \
        ',
            },
            {
                path: "/tab2/",
                id: "tab2",
                content:
                    '\
        <div class="block"> \
          <p>Tab 2 content</p> \
          <p>Suscipit, facere quasi atque totam. Repudiandae facilis at optio atque, rem nam, natus ratione cum enim voluptatem suscipit veniam! Repellat, est debitis. Modi nam mollitia explicabo, unde aliquid impedit! Adipisci!</p> \
          <p>Deserunt adipisci tempora asperiores, quo, nisi ex delectus vitae consectetur iste fugiat iusto dolorem autem. Itaque, ipsa voluptas, a assumenda rem, dolorum porro accusantium, officiis veniam nostrum cum cumque impedit.</p> \
          <p>Laborum illum ipsa voluptatibus possimus nesciunt ex consequatur rem, natus ad praesentium rerum libero consectetur temporibus cupiditate atque aspernatur, eaque provident eligendi quaerat ea soluta doloremque. Iure fugit, minima facere.</p> \
        </div> \
        ',
            },
            {
                path: "/tab3/",
                id: "tab3",
                content:
                    '\
        <div class="block"> \
          <p>Tab 3 content</p> \
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam enim quia molestiae facilis laudantium voluptates obcaecati officia cum, sit libero commodi. Ratione illo suscipit temporibus sequi iure ad laboriosam accusamus?</p> \
          <p>Deserunt adipisci tempora asperiores, quo, nisi ex delectus vitae consectetur iste fugiat iusto dolorem autem. Itaque, ipsa voluptas, a assumenda rem, dolorum porro accusantium, officiis veniam nostrum cum cumque impedit.</p> \
          <p>Laborum illum ipsa voluptatibus possimus nesciunt ex consequatur rem, natus ad praesentium rerum libero consectetur temporibus cupiditate atque aspernatur, eaque provident eligendi quaerat ea soluta doloremque. Iure fugit, minima facere.</p> \
        </div> \
        ',
            },
        ],
    },
    {
        path: "/toast/",
        componentUrl: "./pages/toast.html",
    },
    {
        path: "/toggle/",
        url: "./pages/toggle.html",
    },
    {
        path: "/toolbar-tabbar/",
        componentUrl: "./pages/toolbar-tabbar.html",
        routes: [
            {
                path: "tabbar/",
                componentUrl: "./pages/tabbar.html",
            },
            {
                path: "tabbar-labels/",
                componentUrl: "./pages/tabbar-labels.html",
            },
            {
                path: "tabbar-scrollable/",
                componentUrl: "./pages/tabbar-scrollable.html",
            },
            {
                path: "toolbar-hide-scroll/",
                url: "./pages/toolbar-hide-scroll.html",
            },
        ],
    },
    {
        path: "/tooltip/",
        componentUrl: "./pages/tooltip.html",
    },
    {
        path: "/treeview/",
        componentUrl: "./pages/treeview.html",
    },
    {
        path: "/timeline/",
        url: "./pages/timeline.html",
    },
    {
        path: "/timeline-vertical/",
        url: "./pages/timeline-vertical.html",
    },
    {
        path: "/timeline-horizontal/",
        url: "./pages/timeline-horizontal.html",
    },
    {
        path: "/timeline-horizontal-calendar/",
        url: "./pages/timeline-horizontal-calendar.html",
    },
    {
        path: "/virtual-list/",
        componentUrl: "./pages/virtual-list.html",
    },
    {
        path: "/virtual-list-vdom/",
        componentUrl: "./pages/virtual-list-vdom.html",
    },
    {
        path: "/vi/",
        componentUrl: "./pages/vi.html",
    },

    // Color Themes
    {
        path: "/color-themes/",
        componentUrl: "./pages/color-themes.html",
    },

    // Page Loaders
    {
        path: "/page-loader-template7/:user/:userId/:posts/:postId/",
        templateUrl: "./pages/page-loader-template7.html",
        // additional context
        options: {
            context: {
                foo: "bar",
            },
        },
    },
    {
        path: "/page-loader-component/:user/:userId/:posts/:postId/",
        componentUrl: "./pages/page-loader-component.html",
        // additional context
        options: {
            context: {
                foo: "bar",
            },
        },
    },
    {
        path: "/master-detail/",
        url: "./pages/master-detail-master.html",
        master: true,
        detailRoutes: [
            {
                path: "/master-detail/:id/",
                templateUrl: "./pages/master-detail-detail.html",
            },
        ],
    },

    // Default route (404 page). MUST BE THE LAST
    {
        path: "(.*)",
        url: "./pages/404.html",
    },
];
