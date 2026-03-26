window.CRMApp = window.CRMApp || {};

window.CRMApp.api = (() => {
    const { WEB_APP_URL } = window.CRMApp.constants;

    const fetchJson = async (url) => {
        const response = await fetch(url, { method: 'GET' });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        return response.json();
    };

    const postJson = async (payload) => {
        const response = await fetch(WEB_APP_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const result = await response.json();

        if (result && result.ok === false) {
            throw new Error(result.message || "Error devuelto por Apps Script");
        }

        return result;
    };

    const obtenerAsesores = (hoja) =>
        fetchJson(`${WEB_APP_URL}?accion=obtenerAsesores&hoja=${encodeURIComponent(hoja)}`);

    const obtenerResumenEjecutivo = (asesor, hoja, filtroEstado) =>
        fetchJson(`${WEB_APP_URL}?accion=obtenerResumenEjecutivo&asesor=${encodeURIComponent(asesor)}&hoja=${encodeURIComponent(hoja)}&filtroEstado=${encodeURIComponent(filtroEstado)}`);

    const obtenerClientesParaGestion = (asesor, hoja, filtroEstado) =>
        fetchJson(`${WEB_APP_URL}?accion=obtenerClientesParaGestion&asesor=${encodeURIComponent(asesor)}&hoja=${encodeURIComponent(hoja)}&filtroEstado=${encodeURIComponent(filtroEstado)}&limite=100`);

    const obtenerResumenSupervisor = (hoja) =>
        fetchJson(`${WEB_APP_URL}?accion=obtenerResumenSupervisor&hoja=${encodeURIComponent(hoja)}`);

    const buscarClienteGlobal = (asesor, hoja, query) =>
        fetchJson(`${WEB_APP_URL}?accion=buscarClienteGlobal&asesor=${encodeURIComponent(asesor)}&hoja=${encodeURIComponent(hoja)}&query=${encodeURIComponent(query.trim())}`);

    const guardarLoteCompleto = (gestiones, asesor, hoja) =>
        postJson({
            accion: 'guardarLoteCompleto',
            gestiones,
            asesor,
            hoja
        });

    const validarYCrearRegistro = (payload) =>
        postJson({
            accion: 'validarYCrearRegistro',
            ...payload
        });

    return {
        obtenerAsesores,
        obtenerResumenEjecutivo,
        obtenerClientesParaGestion,
        obtenerResumenSupervisor,
        buscarClienteGlobal,
        guardarLoteCompleto,
        validarYCrearRegistro
    };
})();
