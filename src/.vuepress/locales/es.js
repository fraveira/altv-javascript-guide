const { defaultNavbar } = require('../defaults/navbar');
const { buildSidebar } = require('../utility/sidebarHelper');
const language = 'es'; // ie. /tr/
const languageUpper = 'ES';
const languageName = 'Spanish'; // Turkish

const esLocale = {
    [`/${language}/`]: {
        lang: `${language}-${languageUpper}`,
        title: `Documentación | ${languageName}`
    }
};

const sidebar = [
    {
        title: 'Guía',
        collapsable: false,
        children: [
            {
                title: '🚀 Introducción',
                collapsable: false,
                children: buildSidebar(`/${language}/introduction/`)
            },
            {
                title: `♻️ Conversión`,
                collapsable: false,
                children: buildSidebar(`/${language}/conversion/`)
            },
            {
                title: `📄 Guía API`,
                collapsable: false,
                children: buildSidebar(`/${language}/api/`)
            },
            {
                title: `💡 Eventos`,
                collapsable: false,
                children: buildSidebar(`/${language}/events/`)
            },
            {
                title: `🧍 Jugador`,
                collapsable: false,
                children: buildSidebar(`/${language}/player/`)
            },
            {
                title: `🚙 Vehículo`,
                collapsable: false,
                children: buildSidebar(`/${language}/vehicle/`)
            },
            {
                title: `📊 Bases de datos`,
                collapsable: false,
                children: buildSidebar(`/${language}/databases/`)
            },
            {
                title: `📚 Libro de Recetas `,
                collapsable: false,
                children: buildSidebar(`/${language}/cookbook/`)
            },
            {
                title: `📖 Tablas de Datos`,
                collapsable: false,
                children: buildSidebar(`/${language}/tables/`)
            }
        ]
    }
];

// change this to first two letters + menus. ie. trMenus
const esMenus = {
    [`/${language}/`]: {
        label: languageName,
        nav: [...defaultNavbar],
        sidebar: {
            collapsable: false,
            [`/${language}/`]: sidebar
        },
        sidebarDepth: 3
    }
};

module.exports = {
    esLocale,
    esMenus
};
