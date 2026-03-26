window.CRMApp = window.CRMApp || {};

window.CRMApp.utils = (() => {
    const { WEB_APP_URL, DEFAULT_SUMMARY_CARDS, DEFAULT_ALERT_CARDS, ETAPAS_POR_HOJA } = window.CRMApp.constants;

    const validarUrl = () => {
        const url = (WEB_APP_URL || "").trim();

        if (!url) {
            alert("Debes configurar la URL de implementación de Google Apps Script.");
            return false;
        }

        if (!url.startsWith("https://script.google.com/macros/s/")) {
            alert("La URL de Google Apps Script no parece válida.");
            return false;
        }

        return true;
    };

    const normalizarCliente = (cliente) => ({
        ...cliente,
        gestionado: false,
        sincronizado: false,
        nuevaEtapa: cliente.etapa || 'No Contactado',
        nuevoComentario: '',
        nuevoValor: 0,
        fechaCompromisoPago: cliente.fechaCompromisoPago || '',
        fechaPropuesta: cliente.fechaPropuesta || '',
        riesgo: cliente.riesgo || 'BAJO',
        historial: Array.isArray(cliente.historial) ? cliente.historial : [],
        recurrencia: cliente.recurrencia || cliente.valorRecurrencia || ''
    });

    const requiereFechaCompromiso = (hoja, cliente) =>
        hoja === 'Recupero' && cliente.nuevaEtapa === 'Compromiso de pago';

    const requiereFechaPropuesta = (hoja, cliente) =>
        hoja === 'BD' && cliente.nuevaEtapa === 'Propuesta';

    const getEtapasPorHoja = (hoja) => ETAPAS_POR_HOJA[hoja] || ETAPAS_POR_HOJA.BD;

    const getRiskUI = (riesgo) => {
        const value = (riesgo || '').toUpperCase();

        if (value === 'ALTO') {
            return {
                dot: 'bg-red-500',
                pill: 'bg-red-50 text-red-600 border-red-100',
                text: 'Riesgo alto'
            };
        }

        if (value === 'MEDIO') {
            return {
                dot: 'bg-yellow-400',
                pill: 'bg-yellow-50 text-yellow-700 border-yellow-100',
                text: 'Riesgo medio'
            };
        }

        return {
            dot: 'bg-emerald-500',
            pill: 'bg-emerald-50 text-emerald-600 border-emerald-100',
            text: 'Riesgo bajo'
        };
    };

    const formatHistorialDate = (value) => {
        if (!value) return '';
        const text = String(value);
        if (text.includes('T')) return text.split('T')[0];
        return text;
    };

    const formatearMoneda = (valor) => {
        if (valor === null || valor === undefined || valor === '') return '';
        const numero = Number(valor);
        if (Number.isNaN(numero)) return valor;
        return new Intl.NumberFormat('es-EC', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(numero);
    };

    const getSummaryCards = (resumenSupervisor) =>
        resumenSupervisor?.resumenGeneral || DEFAULT_SUMMARY_CARDS;

    const getAlertCards = (resumenSupervisor) =>
        resumenSupervisor?.alertas || DEFAULT_ALERT_CARDS;

    const filtrarClientesPorBusqueda = (clientes, busqueda) =>
        clientes.filter((cliente) =>
            ((cliente.nombre || '') + ' ' + (cliente.co_cuenta || ''))
                .toLowerCase()
                .includes((busqueda || '').toLowerCase())
        );

    return {
        validarUrl,
        normalizarCliente,
        requiereFechaCompromiso,
        requiereFechaPropuesta,
        getEtapasPorHoja,
        getRiskUI,
        formatHistorialDate,
        formatearMoneda,
        getSummaryCards,
        getAlertCards,
        filtrarClientesPorBusqueda
    };
})();
