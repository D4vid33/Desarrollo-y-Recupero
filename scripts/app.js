const { useState, useEffect } = React;

const { INITIAL_RESUMEN_EJECUTIVO, INITIAL_NEW_CLIENT, TAMANO_LOTE } = window.CRMApp.constants;
const {
    validarUrl,
    normalizarCliente,
    requiereFechaCompromiso,
    requiereFechaPropuesta,
    getEtapasPorHoja,
    filtrarClientesPorBusqueda
} = window.CRMApp.utils;
const {
    obtenerAsesores,
    obtenerResumenEjecutivo,
    obtenerClientesParaGestion,
    obtenerResumenSupervisor,
    buscarClienteGlobal,
    guardarLoteCompleto,
    validarYCrearRegistro
} = window.CRMApp.api;
const { ConfigView, SupervisorView, LoteView } = window.CRMApp.components;

const App = () => {
    const [view, setView] = useState('config');
    const [modo, setModo] = useState('ASESOR');
    const [asesor, setAsesor] = useState('');
    const [hoja, setHoja] = useState('BD');
    const [clientes, setClientes] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [cargandoAsesores, setCargandoAsesores] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [busquedaGlobal, setBusquedaGlobal] = useState('');
    const [resultadoBusquedaGlobal, setResultadoBusquedaGlobal] = useState([]);
    const [buscandoGlobal, setBuscandoGlobal] = useState(false);
    const [asesoresDisponibles, setAsesoresDisponibles] = useState([]);
    const [filtroEstado, setFiltroEstado] = useState('SIN_GESTION');
    const [resumenSupervisor, setResumenSupervisor] = useState(null);
    const [cargandoResumenSupervisor, setCargandoResumenSupervisor] = useState(false);
    const [resumenEjecutivo, setResumenEjecutivo] = useState(INITIAL_RESUMEN_EJECUTIVO);
    const [nuevoRegistro, setNuevoRegistro] = useState(INITIAL_NEW_CLIENT);
    const [creandoRegistro, setCreandoRegistro] = useState(false);
    const [resultadoCreacion, setResultadoCreacion] = useState(null);

    const etapasPorHoja = getEtapasPorHoja(hoja);
    const clientesPendientes = clientes.filter((cliente) => !cliente.sincronizado);
    const loteVisibleBase = clientesPendientes.slice(0, TAMANO_LOTE);
    const loteVisible = filtrarClientesPorBusqueda(loteVisibleBase, busqueda);
    const loteCompletoGestionado = loteVisibleBase.length > 0 && loteVisibleBase.every((cliente) => {
        if (!cliente.gestionado) return false;
        if (requiereFechaCompromiso(hoja, cliente) && !cliente.fechaCompromisoPago) return false;
        if (requiereFechaPropuesta(hoja, cliente) && !cliente.fechaPropuesta) return false;
        return true;
    });

    const cargarAsesoresDisponibles = async (hojaSeleccionada) => {
        if (!validarUrl()) return;

        setCargandoAsesores(true);

        try {
            const data = await obtenerAsesores(hojaSeleccionada);
            setAsesoresDisponibles(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error al cargar asesores:", error);
            setAsesoresDisponibles([]);
            alert("No fue posible cargar la lista de asesores.");
        } finally {
            setCargandoAsesores(false);
        }
    };

    const cargarResumenEjecutivoActual = async (asesorActual, hojaActual, filtroActual) => {
        if (!asesorActual || !validarUrl()) return;

        try {
            const data = await obtenerResumenEjecutivo(asesorActual, hojaActual, filtroActual);
            setResumenEjecutivo({
                totalCargadas: data.totalCargadas || 0,
                pendientes: data.pendientes || 0,
                oportunidades: data.oportunidades || 0,
                cerrados: data.cerrados || 0,
                vencidos: data.vencidos || 0,
                riesgoAlto: data.riesgoAlto || 0
            });
        } catch (error) {
            console.error("Error al cargar resumen ejecutivo:", error);
        }
    };

    useEffect(() => {
        cargarAsesoresDisponibles(hoja);
    }, [hoja]);

    useEffect(() => {
        if (asesor && !nuevoRegistro.responsable) {
            setNuevoRegistro((prev) => ({
                ...prev,
                responsable: asesor
            }));
        }
    }, [asesor]);

    const prepararClientes = (data) => {
        const lista = Array.isArray(data) ? data : [];
        setClientes(lista.map(normalizarCliente));
        setView('lote');
        setBusqueda('');
        setResultadoBusquedaGlobal([]);
        setBusquedaGlobal('');
        setCargando(false);
        cargarResumenEjecutivoActual(asesor, hoja, filtroEstado);
    };

    const iniciarLote = async () => {
        if (!asesor) {
            alert("Selecciona un asesor.");
            return;
        }

        if (!validarUrl()) return;

        setCargando(true);

        try {
            const data = await obtenerClientesParaGestion(asesor, hoja, filtroEstado);
            prepararClientes(data);
        } catch (error) {
            console.error("Error al obtener clientes:", error);
            alert("No fue posible cargar el lote. Revisa la URL, permisos y Apps Script.");
            setCargando(false);
        }
    };

    const cargarResumenSupervisorActual = async () => {
        if (!validarUrl()) return;

        setCargandoResumenSupervisor(true);

        try {
            const data = await obtenerResumenSupervisor(hoja);
            setResumenSupervisor(data || null);
            setView('supervisor');
        } catch (error) {
            console.error("Error al cargar resumen supervisor:", error);
            alert("No fue posible cargar el resumen supervisor.");
        } finally {
            setCargandoResumenSupervisor(false);
        }
    };

    const ejecutarBusquedaGlobal = async () => {
        if (!asesor) {
            alert("Selecciona un asesor antes de usar la búsqueda global.");
            return;
        }

        if (!busquedaGlobal.trim()) {
            alert("Escribe un nombre o co_cuenta para la búsqueda global.");
            return;
        }

        if (!validarUrl()) return;

        setBuscandoGlobal(true);

        try {
            const data = await buscarClienteGlobal(asesor, hoja, busquedaGlobal);
            const lista = Array.isArray(data) ? data : [];
            setResultadoBusquedaGlobal(lista.map(normalizarCliente));
        } catch (error) {
            console.error("Error en búsqueda global:", error);
            alert("No fue posible realizar la búsqueda global.");
        } finally {
            setBuscandoGlobal(false);
        }
    };

    const actualizarColeccion = (setter, collection, idx, campo, valor) => {
        const nuevos = [...collection];
        nuevos[idx][campo] = valor;
        nuevos[idx].gestionado = true;
        setter(nuevos);
    };

    const actualizarLocal = (idxGlobal, campo, valor) => {
        actualizarColeccion(setClientes, clientes, idxGlobal, campo, valor);
    };

    const actualizarGlobal = (idx, campo, valor) => {
        actualizarColeccion(setResultadoBusquedaGlobal, resultadoBusquedaGlobal, idx, campo, valor);
    };

    const validarFechasObligatorias = (gestiones) => gestiones.some((cliente) =>
        (requiereFechaCompromiso(hoja, cliente) && !cliente.fechaCompromisoPago) ||
        (requiereFechaPropuesta(hoja, cliente) && !cliente.fechaPropuesta)
    );

    const guardarGestiones = async ({ gestiones, onSuccess, logLabel, alertMessage }) => {
        if (!validarUrl()) return false;

        setCargando(true);

        try {
            await guardarLoteCompleto(gestiones, asesor, hoja);
            onSuccess();
            setCargando(false);
            cargarResumenEjecutivoActual(asesor, hoja, filtroEstado);
            return true;
        } catch (error) {
            console.error(logLabel, error);
            alert(alertMessage);
            setCargando(false);
            return false;
        }
    };

    const finalizarLote = async () => {
        const gestiones = loteVisibleBase.filter((cliente) => cliente.gestionado);

        if (loteVisibleBase.length === 0) {
            alert("No hay más cuentas pendientes en este lote.");
            return;
        }

        if (gestiones.length < loteVisibleBase.length) {
            alert(`Debes gestionar las ${loteVisibleBase.length} cuentas del lote antes de continuar.`);
            return;
        }

        if (validarFechasObligatorias(loteVisibleBase)) {
            alert("Debes completar las fechas obligatorias del lote antes de sincronizar.");
            return;
        }

        await guardarGestiones({
            gestiones,
            onSuccess: () => {
                const cuentasSincronizadas = new Set(gestiones.map((gestion) => String(gestion.co_cuenta).trim()));

                setClientes((prev) => prev.map((cliente) =>
                    cuentasSincronizadas.has(String(cliente.co_cuenta).trim())
                        ? { ...cliente, sincronizado: true }
                        : cliente
                ));

                setBusqueda('');

                const pendientesRestantes = clientesPendientes.length - gestiones.length;

                if (pendientesRestantes > 0) {
                    alert(`Lote guardado con éxito. Se cargará el siguiente lote de hasta ${TAMANO_LOTE} cuentas.`);
                } else {
                    alert("Lote guardado con éxito. No quedan más cuentas pendientes.");
                    setView('config');
                    setClientes([]);
                }
            },
            logLabel: "Error al guardar lote:",
            alertMessage: "No fue posible guardar el lote."
        });
    };

    const sincronizarBusquedaGlobal = async () => {
        const gestiones = resultadoBusquedaGlobal.filter((cliente) => cliente.gestionado);

        if (gestiones.length === 0) {
            alert("No hay cambios para guardar en la búsqueda global.");
            return;
        }

        if (validarFechasObligatorias(gestiones)) {
            alert("Debes completar las fechas obligatorias antes de sincronizar.");
            return;
        }

        await guardarGestiones({
            gestiones,
            onSuccess: () => {
                alert("Gestión global sincronizada con éxito.");
                setResultadoBusquedaGlobal([]);
                setBusquedaGlobal('');
            },
            logLabel: "Error al guardar búsqueda global:",
            alertMessage: "No fue posible guardar la búsqueda global."
        });
    };

    const volverAFiltros = () => {
        setView('config');
        setClientes([]);
        setResultadoBusquedaGlobal([]);
        setBusqueda('');
        setBusquedaGlobal('');
        setResumenSupervisor(null);
    };

    const crearNuevoRegistro = async () => {
        const payload = {
            co_cuenta: (nuevoRegistro.co_cuenta || '').trim(),
            nombre: (nuevoRegistro.nombre || '').trim(),
            recurrencia: nuevoRegistro.recurrencia,
            responsable: (nuevoRegistro.responsable || '').trim(),
            nuevoValor: nuevoRegistro.nuevoValor
        };

        if (!payload.co_cuenta || !payload.nombre || !payload.responsable) {
            setResultadoCreacion({
                ok: false,
                message: "Completa co_cuenta, nombre del cliente y responsable."
            });
            return;
        }

        if (!validarUrl()) return;

        setCreandoRegistro(true);
        setResultadoCreacion(null);

        try {
            const result = await validarYCrearRegistro(payload);
            setResultadoCreacion({
                ok: result?.ok !== false,
                message: result?.message || "Registro creado correctamente."
            });

            if (result?.ok !== false) {
                setNuevoRegistro(INITIAL_NEW_CLIENT);
                if (asesor) {
                    cargarResumenEjecutivoActual(asesor, hoja, filtroEstado);
                }
            }
        } catch (error) {
            console.error("Error al crear nuevo registro:", error);
            setResultadoCreacion({
                ok: false,
                message: error.message || "No fue posible crear el nuevo registro."
            });
        } finally {
            setCreandoRegistro(false);
        }
    };

    if (view === 'config') {
        return (
            <ConfigView
                modo={modo}
                setModo={setModo}
                hoja={hoja}
                setHoja={setHoja}
                filtroEstado={filtroEstado}
                setFiltroEstado={setFiltroEstado}
                asesor={asesor}
                setAsesor={setAsesor}
                asesoresDisponibles={asesoresDisponibles}
                cargandoAsesores={cargandoAsesores}
                iniciarLote={iniciarLote}
                cargarResumenSupervisor={cargarResumenSupervisorActual}
                cargando={cargando}
                cargandoResumenSupervisor={cargandoResumenSupervisor}
                nuevoRegistro={nuevoRegistro}
                setNuevoRegistro={setNuevoRegistro}
                creandoRegistro={creandoRegistro}
                crearNuevoRegistro={crearNuevoRegistro}
                resultadoCreacion={resultadoCreacion}
            />
        );
    }

    if (view === 'supervisor') {
        return (
            <SupervisorView
                hoja={hoja}
                resumenSupervisor={resumenSupervisor}
                volverAFiltros={volverAFiltros}
            />
        );
    }

    return (
        <LoteView
            hoja={hoja}
            asesor={asesor}
            filtroEstado={filtroEstado}
            clientesPendientes={clientesPendientes}
            loteVisibleBase={loteVisibleBase}
            loteVisible={loteVisible}
            resumenEjecutivo={resumenEjecutivo}
            busquedaGlobal={busquedaGlobal}
            setBusquedaGlobal={setBusquedaGlobal}
            buscarGlobal={ejecutarBusquedaGlobal}
            buscandoGlobal={buscandoGlobal}
            resultadoBusquedaGlobal={resultadoBusquedaGlobal}
            sincronizarBusquedaGlobal={sincronizarBusquedaGlobal}
            cargando={cargando}
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            clientes={clientes}
            actualizarLocal={actualizarLocal}
            actualizarGlobal={actualizarGlobal}
            etapasPorHoja={etapasPorHoja}
            loteCompletoGestionado={loteCompletoGestionado}
            finalizarLote={finalizarLote}
            volverAFiltros={volverAFiltros}
        />
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
